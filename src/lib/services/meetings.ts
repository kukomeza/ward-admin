import { db, ensureDatabase } from "../db";
import {
  AgendaTemplateItem,
  Meeting,
  MeetingItem,
  MeetingType,
  MeetingVisitorNote,
  TaskAssignment,
} from "../types";

export async function getMeetingTypes(activeOnly = true): Promise<MeetingType[]> {
  await ensureDatabase();
  let sql = "SELECT * FROM meeting_types WHERE 1=1";
  if (activeOnly) sql += " AND is_active = 1";
  sql += " ORDER BY name ASC";
  const res = await db.execute(sql);
  return res.rows as unknown as MeetingType[];
}

export async function createMeetingType(data: {
  name: string;
  code?: string;
  description?: string;
  default_template?: string;
}): Promise<MeetingType> {
  await ensureDatabase();
  const id = `mt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const code = (
    data.code || data.name.toUpperCase().replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  ).replace(/[^A-Z0-9_]/g, "");

  await db.execute({
    sql: `INSERT INTO meeting_types (id, name, code, description, default_template, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
    args: [id, data.name.trim(), code, data.description || null, data.default_template || "[]"],
  });

  const res = await db.execute({ sql: "SELECT * FROM meeting_types WHERE id = ?", args: [id] });
  return res.rows[0] as unknown as MeetingType;
}

export async function getMeetings(status?: string): Promise<Meeting[]> {
  await ensureDatabase();

  let sql = `
    SELECT 
      m.*,
      mt.name AS meeting_type_name,
      mt.code AS meeting_type_code,
      (p_pres.first_name || ' ' || p_pres.last_name) AS presiding_name,
      (p_cond.first_name || ' ' || p_cond.last_name) AS conducting_name
    FROM meetings m
    JOIN meeting_types mt ON m.meeting_type_id = mt.id
    LEFT JOIN persons p_pres ON m.presiding_person_id = p_pres.id
    LEFT JOIN persons p_cond ON m.conducting_person_id = p_cond.id
    WHERE 1=1
  `;
  const args: (string | number)[] = [];

  if (status && status !== "ALL") {
    sql += ` AND m.status = ?`;
    args.push(status);
  }

  sql += ` ORDER BY m.meeting_date DESC, m.start_time DESC`;

  const res = await db.execute({ sql, args });
  return res.rows as unknown as Meeting[];
}

export async function getMeetingById(id: string): Promise<{
  meeting: Meeting | null;
  items: MeetingItem[];
  assignments: TaskAssignment[];
  visitorNotes: MeetingVisitorNote[];
}> {
  await ensureDatabase();

  const meetingRes = await db.execute({
    sql: `
      SELECT 
        m.*,
        mt.name AS meeting_type_name,
        mt.code AS meeting_type_code,
        (p_pres.first_name || ' ' || p_pres.last_name) AS presiding_name,
        p_pres.phone AS presiding_phone,
        (p_cond.first_name || ' ' || p_cond.last_name) AS conducting_name,
        p_cond.phone AS conducting_phone
      FROM meetings m
      JOIN meeting_types mt ON m.meeting_type_id = mt.id
      LEFT JOIN persons p_pres ON m.presiding_person_id = p_pres.id
      LEFT JOIN persons p_cond ON m.conducting_person_id = p_cond.id
      WHERE m.id = ?
    `,
    args: [id],
  });

  if (meetingRes.rows.length === 0) {
    return { meeting: null, items: [], assignments: [], visitorNotes: [] };
  }

  const meeting = meetingRes.rows[0] as unknown as Meeting;

  // Items
  const itemsRes = await db.execute({
    sql: `SELECT * FROM meeting_items WHERE meeting_id = ? ORDER BY order_index ASC`,
    args: [id],
  });
  const items = itemsRes.rows as unknown as MeetingItem[];

  // Assignments
  const assignmentsRes = await db.execute({
    sql: `
      SELECT 
        ta.*,
        (p.first_name || ' ' || p.last_name) AS person_name,
        p.first_name AS person_first_name,
        p.phone AS person_phone,
        tt.name AS task_name,
        tt.code AS task_code,
        tt.color AS task_color
      FROM task_assignments ta
      JOIN persons p ON ta.person_id = p.id
      JOIN task_types tt ON ta.task_type_id = tt.id
      WHERE ta.meeting_id = ?
      ORDER BY ta.created_at ASC
    `,
    args: [id],
  });
  const assignments = assignmentsRes.rows as unknown as TaskAssignment[];

  // Visitor Notes (for live mode welcomes)
  const notesRes = await db.execute({
    sql: `SELECT * FROM meeting_visitor_notes WHERE meeting_id = ? ORDER BY order_index ASC, created_at ASC`,
    args: [id],
  });
  const visitorNotes = notesRes.rows as unknown as MeetingVisitorNote[];

  // Attach assignments to items
  items.forEach((item) => {
    item.assignments = assignments.filter((a) => a.meeting_item_id === item.id);
  });

  return {
    meeting,
    items,
    assignments,
    visitorNotes,
  };
}

export async function createMeeting(data: {
  meeting_type_id: string;
  meeting_date: string;
  start_time?: string;
  title: string;
  presiding_person_id?: string;
  conducting_person_id?: string;
  notes?: string;
  apply_template?: boolean;
}): Promise<string> {
  await ensureDatabase();

  const id = `m-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const startTime = data.start_time || "10:00";

  await db.execute({
    sql: `
      INSERT INTO meetings (
        id, meeting_type_id, meeting_date, start_time, title, status,
        presiding_person_id, conducting_person_id, notes
      ) VALUES (?, ?, ?, ?, ?, 'SCHEDULED', ?, ?, ?)
    `,
    args: [
      id,
      data.meeting_type_id,
      data.meeting_date,
      startTime,
      data.title.trim(),
      data.presiding_person_id || null,
      data.conducting_person_id || null,
      data.notes?.trim() || null,
    ],
  });

  // Assign Preside and Conduct to task_assignments if specified
  if (data.presiding_person_id) {
    const presideTask = await db.execute({
      sql: `SELECT id FROM task_types WHERE code = 'PRESIDE' LIMIT 1`,
      args: [],
    });
    if (presideTask.rows.length > 0) {
      await db.execute({
        sql: `INSERT INTO task_assignments (id, meeting_id, person_id, task_type_id, status) VALUES (?, ?, ?, ?, 'CONFIRMED')`,
        args: [`assign-${Date.now()}-pres`, id, data.presiding_person_id, String(presideTask.rows[0].id)],
      });
    }
  }

  if (data.conducting_person_id) {
    const conductTask = await db.execute({
      sql: `SELECT id FROM task_types WHERE code = 'CONDUCT' LIMIT 1`,
      args: [],
    });
    if (conductTask.rows.length > 0) {
      await db.execute({
        sql: `INSERT INTO task_assignments (id, meeting_id, person_id, task_type_id, status) VALUES (?, ?, ?, ?, 'CONFIRMED')`,
        args: [`assign-${Date.now()}-cond`, id, data.conducting_person_id, String(conductTask.rows[0].id)],
      });
    }
  }

  // Auto-apply template if requested (default true)
  if (data.apply_template !== false) {
    const mtRes = await db.execute({
      sql: `SELECT default_template FROM meeting_types WHERE id = ?`,
      args: [data.meeting_type_id],
    });

    if (mtRes.rows.length > 0 && mtRes.rows[0].default_template) {
      try {
        const templateItems: AgendaTemplateItem[] = JSON.parse(String(mtRes.rows[0].default_template));
        for (let idx = 0; idx < templateItems.length; idx++) {
          const item = templateItems[idx];
          const itemId = `mi-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 5)}`;
          await db.execute({
            sql: `
              INSERT INTO meeting_items (id, meeting_id, order_index, item_type, title, speaker_topic, notes, is_completed)
              VALUES (?, ?, ?, ?, ?, ?, ?, 0)
            `,
            args: [
              itemId,
              id,
              idx,
              item.item_type,
              item.title,
              item.speaker_topic || null,
              item.notes || null,
            ],
          });
        }
      } catch (err) {
        console.error("Failed to parse meeting template:", err);
      }
    }
  }

  return id;
}

export async function updateMeeting(
  id: string,
  data: Partial<Meeting>
): Promise<void> {
  await ensureDatabase();

  const updates: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    args.push(data.title.trim());
  }
  if (data.meeting_date !== undefined) {
    updates.push("meeting_date = ?");
    args.push(data.meeting_date);
  }
  if (data.start_time !== undefined) {
    updates.push("start_time = ?");
    args.push(data.start_time);
  }
  if (data.status !== undefined) {
    updates.push("status = ?");
    args.push(data.status);
  }
  if (data.presiding_person_id !== undefined) {
    updates.push("presiding_person_id = ?");
    args.push(data.presiding_person_id || null);
  }
  if (data.conducting_person_id !== undefined) {
    updates.push("conducting_person_id = ?");
    args.push(data.conducting_person_id || null);
  }
  if (data.notes !== undefined) {
    updates.push("notes = ?");
    args.push(data.notes || null);
  }

  if (updates.length > 0) {
    updates.push("updated_at = datetime('now')");
    args.push(id);
    await db.execute({
      sql: `UPDATE meetings SET ${updates.join(", ")} WHERE id = ?`,
      args,
    });
  }
}

export async function deleteMeeting(id: string): Promise<boolean> {
  await ensureDatabase();
  await db.execute({ sql: "DELETE FROM meetings WHERE id = ?", args: [id] });
  return true;
}

// Agenda Items
export async function addMeetingItem(
  meetingId: string,
  data: {
    item_type: MeetingItem["item_type"];
    title: string;
    hymn_number?: string;
    hymn_title?: string;
    speaker_topic?: string;
    notes?: string;
  }
): Promise<string> {
  await ensureDatabase();

  const countRes = await db.execute({
    sql: "SELECT COALESCE(MAX(order_index), -1) + 1 AS next_index FROM meeting_items WHERE meeting_id = ?",
    args: [meetingId],
  });
  const orderIndex = Number(countRes.rows[0].next_index);
  const itemId = `mi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  await db.execute({
    sql: `
      INSERT INTO meeting_items (
        id, meeting_id, order_index, item_type, title, hymn_number, hymn_title, speaker_topic, notes, is_completed
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    args: [
      itemId,
      meetingId,
      orderIndex,
      data.item_type,
      data.title.trim(),
      data.hymn_number?.trim() || null,
      data.hymn_title?.trim() || null,
      data.speaker_topic?.trim() || null,
      data.notes?.trim() || null,
    ],
  });

  return itemId;
}

export async function updateMeetingItem(
  itemId: string,
  data: Partial<MeetingItem>
): Promise<void> {
  await ensureDatabase();

  const updates: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.title !== undefined) {
    updates.push("title = ?");
    args.push(data.title.trim());
  }
  if (data.item_type !== undefined) {
    updates.push("item_type = ?");
    args.push(data.item_type);
  }
  if (data.hymn_number !== undefined) {
    updates.push("hymn_number = ?");
    args.push(data.hymn_number?.trim() || null);
  }
  if (data.hymn_title !== undefined) {
    updates.push("hymn_title = ?");
    args.push(data.hymn_title?.trim() || null);
  }
  if (data.speaker_topic !== undefined) {
    updates.push("speaker_topic = ?");
    args.push(data.speaker_topic?.trim() || null);
  }
  if (data.notes !== undefined) {
    updates.push("notes = ?");
    args.push(data.notes?.trim() || null);
  }
  if (data.is_completed !== undefined) {
    updates.push("is_completed = ?");
    args.push(data.is_completed);
  }

  if (updates.length > 0) {
    args.push(itemId);
    await db.execute({
      sql: `UPDATE meeting_items SET ${updates.join(", ")} WHERE id = ?`,
      args,
    });
  }
}

export async function deleteMeetingItem(itemId: string): Promise<void> {
  await ensureDatabase();
  await db.execute({ sql: "DELETE FROM meeting_items WHERE id = ?", args: [itemId] });
}

export async function reorderMeetingItems(
  meetingId: string,
  orderedIds: string[]
): Promise<void> {
  await ensureDatabase();
  for (let i = 0; i < orderedIds.length; i++) {
    await db.execute({
      sql: "UPDATE meeting_items SET order_index = ? WHERE id = ? AND meeting_id = ?",
      args: [i, orderedIds[i], meetingId],
    });
  }
}

// Assignments
export async function assignPersonToTask(data: {
  meetingId: string;
  meetingItemId?: string | null;
  personId: string;
  taskTypeId: string;
  override3MonthAlert?: boolean;
  notes?: string;
}): Promise<string> {
  await ensureDatabase();

  const trimmedNotes = data.notes?.trim() || null;

  // If assigning specifically to Pan or Agua on an ordinance item, replace any previous assignment for that slot
  if (
    data.meetingItemId &&
    trimmedNotes &&
    (trimmedNotes.toLowerCase() === "pan" || trimmedNotes.toLowerCase() === "agua")
  ) {
    await db.execute({
      sql: `
        DELETE FROM task_assignments 
        WHERE meeting_item_id = ? 
          AND LOWER(COALESCE(notes, '')) = LOWER(?)
      `,
      args: [data.meetingItemId, trimmedNotes],
    });
  }

  // If assigning Preside or Conduct at meeting level (meetingItemId is null)
  const taskRes = await db.execute({
    sql: `SELECT code FROM task_types WHERE id = ?`,
    args: [data.taskTypeId],
  });
  const taskCode = taskRes.rows.length > 0 ? String(taskRes.rows[0].code) : null;

  if (!data.meetingItemId && (taskCode === "PRESIDE" || taskCode === "CONDUCT")) {
    await db.execute({
      sql: `DELETE FROM task_assignments WHERE meeting_id = ? AND task_type_id = ?`,
      args: [data.meetingId, data.taskTypeId],
    });
    if (taskCode === "PRESIDE") {
      await db.execute({
        sql: `UPDATE meetings SET presiding_person_id = ? WHERE id = ?`,
        args: [data.personId, data.meetingId],
      });
    } else if (taskCode === "CONDUCT") {
      await db.execute({
        sql: `UPDATE meetings SET conducting_person_id = ? WHERE id = ?`,
        args: [data.personId, data.meetingId],
      });
    }
  }

  // Deduplicate: if the exact same person is already assigned to this item and task type with the same note, return existing
  if (data.meetingItemId) {
    const existing = await db.execute({
      sql: `
        SELECT id FROM task_assignments 
        WHERE meeting_item_id = ? 
          AND person_id = ? 
          AND task_type_id = ?
          AND LOWER(COALESCE(notes, '')) = LOWER(?)
      `,
      args: [data.meetingItemId, data.personId, data.taskTypeId, trimmedNotes || ""],
    });
    if (existing.rows.length > 0) {
      return String(existing.rows[0].id);
    }
  }

  const id = `assign-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  await db.execute({
    sql: `
      INSERT INTO task_assignments (
        id, meeting_id, meeting_item_id, person_id, task_type_id, status, override_3month_alert, notes
      ) VALUES (?, ?, ?, ?, ?, 'CONFIRMED', ?, ?)
    `,
    args: [
      id,
      data.meetingId,
      data.meetingItemId || null,
      data.personId,
      data.taskTypeId,
      data.override3MonthAlert ? 1 : 0,
      trimmedNotes,
    ],
  });

  return id;
}

export async function removeTaskAssignment(assignmentId: string): Promise<void> {
  await ensureDatabase();
  await db.execute({ sql: "DELETE FROM task_assignments WHERE id = ?", args: [assignmentId] });
}

// Visitor Notes (Live mode)
export async function addVisitorNote(
  meetingId: string,
  visitorName: string,
  visitorTitle?: string
): Promise<string> {
  await ensureDatabase();

  const countRes = await db.execute({
    sql: "SELECT COALESCE(MAX(order_index), -1) + 1 AS next_index FROM meeting_visitor_notes WHERE meeting_id = ?",
    args: [meetingId],
  });
  const orderIndex = Number(countRes.rows[0].next_index);
  const id = `vn-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

  await db.execute({
    sql: `
      INSERT INTO meeting_visitor_notes (id, meeting_id, visitor_name, visitor_title, order_index, is_read)
      VALUES (?, ?, ?, ?, ?, 0)
    `,
    args: [id, meetingId, visitorName.trim(), visitorTitle?.trim() || null, orderIndex],
  });

  return id;
}

export async function deleteVisitorNote(noteId: string): Promise<void> {
  await ensureDatabase();
  await db.execute({ sql: "DELETE FROM meeting_visitor_notes WHERE id = ?", args: [noteId] });
}

export async function toggleVisitorNoteRead(noteId: string, isRead: boolean): Promise<void> {
  await ensureDatabase();
  await db.execute({
    sql: "UPDATE meeting_visitor_notes SET is_read = ? WHERE id = ?",
    args: [isRead ? 1 : 0, noteId],
  });
}
