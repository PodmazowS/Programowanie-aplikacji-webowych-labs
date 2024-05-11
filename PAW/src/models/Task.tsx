export interface Task {
    id: string;
    name: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    storyId: string;
    estimatedTime: string;
    state: 'todo' | 'doing' | 'done';
    startDate?: string;
    endDate?: string;
    ownerId: string;
    creationDate: string;
  }
  