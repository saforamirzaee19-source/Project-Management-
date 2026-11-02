import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="bg-[#6B352A] p-6 text-white md:min-h-screen md:w-60">
      <Link to="/" className="text-2xl font-bold">
        forma.
      </Link>

      <nav
        aria-label="Dashboard navigation"
        className="mt-8 flex gap-2 overflow-x-auto md:flex-col"
      >
        <a
          className="rounded-lg bg-[#FFF1A6] px-4 py-3 font-semibold text-[#6B352A]"
          href="#overview"
        >
          Overview
        </a>
        <a className="rounded-lg px-4 py-3 hover:bg-white/10" href="#tasks">
          My tasks
        </a>
        <a className="rounded-lg px-4 py-3 hover:bg-white/10" href="#projects">
          Projects
        </a>
        <a className="rounded-lg px-4 py-3 hover:bg-white/10" href="#settings">
          Settings
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;
