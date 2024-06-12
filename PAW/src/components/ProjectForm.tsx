import React, { useState, useEffect, } from "react";
import useNavigate, { Link } from "react-router-dom";
import ProjectStorage from "../api/localStorageAPI";
import { Project } from "../models/Project";
import LogoutButton from "./GoogleLogout";
import "../styles/projectForm.css";
import { GoogleLogout } from "react-google-login";


const ProjectForm: React.FC = () => {
  const [project, setProject] = useState<Project>({ id: "", name: "", description: "" });
  const [projects, setProjects] = useState<Project[]>([]);
  
  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project.name.trim() || !project.description.trim()) {
      alert('Both name and description are required.');
      return;
    }
    const newProject = { ...project, id: project.id || String(Date.now()) };
    ProjectStorage.saveProject(newProject);
    setProject({ id: "", name: "", description: "" });
    loadProjects();
  };

  const loadProjects = () => {
    const allProjects = ProjectStorage.getAllProjects();
    setProjects(allProjects);
  };
  const handleDelete = (id: string) => {
    ProjectStorage.deleteProject(id);
    setProjects(prevProjects => prevProjects.filter(p => p.id !== id));
  };

  const handleEdit = (project: Project) => {
    setProject(project); 
  };

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="nav-buttons">
          <Link to="/users">User List</Link>
          <div className="google-logout-btn">
          <LogoutButton />
          </div>
        </div>
      </div>
      <div className="project-form">
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
            <button onClick={() => handleEdit(project)} className="btn edit-btn">Edit</button>
            <button onClick={() => handleDelete(project.id)} className="btn delete-btn">Delete</button>
            <Link to={`/projects/${project.id}`}>View Project</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectForm;
