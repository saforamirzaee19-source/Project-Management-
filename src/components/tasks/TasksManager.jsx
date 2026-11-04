import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import useCurrentUserId from "../../contexts/useCurrentUserId.js";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../../services/tasks.js";
import { getProjects } from "../../services/projects.js";
import TaskModal from "./TaskModal.jsx";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function formatUserId(value, currentUserId) {
  if (!value) {
    return "—";
  }

  return value === currentUserId ? "You" : `${value.slice(0, 12)}…`;
}

function TasksManager() {
  const queryClient = useQueryClient();
  const userId = useCurrentUserId();
  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: ({ signal }) => getTasks(signal),
  });
  const projectsQuery = useQuery({
    queryKey: ["projects"],
    queryFn: ({ signal }) => getProjects(signal),
  });
  const tasks = tasksQuery.data ?? [];
  const projects = projectsQuery.data ?? [];
  const [modalTask, setModalTask] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState("");
  const [actionError, setActionError] = useState("");

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, task }) => updateTask(id, task),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });
  const saving = createMutation.isPending || updateMutation.isPending;

  function openCreateModal() {
    setModalTask(null);
    setModalError("");
    setModalOpen(true);
  }

  function openEditModal(task) {
    setModalTask(task);
    setModalError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (!saving) {
      setModalOpen(false);
    }
  }

  async function handleSave(taskData) {
    setModalError("");
    const now = new Date().toISOString();

    try {
      if (modalTask) {
        await updateMutation.mutateAsync({
          id: modalTask.id,
          task: {
            ...taskData,
            createdBy: modalTask.createdBy || userId,
            createdAt: modalTask.createdAt || now,
            updatedAt: now,
            completedAt:
              taskData.status === "Completed"
                ? modalTask.completedAt ||
                  (modalTask.status !== "Completed" ? now : undefined)
                : undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...taskData,
          createdBy: userId,
          createdAt: now,
          updatedAt: now,
          completedAt: taskData.status === "Completed" ? now : undefined,
        });
      }

      setModalOpen(false);
    } catch (error) {
      setModalError(error.message);
    }
  }

  async function handleDelete(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) {
      return;
    }

    setActionError("");
    try {
      await deleteMutation.mutateAsync(task.id);
    } catch (error) {
      setActionError(`Couldn’t delete "${task.title}": ${error.message}`);
    }
  }

  return (
    <section
      className="mt-8 rounded-2xl border border-[#6B352A]/15 bg-white p-5 md:p-6"
      id="tasks"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Tasks</h2>
          <p className="mt-1 text-sm">Create and manage project tasks.</p>
        </div>
        <button
          className="rounded-full bg-[#6B352A] px-5 py-2 font-semibold text-[#FFF1A6]"
          onClick={openCreateModal}
          type="button"
        >
          Create task
        </button>
      </div>

      {tasksQuery.isError ? (
        <div className="mt-5 rounded-xl border border-red-300 p-4">
          <p role="alert">Couldn’t load tasks: {tasksQuery.error.message}</p>
          <button
            className="mt-3 font-semibold underline underline-offset-2"
            onClick={() => tasksQuery.refetch()}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : projectsQuery.isError ? (
        <p className="mt-5 text-red-700" role="alert">
          Couldn’t load projects for task assignment:{" "}
          {projectsQuery.error.message}
        </p>
      ) : tasksQuery.isPending || projectsQuery.isPending ? (
        <p className="mt-5" role="status">
          Loading tasks…
        </p>
      ) : (
        <>
          {actionError && (
            <p className="mt-4 text-sm text-red-700" role="alert">
              {actionError}
            </p>
          )}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[1500px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#6B352A]/15 text-[#6B352A]/70">
                  {[
                    "Title",
                    "Priority",
                    "Status",
                    "Assignee",
                    "Project",
                    "Parent task",
                    "Due date",
                    "Created by",
                    "Created at",
                    "Updated at",
                    "Completed at",
                    "Actions",
                  ].map((heading) => (
                    <th
                      className="px-3 py-3 font-semibold"
                      key={heading}
                      scope="col"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#6B352A]/10">
                {tasks.map((task) => {
                  const project = projects.find(
                    (item) => item.id === task.projectId,
                  );
                  const parentTask = tasks.find(
                    (item) => item.id === task.parentId,
                  );

                  return (
                    <tr key={task.id}>
                      <th className="px-3 py-4 font-semibold" scope="row">
                        {task.title}
                      </th>
                      <td className="px-3 py-4">{task.priority || "—"}</td>
                      <td className="px-3 py-4">{task.status || "—"}</td>
                      <td className="px-3 py-4" title={task.assignee}>
                        {formatUserId(task.assignee, userId)}
                      </td>
                      <td className="px-3 py-4">
                        {project?.title || project?.name || "—"}
                      </td>
                      <td className="px-3 py-4">{parentTask?.title || "—"}</td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {formatDate(task.dueDate)}
                      </td>
                      <td className="px-3 py-4" title={task.createdBy}>
                        {formatUserId(task.createdBy, userId)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {formatDate(task.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {formatDate(task.updatedAt)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {formatDate(task.completedAt)}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex gap-3">
                          <button
                            className="font-semibold underline underline-offset-2"
                            onClick={() => openEditModal(task)}
                            type="button"
                          >
                            Edit
                          </button>
                          <button
                            className="font-semibold text-red-700 underline underline-offset-2"
                            onClick={() => handleDelete(task)}
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {tasks.length === 0 && (
                  <tr>
                    <td className="px-3 py-8 text-center" colSpan={12}>
                      No tasks yet. Create one to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modalOpen && (
        <TaskModal
          error={modalError}
          onClose={closeModal}
          onSave={handleSave}
          projects={projects}
          saving={saving}
          task={modalTask}
          tasks={tasks}
        />
      )}
    </section>
  );
}

export default TasksManager;
