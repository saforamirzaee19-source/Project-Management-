export async function getTasks(signal) {
  const response = await fetch("/api/tasks", { signal });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  const tasks = await response.json();

  if (!Array.isArray(tasks)) {
    throw new Error("The tasks API returned an invalid response.");
  }

  return tasks;
}
