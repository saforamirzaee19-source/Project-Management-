"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";

function AdminUsers({ currentUserId }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      try {
        const response = await fetch("/api/admin/users");
        const body = await response.json();
        if (!response.ok) {
          throw new Error(body?.error || "Could not load users.");
        }
        if (active) {
          setUsers(body);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadUsers();
    return () => {
      active = false;
    };
  }, []);

  async function changeRole(userId, role) {
    setUpdatingUserId(userId);
    setError("");
    try {
      const response = await fetch(`/api/admin/users/${encodeURIComponent(userId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || "Could not update this user's role.");
      }
      setUsers((current) =>
        current.map((user) => (user.userId === userId ? body : user)),
      );
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setUpdatingUserId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A]">
      <Sidebar />
      <div className="min-w-0 md:ml-60">
        <Header page="admin" />
        <main className="p-6 md:p-8">
          <section className="mx-auto max-w-4xl">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#6B352A]/65">
                Workspace settings
              </p>
              <h2 className="mt-2 text-3xl font-bold">Manage users</h2>
              <p className="mt-2 max-w-2xl leading-7 text-[#6B352A]/75">
                Review workspace accounts and grant or remove administrator
                access. Only administrators can change roles.
              </p>
            </div>

            {error && (
              <p
                className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="overflow-hidden rounded-2xl border border-[#6B352A]/15 bg-white">
              {isLoading ? (
                <p className="p-6 text-sm text-[#6B352A]/70" role="status">
                  Loading users…
                </p>
              ) : users.length === 0 ? (
                <p className="p-6 text-sm text-[#6B352A]/70">
                  No user accounts have been created yet.
                </p>
              ) : (
                <ul className="divide-y divide-[#6B352A]/10">
                  {users.map((user) => (
                    <li
                      className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                      key={user.userId}
                    >
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {user.displayName}
                          {user.userId === currentUserId && (
                            <span className="ml-2 text-xs font-normal text-[#6B352A]/60">
                              You
                            </span>
                          )}
                        </p>
                        <p className="mt-1 truncate text-sm text-[#6B352A]/70">
                          {user.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-[#FFF1A6] px-3 py-1 text-xs font-semibold capitalize">
                          {user.role}
                        </span>
                        {user.userId !== currentUserId && (
                          <button
                            className="rounded-full border border-[#6B352A]/30 px-4 py-2 text-sm font-semibold transition hover:bg-[#FFF1A6] disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={updatingUserId !== null}
                            onClick={() =>
                              changeRole(
                                user.userId,
                                user.role === "admin" ? "user" : "admin",
                              )
                            }
                            type="button"
                          >
                            {updatingUserId === user.userId
                              ? "Saving…"
                              : user.role === "admin"
                                ? "Remove admin"
                                : "Make admin"}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminUsers;
