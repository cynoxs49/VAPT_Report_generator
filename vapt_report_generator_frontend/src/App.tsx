import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/new" element={<ProjectPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/projects/:id/preview" element={<ProjectPage />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
