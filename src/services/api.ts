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
}

export const apiService = new ApiService(); 