import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { getTasks } from "../services/tasks.js";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getTasks(controller.signal)
      .then(setTasks)
      .catch((loadError) => {
        if (loadError.name !== "AbortError") {
          setError(loadError.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [reloadCount]);

  const activeTasks = tasks.filter((task) => task.status !== "Completed");
  const stats = [
    { label: "My tasks", value: activeTasks.length },
    {
      label: "In progress",
      value: activeTasks.filter((task) => task.status === "In progress").length,
    },
    {
      label: "Completed this week",
      value: tasks.filter((task) => task.completedThisWeek).length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A] md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header page="dashboard" />

        <main id="overview" className="p-6 md:p-8">
          <h2 className="text-2xl font-bold">Good morning, Ahmad!</h2>
          <p className="mt-2">Here’s what’s happening with your work.</p>

          {loading ? (
            <p className="mt-8" role="status">
              Loading dashboard…
            </p>
          ) : error ? (
            <div className="mt-8 rounded-2xl border border-red-300 bg-white p-5">
              <p role="alert">Couldn’t load dashboard data: {error}</p>
              <button
                className="mt-4 rounded-full bg-[#6B352A] px-4 py-2 text-sm font-semibold text-white"
                onClick={() => {
                  setError("");
                  setLoading(true);
                  setReloadCount((count) => count + 1);
                }}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : (
            <>
              <section className="mt-8 grid gap-4 sm:grid-cols-3">
                {stats.map(({ label, value }, index) => (
                  <article
                    className={`rounded-2xl border border-[#6B352A]/15 p-5 ${
                      index === 2 ? "bg-[#FFF1A6]" : "bg-white"
                    }`}
                    key={label}
                  >
                    <p className="text-sm">{label}</p>
                    <p className="mt-2 text-3xl font-bold">{value}</p>
                  </article>
                ))}
              </section>

              <section
                id="tasks"
                className="mt-8 rounded-2xl border border-[#6B352A]/15 bg-white p-5"
              >
                <h2 className="text-lg font-bold">Recent tasks</h2>
                {activeTasks.length === 0 ? (
                  <p className="mt-4">No tasks yet.</p>
                ) : (
                  <ul className="mt-4 divide-y divide-[#6B352A]/10">
                    {activeTasks.slice(0, 3).map((task) => (
                      <li
                        className="flex items-center justify-between gap-4 py-4"
                        key={task.id}
                      >
                        <span>{task.title}</span>
                        <span className="rounded-full bg-[#FFF1A6] px-3 py-1 text-sm">
                          {task.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
