"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import useAuth from "../contexts/useAuth.js";

const tabs = [
  { label: "Overview", to: "/dashboard" },
  { label: "My tasks", to: "/tasks" },
  { label: "Projects", to: "/projects" },
];

function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const visibleTabs =
    role === "admin" ? [...tabs, { label: "Admin", to: "/admin" }] : tabs;

  return (
    <aside className="bg-[#6B352A] p-6 text-white md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-60 md:overflow-y-auto">
      <a href="/" className="text-2xl font-bold">
        forma.
      </a>

      <nav
        aria-label="Dashboard navigation"
        className="mt-8 flex gap-2 overflow-x-auto md:flex-col"
      >
        {visibleTabs.map(({ label, to }) => (
          <Link
            key={to}
            className={
              pathname === to ||
              (to === "/projects" && pathname.startsWith("/project/"))
                ? "rounded-lg bg-[#FFF1A6] px-4 py-3 font-semibold text-[#6B352A]"
                : "rounded-lg px-4 py-3 hover:bg-white/10"
            }
            href={to}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
