
import { config } from '../config/env';

// Type definitions for API responses
interface MongoUser {
  _id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  has_completed_onboarding?: boolean;
  streak?: number;
  level?: string;
  google_id?: string;
}

interface MongoGoal {
  _id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
  status: 'active' | 'completed' | 'stalled';
  priority?: string;
  progress?: number;
  created_at?: string;
}

interface MongoTask {
  _id: string;
  user_id: string;
  title: string;
  description?: string;
  goal_id?: string;
  status: 'pending' | 'completed' | 'in_progress';
  priority?: string;
  due_date?: string;
  created_at?: string;
}

interface MongoJournalEntry {
  _id: string;
  user_id: string;
  content: string;
  mood_score?: number;
  summary?: string;
  created_at?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = config.API_BASE_URL;
  }

  // User operations
  async getUserByEmail(email: string): Promise<MongoUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/users/email/${email}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as MongoUser;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async createUser(userData: {
    google_id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  }): Promise<MongoUser> {
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as MongoUser;
  }

  async updateUserProfile(userId: string, updates: { avatar_url?: string }): Promise<MongoUser> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as MongoUser;
  }

  async updateUserOnboarding(userId: string, hasCompleted: boolean): Promise<MongoUser> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ has_completed_onboarding: hasCompleted }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as MongoUser;
  }

  // Goal operations
  async getUserGoals(userId: string): Promise<MongoGoal[]> {
    try {
      const response = await fetch(`${this.baseUrl}/goals/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as MongoGoal[];
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  async createGoal(goalData: {
    user_id: string;
    title: string;
    description?: string;
    category?: string;
    priority?: string;
  }): Promise<MongoGoal> {
    const response = await fetch(`${this.baseUrl}/goals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...goalData,
        status: 'active'
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as MongoGoal;
  }

  // Task operations
  async getUserTasks(userId: string): Promise<MongoTask[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as MongoTask[];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  async createTask(taskData: {
    user_id: string;
    title: string;
    description?: string;
    goal_id?: string;
    priority?: string;
    status: 'pending' | 'completed' | 'in_progress';
  }): Promise<MongoTask> {
    const response = await fetch(`${this.baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as MongoTask;
  }

  async updateTaskStatus(taskId: string, status: 'pending' | 'completed' | 'in_progress'): Promise<MongoTask> {
    const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as MongoTask;
  }

  async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  }

  // Journal operations
  async getUserJournalEntries(userId: string): Promise<MongoJournalEntry[]> {
    try {
      const response = await fetch(`${this.baseUrl}/journals/user/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json() as MongoJournalEntry[];
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      return [];
    }
  }

  async createJournalEntry(entryData: {
    user_id: string;
    content: string;
    mood_score?: number;
  }): Promise<MongoJournalEntry> {
    const response = await fetch(`${this.baseUrl}/journals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json() as MongoJournalEntry;
  }
}

export const apiService = new ApiService();
