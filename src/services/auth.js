async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const body = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error || `Request failed with status ${response.status}.`);
  }
  return body;
}

export function registerAccount(details) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(details),
  });
}

export function updateAccount(details) {
  return request("/api/auth/account", {
    method: "PATCH",
    body: JSON.stringify(details),
  });
}
