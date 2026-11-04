import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projects.js";
import useCurrentUserId from "../contexts/useCurrentUserId.js";

const emptyProject = {
  title: "",
  description: "",
  status: "Planning",
  dueDate: "",
  members: "",
};

function formatUserId(value, currentUserId) {
  if (!value) {
    return "—";
  }

  return value === currentUserId ? "You" : `${value.slice(0, 12)}…`;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function ProjectModal({ project, saving, error, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    project
      ? {
          ...project,
          title: project.title || project.name || "",
          members: (project.members || []).join(", "),
        }
      : emptyProject,
  );

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape" && !saving) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, saving]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate,
      members: form.members
        .split(",")
        .map((member) => member.trim())
        .filter(Boolean),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="project-modal-title"
        aria-modal="true"
        className="w-full max-w-lg rounded-2xl bg-white p-6 text-[#6B352A] shadow-xl sm:p-8"
        role="dialog"
      >
        <h2 className="text-2xl font-bold" id="project-modal-title">
          {project ? "Edit project" : "Create project"}
        </h2>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Project title
            <input
              autoFocus
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              maxLength={100}
              name="title"
              onChange={handleChange}
              required
              value={form.title}
            />
          </label>

          <label className="block text-sm font-semibold">
            Description
            <textarea
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              maxLength={500}
              name="description"
              onChange={handleChange}
              rows={3}
              value={form.description}
            />
          </label>

          <label className="block text-sm font-semibold">
            Members (user IDs, separated by commas)
            <input
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              name="members"
              onChange={handleChange}
              placeholder="user-id-1, user-id-2"
              value={form.members}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Status
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="status"
                onChange={handleChange}
                value={form.status}
              >
                <option>Planning</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </label>

            <label className="block text-sm font-semibold">
              Due date
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="dueDate"
                onChange={handleChange}
                type="date"
                value={form.dueDate}
              />
            </label>
          </div>

          {error && (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              className="rounded-full border border-[#6B352A]/30 px-5 py-2 font-semibold"
              disabled={saving}
              onClick={onClose}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-full bg-[#6B352A] px-5 py-2 font-semibold text-[#FFF1A6] disabled:opacity-60"
              disabled={saving}
              type="submit"
            >
              {saving ? "Saving…" : project ? "Save changes" : "Create project"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ProjectsManager() {
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: ({ signal }) => getProjects(signal),
  });
  const projects = projectsQuery.data ?? [];
  const [modalProject, setModalProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [actionError, setActionError] = useState("");

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, project }) => updateProject(id, project),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const saving = createMutation.isPending || updateMutation.isPending;

  function openCreateModal() {
    setModalProject(null);
    setModalError("");
    setModalOpen(true);
  }

  function openEditModal(project) {
    setModalProject(project);
    setModalError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (!saving) {
      setModalOpen(false);
    }
  }

  async function handleSave(projectData) {
    setModalError("");

    try {
      const now = new Date().toISOString();
      if (modalProject) {
        const updatedProject = {
          ...projectData,
          owner: modalProject.owner,
          createdBy: modalProject.createdBy,
          createdAt: modalProject.createdAt,
          updatedAt: now,
          completedAt:
            projectData.status === "Completed"
              ? modalProject.completedAt ||
                (modalProject.status !== "Completed" ? now : undefined)
              : undefined,
        };
        await updateMutation.mutateAsync({
          id: modalProject.id,
          project: updatedProject,
        });
      } else {
        const newProject = {
          ...projectData,
          owner: userId,
          createdBy: userId,
          createdAt: now,
          updatedAt: now,
          completedAt:
            projectData.status === "Completed" ? now : undefined,
        };
        await createMutation.mutateAsync(newProject);
      }

      setModalOpen(false);
    } catch (error) {
      setModalError(error.message);
    }
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.title || project.name}"? This cannot be undone.`)) {
      return;
    }

    setActionError("");

    try {
      await deleteMutation.mutateAsync(project.id);
    } catch (error) {
      setActionError(
        `Couldn’t delete "${project.title || project.name}": ${error.message}`,
      );
    }
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-[#6B352A]/15 bg-white p-5 md:p-6"
      id="projects"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Projects</h2>
          <p className="mt-1 text-sm">Create and manage your team projects.</p>
        </div>
        <button
          className="rounded-full bg-[#6B352A] px-5 py-2 font-semibold text-[#FFF1A6]"
          onClick={openCreateModal}
          type="button"
        >
          Create project
        </button>
      </div>

      {projectsQuery.isError ? (
        <div className="mt-5 rounded-xl border border-red-300 p-4">
          <p role="alert">
            Couldn’t load projects: {projectsQuery.error.message}
          </p>
          <button
            className="mt-3 font-semibold underline underline-offset-2"
            onClick={() => projectsQuery.refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : projectsQuery.isPending ? (
        <p className="mt-5" role="status">
          Loading projects…
        </p>
      ) : (
        <>
          {actionError && (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {actionError}
            </p>
          )}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#6B352A]/15 text-[#6B352A]/70">
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Title
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Owner
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Members
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Created at
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Updated at
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Completed at
                  </th>
                  <th className="px-3 py-3 text-right font-semibold" scope="col">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B352A]/10">
                {projects.map((project) => (
                  <tr key={project.id}>
                    <th className="px-3 py-4 font-medium" scope="row">
                      <p className="font-semibold">
                        {project.title || project.name}
                      </p>
                      {project.description && (
                        <p className="mt-1 max-w-md truncate font-normal text-[#6B352A]/70">
                          {project.description}
                        </p>
                      )}
                    </th>
                    <td className="px-3 py-4">
                      <span title={project.owner}>
                        {formatUserId(project.owner, userId)}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {project.members?.length
                        ? project.members
                            .map((member) => formatUserId(member, userId))
                            .join(", ")
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {formatDate(project.updatedAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4">
                      {formatDate(project.completedAt)}
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex justify-end gap-3">
                        <button
                          className="font-semibold underline underline-offset-2"
                          onClick={() => openEditModal(project)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="font-semibold text-red-700 underline underline-offset-2"
                          onClick={() => handleDelete(project)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td className="px-3 py-8 text-center" colSpan={7}>
                      No projects yet. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modalOpen && (
        <ProjectModal
          error={modalError}
          onClose={closeModal}
          onSave={handleSave}
          project={modalProject}
          saving={saving}
        />
      )}
    </section>
  );
}

export default ProjectsManager;
