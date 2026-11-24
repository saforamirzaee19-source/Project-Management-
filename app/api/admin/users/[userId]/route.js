import { getAdminContext } from "../../../_lib/admin.js";
import { json, writeDatabase } from "../../../_lib/db.js";

export async function PATCH(request, { params }) {
  const context = await getAdminContext();
  if (context.error) {
    return json({ error: context.error }, context.status);
  }

  const body = await request.json();
  if (body?.role !== "admin" && body?.role !== "user") {
    return json({ error: "Choose a valid user role." }, 400);
  }

  const { userId } = await params;
  const targetIndex =
    context.database.accounts?.findIndex(
      (account) => account.userId === userId,
    ) ?? -1;
  if (targetIndex < 0) {
    return json({ error: "User not found." }, 404);
  }
  if (context.database.accounts[targetIndex].userId === context.account.userId) {
    return json({ error: "You cannot change your own role." }, 400);
  }

  const target = context.database.accounts[targetIndex];
  if (
    target.role === "admin" &&
    body.role === "user" &&
    context.database.accounts.filter((account) => account.role === "admin")
      .length <= 1
  ) {
    return json({ error: "At least one administrator must remain." }, 409);
  }

  target.role = body.role;
  await writeDatabase(context.database);

  return json({
    userId: target.userId,
    displayName: target.displayName,
    email: target.email,
    role: target.role,
  });
}
