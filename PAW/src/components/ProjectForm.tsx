import React, { useState, useEffect } from "react";
import ProjectStorage from "../api/localStorageAPI";
import { Project } from "../models/Project";

const ProjectForm: React.FC = () => {
  const [project, setProject] = useState<Project>({ id: "", name: "", description: "" });
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!project.name.trim() || !project.description.trim()) {
      setError("Both project name and description are required.");
      return;
    }

    const newProject = { ...project, id: project.id || String(Date.now()) };
    ProjectStorage.saveProject(newProject);
    setProject({ id: "", name: "", description: "" });
    loadProjects();
  };

  const handleDelete = (id: string) => {
    ProjectStorage.deleteProject(id);
    loadProjects();
  };

  const handleEdit = (project: Project) => {
    setProject(project);
    setError(""); 
  };

  const loadProjects = () => {
    const allProjects = ProjectStorage.getAllProjects();
    setProjects(allProjects);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div>
      <div className="project-form">
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Project Name:</label>
            <input
              id="name"
              name="name"
              value={project.name}
              onChange={handleChange}
              placeholder="Project Name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>
          <button type="submit" className="btn">
            {project.id ? "Update Project" : "Save Project"}
          </button>
        </form>
      </div>
      <div className="project-list">
        {projects.length === 0 && <p>No projects available.</p>}
        {projects.map(project => (
          <div className="project-item" key={project.id}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <button onClick={() => handleEdit(project)} className="btn edit">Edit</button>
            <button onClick={() => handleDelete(project.id)} className="btn delete">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;
