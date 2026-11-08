import { useQuery } from "@tanstack/react-query";
import Header from "../components/Header.jsx";
import LoadingState from "../components/LoadingState.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { getTasks } from "../services/tasks.js";
import { getProjects } from "../services/projects.js";

function Dashboard() {
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: ({ signal }) => getTasks(signal),
  });
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: ({ signal }) => getProjects(signal),
  });
  const tasks = tasksQuery.data ?? [];

  const activeTasks = tasks.filter((task) => task.status !== "Completed");
  const stats = [
    {
      label: "My Projects",
      value: projectsQuery.isPending
        ? "…"
        : projectsQuery.isError
          ? "—"
          : projectsQuery.data.length,
    },
    {
      label: "In progress",
      value: activeTasks.filter((task) => task.status === "In progress").length,
    },
    {
      label: "Completed",
      value: tasks.filter((task) => task.status === "Completed").length,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A]">
      <Sidebar />

      <div className="min-w-0 md:ml-60">
        <Header page="dashboard" />

        <main id="overview" className="p-6 md:p-8">
          {tasksQuery.isPending || projectsQuery.isPending ? (
            <div className="mt-8">
              <LoadingState label="Loading dashboard stats…" />
            </div>
          ) : tasksQuery.isError ? (
            <div className="mt-8 rounded-2xl border border-red-300 bg-white p-5">
              <p role="alert">
                Couldn’t load dashboard data: {tasksQuery.error.message}
              </p>
              <button
                className="mt-4 rounded-full bg-[#6B352A] px-4 py-2 text-sm font-semibold text-white"
                onClick={() => tasksQuery.refetch()}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : (
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
          )}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
