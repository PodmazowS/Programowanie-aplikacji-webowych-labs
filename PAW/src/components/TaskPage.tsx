import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProjectStorage from "../api/localStorageAPI";
import StoryStorage from "../api/StoryStorage";
import TaskStorage from "../api/TaskStorage";
import UserSession from "../api/UserSession";
import { Project } from "../models/Project";
import { Story } from "../models/Story";
import { User } from "../models/User";
import { Task } from "../models/Task";

const TaskPage: React.FC = () => {
    const { storyId } = useParams<{ storyId: string }>();
    const [story, setStory] = useState<Story | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const loggedInUser: User = UserSession.getUser();
    const [newTask, setNewTask] = useState<Task>({
        id: "",
        name: "",
        description: "",
        priority: "medium",
        storyId: storyId || "",
        estimatedTime: new Date().toISOString(),
        state: "todo",
        ownerId: loggedInUser.id,
        creationDate: "",
        startDate: "",
        endDate: "",
    });
    const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "doing" | "done">("all");
    
    useEffect(() => {
        console.log('storyId:', storyId);
        const foundStory = StoryStorage.getAllStories().find(s => s.id === storyId);
        console.log('foundStory:', foundStory);
        setStory(foundStory || null);
    
        const storyTasks = TaskStorage.getAllTasks().filter(t => t.storyId === storyId);
        console.log('storyTasks:', storyTasks);
        setTasks(storyTasks);
        setFilteredTasks(storyTasks);
    }, [storyId]);
    
    const handleTaskChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewTask({ ...newTask, [e.target.name]: e.target.value });
    };
    
    const handleTaskSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTask.name.trim() || !newTask.description.trim()) {
        alert('required.');
        return;
        }
        const taskToAdd = { ...newTask, id: newTask.id || String(Date.now()), storyId: storyId || "" };
        TaskStorage.saveTask(taskToAdd);

        const updatedTasks = tasks.map(task =>
            task.id === taskToAdd.id ? taskToAdd : task
        );

        if (!tasks.some(task => task.id === taskToAdd.id)) {
            setTasks([...tasks, taskToAdd]);
            setFilteredTasks([...tasks, taskToAdd]);
        } else {
            setTasks(updatedTasks);
            setFilteredTasks(updatedTasks.filter(task => statusFilter === "all" || task.state === statusFilter));
        }

        setNewTask({
            id: "",
            name: "",
            description: "",
            priority: "medium",
            storyId: storyId || "",
            estimatedTime: new Date().toISOString(),
            state: "todo",
            ownerId: loggedInUser.id,
            creationDate: "",
            startDate: "",
            endDate: "",
        });
    };

    const handleStatusChange = (id: string, newStatus: "todo" | "doing" | "done") => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, state: newStatus } : task
        );
        TaskStorage.saveTask(updatedTasks.find(task => task.id === id) as Task);
        setTasks(updatedTasks);
        setFilteredTasks(updatedTasks.filter(task => statusFilter === "all" || task.state === statusFilter));
    };

    const handleDelete = (id: string) => {
        TaskStorage.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
        setFilteredTasks(filteredTasks.filter(task => task.id !== id));
    };

    return (
        <div className="task-page">
            <h2>Tasks for Story: {story?.name}</h2>
            <form onSubmit={handleTaskSubmit} className="task-input-form">
                <input name="name" value={newTask.name} onChange={handleTaskChange} placeholder="Task Name"/>
                <textarea name="description" value={newTask.description} onChange={handleTaskChange} placeholder="Description" />
                <input type="datetime-local" name="estimatedTime" value={newTask.estimatedTime} onChange={handleTaskChange} />
                <select name="priority" value={newTask.priority} onChange={handleTaskChange} >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <button className="btn">Add Task</button>
            </form>
            <div className="kanban-board">
                <div className="kanban-column">
                    <h2>To Do:</h2>
                    {filteredTasks.filter(task => task.state === "todo").map(task => (
                        <div key={task.id} className="task-item">
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Priority: {task.priority}</p>
                            <p>Estimated Time: {task.estimatedTime}</p>
                            <p>State: {task.state}</p>
                            <button onClick={() => handleStatusChange(task.id, task.state === "todo" ? "doing" : "done")}>
                                {task.state === "todo" ? "Start" : "Finish"}
                            </button>
                            <button onClick={() => handleDelete(task.id)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div className="kanban-column">
                    <h2>Doing:</h2>
                    {filteredTasks.filter(task => task.state === "doing").map(task => (
                        <div key={task.id} className="task-item">
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Priority: {task.priority}</p>
                            <p>Estimated Time: {task.estimatedTime}</p>
                            <p>State: {task.state}</p>
                            <button onClick={() => handleStatusChange(task.id, task.state === "todo" ? "doing" : "done")}>
                                {task.state === "todo" ? "Start" : "Finish"}
                            </button>
                            <button onClick={() => handleDelete(task.id)}>Delete</button>
                        </div>
                    ))}
                </div>
                <div className="kanban-column">
                    <h2>Done:</h2>
                    {filteredTasks.filter(task => task.state === "done").map(task => (
                        <div key={task.id} className="task-item">
                            <h3>{task.name}</h3>
                            <p>{task.description}</p>
                            <p>Priority: {task.priority}</p>
                            <p>Estimated Time: {task.estimatedTime}</p>
                            <p>State: {task.state}</p>
                            <button onClick={() => handleStatusChange(task.id, task.state === "todo" ? "doing" : "done")}>
                                {task.state === "todo" ? "Start" : "Finish"}
                            </button>
                            <button onClick={() => handleDelete(task.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
            <Link to={`/projects/${story?.projectId}`}>Back to Project</Link>
        </div>
    );
}

export default TaskPage;
    