import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectForm from "./components/ProjectForm";
import ProjectPage from "./components/ProjectPage";
import StoryForm from "./components/StoryForm";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProjectForm />} />
        <Route path="/projects/:projectId" element={<ProjectPage />} />
        <Route path="/projects/:projectId/new-story" element={<StoryForm />} />
      </Routes>
    </Router>
  );
};

export default App;
