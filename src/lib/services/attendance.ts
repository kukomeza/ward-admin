import { db, ensureDatabase } from "../db";
import { MeetingAttendanceItem } from "../types";
import crypto from "crypto";

export interface MeetingAttendanceSummary {
  items: MeetingAttendanceItem[];
  totalAttendees: number;
  presentFamiliesCount: number;
  totalCatalogCount: number;
}

/**
 * Obtiene la lista completa de familias/personas del padrón de asistencia
 * junto con la cantidad de asistentes registrados en la reunión indicada.
 */
export async function getMeetingAttendance(
  meetingId: string
): Promise<MeetingAttendanceSummary> {
  await ensureDatabase();

  const res = await db.execute({
    sql: `
      SELECT 
        af.id AS family_id,
        af.name AS family_name,
        af.default_count,
        af.notes AS family_notes,
        COALESCE(ma.attendees_count, 0) AS attendees_count,
        ma.id AS attendance_id,
        ma.notes AS attendance_notes,
        ma.updated_at
      FROM attendance_families af
      LEFT JOIN meeting_attendance ma 
        ON ma.family_id = af.id AND ma.meeting_id = ?
      WHERE af.is_active = 1 OR COALESCE(ma.attendees_count, 0) > 0
      ORDER BY af.name COLLATE NOCASE ASC
    `,
    args: [meetingId],
  });

  const items: MeetingAttendanceItem[] = res.rows.map((r) => ({
    family_id: String(r.family_id),
    family_name: String(r.family_name),
    default_count: Number(r.default_count) || 1,
    family_notes: r.family_notes ? String(r.family_notes) : null,
    attendees_count: Number(r.attendees_count) || 0,
    attendance_id: r.attendance_id ? String(r.attendance_id) : null,
    attendance_notes: r.attendance_notes ? String(r.attendance_notes) : null,
    updated_at: r.updated_at ? String(r.updated_at) : null,
  }));

  const totalAttendees = items.reduce((sum, item) => sum + item.attendees_count, 0);
  const presentFamiliesCount = items.filter((item) => item.attendees_count > 0).length;

  return {
    items,
    totalAttendees,
    presentFamiliesCount,
    totalCatalogCount: items.length,
  };
}

/**
 * Registra o actualiza la asistencia de una familia o persona en una reunión.
 * Si la familia es nueva, la guarda en `attendance_families` para poder reutilizarla
 * automáticamente en futuras reuniones.
 */
export async function recordMeetingAttendance(
  meetingId: string,
  params: {
    familyId?: string;
    familyName?: string;
    attendeesCount: number;
    notes?: string | null;
  }
): Promise<MeetingAttendanceSummary> {
  await ensureDatabase();

  const count = Math.max(0, Math.floor(Number(params.attendeesCount) || 0));
  let targetFamilyId = params.familyId?.trim();

  // Si no viene familyId pero viene familyName, buscar o crear en el catálogo
  if (!targetFamilyId && params.familyName) {
    const cleanName = params.familyName.trim();
    if (!cleanName) {
      throw new Error("El nombre de la familia o persona es requerido");
    }

    const existing = await db.execute({
      sql: `SELECT id, default_count FROM attendance_families WHERE LOWER(TRIM(name)) = LOWER(?) LIMIT 1`,
      args: [cleanName],
    });

    if (existing.rows.length > 0) {
      targetFamilyId = String(existing.rows[0].id);
      await db.execute({
        sql: `UPDATE attendance_families SET is_active = 1, default_count = CASE WHEN ? > 0 THEN ? ELSE default_count END WHERE id = ?`,
        args: [count, count, targetFamilyId],
      });
    } else {
      targetFamilyId = `fam-${crypto.randomUUID().slice(0, 8)}`;
      const defaultCount = count > 0 ? count : 1;
      await db.execute({
        sql: `INSERT INTO attendance_families (id, name, default_count, notes, is_active) VALUES (?, ?, ?, ?, 1)`,
        args: [targetFamilyId, cleanName, defaultCount, params.notes || null],
      });
    }
  } else if (targetFamilyId && count > 0) {
    // Actualizar el default_count de la familia para recordar la cantidad habitual en futuras reuniones
    await db.execute({
      sql: `UPDATE attendance_families SET default_count = ? WHERE id = ?`,
      args: [count, targetFamilyId],
    });
  }

  if (!targetFamilyId) {
    throw new Error("No se especificó la familia o persona");
  }

  // Verificar si ya existe registro en esta reunión
  const existingRecord = await db.execute({
    sql: `SELECT id FROM meeting_attendance WHERE meeting_id = ? AND family_id = ? LIMIT 1`,
    args: [meetingId, targetFamilyId],
  });

  if (existingRecord.rows.length > 0) {
    await db.execute({
      sql: `UPDATE meeting_attendance SET attendees_count = ?, notes = COALESCE(?, notes), updated_at = datetime('now') WHERE meeting_id = ? AND family_id = ?`,
      args: [count, params.notes ?? null, meetingId, targetFamilyId],
    });
  } else {
    const attId = `att-${crypto.randomUUID().slice(0, 8)}`;
    await db.execute({
      sql: `INSERT INTO meeting_attendance (id, meeting_id, family_id, attendees_count, notes) VALUES (?, ?, ?, ?, ?)`,
      args: [attId, meetingId, targetFamilyId, count, params.notes || null],
    });
  }

  return getMeetingAttendance(meetingId);
}

/**
 * Actualiza el nombre o cantidad habitual de una familia en el catálogo.
 */
export async function updateAttendanceFamily(
  familyId: string,
  data: { name?: string; default_count?: number }
): Promise<void> {
  await ensureDatabase();

  if (data.name !== undefined && data.name.trim()) {
    await db.execute({
      sql: `UPDATE attendance_families SET name = ? WHERE id = ?`,
      args: [data.name.trim(), familyId],
    });
  }

  if (data.default_count !== undefined) {
    const cleanDefault = Math.max(1, Math.floor(Number(data.default_count) || 1));
    await db.execute({
      sql: `UPDATE attendance_families SET default_count = ? WHERE id = ?`,
      args: [cleanDefault, familyId],
    });
  }
}

/**
 * Desactiva una familia del catálogo para que no aparezca en futuras reuniones
 * y pone en 0 su asistencia en la reunión actual si se indica.
 */
export async function removeAttendanceFamily(
  familyId: string,
  meetingId?: string
): Promise<void> {
  await ensureDatabase();

  if (meetingId) {
    await db.execute({
      sql: `DELETE FROM meeting_attendance WHERE meeting_id = ? AND family_id = ?`,
      args: [meetingId, familyId],
    });
  }

  await db.execute({
    sql: `UPDATE attendance_families SET is_active = 0 WHERE id = ?`,
    args: [familyId],
  });
}

