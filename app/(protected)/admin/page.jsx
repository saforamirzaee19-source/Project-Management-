import { auth } from "../../../auth.js";
import { readDatabase } from "../../api/_lib/db.js";
import { redirect } from "next/navigation";
import AdminUsers from "../../../src/views/AdminUsers.jsx";

export default async function Page() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin?callbackUrl=%2Fadmin");
  }

  const database = await readDatabase();
  const account = database.accounts?.find(
    (candidate) => candidate.userId === session.user.id,
  );
  if (account?.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminUsers currentUserId={account.userId} />;
}
