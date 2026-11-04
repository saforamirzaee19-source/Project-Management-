import { useEffect, useState } from "react";

const tabs = [
  { label: "Overview", to: "#overview" },
  { label: "My tasks", to: "#tasks" },
  { label: "Projects", to: "#projects" },
];

function Sidebar() {
  const [activeHash, setActiveHash] = useState(
    () => window.location.hash || "#overview",
  );

  useEffect(() => {
    function syncActiveTab() {
      setActiveHash(window.location.hash || "#overview");
    }

    window.addEventListener("hashchange", syncActiveTab);
    return () => window.removeEventListener("hashchange", syncActiveTab);
  }, []);

  return (
    <aside className="bg-[#6B352A] p-6 text-white md:fixed md:inset-y-0 md:left-0 md:z-40 md:w-60 md:overflow-y-auto">
      <a href="/" className="text-2xl font-bold">
        forma.
      </a>

      <nav
        aria-label="Dashboard navigation"
        className="mt-8 flex gap-2 overflow-x-auto md:flex-col"
      >
        {tabs.map(({ label, to }) => {
          const active = activeHash === to;

          return (
            <a
              key={to}
              className={
                active
                  ? "rounded-lg bg-[#FFF1A6] px-4 py-3 font-semibold text-[#6B352A]"
                  : "rounded-lg px-4 py-3 hover:bg-white/10"
              }
              aria-current={active ? "location" : undefined}
              href={to}
            >
              {label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
