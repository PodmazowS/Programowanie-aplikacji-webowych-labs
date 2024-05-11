import React, { useState, useEffect } from "react";
import TaskStorage from "../api/TaskStorage";
import { Task } from "../models/Task";
import ActiveProject from "../api/ActiveProject";
import UserSession from "../api/UserSession";

const TaskForm: React.FC = () => {
const [task, setTask] = useState<Task>({
    id: "",
    name: "",
    description: "",
    priority: "medium",
    storyId: ActiveProject.getActiveProject() || "",
    estimatedTime: new Date().toISOString(),
    state: "todo",
    ownerId: UserSession.getUser().id,
    creationDate: "" 
});
const [tasks, setTasks] = useState<Task[]>([]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask = { ...task, id: task.id || String(Date.now()) };
    TaskStorage.saveTask(newTask);
    setTask({
      id: "",
      name: "",
      description: "",
      priority: "medium",
      storyId: ActiveProject.getActiveProject() || "",
      estimatedTime: new Date().toISOString(),
      state: "todo",
      ownerId: UserSession.getUser().id,
      creationDate: "",
      startDate: "",
      endDate: "",
    });
    loadTasks();
  };

  const handleDelete = (id: string) => {
    TaskStorage.deleteTask(id);
    loadTasks();
  };

  const loadTasks = () => {
    const allTasks = TaskStorage.getAllTasks().filter(s => s.storyId === ActiveProject.getActiveProject());
    setTasks(allTasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" value={task.name} onChange={handleChange} placeholder="Task Name" />
        <textarea name="description" value={task.description} onChange={handleChange} placeholder="Description" />
        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Save Task</button>
      </form>
    <ul>
        {tasks.map(task => (
            <li key={task.id}>
                <h3>{task.name}</h3>
                <p>{task.description}</p>
                <button onClick={() => handleDelete(task.id)}>Delete</button>
            </li>
        ))}
    </ul>
    </div>
    );
}

export default TaskForm;