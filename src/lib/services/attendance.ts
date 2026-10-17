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

export interface MeetingAttendanceTrendItem {
  meeting_id: string;
  title: string;
  meeting_date: string;
  meeting_type_name: string;
  total_attendees: number;
  present_families_count: number;
}

export interface FamilyAttendanceHistoryPoint {
  meeting_id: string;
  meeting_date: string;
  meeting_title: string;
  attendees_count: number;
}

export interface FamilyAttendanceStat {
  family_id: string;
  family_name: string;
  default_count: number;
  meetings_attended: number;
  total_meetings_evaluated: number;
  attendance_rate: number;
  average_count_when_present: number;
  last_attended_date: string | null;
  last_attended_count: number;
  consecutive_absences: number;
  history: FamilyAttendanceHistoryPoint[];
}

export interface AttendanceAnalytics {
  summary: {
    totalMeetingsRecorded: number;
    averageAttendanceAllTime: number;
    averageAttendanceQuarter: number;
    maxAttendance: number;
    maxAttendanceDate: string | null;
    latestAttendance: number;
    latestAttendanceDate: string | null;
    totalActiveFamilies: number;
    familiesAlertCount: number;
  };
  meetingTrends: MeetingAttendanceTrendItem[];
  familyStats: FamilyAttendanceStat[];
}

/**
 * Calcula las estadísticas de asistencia, tendencia por domingo,
 * historial individual por familia y alertas de ministración (inasistencias consecutivas).
 */
export async function getAttendanceAnalytics(): Promise<AttendanceAnalytics> {
  await ensureDatabase();

  // 1. Obtener todas las reuniones donde se ha registrado asistencia (> 0 asistentes), ordenadas por fecha ASC
  const meetingsRes = await db.execute(`
    SELECT
      m.id AS meeting_id,
      m.title,
      m.meeting_date,
      COALESCE(mt.name, 'Reunión') AS meeting_type_name,
      COALESCE(SUM(ma.attendees_count), 0) AS total_attendees,
      COUNT(CASE WHEN ma.attendees_count > 0 THEN 1 END) AS present_families_count
    FROM meetings m
    LEFT JOIN meeting_types mt ON mt.id = m.meeting_type_id
    LEFT JOIN meeting_attendance ma ON ma.meeting_id = m.id
    GROUP BY m.id
    HAVING COALESCE(SUM(ma.attendees_count), 0) > 0
    ORDER BY m.meeting_date ASC, m.created_at ASC
  `);

  const meetingTrends: MeetingAttendanceTrendItem[] = meetingsRes.rows.map(
    (r) => ({
      meeting_id: String(r.meeting_id),
      title: String(r.title),
      meeting_date: String(r.meeting_date),
      meeting_type_name: String(r.meeting_type_name),
      total_attendees: Number(r.total_attendees) || 0,
      present_families_count: Number(r.present_families_count) || 0,
    })
  );

  // 2. Obtener todas las familias activas del padrón
  const familiesRes = await db.execute(`
    SELECT id, name, default_count
    FROM attendance_families
    WHERE is_active = 1
    ORDER BY name COLLATE NOCASE ASC
  `);

  // 3. Obtener todos los registros de asistencia por reunión y familia
  const recordsRes = await db.execute(`
    SELECT meeting_id, family_id, attendees_count
    FROM meeting_attendance
    WHERE attendees_count > 0
  `);

  const attendanceMap = new Map<string, number>();
  for (const row of recordsRes.rows) {
    const key = `${String(row.meeting_id)}::${String(row.family_id)}`;
    attendanceMap.set(key, Number(row.attendees_count) || 0);
  }

  const totalMeetingsRecorded = meetingTrends.length;

  // 4. Construir historial por cada familia
  const familyStats: FamilyAttendanceStat[] = familiesRes.rows.map((fam) => {
    const familyId = String(fam.id);
    const familyName = String(fam.name);
    const defaultCount = Number(fam.default_count) || 1;

    const historyChronological: FamilyAttendanceHistoryPoint[] =
      meetingTrends.map((m) => {
        const count = attendanceMap.get(`${m.meeting_id}::${familyId}`) || 0;
        return {
          meeting_id: m.meeting_id,
          meeting_date: m.meeting_date,
          meeting_title: m.title,
          attendees_count: count,
        };
      });

    const attendedPoints = historyChronological.filter(
      (h) => h.attendees_count > 0
    );
    const meetingsAttended = attendedPoints.length;
    const attendanceRate =
      totalMeetingsRecorded > 0
        ? Math.round((meetingsAttended / totalMeetingsRecorded) * 100)
        : 0;

    const totalPresentSum = attendedPoints.reduce(
      (acc, p) => acc + p.attendees_count,
      0
    );
    const averageCountWhenPresent =
      meetingsAttended > 0
        ? Math.round((totalPresentSum / meetingsAttended) * 10) / 10
        : 0;

    const lastAttended =
      attendedPoints.length > 0
        ? attendedPoints[attendedPoints.length - 1]
        : null;

    // Calcular ausencias consecutivas desde la reunión más reciente hacia atrás
    let consecutiveAbsences = 0;
    for (let i = historyChronological.length - 1; i >= 0; i--) {
      if (historyChronological[i].attendees_count === 0) {
        consecutiveAbsences++;
      } else {
        break;
      }
    }

    return {
      family_id: familyId,
      family_name: familyName,
      default_count: defaultCount,
      meetings_attended: meetingsAttended,
      total_meetings_evaluated: totalMeetingsRecorded,
      attendance_rate: attendanceRate,
      average_count_when_present: averageCountWhenPresent,
      last_attended_date: lastAttended ? lastAttended.meeting_date : null,
      last_attended_count: lastAttended ? lastAttended.attendees_count : 0,
      consecutive_absences: consecutiveAbsences,
      // Mostrar de la más reciente a la más antigua para inspección rápida
      history: [...historyChronological].reverse(),
    };
  });

  // 5. Calcular métricas de resumen
  const totalSumAll = meetingTrends.reduce(
    (acc, m) => acc + m.total_attendees,
    0
  );
  const averageAttendanceAllTime =
    totalMeetingsRecorded > 0 ? Math.round(totalSumAll / totalMeetingsRecorded) : 0;

  // Promedio trimestral (últimas 12 reuniones o últimos 90 días)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const cutoffStr = ninetyDaysAgo.toISOString().slice(0, 10);

  const quarterMeetings = meetingTrends.filter(
    (m) => m.meeting_date >= cutoffStr
  );
  const quarterPool =
    quarterMeetings.length > 0 ? quarterMeetings : meetingTrends.slice(-12);
  const averageAttendanceQuarter =
    quarterPool.length > 0
      ? Math.round(
          quarterPool.reduce((acc, m) => acc + m.total_attendees, 0) /
            quarterPool.length
        )
      : 0;

  let maxAttendance = 0;
  let maxAttendanceDate: string | null = null;
  for (const m of meetingTrends) {
    if (m.total_attendees >= maxAttendance) {
      maxAttendance = m.total_attendees;
      maxAttendanceDate = m.meeting_date;
    }
  }

  const latestMeeting =
    meetingTrends.length > 0 ? meetingTrends[meetingTrends.length - 1] : null;

  const alertThreshold = totalMeetingsRecorded >= 3 ? 3 : 2;
  const familiesAlertCount =
    totalMeetingsRecorded >= 2
      ? familyStats.filter((f) => f.consecutive_absences >= alertThreshold)
          .length
      : 0;

  return {
    summary: {
      totalMeetingsRecorded,
      averageAttendanceAllTime,
      averageAttendanceQuarter,
      maxAttendance,
      maxAttendanceDate,
      latestAttendance: latestMeeting ? latestMeeting.total_attendees : 0,
      latestAttendanceDate: latestMeeting ? latestMeeting.meeting_date : null,
      totalActiveFamilies: familyStats.length,
      familiesAlertCount,
    },
    meetingTrends,
    familyStats,
  };
}


