import { auth } from "../../../auth.js";
import { readDatabase } from "./db.js";

export async function getAdminContext() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Authentication required.", status: 401 };
  }

  const database = await readDatabase();
  const account = database.accounts?.find(
    (candidate) => candidate.userId === session.user.id,
  );
  if (account?.role !== "admin") {
    return { error: "Administrator access required.", status: 403 };
  }

  return { account, database };
}
