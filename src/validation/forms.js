import { z } from "zod";

const dueDateSchema = z
  .string()
  .refine(
    (date) => date === "" || z.iso.date().safeParse(date).success,
    "Enter a valid date.",
  );

export const projectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Enter a project title.")
    .max(100, "Use 100 characters or fewer."),
  description: z.string().trim().max(500, "Use 500 characters or fewer."),
  status: z.enum(["Planning", "In progress", "Completed"]),
  dueDate: dueDateSchema,
  members: z
    .string()
    .transform((members) =>
      members.trim() ? members.split(",").map((member) => member.trim()) : [],
    )
    .pipe(
      z.array(z.string().min(1, "Remove empty member IDs from the list.")),
    ),
});

export function createTaskFormSchema(projects, tasks, currentTaskId) {
  const projectIds = new Set(projects.map((project) => String(project.id)));
  const parentTaskIds = new Set(
    tasks.filter((task) => task.id !== currentTaskId).map((task) => task.id),
  );

  return z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Enter a task title.")
        .max(150, "Use 150 characters or fewer."),
      priority: z.enum(["Low", "Medium", "High"]),
      status: z.enum(["Up next", "In progress", "Completed"]),
      assignee: z.string().trim(),
      projectId: z.string().trim().min(1, "Choose a project."),
      parentId: z.string(),
      dueDate: dueDateSchema,
    })
    .superRefine((task, context) => {
      if (!projectIds.has(task.projectId)) {
        context.addIssue({
          code: "custom",
          message: "Choose an available project.",
          path: ["projectId"],
        });
      }

      if (task.parentId && !parentTaskIds.has(task.parentId)) {
        context.addIssue({
          code: "custom",
          message: "Choose an available parent task.",
          path: ["parentId"],
        });
      }
    });
}

export const signInFormSchema = z.object({
  email: z
    .string()
    .trim()
    .pipe(z.email("Enter a valid email address.")),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .regex(
      /(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/,
      "Include an uppercase letter, a number, and a symbol.",
    ),
});

export function getFieldErrors(issues) {
  return issues.reduce((errors, issue) => {
    const field = issue.path[0];
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
    return errors;
  }, {});
}
