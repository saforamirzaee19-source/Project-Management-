import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./Components/Dashboard.jsx";
import Home from "./Components/Home.jsx";
import SignIn from "./Components/SignIn.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
