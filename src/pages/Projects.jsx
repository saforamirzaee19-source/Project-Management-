import Header from "../components/Header.jsx";
import ProjectsManager from "../components/projects/ProjectsManager.jsx";
import Sidebar from "../components/Sidebar.jsx";

function Projects() {
  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#6B352A]">
      <Sidebar />

      <div className="min-w-0 md:ml-60">
        <Header page="projects" />

        <main className="p-6 md:p-8">
          <ProjectsManager />
        </main>
      </div>
    </div>
  );
}

export default Projects;
