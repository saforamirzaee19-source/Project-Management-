import { json, readDatabase, writeDatabase } from "../_lib/db.js";
import { randomUUID } from "node:crypto";

function validateTask(task, projects) {
  if (!task || typeof task !== "object") {
    return "A task object is required.";
  }
  if (typeof task.title !== "string" || !task.title.trim()) {
    return "A task title is required.";
  }
  if (!String(task.projectId ?? "").trim()) {
    return "A task must belong to a project.";
  }
  if (!projects.some((project) => String(project.id) === String(task.projectId))) {
    return "Choose an available project.";
  }
  return null;
}

export async function GET() {
  const database = await readDatabase();
  return json(database.tasks ?? []);
}

export async function POST(request) {
  const task = await request.json();
  const database = await readDatabase();
  const error = validateTask(task, database.projects ?? []);
  if (error) {
    return json({ error }, 400);
  }

  if (
    task.parentId &&
    !database.tasks?.some(
      (candidate) =>
        String(candidate.id) === String(task.parentId) &&
        String(candidate.projectId) === String(task.projectId),
    )
  ) {
    return json(
      { error: "Choose a parent task from the same project." },
      400,
    );
  }

  const now = new Date().toISOString();
  const created = {
    ...task,
    id: task.id || randomUUID(),
    title: task.title.trim(),
    createdAt: task.createdAt || now,
    updatedAt: now,
    completedAt: task.status === "Completed" ? task.completedAt || now : null,
  };

  database.tasks ??= [];
  database.tasks.push(created);
  await writeDatabase(database);
  return json(created, 201);
}
