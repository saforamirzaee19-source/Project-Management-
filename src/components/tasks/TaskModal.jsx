import { useEffect, useState } from "react";

const emptyTask = {
  title: "",
  priority: "Medium",
  status: "Up next",
  assignee: "",
  projectId: "",
  parentId: "",
  dueDate: "",
};

function TaskModal({ task, tasks, projects, saving, error, onClose, onSave }) {
  const [form, setForm] = useState(() =>
    task
      ? {
          ...emptyTask,
          ...task,
          assignee: task.assignee || "",
          projectId: task.projectId || "",
          parentId: task.parentId || "",
          dueDate: task.dueDate || "",
        }
      : emptyTask,
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
      priority: form.priority,
      status: form.status,
      assignee: form.assignee.trim(),
      projectId: form.projectId,
      parentId: form.parentId,
      dueDate: form.dueDate,
    });
  }

  const parentTasks = tasks.filter((candidate) => candidate.id !== task?.id);

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
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-semibold">
            Task title
            <input
              autoFocus
              className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
              maxLength={150}
              name="title"
              onChange={handleChange}
              required
              value={form.title}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Priority
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="priority"
                onChange={handleChange}
                value={form.priority}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>
            <label className="block text-sm font-semibold">
              Status
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="status"
                onChange={handleChange}
                value={form.status}
              >
                <option>Up next</option>
                <option>In progress</option>
                <option>Completed</option>
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Assignee (user ID)
              <input
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="assignee"
                onChange={handleChange}
                placeholder="Optional user ID"
                value={form.assignee}
              />
            </label>
            <label className="block text-sm font-semibold">
              Project
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="projectId"
                onChange={handleChange}
                value={form.projectId}
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title || project.name || `Project ${project.id}`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Parent task
              <select
                className="mt-2 w-full rounded-xl border border-[#6B352A]/30 bg-white px-4 py-3 font-normal outline-none focus:border-[#6B352A]"
                name="parentId"
                onChange={handleChange}
                value={form.parentId}
              >
                <option value="">No parent</option>
                {parentTasks.map((parentTask) => (
                  <option key={parentTask.id} value={parentTask.id}>
                    {parentTask.title}
                  </option>
                ))}
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
              {saving ? "Saving…" : task ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default TaskModal;
