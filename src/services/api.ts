import { config } from '@/config/env';
import { supabase } from '@/integrations/supabase/client';

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
  private isBackendAvailable: boolean | null = null; // Track backend availability

  constructor() {
    this.baseURL = config.API_BASE_URL;
    console.log('🔧 API SERVICE INITIALIZED:', {
      baseURL: this.baseURL,
      environment: config.ENVIRONMENT,
      timestamp: new Date().toISOString()
    });
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    console.log('🔐 AUTH HEADERS DEBUG: Getting authentication headers...');
    
    // STEP 1: Check if backend is in development mode (localhost)
    const isBackendDevelopment = this.baseURL.includes('localhost') || this.baseURL.includes('127.0.0.1');
    const isBackendStaging = this.baseURL.includes('onrender.com');
    console.log('🔍 AUTH DEBUG: Backend development mode:', isBackendDevelopment);
    console.log('🔍 AUTH DEBUG: Backend staging mode:', isBackendStaging);
    
    if (isBackendDevelopment || isBackendStaging) {
      console.log('🛠️ AUTH DEBUG: Using mock authentication for backend');
      
      // Create mock token that backend expects
      // Backend expects base64 encoded "user_id:email" format
      const mockUserId = "user_123";
      const mockEmail = "contact.pavansb@gmail.com";
      const mockTokenData = `${mockUserId}:${mockEmail}`;
      const mockToken = btoa(mockTokenData); // Base64 encode
      
      console.log('✅ AUTH DEBUG: Created mock token for backend');
      console.log('🔐 AUTH DEBUG: Mock token preview:', mockToken.substring(0, 20) + '...');
      
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`
      };
    }
    
    // STEP 2: For production (future), use Supabase JWT tokens
    console.log('🔍 AUTH DEBUG: Using Supabase JWT for production');
    
    // Get Supabase session token (for future production use)
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      console.log('🔍 AUTH DEBUG: Supabase session check:', {
        sessionExists: !!session,
        accessTokenExists: !!session?.access_token,
        userExists: !!session?.user?.email,
        error: error?.message
      });
      
      if (error) {
        console.error('❌ AUTH DEBUG: Supabase session error:', error);
        return { 'Content-Type': 'application/json' };
      }
      
      if (session?.access_token) {
        console.log('✅ AUTH DEBUG: Using Supabase JWT token for authorization');
        console.log('🔐 AUTH DEBUG: Token preview:', session.access_token.substring(0, 20) + '...');
        
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        };
      } else {
        console.warn('⚠️ AUTH DEBUG: No Supabase access token available');
        return { 'Content-Type': 'application/json' };
      }
      
    } catch (error: unknown) {
      console.error('❌ AUTH DEBUG: Error getting Supabase session:', error);
      return { 'Content-Type': 'application/json' };
    }
  }

  private async checkBackendAvailability(): Promise<boolean> {
    if (this.isBackendAvailable !== null) {
      return this.isBackendAvailable;
    }

    // Smart staging detection - if URL contains placeholder or staging marker, skip HTTP check
    if (this.baseURL.includes('placeholder') || this.baseURL.includes('api-staging-placeholder')) {
      console.log('🚧 STAGING ENVIRONMENT: Skipping HTTP check for placeholder backend URL');
      console.log('🚧 Backend URL contains "placeholder" - marking as unavailable to enable fallback mode');
      this.isBackendAvailable = false;
      return false;
    }

    try {
      console.log('🔍 CHECKING BACKEND AVAILABILITY:', this.baseURL);
      
      // Simple health check with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'Content-Type': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      
      this.isBackendAvailable = response.ok;
      console.log(`✅ BACKEND AVAILABILITY CHECK: ${this.isBackendAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}`);
      
      return this.isBackendAvailable;
    } catch (error: unknown) {
      console.error('❌ BACKEND AVAILABILITY CHECK FAILED:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'UnknownError',
        baseURL: this.baseURL
      });
      
      this.isBackendAvailable = false;
      return false;
    }
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

  private async makeRequestWithFallback<T>(
    url: string,
    options: RequestInit,
    fallbackData?: T
  ): Promise<T> {
    console.log(`🔄 API REQUEST: ${options.method || 'GET'} ${url}`);
    
    try {
      // Check backend availability first for critical requests
      if (config.ENVIRONMENT === 'qa') {
        const isAvailable = await this.checkBackendAvailability();
        if (!isAvailable) {
          console.warn('⚠️  BACKEND NOT AVAILABLE - Using fallback strategy');
          if (fallbackData !== undefined) {
            console.log('📦 RETURNING FALLBACK DATA:', fallbackData);
            return fallbackData;
          }
          throw new Error('Backend service is not available in staging environment');
        }
      }

      const response = await fetch(url, options);
      const data = await this.handleResponse<T>(response);
      console.log(`✅ API SUCCESS: ${options.method || 'GET'} ${url}`);
      return data;
      
    } catch (error: unknown) {
      console.error(`❌ API ERROR: ${options.method || 'GET'} ${url}`, {
        error: error instanceof Error ? error.message : 'Unknown error',
        name: error instanceof Error ? error.name : 'UnknownError',
        status: error instanceof Error ? error.status : 'UnknownStatus'
      });

      // Enhanced error handling for staging
      if (config.ENVIRONMENT === 'qa') {
        console.warn('🔄 STAGING ERROR DETECTED - Attempting fallback...');
        
        // DNS resolution errors
        if (error instanceof Error && error.message?.includes('ERR_NAME_NOT_RESOLVED')) {
          console.error('❌ DNS RESOLUTION FAILED:', {
            baseURL: this.baseURL,
            suggestion: 'Backend domain does not exist or is not accessible'
          });
        }
        
        // Network errors
        if (error instanceof Error && (error.message?.includes('Failed to fetch') || error.name === 'TypeError')) {
          console.error('❌ NETWORK ERROR DETECTED:', {
            baseURL: this.baseURL,
            environment: config.ENVIRONMENT,
            suggestion: 'Backend server is not reachable from staging environment'
          });
        }

        if (fallbackData !== undefined) {
          console.log('📦 USING FALLBACK DATA DUE TO ERROR:', fallbackData);
          return fallbackData;
        }
      }

      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.makeRequestWithFallback(`${this.baseURL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  }

  async getCurrentUser() {
    return this.makeRequestWithFallback(`${this.baseURL}/api/auth/me`, {
      headers: await this.getAuthHeaders(),
    });
  }

  async getGoals() {
    return this.makeRequestWithFallback(`${this.baseURL}/api/goals`, {
      headers: await this.getAuthHeaders(),
    }, []); // Fallback to empty array
  }

  async createGoal(goal: { title: string; description: string; priority: string; target_date?: string }) {
    // Create fallback goal for staging environment
    const fallbackGoal = {
      _id: `mock_goal_${Date.now()}`,
      user_id: 'mock_user_123',
      title: goal.title,
      description: goal.description,
      priority: goal.priority,
      target_date: goal.target_date,
      status: 'active' as const,
      progress: 0,
      created_at: new Date().toISOString()
    };

    return this.makeRequestWithFallback(`${this.baseURL}/api/goals`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(goal),
    }, fallbackGoal); // Provide fallback goal
  }

  async getTasks() {
    return this.makeRequestWithFallback(`${this.baseURL}/api/tasks`, {
      headers: await this.getAuthHeaders(),
    }, []); // Fallback to empty array
  }

  async createTask(task: { title: string; description?: string; goal_id?: string; priority: string; due_date?: string }) {
    // Create fallback task for staging environment
    const fallbackTask = {
      _id: `mock_task_${Date.now()}`,
      user_id: 'mock_user_123',
      title: task.title,
      description: task.description,
      goal_id: task.goal_id,
      priority: task.priority,
      due_date: task.due_date,
      status: 'pending' as const,
      created_at: new Date().toISOString()
    };

    return this.makeRequestWithFallback(`${this.baseURL}/api/tasks`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(task),
    }, fallbackTask); // Provide fallback task
  }

  async updateTask(taskId: string, updates: { status?: string; title?: string; description?: string }) {
    return this.makeRequestWithFallback(`${this.baseURL}/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
  }

  async getJournals() {
    return this.makeRequestWithFallback(`${this.baseURL}/api/journals`, {
      headers: await this.getAuthHeaders(),
    }, []); // Fallback to empty array
  }

  async createJournal(journal: { content: string; mood_level: number }) {
    return this.makeRequestWithFallback(`${this.baseURL}/api/journals`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(journal),
    });
  }

  async generateTasksFromGoal(goalId: string) {
    return this.makeRequestWithFallback(`${this.baseURL}/api/ai/generate-tasks`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ goal_id: goalId }),
    }, []); // Fallback to empty array
  }

  // Enhanced AI Methods - All route through FastAPI backend for security
  async generateTasksFromGoalTitle(goalTitle: string, goalDescription: string) {
    console.log('🤖 GENERATING TASKS VIA BACKEND:', { goalTitle, goalDescription });
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/ai/generate-tasks-from-goal`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ 
        goal_title: goalTitle, 
        goal_description: goalDescription 
      }),
    }, {
      // Secure fallback response when backend is unavailable
      tasks: [
        {
          title: `Work on ${goalTitle}`,
          description: goalDescription || 'Focus on achieving this goal step by step',
          priority: 'medium',
          estimatedDuration: 60
        }
      ],
      goalAnalysis: 'This goal requires focused effort and consistent action. Break it down into smaller, manageable steps.'
    });
  }

  async generateDailyBreakdown(tasks: object[], goalTitle: string, goalDescription: string, timeframe: string = '7 days') {
    console.log('📅 GENERATING DAILY BREAKDOWN VIA BACKEND:', { tasks, goalTitle, timeframe });
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/ai/generate-daily-breakdown`, {
      method: 'POST', 
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({
        tasks: tasks,
        goal_title: goalTitle,
        goal_description: goalDescription,
        timeframe: timeframe
      }),
    }, {
      // Secure fallback response
      weeklyPlan: [
        {
          day: "Monday",
          tasks: [
            {
              title: "Start working on your goal",
              description: "Begin with the first task from your action plan",
              estimatedDuration: 60,
              priority: "medium"
            }
          ]
        }
      ],
      totalDuration: 420,
      tips: ["Start small and build momentum", "Track your progress daily", "Celebrate small wins"]
    });
  }

  async analyzeJournal(content: string) {
    console.log('📔 ANALYZING JOURNAL VIA BACKEND:', { contentLength: content.length });
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/ai/analyze-journal`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ content }),
    }, {
      // Secure fallback response
      summary: 'Journal entry recorded successfully.',
      mood: 3,
      insights: ['Reflection is valuable for personal growth'],
      recommendations: ['Continue journaling regularly']
    });
  }

  async generateMotivationalMessage(goalTitle: string, recentProgress: string) {
    console.log('✨ GENERATING MOTIVATION VIA BACKEND:', { goalTitle, recentProgress });
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/ai/motivational-message`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ 
        goal_title: goalTitle, 
        recent_progress: recentProgress 
      }),
    }, {
      // Secure fallback response
      message: 'Keep up the great work! Every step forward counts toward your success.'
    });
  }

  // User Management Methods with Enhanced Error Handling
  async getUserByEmail(email: string) {
    console.log('🔍 FETCHING USER BY EMAIL:', email);
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/users/by-email/${encodeURIComponent(email)}`, {
      headers: await this.getAuthHeaders(),
    }, null); // Fallback to null (user not found)
  }

  async createUser(userData: { google_id: string; email: string; full_name: string; avatar_url?: string }) {
    console.log('👤 CREATING NEW USER:', { email: userData.email, google_id: userData.google_id });
    
    // For staging, create a mock user if backend is not available
    const mockUser = {
      _id: `mock_${userData.google_id}`,
      ...userData,
      has_completed_onboarding: false,
      streak: 0,
      level: 'beginner',
      created_at: new Date().toISOString()
    };

    return this.makeRequestWithFallback(`${this.baseURL}/api/users`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(userData),
    }, mockUser); // Fallback to mock user
  }

  async updateUserProfile(userId: string, updates: { full_name?: string; avatar_url?: string; level?: string }) {
    return this.makeRequestWithFallback(`${this.baseURL}/api/users/${userId}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(updates),
    }, { ...updates }); // Fallback to the updates object
  }

  async updateUserOnboarding(userId: string, completed: boolean) {
    return this.makeRequestWithFallback(`${this.baseURL}/api/users/${userId}/onboarding`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify({ has_completed_onboarding: completed }),
    }, { has_completed_onboarding: completed }); // Fallback to success response
  }

  // Enhanced Goal Methods
  async getUserGoals(userId: string) {
    console.log('🎯 FETCHING USER GOALS - Using authentication-based filtering');
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/goals`, {
      headers: await this.getAuthHeaders(),
    }, []); // Fallback to empty array
  }

  async updateGoalProgress(goalId: string, progress: number) {
    console.log('🎯 UPDATING GOAL PROGRESS:', { goalId, progress });
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/goals/${goalId}/progress?progress=${progress}`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
    }, { progress }); // Fallback to progress update
  }

  // Enhanced Task Methods
  async getUserTasks(userId: string) {
    console.log('📋 FETCHING USER TASKS - Using authentication-based filtering');
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/tasks`, {
      headers: await this.getAuthHeaders(),
    }, []); // Fallback to empty array
  }

  async updateTaskStatus(taskId: string, status: string) {
    console.log('📋 UPDATING TASK STATUS:', { taskId, status });
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/tasks/${taskId}/status`, {
      method: 'PATCH',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(status),
    }, { status }); // Fallback to status update
  }

  async deleteTask(taskId: string) {
    return this.makeRequestWithFallback(`${this.baseURL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
    }, { success: true }); // Fallback to success
  }

  // Enhanced Journal Methods
  async getUserJournalEntries(userId: string) {
    console.log('📝 FETCHING USER JOURNAL ENTRIES - Using authentication-based filtering');
    
    return this.makeRequestWithFallback(`${this.baseURL}/api/journals`, {
      headers: await this.getAuthHeaders(),
    }, []); // Fallback to empty array
  }

  async createJournalEntry(entryData: { user_id: string; content: string; mood_score?: number }) {
    console.log('📝 CREATING JOURNAL ENTRY:', { user_id: entryData.user_id, content_length: entryData.content.length });
    
    // Mock journal entry for fallback
    const mockEntry = {
      _id: `mock_journal_${Date.now()}`,
      ...entryData,
      created_at: new Date().toISOString()
    };

    return this.makeRequestWithFallback(`${this.baseURL}/api/journals`, {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(entryData),
    }, mockEntry); // Fallback to mock entry
  }

  async updateJournalEntry(entryId: string, updates: Partial<{ content: string; mood_score: number }>) {
    return this.makeRequestWithFallback(`${this.baseURL}/api/journals/${entryId}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      body: JSON.stringify(updates),
    }, { ...updates }); // Fallback to updates
  }

  // CORS Testing Method
  async testCORS() {
    console.log('🧪 TESTING CORS WITH BACKEND:', this.baseURL);
    
    try {
      const response = await fetch(`${this.baseURL}/cors-test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ CORS TEST SUCCESSFUL:', data);
        return data;
      } else {
        console.warn('⚠️  CORS TEST FAILED:', response.status, response.statusText);
        return { error: `HTTP ${response.status}`, status: response.status };
      }
    } catch (error: unknown) {
      console.error('❌ CORS TEST ERROR:', error instanceof Error ? error.message : 'Unknown error');
      return { error: error instanceof Error ? error.message : 'Unknown error', type: error instanceof Error ? error.name : 'UnknownError' };
    }
  }
}

export const apiService = new ApiService();
