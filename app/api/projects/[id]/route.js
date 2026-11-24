import { json, readDatabase, writeDatabase } from "../../_lib/db.js";

export async function PUT(request, { params }) {
  const { id } = await params;
  const project = await request.json();
  if (!project || typeof project.title !== "string" || !project.title.trim()) {
    return json({ error: "A project title is required." }, 400);
  }

  const database = await readDatabase();
  const index = database.projects?.findIndex(
    (candidate) => String(candidate.id) === String(id),
  ) ?? -1;
  if (index < 0) {
    return json({ error: "Project not found." }, 404);
  }

  const previous = database.projects[index];
  const now = new Date().toISOString();
  database.projects[index] = {
    ...previous,
    ...project,
    title: project.title.trim(),
    updatedAt: now,
    completedAt:
      project.status === "Completed"
        ? previous.completedAt || now
        : null,
  };
  await writeDatabase(database);
  return json(database.projects[index]);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const database = await readDatabase();
  if (!database.projects?.some((project) => String(project.id) === String(id))) {
    return json({ error: "Project not found." }, 404);
  }
  if (database.tasks?.some((task) => String(task.projectId) === String(id))) {
    return json(
      { error: "Delete or move this project's tasks before deleting it." },
      409,
    );
  }

  database.projects = database.projects.filter(
    (project) => String(project.id) !== String(id),
  );
  await writeDatabase(database);
  return new Response(null, { status: 204 });
}
