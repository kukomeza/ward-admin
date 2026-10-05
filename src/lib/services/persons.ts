import { db, ensureDatabase } from "../db";
import { Person, TaskAssignment } from "../types";

export async function getPersons(search?: string, activeOnly = true): Promise<Person[]> {
  await ensureDatabase();

  let sql = `SELECT * FROM persons WHERE 1=1`;
  const args: (string | number)[] = [];

  if (activeOnly) {
    sql += ` AND is_active = 1`;
  }

  if (search && search.trim()) {
    sql += ` AND (first_name LIKE ? OR last_name LIKE ? OR notes LIKE ?)`;
    const pattern = `%${search.trim()}%`;
    args.push(pattern, pattern, pattern);
  }

  sql += ` ORDER BY last_name ASC, first_name ASC`;

  const res = await db.execute({ sql, args });
  return res.rows as unknown as Person[];
}

export async function getPersonById(id: string): Promise<{
  person: Person | null;
  history: (TaskAssignment & { meeting_title: string; meeting_type_name: string })[];
}> {
  await ensureDatabase();

  const personRes = await db.execute({
    sql: `SELECT * FROM persons WHERE id = ?`,
    args: [id],
  });

  if (personRes.rows.length === 0) {
    return { person: null, history: [] };
  }

  const person = personRes.rows[0] as unknown as Person;

  const historyRes = await db.execute({
    sql: `
      SELECT 
        ta.*,
        m.meeting_date,
        m.title AS meeting_title,
        mt.name AS meeting_type_name,
        tt.name AS task_name,
        tt.code AS task_code,
        tt.color AS task_color
      FROM task_assignments ta
      JOIN meetings m ON ta.meeting_id = m.id
      JOIN meeting_types mt ON m.meeting_type_id = mt.id
      JOIN task_types tt ON ta.task_type_id = tt.id
      WHERE ta.person_id = ?
      ORDER BY m.meeting_date DESC
    `,
    args: [id],
  });

  return {
    person,
    history: historyRes.rows as unknown as (TaskAssignment & { meeting_title: string; meeting_type_name: string })[],
  };
}

export async function createPerson(data: {
  first_name: string;
  last_name: string;
  phone?: string;
  email?: string;
  gender?: "M" | "F";
  notes?: string;
}): Promise<Person> {
  await ensureDatabase();

  const id = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  await db.execute({
    sql: `
      INSERT INTO persons (id, first_name, last_name, phone, email, gender, notes, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `,
    args: [
      id,
      data.first_name.trim(),
      data.last_name.trim(),
      data.phone?.trim() || null,
      data.email?.trim() || null,
      data.gender || null,
      data.notes?.trim() || null,
    ],
  });

  const res = await getPersonById(id);
  return res.person!;
}

export async function updatePerson(
  id: string,
  data: Partial<Person>
): Promise<Person | null> {
  await ensureDatabase();

  const updates: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.first_name !== undefined) {
    updates.push("first_name = ?");
    args.push(data.first_name.trim());
  }
  if (data.last_name !== undefined) {
    updates.push("last_name = ?");
    args.push(data.last_name.trim());
  }
  if (data.phone !== undefined) {
    updates.push("phone = ?");
    args.push(data.phone?.trim() || null);
  }
  if (data.email !== undefined) {
    updates.push("email = ?");
    args.push(data.email?.trim() || null);
  }
  if (data.gender !== undefined) {
    updates.push("gender = ?");
    args.push(data.gender || null);
  }
  if (data.notes !== undefined) {
    updates.push("notes = ?");
    args.push(data.notes?.trim() || null);
  }
  if (data.is_active !== undefined) {
    updates.push("is_active = ?");
    args.push(data.is_active);
  }

  if (updates.length === 0) return (await getPersonById(id)).person;

  args.push(id);
  await db.execute({
    sql: `UPDATE persons SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });

  return (await getPersonById(id)).person;
}

export async function deletePerson(id: string): Promise<boolean> {
  await ensureDatabase();
  // Soft delete to protect assignment integrity
  await db.execute({
    sql: `UPDATE persons SET is_active = 0 WHERE id = ?`,
    args: [id],
  });
  return true;
}

export async function importPersonsBulk(
  persons: Array<{
    first_name: string;
    last_name: string;
    phone?: string | null;
    email?: string | null;
    gender?: "M" | "F" | null;
    notes?: string | null;
  }>,
  updateExisting = true
): Promise<{ created: number; updated: number; skipped: number; total: number }> {
  await ensureDatabase();

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const p of persons) {
    const firstName = p.first_name?.trim();
    const lastName = p.last_name?.trim();
    if (!firstName || !lastName) {
      skipped++;
      continue;
    }

    // Check if person already exists by first_name and last_name (case-insensitive)
    const existingRes = await db.execute({
      sql: `SELECT id, is_active FROM persons WHERE LOWER(first_name) = LOWER(?) AND LOWER(last_name) = LOWER(?) LIMIT 1`,
      args: [firstName, lastName],
    });

    if (existingRes.rows.length > 0) {
      if (updateExisting) {
        const existingId = String(existingRes.rows[0].id);
        const updates: string[] = ["is_active = 1"];
        const args: (string | number | null)[] = [];

        if (p.phone !== undefined && p.phone !== null) {
          updates.push("phone = ?");
          args.push(p.phone.trim() || null);
        }
        if (p.email !== undefined && p.email !== null) {
          updates.push("email = ?");
          args.push(p.email.trim() || null);
        }
        if (p.gender !== undefined && p.gender !== null) {
          updates.push("gender = ?");
          args.push(p.gender || null);
        }
        if (p.notes !== undefined && p.notes !== null) {
          updates.push("notes = ?");
          args.push(p.notes.trim() || null);
        }

        args.push(existingId);
        await db.execute({
          sql: `UPDATE persons SET ${updates.join(", ")} WHERE id = ?`,
          args,
        });
        updated++;
      } else {
        skipped++;
      }
    } else {
      const id = `p-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      await db.execute({
        sql: `
          INSERT INTO persons (id, first_name, last_name, phone, email, gender, notes, is_active)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1)
        `,
        args: [
          id,
          firstName,
          lastName,
          p.phone?.trim() || null,
          p.email?.trim() || null,
          p.gender || null,
          p.notes?.trim() || null,
        ],
      });
      created++;
    }
  }

  return { created, updated, skipped, total: persons.length };
}

