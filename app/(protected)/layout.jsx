import { auth } from "../../auth.js";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/signin");
  }

  return children;
}
