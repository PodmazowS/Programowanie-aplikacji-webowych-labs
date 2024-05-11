import { Task } from "../models/Task";

class TaskStorage {
  private static STORAGE_KEY = "tasks";

  static getAllTasks(): Task[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveTask(task: Task) {
    const tasks = this.getAllTasks();
    const existingIndex = tasks.findIndex(t => t.id === task.id);
    if (existingIndex !== -1) {
      tasks[existingIndex] = task;
    } else {
      tasks.push(task);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  static deleteTask(id: string) {
    const tasks = this.getAllTasks().filter(task => task.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }

  static getTasksByStory(storyId: string): Task[] {
    return this.getAllTasks().filter(task => task.storyId === storyId);
  }
}

export default TaskStorage;
