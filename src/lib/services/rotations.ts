import { db, ensureDatabase } from "../db";
import { Person, PersonCandidateStatus, RotationAuditResult } from "../types";

/**
 * Checks if a person has performed a specific task within 90 days prior to meetingDate.
 */
export async function checkRotationRule(
  personId: string,
  taskTypeId: string,
  meetingDate: string,
  excludeMeetingId?: string
): Promise<RotationAuditResult> {
  await ensureDatabase();

  // Find assignments for this person and task in the last 90 days before meetingDate
  const conflictQuery = await db.execute({
    sql: `
      SELECT 
        ta.id AS assignment_id,
        m.id AS meeting_id,
        m.meeting_date,
        m.title AS meeting_title,
        mt.name AS meeting_type_name,
        tt.name AS task_name,
        ROUND(julianday(?) - julianday(m.meeting_date)) AS days_ago
      FROM task_assignments ta
      JOIN meetings m ON ta.meeting_id = m.id
      JOIN task_types tt ON ta.task_type_id = tt.id
      JOIN meeting_types mt ON m.meeting_type_id = mt.id
      WHERE ta.person_id = ?
        AND ta.task_type_id = ?
        AND m.meeting_date >= date(?, '-90 days')
        AND m.meeting_date <= ?
        ${excludeMeetingId ? "AND m.id != ?" : ""}
      ORDER BY m.meeting_date DESC
      LIMIT 1
    `,
    args: excludeMeetingId
      ? [meetingDate, personId, taskTypeId, meetingDate, meetingDate, excludeMeetingId]
      : [meetingDate, personId, taskTypeId, meetingDate, meetingDate],
  });

  // Also query other recent assignments for this person in any task (last 45 days)
  const otherQuery = await db.execute({
    sql: `
      SELECT 
        m.id AS meeting_id,
        m.meeting_date,
        m.title AS meeting_title,
        tt.name AS task_name,
        ROUND(julianday(?) - julianday(m.meeting_date)) AS days_ago
      FROM task_assignments ta
      JOIN meetings m ON ta.meeting_id = m.id
      JOIN task_types tt ON ta.task_type_id = tt.id
      WHERE ta.person_id = ?
        AND ta.task_type_id != ?
        AND m.meeting_date >= date(?, '-45 days')
        AND m.meeting_date <= ?
        ${excludeMeetingId ? "AND m.id != ?" : ""}
      ORDER BY m.meeting_date DESC
      LIMIT 3
    `,
    args: excludeMeetingId
      ? [meetingDate, personId, taskTypeId, meetingDate, meetingDate, excludeMeetingId]
      : [meetingDate, personId, taskTypeId, meetingDate, meetingDate],
  });

  const hasConflict = conflictQuery.rows.length > 0;
  const lastRow = conflictQuery.rows[0];

  return {
    has_conflict: hasConflict,
    last_assignment: hasConflict
      ? {
          meeting_id: String(lastRow.meeting_id),
          meeting_title: String(lastRow.meeting_title),
          meeting_type_name: String(lastRow.meeting_type_name),
          meeting_date: String(lastRow.meeting_date),
          task_name: String(lastRow.task_name),
          days_ago: Math.max(0, Number(lastRow.days_ago)),
        }
      : undefined,
    other_recent_assignments: otherQuery.rows.map((r) => ({
      meeting_id: String(r.meeting_id),
      meeting_title: String(r.meeting_title),
      meeting_date: String(r.meeting_date),
      task_name: String(r.task_name),
      days_ago: Math.max(0, Number(r.days_ago)),
    })),
  };
}

/**
 * Returns all active persons enriched with conflict info for the requested task and date.
 * Available persons are sorted first, making assignment effortless.
 */
export async function getCandidatesForTask(
  taskTypeId: string,
  meetingDate: string,
  excludeMeetingId?: string
): Promise<PersonCandidateStatus[]> {
  await ensureDatabase();

  const personsRes = await db.execute(
    "SELECT * FROM persons WHERE is_active = 1 ORDER BY last_name ASC, first_name ASC"
  );
  const persons = personsRes.rows as unknown as Person[];

  const results: PersonCandidateStatus[] = [];

  for (const person of persons) {
    const audit = await checkRotationRule(person.id, taskTypeId, meetingDate, excludeMeetingId);

    let conflictDetails = "";
    if (audit.has_conflict && audit.last_assignment) {
      conflictDetails = `Participó en ${audit.last_assignment.task_name} el ${audit.last_assignment.meeting_date} (hace ${audit.last_assignment.days_ago} días)`;
    }

    const lastOther = audit.other_recent_assignments?.[0];

    results.push({
      person,
      conflict: audit.has_conflict,
      last_task_date: audit.last_assignment?.meeting_date,
      days_ago: audit.last_assignment?.days_ago,
      conflict_details: conflictDetails,
      last_any_task_date: lastOther?.meeting_date,
      last_any_task_name: lastOther?.task_name,
    });
  }

  // Sort: non-conflicting first, then by last participation days_ago descending (longest ago first)
  return results.sort((a, b) => {
    if (a.conflict === b.conflict) {
      return (b.days_ago ?? 999) - (a.days_ago ?? 999);
    }
    return a.conflict ? 1 : -1;
  });
}
