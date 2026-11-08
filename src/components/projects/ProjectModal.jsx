import { useEffect, useState } from "react";
import FormFieldError from "../FormFieldError.jsx";
import { getFieldErrors, projectFormSchema } from "../../validation/forms.js";

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
          description: project.description || "",
          status: project.status || "Planning",
          dueDate: project.dueDate || "",
          members: (project.members || []).join(", "),
        }
      : emptyProject,
  );
  const [fieldErrors, setFieldErrors] = useState({});

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
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const result = projectFormSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error.issues));
      return;
    }

    setFieldErrors({});
    onSave(result.data);
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
        <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Project title
            <input
              autoFocus
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              maxLength={100}
              name="title"
              onChange={handleChange}
              aria-describedby={
                fieldErrors.title ? "project-title-error" : undefined
              }
              aria-invalid={Boolean(fieldErrors.title)}
              value={form.title}
            />
            <FormFieldError
              id="project-title-error"
              message={fieldErrors.title}
            />
          </label>

          <label className="block text-sm font-semibold">
            Description
            <textarea
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              maxLength={500}
              name="description"
              onChange={handleChange}
              aria-describedby={
                fieldErrors.description
                  ? "project-description-error"
                  : undefined
              }
              aria-invalid={Boolean(fieldErrors.description)}
              rows={3}
              value={form.description}
            />
            <FormFieldError
              id="project-description-error"
              message={fieldErrors.description}
            />
          </label>

          <label className="block text-sm font-semibold">
            Members (user IDs, separated by commas)
            <input
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              name="members"
              onChange={handleChange}
              aria-describedby={
                fieldErrors.members ? "project-members-error" : undefined
              }
              aria-invalid={Boolean(fieldErrors.members)}
              placeholder="user-id-1, user-id-2"
              value={form.members}
            />
            <FormFieldError
              id="project-members-error"
              message={fieldErrors.members}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Status
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="status"
                onChange={handleChange}
                aria-describedby={
                  fieldErrors.status ? "project-status-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.status)}
                value={form.status}
              >
                <option>Planning</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
              <FormFieldError
                id="project-status-error"
                message={fieldErrors.status}
              />
            </label>

            <label className="block text-sm font-semibold">
              Due date
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="dueDate"
                onChange={handleChange}
                type="date"
                aria-describedby={
                  fieldErrors.dueDate ? "project-due-date-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.dueDate)}
                value={form.dueDate}
              />
              <FormFieldError
                id="project-due-date-error"
                message={fieldErrors.dueDate}
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
