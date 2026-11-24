import { getAdminContext } from "../../_lib/admin.js";
import { json } from "../../_lib/db.js";

export async function GET() {
  const context = await getAdminContext();
  if (context.error) {
    return json({ error: context.error }, context.status);
  }

  return json(
    (context.database.accounts ?? []).map((account) => ({
      userId: account.userId,
      displayName: account.displayName,
      email: account.email,
      role: account.role === "admin" ? "admin" : "user",
    })),
  );
}
