import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import useAuth from "./contexts/useAuth.js";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import Projects from "./pages/Projects.jsx";
import SignIn from "./pages/SignIn.jsx";
import Tasks from "./pages/Tasks.jsx";

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location }}
        to="/signin"
      />
    );
  }

  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/tasks"
        element={
          <RequireAuth>
            <Tasks />
          </RequireAuth>
        }
      />
      <Route
        path="/projects"
        element={
          <RequireAuth>
            <Projects />
          </RequireAuth>
        }
      />
      <Route
        path="/project/:id"
        element={
          <RequireAuth>
            <ProjectDetails />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
