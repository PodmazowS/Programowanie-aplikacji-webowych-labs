// src/App.tsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProjectForm from "./components/ProjectForm";
import ProjectPage from "./components/ProjectPage";
import StoryForm from "./components/StoryForm";
import TaskPage from "./components/TaskPage";
import UserPage from "./components/UserPage";
import LoginForm from "./components/LoginForm";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThemeContext } from "./styles/themeContext";



const App: React.FC = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<ProtectedRoute><ProjectForm /></ProtectedRoute>} />
          <Route path="/projects/:projectId" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
          <Route path="/projects/:projectId/new-story" element={<ProtectedRoute><StoryForm /></ProtectedRoute>} />
          <Route path="/stories/:storyId" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserPage /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeContext.Provider>
  );
};

export default App;
