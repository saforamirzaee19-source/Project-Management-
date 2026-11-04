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

export async function getProjects(signal) {
  const projects = await request("/api/projects", { signal });

  if (!Array.isArray(projects)) {
    throw new Error("The projects API returned an invalid response.");
  }

  return projects;
}

export function createProject(project) {
  return request("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export function updateProject(id, project) {
  return request(`/api/projects/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });
}

export function deleteProject(id) {
  return request(`/api/projects/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
