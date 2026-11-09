import { useEffect, useState } from "react";
import FormFieldError from "../FormFieldError.jsx";
import {
  createTaskFormSchema,
  getFieldErrors,
} from "../../validation/forms.js";

const emptyTask = {
  title: "",
  priority: "Medium",
  status: "Up next",
  assignee: "",
  projectId: "",
  parentId: "",
  dueDate: "",
};

function TaskModal({
  task,
  tasks,
  projects,
  projectId,
  saving,
  error,
  onClose,
  onSave,
}) {
  const fixedProjectId =
    projectId === undefined ? undefined : String(projectId);
  const [form, setForm] = useState(() =>
    task
      ? {
          ...emptyTask,
          ...task,
          assignee: task.assignee || "",
          projectId: fixedProjectId ?? task.projectId ?? "",
          parentId: task.parentId || "",
          dueDate: task.dueDate || "",
        }
      : { ...emptyTask, projectId: fixedProjectId ?? "" },
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
    const result = createTaskFormSchema(projects, tasks, task?.id).safeParse(
      form,
    );
    if (!result.success) {
      setFieldErrors(getFieldErrors(result.error.issues));
      return;
    }

    setFieldErrors({});
    onSave(
      fixedProjectId === undefined
        ? result.data
        : { ...result.data, projectId: fixedProjectId },
    );
  }

  const parentTasks = tasks.filter(
    (candidate) =>
      String(candidate.id) !== String(task?.id) &&
      (fixedProjectId === undefined ||
        String(candidate.projectId) === fixedProjectId),
  );
  const fixedProject = projects.find(
    (project) => String(project.id) === fixedProjectId,
  );

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
        aria-labelledby="task-modal-title"
        aria-modal="true"
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 text-[#6B352A] shadow-xl sm:p-8"
        role="dialog"
      >
        <h2 className="text-2xl font-bold" id="task-modal-title">
          {task ? "Edit task" : "Create task"}
        </h2>
        <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Task title
            <input
              autoFocus
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              maxLength={150}
              name="title"
              onChange={handleChange}
              aria-describedby={
                fieldErrors.title ? "task-title-error" : undefined
              }
              aria-invalid={Boolean(fieldErrors.title)}
              value={form.title}
            />
            <FormFieldError id="task-title-error" message={fieldErrors.title} />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Priority
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="priority"
                onChange={handleChange}
                aria-describedby={
                  fieldErrors.priority ? "task-priority-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.priority)}
                value={form.priority}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
              <FormFieldError
                id="task-priority-error"
                message={fieldErrors.priority}
              />
            </label>
            <label className="block text-sm font-semibold">
              Status
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="status"
                onChange={handleChange}
                aria-describedby={
                  fieldErrors.status ? "task-status-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.status)}
                value={form.status}
              >
                <option>Up next</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
              <FormFieldError
                id="task-status-error"
                message={fieldErrors.status}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Assignee (user ID)
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="assignee"
                onChange={handleChange}
                aria-describedby={
                  fieldErrors.assignee ? "task-assignee-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.assignee)}
                placeholder="Optional user ID"
                value={form.assignee}
              />
              <FormFieldError
                id="task-assignee-error"
                message={fieldErrors.assignee}
              />
            </label>
            <label className="block text-sm font-semibold">
              Project
              {fixedProjectId === undefined ? (
                <>
                  <select
                    className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                    name="projectId"
                    onChange={handleChange}
                    aria-describedby={
                      fieldErrors.projectId ? "task-project-error" : undefined
                    }
                    aria-invalid={Boolean(fieldErrors.projectId)}
                    value={form.projectId}
                  >
                    <option disabled value="">
                      Choose a project
                    </option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title ||
                          project.name ||
                          `Project ${project.id}`}
                      </option>
                    ))}
                  </select>
                  <FormFieldError
                    id="task-project-error"
                    message={fieldErrors.projectId}
                  />
                </>
              ) : (
                <p className="mt-2 rounded-xl border border-[#6B352A]/15 bg-[#FFFDF5] px-4 py-3 font-normal">
                  {fixedProject?.title ||
                    fixedProject?.name ||
                    `Project ${fixedProjectId}`}
                </p>
              )}
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Parent task
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="parentId"
                onChange={handleChange}
                aria-describedby={
                  fieldErrors.parentId ? "task-parent-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.parentId)}
                value={form.parentId}
              >
                <option value="">No parent</option>
                {parentTasks.map((parentTask) => (
                  <option key={parentTask.id} value={parentTask.id}>
                    {parentTask.title}
                  </option>
                ))}
              </select>
              <FormFieldError
                id="task-parent-error"
                message={fieldErrors.parentId}
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
                  fieldErrors.dueDate ? "task-due-date-error" : undefined
                }
                aria-invalid={Boolean(fieldErrors.dueDate)}
                value={form.dueDate}
              />
              <FormFieldError
                id="task-due-date-error"
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
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TaskModal;
