import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ProjectStorage from "../api/localStorageAPI";
import StoryStorage from "../api/StoryStorage";
import UserSession from "../api/UserSession";
import { Project } from "../models/Project";
import { Story } from "../models/Story";
import { User } from "../models/User";
import "../styles/projectForm.css";

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [filteredStories, setFilteredStories] = useState<Story[]>([]);
  const loggedInUser: User = UserSession.getUser();
  const [newStory, setNewStory] = useState<Story>({
    id: "",
    name: "",
    description: "",
    priority: "medium",
    projectId: projectId || "",
    createdDate: new Date().toISOString(),
    state: "todo",
    ownerId: loggedInUser.id
  });
  const [statusFilter, setStatusFilter] = useState<"all" | "todo" | "doing" | "done">("all");

  useEffect(() => {
    const foundProject = ProjectStorage.getAllProjects().find(p => p.id === projectId);
    setProject(foundProject || null);

    const projectStories = StoryStorage.getAllStories().filter(s => s.projectId === projectId);
    setStories(projectStories);
    setFilteredStories(projectStories);
  }, [projectId]);

  const handleStoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setNewStory({ ...newStory, [e.target.name]: e.target.value });
  };

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.name.trim() || !newStory.description.trim()) {
      alert('Both name and description are required.');
      return;
    }
  const storyToAdd = { ...newStory, id: newStory.id || String(Date.now()), projectId: projectId || "" };
  StoryStorage.saveStory(storyToAdd);

  const updatedStories = stories.map(story =>
    story.id === storyToAdd.id ? storyToAdd : story
  );

  if (!stories.some(story => story.id === storyToAdd.id)) {
    setStories([...stories, storyToAdd]);
    setFilteredStories([...stories, storyToAdd]);
  } else {
    setStories(updatedStories);
    setFilteredStories(updatedStories.filter(story => statusFilter === "all" || story.state === statusFilter));
  }

    setNewStory({
      id: "",
      name: "",
      description: "",
      priority: "medium",
      projectId: projectId || "",
      createdDate: new Date().toISOString(),
      state: "todo",
      ownerId: loggedInUser.id
    });
  };

  const handleStatusChange = (id: string, newStatus: "todo" | "doing" | "done") => {
    const updatedStories = stories.map(story =>
      story.id === id ? { ...story, state: newStatus } : story
    );
    setStories(updatedStories);
    setFilteredStories(updatedStories.filter(story => statusFilter === "all" || story.state === statusFilter));
    const updatedStory = updatedStories.find(story => story.id === id);
    if (updatedStory) StoryStorage.saveStory(updatedStory);
  };

  const handleDelete = (id: string) => {
    StoryStorage.deleteStory(id);
    const remainingStories = stories.filter(story => story.id !== id);
    setStories(remainingStories);
    setFilteredStories(remainingStories.filter(story => statusFilter === "all" || story.state === statusFilter));
  };

  const handleEdit = (story: Story) => {
    setNewStory(story);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFilter = e.target.value as "all" | "todo" | "doing" | "done";
    setStatusFilter(selectedFilter);
    setFilteredStories(stories.filter(story => selectedFilter === "all" || story.state === selectedFilter));
  };

  return (
    <div className="project-page">
      {project ? (
        <>
          <div className="project-header">
            <h1>{project.name}</h1>
            <p>Description: {project.description}</p>
          </div>
          <h2>Project Stories</h2>
          <form onSubmit={handleStorySubmit}>
            <input name="name" value={newStory.name} onChange={handleStoryChange} placeholder="Story Name" />
            <textarea name="description" style={{height: "50px", resize: "vertical" }} value={newStory.description} onChange={handleStoryChange} placeholder="Description" />
            <select name="priority" value={newStory.priority} onChange={handleStoryChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button type="submit" className="btn add-story-btn">{newStory.id ? "Update Story" : "Add New Story"}</button>
            
          </form>
          <div>
            <label>Status Filter: </label>
            <select value={statusFilter} onChange={handleFilterChange}>
              <option value="all">All</option>
              <option value="todo">Todo</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div className="story-list">
            {filteredStories.length === 0 && <p>No stories available.</p>}
            {filteredStories.map(story => (
              <div key={story.id} className="story-item">
                <h3>{story.name}</h3>
                <p>Description: {story.description}</p>
                <p>Priority: {story.priority}</p>
                <p>Created by: {loggedInUser.firstName} {loggedInUser.lastName}</p>
                <label>Status: </label>
                <select
                  value={story.state}
                  onChange={(e) => handleStatusChange(story.id, e.target.value as "todo" | "doing" | "done")}
                >
                  <option value="todo">Todo</option>
                  <option value="doing">Doing</option>
                  <option value="done">Done</option>
                </select>
                <div>
                  <button onClick={() => handleEdit(story)} className="btn edit-btn">Edit</button>
                  <button onClick={() => handleDelete(story.id)} className="btn delete-btn">Delete</button>
                  <Link to={`/stories/${story.id}`} className="btn view-btn">View Tasks</Link>
                </div>
                
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Project not found.</p>
      )}
      <Link to="/" className="btn back-btn">Back to Projects</Link>
    </div>
  );
};

export default ProjectPage;
