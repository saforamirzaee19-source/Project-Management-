import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import LoadingState from "../components/LoadingState.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { getProjects } from "../services/projects.js";
import { getTasks } from "../services/tasks.js";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function ProjectDetails() {
  const { id } = useParams();
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: ({ signal }) => getProjects(signal),
  });
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: ({ signal }) => getTasks(signal),
  });

  const project = projectsQuery.data?.find(
    (candidate) => String(candidate.id) === id,
  );
  const projectTasks = project
    ? (tasksQuery.data ?? []).filter(
        (task) => String(task.projectId) === String(project.id),
      )
    : [];

  let content;
  if (projectsQuery.isPending || tasksQuery.isPending) {
    content = <LoadingState label="Loading project details…" />;
  } else if (projectsQuery.isError || tasksQuery.isError) {
    content = (
      <div className="rounded-2xl border border-red-300 bg-white p-5">
        {projectsQuery.isError && (
          <p role="alert">
            Couldn’t load projects: {projectsQuery.error.message}
          </p>
        )}
        {tasksQuery.isError && (
          <p role="alert">
            Couldn’t load tasks: {tasksQuery.error.message}
          </p>
        )}
        <div className="mt-4 flex gap-4">
          {projectsQuery.isError && (
            <button
              className="font-semibold underline underline-offset-2"
              onClick={() => projectsQuery.refetch()}
              type="button"
            >
              Retry projects
            </button>
          )}
          {tasksQuery.isError && (
            <button
              className="font-semibold underline underline-offset-2"
              onClick={() => tasksQuery.refetch()}
              type="button"
            >
              Retry tasks
            </button>
          )}
        </div>
      </div>
    );
  } else if (!project) {
    content = (
      <section className="rounded-2xl border border-[#6B352A]/15 bg-white p-5">
        <p role="status">Project not found.</p>
        <Link
          className="mt-4 inline-block font-semibold underline underline-offset-2"
          to="/projects"
        >
          Back to projects
        </Link>
      </section>
    );
  } else {
    content = (
      <>
        <section className="rounded-2xl border border-[#6B352A]/15 bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold">
                {project.title || project.name}
              </h2>
              {project.description && (
                <p className="mt-2 max-w-3xl leading-7">
                  {project.description}
                </p>
              )}
            </div>
            <span className="rounded-full bg-[#FFF1A6] px-4 py-2 text-sm font-semibold">
              {project.status || "No status"}
            </span>
          </div>
          <p className="mt-5 text-sm">
            Due date: {formatDate(project.dueDate)}
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-[#6B352A]/15 bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold">Project tasks</h2>
            <p className="text-sm">
              {projectTasks.length}{" "}
              {projectTasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>

          {projectTasks.length === 0 ? (
            <p className="mt-5">No tasks are assigned to this project yet.</p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#6B352A]/15 text-[#6B352A]/70">
                    <th className="px-3 py-3 font-semibold" scope="col">
                      Task
                    </th>
                    <th className="px-3 py-3 font-semibold" scope="col">
                      Priority
                    </th>
                    <th className="px-3 py-3 font-semibold" scope="col">
                      Status
                    </th>
                    <th className="px-3 py-3 font-semibold" scope="col">
                      Due date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#6B352A]/10">
                  {projectTasks.map((task) => (
                    <tr key={task.id}>
                      <th className="px-3 py-4 font-semibold" scope="row">
                        {task.title}
                      </th>
                      <td className="px-3 py-4">{task.priority || "—"}</td>
                      <td className="px-3 py-4">{task.status || "—"}</td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {formatDate(task.dueDate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A]">
      <Sidebar />

      <div className="min-w-0 md:ml-60">
        <Header page="project" />

        <main className="space-y-6 p-6 md:p-8">
          <Link
            className="inline-block font-semibold underline underline-offset-4"
            to="/projects"
          >
            ← All projects
          </Link>
          {content}
        </main>
      </div>
    </div>
  );
}

export default ProjectDetails;
