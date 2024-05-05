import React, { useState, useEffect } from "react";
import StoryStorage from "../api/StoryStorage";
import { Story } from "../models/Story";
import ActiveProject from "../api/ActiveProject";
import UserSession from "../api/UserSession";

const StoryForm: React.FC = () => {
  const [story, setStory] = useState<Story>({
    id: "",
    name: "",
    description: "",
    priority: "medium",
    projectId: ActiveProject.getActiveProject() || "",
    createdDate: new Date().toISOString(),
    state: "todo",
    ownerId: UserSession.getUser().id
  });
  const [stories, setStories] = useState<Story[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setStory({ ...story, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStory = { ...story, id: story.id || String(Date.now()) };
    StoryStorage.saveStory(newStory);
    setStory({
      id: "",
      name: "",
      description: "",
      priority: "medium",
      projectId: ActiveProject.getActiveProject() || "",
      createdDate: new Date().toISOString(),
      state: "todo",
      ownerId: UserSession.getUser().id
    });
    loadStories();
  };

  const handleDelete = (id: string) => {
    StoryStorage.deleteStory(id);
    loadStories();
  };

  const loadStories = () => {
    const allStories = StoryStorage.getAllStories().filter(s => s.projectId === ActiveProject.getActiveProject());
    setStories(allStories);
  };

  useEffect(() => {
    loadStories();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="name" value={story.name} onChange={handleChange} placeholder="Story Name" />
        <textarea name="description" value={story.description} onChange={handleChange} placeholder="Description" />
        <select name="priority" value={story.priority} onChange={handleChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Save Story</button>
      </form>
      <div>
        {stories.length === 0 && <p>No stories available.</p>}
        {stories.map(story => (
          <div key={story.id}>
            <h3>{story.name}</h3>
            <p>{story.description}</p>
            <button onClick={() => handleDelete(story.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryForm;
