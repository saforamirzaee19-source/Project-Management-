import { json, readDatabase, writeDatabase } from "../_lib/db.js";
import { randomUUID } from "node:crypto";
import { auth } from "../../../auth.js";

function validateProject(project) {
  if (!project || typeof project !== "object") {
    return "A project object is required.";
  }
  if (typeof project.title !== "string" || !project.title.trim()) {
    return "A project title is required.";
  }
  if (typeof project.status !== "string") {
    return "A project status is required.";
  }
  return null;
}

export async function GET() {
  const database = await readDatabase();
  return json(database.projects ?? []);
}

export async function POST(request) {
  const session = await auth();
  if (!session?.user?.id) {
    return json({ error: "Authentication required." }, 401);
  }
  const project = await request.json();
  const error = validateProject(project);
  if (error) {
    return json({ error }, 400);
  }

  const database = await readDatabase();
  const now = new Date().toISOString();
  const created = {
    ...project,
    id: project.id || randomUUID(),
    owner: session.user.id,
    createdBy: session.user.id,
    title: project.title.trim(),
    createdAt: project.createdAt || now,
    updatedAt: now,
    completedAt:
      project.status === "Completed" ? project.completedAt || now : null,
  };

  database.projects ??= [];
  database.projects.push(created);
  await writeDatabase(database);
  return json(created, 201);
}
