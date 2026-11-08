import { useEffect, useState } from "react";

const emptyProject = {
  title: "",
  description: "",
  status: "Planning",
  dueDate: "",
  members: "",
};

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

export default ProjectModal;
