import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A] md:flex">
      <Sidebar />

      <div className="min-w-0 flex-1">
        <Header page="dashboard" />

        <main id="overview" className="p-6 md:p-8">
          <h2 className="text-2xl font-bold">Good morning, Ahmad!</h2>
          <p className="mt-2">Here’s what’s happening with your work.</p>

          <section className="mt-8 grid gap-4 sm:grid-cols-3">
            <article className="rounded-2xl border border-[#6B352A]/15 bg-white p-5">
              <p className="text-sm">My tasks</p>
              <p className="mt-2 text-3xl font-bold">8</p>
            </article>
            <article className="rounded-2xl border border-[#6B352A]/15 bg-white p-5">
              <p className="text-sm">In progress</p>
              <p className="mt-2 text-3xl font-bold">3</p>
            </article>
            <article className="rounded-2xl border border-[#6B352A]/15 bg-[#FFF1A6] p-5">
              <p className="text-sm">Completed this week</p>
              <p className="mt-2 text-3xl font-bold">5</p>
            </article>
          </section>

          <section
            id="tasks"
            className="mt-8 rounded-2xl border border-[#6B352A]/15 bg-white p-5"
          >
            <h2 className="text-lg font-bold">Recent tasks</h2>
            <ul className="mt-4 divide-y divide-[#6B352A]/10">
              <li className="flex items-center justify-between gap-4 py-4">
                <span>Plan the next team meeting</span>
                <span className="rounded-full bg-[#FFF1A6] px-3 py-1 text-sm">
                  In progress
                </span>
              </li>
              <li className="flex items-center justify-between gap-4 py-4">
                <span>Review project notes</span>
                <span className="rounded-full bg-[#FFF1A6] px-3 py-1 text-sm">
                  Up next
                </span>
              </li>
              <li className="flex items-center justify-between gap-4 py-4">
                <span>Share the weekly update</span>
                <span className="rounded-full bg-[#FFF1A6] px-3 py-1 text-sm">
                  In progress
                </span>
              </li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
