import { json, readDatabase, writeDatabase } from "../../_lib/db.js";
import { auth } from "../../../../auth.js";

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return json({ error: "Authentication required." }, 401);
  const { id } = await params;
  const task = await request.json();
  if (!task || typeof task.title !== "string" || !task.title.trim()) {
    return json({ error: "A task title is required." }, 400);
  }
  if (!String(task.projectId ?? "").trim()) {
    return json({ error: "A task must belong to a project." }, 400);
  }

  const database = await readDatabase();
  const index = database.tasks?.findIndex(
    (candidate) => String(candidate.id) === String(id),
  ) ?? -1;
  if (index < 0) {
    return json({ error: "Task not found." }, 404);
  }
  if (
    !database.projects?.some(
      (project) => String(project.id) === String(task.projectId),
    )
  ) {
    return json({ error: "Choose an available project." }, 400);
  }
  if (
    task.parentId &&
    (String(task.parentId) === String(id) ||
      !database.tasks.some(
        (candidate) =>
          String(candidate.id) === String(task.parentId) &&
          String(candidate.projectId) === String(task.projectId),
      ))
  ) {
    return json(
      { error: "Choose a parent task from the same project." },
      400,
    );
  }

  const previous = database.tasks[index];
  const now = new Date().toISOString();
  database.tasks[index] = {
    ...previous,
    ...task,
    title: task.title.trim(),
    updatedAt: now,
    completedAt:
      task.status === "Completed" ? previous.completedAt || now : null,
  };
  await writeDatabase(database);
  return json(database.tasks[index]);
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session?.user?.id) return json({ error: "Authentication required." }, 401);
  const { id } = await params;
  const database = await readDatabase();
  if (!database.tasks?.some((task) => String(task.id) === String(id))) {
    return json({ error: "Task not found." }, 404);
  }
  if (database.tasks.some((task) => String(task.parentId) === String(id))) {
    return json(
      { error: "Delete or reassign this task's child tasks first." },
      409,
    );
  }

  database.tasks = database.tasks.filter(
    (task) => String(task.id) !== String(id),
  );
  await writeDatabase(database);
  return new Response(null, { status: 204 });
}
