import { Project } from "../models/Project";

class ProjectStorage {
  private static STORAGE_KEY = "projects";

  static getAllProjects(): Project[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveProject(project: Project) {
    const projects = this.getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    if (existingIndex !== -1) projects[existingIndex] = project;
    else projects.push(project);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }

  static deleteProject(id: string) {
    let projects = this.getAllProjects();
    projects = projects.filter(p => p.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(projects));
  }
  
  static getProject(id: string): Project | undefined {
    return this.getAllProjects().find(p => p.id === id);
  }
}

export default ProjectStorage;
