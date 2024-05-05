import { Story } from "../models/Story";

class StoryStorage {
  private static STORAGE_KEY = "stories";

  static getAllStories(): Story[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  static saveStory(story: Story) {
    const stories = this.getAllStories();
    const existingIndex = stories.findIndex(s => s.id === story.id);
    if (existingIndex !== -1) stories[existingIndex] = story;
    else stories.push(story);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }

  static deleteStory(id: string) {
    let stories = this.getAllStories();
    stories = stories.filter(s => s.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(stories));
  }
}

export default StoryStorage;
