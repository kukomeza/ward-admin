import { db, ensureDatabase } from "../db";
import { TaskType } from "../types";

export async function getTaskTypes(activeOnly = true): Promise<TaskType[]> {
  await ensureDatabase();

  let sql = `SELECT * FROM task_types WHERE 1=1`;
  if (activeOnly) {
    sql += ` AND is_active = 1`;
  }
  sql += ` ORDER BY name ASC`;

  const res = await db.execute(sql);
  return res.rows as unknown as TaskType[];
}

export async function getTaskTypeById(id: string): Promise<TaskType | null> {
  await ensureDatabase();

  const res = await db.execute({
    sql: `SELECT * FROM task_types WHERE id = ?`,
    args: [id],
  });

  return (res.rows[0] as unknown as TaskType) || null;
}

export async function createTaskType(data: {
  name: string;
  code?: string;
  description?: string;
  color?: string;
}): Promise<TaskType> {
  await ensureDatabase();

  const id = `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const code = (
    data.code || data.name.toUpperCase().replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  ).replace(/[^A-Z0-9_]/g, "");

  await db.execute({
    sql: `
      INSERT INTO task_types (id, name, code, description, color, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
    `,
    args: [
      id,
      data.name.trim(),
      code,
      data.description?.trim() || null,
      data.color || "#2563eb",
    ],
  });

  return (await getTaskTypeById(id))!;
}

export async function updateTaskType(
  id: string,
  data: Partial<TaskType>
): Promise<TaskType | null> {
  await ensureDatabase();

  const updates: string[] = [];
  const args: (string | number | null)[] = [];

  if (data.name !== undefined) {
    updates.push("name = ?");
    args.push(data.name.trim());
  }
  if (data.description !== undefined) {
    updates.push("description = ?");
    args.push(data.description?.trim() || null);
  }
  if (data.color !== undefined) {
    updates.push("color = ?");
    args.push(data.color);
  }
  if (data.is_active !== undefined) {
    updates.push("is_active = ?");
    args.push(data.is_active);
  }

  if (updates.length === 0) return await getTaskTypeById(id);

  args.push(id);
  await db.execute({
    sql: `UPDATE task_types SET ${updates.join(", ")} WHERE id = ?`,
    args,
  });

  return await getTaskTypeById(id);
}
