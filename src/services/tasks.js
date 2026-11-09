async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function getTasks(signal) {
  const tasks = await request("/api/tasks", { signal });

  if (!Array.isArray(tasks)) {
    throw new Error("The tasks API returned an invalid response.");
  }

  return tasks;
}

export function createTask(task) {
  assertProjectId(task);
  return request("/api/tasks", {
    method: "POST",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, task) {
  assertProjectId(task);
  return request(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

function assertProjectId(task) {
  if (!task || String(task.projectId ?? "").trim() === "") {
    throw new Error("A task must belong to a project.");
  }
}

export function deleteTask(id) {
  return request(`/api/tasks/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
