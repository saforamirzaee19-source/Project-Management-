import { useEffect, useState } from "react";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../services/projects.js";

const emptyProject = {
  name: "",
  description: "",
  status: "Planning",
  dueDate: "",
};

function ProjectModal({ project, saving, error, onClose, onSave }) {
  const [form, setForm] = useState(() => project ?? emptyProject);

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
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      dueDate: form.dueDate,
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
            Project name
            <input
              autoFocus
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              maxLength={100}
              name="name"
              onChange={handleChange}
              required
              value={form.name}
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
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [modalProject, setModalProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState("");
  const [actionError, setActionError] = useState("");
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getProjects(controller.signal)
      .then(setProjects)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLoadError(error.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [reloadCount]);

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
    setSaving(true);
    setModalError("");

    try {
      if (modalProject) {
        const updatedProject = await updateProject(modalProject.id, projectData);
        setProjects((current) =>
          current.map((project) =>
            project.id === modalProject.id ? updatedProject : project,
          ),
        );
      } else {
        const createdProject = await createProject(projectData);
        setProjects((current) => [...current, createdProject]);
      }

      setModalOpen(false);
    } catch (error) {
      setModalError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project) {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      return;
    }

    setActionError("");

    try {
      await deleteProject(project.id);
      setProjects((current) =>
        current.filter((item) => item.id !== project.id),
      );
    } catch (error) {
      setActionError(`Couldn’t delete "${project.name}": ${error.message}`);
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

      {loadError ? (
        <div className="mt-5 rounded-xl border border-red-300 p-4">
          <p role="alert">Couldn’t load projects: {loadError}</p>
          <button
            className="mt-3 font-semibold underline underline-offset-2"
            onClick={() => {
              setLoadError("");
              setLoading(true);
              setReloadCount((count) => count + 1);
            }}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : loading ? (
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
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#6B352A]/15 text-[#6B352A]/70">
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Project
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Status
                  </th>
                  <th className="px-3 py-3 font-semibold" scope="col">
                    Due date
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
                      <p className="font-semibold">{project.name}</p>
                      {project.description && (
                        <p className="mt-1 max-w-md truncate font-normal text-[#6B352A]/70">
                          {project.description}
                        </p>
                      )}
                    </th>
                    <td className="px-3 py-4">
                      <span className="rounded-full bg-[#FFF1A6] px-3 py-1 text-xs font-semibold">
                        {project.status}
                      </span>
                    </td>
                    <td className="px-3 py-4">
                      {project.dueDate || "—"}
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
                    <td className="px-3 py-8 text-center" colSpan={4}>
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
