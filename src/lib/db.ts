import { createClient } from "@libsql/client";

const DB_URL = process.env.DATABASE_URL || "file:ward.db";
const DB_AUTH_TOKEN = process.env.DATABASE_AUTH_TOKEN;

export const db = createClient({
  url: DB_URL,
  ...(DB_AUTH_TOKEN ? { authToken: DB_AUTH_TOKEN } : {}),
});

let isInitialized = false;

export async function ensureDatabase() {
  if (isInitialized) return;

  // Create tables
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS persons (
      id TEXT PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      gender TEXT,
      notes TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS task_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      color TEXT DEFAULT '#2563eb',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meeting_types (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT NOT NULL UNIQUE,
      description TEXT,
      default_template TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meetings (
      id TEXT PRIMARY KEY,
      meeting_type_id TEXT NOT NULL REFERENCES meeting_types(id),
      meeting_date TEXT NOT NULL,
      start_time TEXT NOT NULL DEFAULT '10:00',
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'SCHEDULED',
      presiding_person_id TEXT REFERENCES persons(id),
      conducting_person_id TEXT REFERENCES persons(id),
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meeting_items (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
      order_index INTEGER NOT NULL,
      item_type TEXT NOT NULL,
      title TEXT NOT NULL,
      hymn_number TEXT,
      hymn_title TEXT,
      speaker_topic TEXT,
      notes TEXT,
      is_completed INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS task_assignments (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
      meeting_item_id TEXT REFERENCES meeting_items(id) ON DELETE SET NULL,
      person_id TEXT NOT NULL REFERENCES persons(id),
      task_type_id TEXT NOT NULL REFERENCES task_types(id),
      status TEXT NOT NULL DEFAULT 'CONFIRMED',
      override_3month_alert INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meeting_visitor_notes (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
      visitor_name TEXT NOT NULL,
      visitor_title TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      is_read INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS attendance_families (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      default_count INTEGER NOT NULL DEFAULT 1,
      notes TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS meeting_attendance (
      id TEXT PRIMARY KEY,
      meeting_id TEXT NOT NULL REFERENCES meetings(id) ON DELETE CASCADE,
      family_id TEXT NOT NULL REFERENCES attendance_families(id) ON DELETE CASCADE,
      attendees_count INTEGER NOT NULL DEFAULT 0,
      notes TEXT,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(meeting_id, family_id)
    );

    CREATE INDEX IF NOT EXISTS idx_assignments_person_task ON task_assignments(person_id, task_type_id);
    CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
    CREATE INDEX IF NOT EXISTS idx_meeting_attendance_meeting ON meeting_attendance(meeting_id);
  `);

  // Check if seed data exists
  const existingTasks = await db.execute("SELECT COUNT(*) as count FROM task_types");
  const count = Number(existingTasks.rows[0].count);

  if (count === 0) {
    await seedDefaultData();
  }

  isInitialized = true;
}

async function seedDefaultData() {
  // 1. Base Task Types
  const tasks = [
    { id: "task-preside", name: "Presidir", code: "PRESIDE", color: "#4f46e5", desc: "Presidir la reunión (Obispado o Presidencia)" },
    { id: "task-conduct", name: "Dirigir", code: "CONDUCT", color: "#2563eb", desc: "Conducir el programa de la reunión" },
    { id: "task-music-conduct", name: "Dirigir himnos", code: "MUSIC_CONDUCT", color: "#0891b2", desc: "Dirigir el canto congregacional de los himnos" },
    { id: "task-special-music", name: "Cantar / Música Especial", code: "SPECIAL_MUSIC", color: "#0d9488", desc: "Número musical especial o solista" },
    { id: "task-prayer", name: "Orar", code: "PRAYER", color: "#16a34a", desc: "Ofrecer primera o última oración" },
    { id: "task-talk", name: "Discursar", code: "TALK", color: "#d97706", desc: "Compartir un discurso o mensaje preparado" },
    { id: "task-testify", name: "Testificar", code: "TESTIFY", color: "#ea580c", desc: "Compartir testimonio" },
    { id: "task-announcement", name: "Anunciar", code: "ANNOUNCEMENT", color: "#64748b", desc: "Dar anuncios o asuntos oficiales" },
    { id: "task-prepare-sac", name: "Preparar", code: "PREPARE_SACRAMENT", color: "#9333ea", desc: "Preparar la mesa de la Santa Cena" },
    { id: "task-bless-sac", name: "Bendecir", code: "BLESS_SACRAMENT", color: "#7c3aed", desc: "Bendecir el pan o el agua de la Santa Cena" },
    { id: "task-pass-sac", name: "Repartir", code: "PASS_SACRAMENT", color: "#6366f1", desc: "Repartir la Santa Cena a la congregación" },
    { id: "task-baptize", name: "Bautizar", code: "BAPTIZE", color: "#0284c7", desc: "Efectuar la ordenanza del bautismo" },
    { id: "task-confirm", name: "Confirmar", code: "CONFIRM", color: "#0369a1", desc: "Efectuar la confirmación como miembro" },
  ];

  for (const t of tasks) {
    await db.execute({
      sql: `INSERT INTO task_types (id, name, code, color, description, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
      args: [t.id, t.name, t.code, t.color, t.desc],
    });
  }

  // 2. Default Meeting Types & Templates
  const sacramentalTemplate = JSON.stringify([
    { item_type: "WELCOME", title: "Bienvenida y Reconocimiento de Autoridades" },
    { item_type: "HYMN", title: "Himno de Apertura", task_code: "MUSIC_CONDUCT" },
    { item_type: "PRAYER", title: "Primera Oración", task_code: "PRAYER" },
    { item_type: "ANNOUNCEMENT", title: "Asuntos de Barrio y Anuncios", task_code: "ANNOUNCEMENT" },
    { item_type: "HYMN", title: "Himno Sacramental", task_code: "MUSIC_CONDUCT" },
    { item_type: "ORDINANCE", title: "Administración de la Santa Cena", task_code: "BLESS_SACRAMENT" },
    { item_type: "TALK", title: "Primer Discurso (Joven / Miembro)", task_code: "TALK", speaker_topic: "Tema asignado" },
    { item_type: "TALK", title: "Segundo Discurso", task_code: "TALK", speaker_topic: "Tema asignado" },
    { item_type: "HYMN", title: "Himno Intermedio o Número Especial", task_code: "SPECIAL_MUSIC" },
    { item_type: "TALK", title: "Discurso Final", task_code: "TALK", speaker_topic: "Tema asignado" },
    { item_type: "HYMN", title: "Himno Final", task_code: "MUSIC_CONDUCT" },
    { item_type: "PRAYER", title: "Última Oración", task_code: "PRAYER" },
  ]);

  const baptismTemplate = JSON.stringify([
    { item_type: "WELCOME", title: "Bienvenida" },
    { item_type: "HYMN", title: "Himno de Apertura", task_code: "MUSIC_CONDUCT" },
    { item_type: "PRAYER", title: "Primera Oración", task_code: "PRAYER" },
    { item_type: "TALK", title: "Mensaje sobre el Bautismo y Convenios", task_code: "TALK" },
    { item_type: "ORDINANCE", title: "Ordenanza Bautismal en la Pila", task_code: "BAPTIZE" },
    { item_type: "SPECIAL_MUSIC", title: "Intermedio Musical (Preludio)", task_code: "SPECIAL_MUSIC" },
    { item_type: "ORDINANCE", title: "Confirmación y Don del Espíritu Santo", task_code: "CONFIRM" },
    { item_type: "TALK", title: "Mensaje sobre el Don del Espíritu Santo", task_code: "TALK" },
    { item_type: "ANNOUNCEMENT", title: "Palabras de Bienvenida a la Comunidad" },
    { item_type: "HYMN", title: "Himno Final", task_code: "MUSIC_CONDUCT" },
    { item_type: "PRAYER", title: "Última Oración", task_code: "PRAYER" },
  ]);

  const devotionalTemplate = JSON.stringify([
    { item_type: "WELCOME", title: "Bienvenida y Reconocimiento" },
    { item_type: "HYMN", title: "Himno de Apertura", task_code: "MUSIC_CONDUCT" },
    { item_type: "PRAYER", title: "Primera Oración", task_code: "PRAYER" },
    { item_type: "TALK", title: "Mensaje Principal", task_code: "TALK" },
    { item_type: "TESTIMONY", title: "Tiempo para Testimonios", task_code: "TESTIFY" },
    { item_type: "HYMN", title: "Himno Final", task_code: "MUSIC_CONDUCT" },
    { item_type: "PRAYER", title: "Última Oración", task_code: "PRAYER" },
  ]);

  await db.execute({
    sql: `INSERT INTO meeting_types (id, name, code, description, default_template, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
    args: ["mt-sacramental", "Reunión Sacramental", "SACRAMENTAL", "Reunión dominical general de adoración y Santa Cena", sacramentalTemplate],
  });

  await db.execute({
    sql: `INSERT INTO meeting_types (id, name, code, description, default_template, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
    args: ["mt-baptism", "Servicio Bautismal", "BAPTISM", "Servicio bautismal y confirmación", baptismTemplate],
  });

  await db.execute({
    sql: `INSERT INTO meeting_types (id, name, code, description, default_template, is_active) VALUES (?, ?, ?, ?, ?, 1)`,
    args: ["mt-devotional", "Devocional", "DEVOTIONAL", "Devocional dominical o de entresemana", devotionalTemplate],
  });
}

