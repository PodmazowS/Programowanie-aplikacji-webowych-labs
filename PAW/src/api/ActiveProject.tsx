class ActiveProject {
    private static STORAGE_KEY = "activeProject";
  
    static getActiveProject(): string | null {
      return localStorage.getItem(this.STORAGE_KEY);
    }
  
    static setActiveProject(projectId: string) {
      localStorage.setItem(this.STORAGE_KEY, projectId);
    }
  }
  
  export default ActiveProject;
  