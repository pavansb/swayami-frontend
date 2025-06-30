import { config } from '@/config/env';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface ApiError {
  detail: string;
  status: number;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('swayami_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Network error' }));
      throw {
        detail: errorData.detail || 'An error occurred',
        status: response.status,
      } as ApiError;
    }
    return response.json();
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async getCurrentUser() {
    const response = await fetch(`${this.baseURL}/api/auth/me`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async getGoals() {
    const response = await fetch(`${this.baseURL}/api/goals`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createGoal(goal: { title: string; description: string; priority: string; target_date?: string }) {
    const response = await fetch(`${this.baseURL}/api/goals`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(goal),
    });

    return this.handleResponse(response);
  }

  async getTasks() {
    const response = await fetch(`${this.baseURL}/api/tasks`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createTask(task: { title: string; description?: string; goal_id?: string; priority: string; due_date?: string }) {
    const response = await fetch(`${this.baseURL}/api/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(task),
    });

    return this.handleResponse(response);
  }

  async updateTask(taskId: string, updates: { status?: string; title?: string; description?: string }) {
    const response = await fetch(`${this.baseURL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  async getJournals() {
    const response = await fetch(`${this.baseURL}/api/journals`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createJournal(journal: { content: string; mood_level: number }) {
    const response = await fetch(`${this.baseURL}/api/journals`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(journal),
    });

    return this.handleResponse(response);
  }

  async generateTasksFromGoal(goalId: string) {
    const response = await fetch(`${this.baseURL}/api/ai/generate-tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ goal_id: goalId }),
    });

    return this.handleResponse(response);
  }

  async analyzeJournal(journalId: string) {
    const response = await fetch(`${this.baseURL}/api/ai/analyze-journal`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ journal_id: journalId }),
    });

    return this.handleResponse(response);
  }

  // User Management Methods
  async getUserByEmail(email: string) {
    const response = await fetch(`${this.baseURL}/api/users/by-email/${encodeURIComponent(email)}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createUser(userData: { google_id: string; email: string; full_name: string; avatar_url?: string }) {
    const response = await fetch(`${this.baseURL}/api/users`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse(response);
  }

  async updateUserProfile(userId: string, updates: { full_name?: string; avatar_url?: string; level?: string }) {
    const response = await fetch(`${this.baseURL}/api/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  async updateUserOnboarding(userId: string, completed: boolean) {
    const response = await fetch(`${this.baseURL}/api/users/${userId}/onboarding`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ has_completed_onboarding: completed }),
    });

    return this.handleResponse(response);
  }

  // Enhanced Goal Methods
  async getUserGoals(userId: string) {
    const response = await fetch(`${this.baseURL}/api/goals/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateGoalProgress(goalId: string, progress: number) {
    const response = await fetch(`${this.baseURL}/api/goals/${goalId}/progress`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ progress }),
    });

    return this.handleResponse(response);
  }

  // Enhanced Task Methods
  async getUserTasks(userId: string) {
    const response = await fetch(`${this.baseURL}/api/tasks/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async updateTaskStatus(taskId: string, status: string) {
    const response = await fetch(`${this.baseURL}/api/tasks/${taskId}/status`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });

    return this.handleResponse(response);
  }

  async deleteTask(taskId: string) {
    const response = await fetch(`${this.baseURL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  // Enhanced Journal Methods
  async getUserJournalEntries(userId: string) {
    const response = await fetch(`${this.baseURL}/api/journals/user/${userId}`, {
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse(response);
  }

  async createJournalEntry(entryData: { user_id: string; content: string; mood_score?: number }) {
    const response = await fetch(`${this.baseURL}/api/journals`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(entryData),
    });

    return this.handleResponse(response);
  }

  async updateJournalEntry(entryId: string, updates: Partial<{ content: string; mood_score: number }>) {
    const response = await fetch(`${this.baseURL}/api/journals/${entryId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  // CORS Testing Method
  async testCORS() {
    try {
      const response = await fetch(`${this.baseURL}/cors-test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin,
        },
      });

      return this.handleResponse(response);
    } catch (error) {
      console.error('CORS Test Failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService(); 