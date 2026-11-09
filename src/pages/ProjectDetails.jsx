import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header.jsx";
import LoadingState from "../components/LoadingState.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TasksManager from "../components/tasks/TasksManager.jsx";
import { getProjects } from "../services/projects.js";

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

  const project = projectsQuery.data?.find(
    (candidate) => String(candidate.id) === id,
  );

  let content;
  if (projectsQuery.isPending) {
    content = <LoadingState label="Loading project details…" />;
  } else if (projectsQuery.isError) {
    content = (
      <div className="rounded-2xl border border-red-300 bg-white p-5">
        {projectsQuery.isError && (
          <p role="alert">
            Couldn’t load projects: {projectsQuery.error.message}
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

        <TasksManager projectId={project.id} />
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
