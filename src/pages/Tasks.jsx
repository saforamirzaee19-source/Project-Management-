import Header from "../components/Header.jsx";
import Sidebar from "../components/Sidebar.jsx";
import TasksManager from "../components/tasks/TasksManager.jsx";

function Tasks() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A]">
      <Sidebar />

      <div className="min-w-0 md:ml-60">
        <Header page="tasks" />

        <main className="p-6 md:p-8">
          <TasksManager />
        </main>
      </div>
    </div>
  );
}

export default Tasks;
