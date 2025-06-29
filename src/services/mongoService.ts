/**
 * MongoDB Service for Swayami App
 * Handles all database operations using MongoDB Atlas
 * Falls back to localStorage mock in development when MongoDB is not configured
 */

const MONGO_API_BASE = 'https://us-east-1.aws.data.mongodb-api.com/app/data-gcxns/endpoint/data/v1';
const MONGO_API_KEY = import.meta.env.VITE_MONGO_API_KEY;
const DATA_SOURCE = 'swayami-app-db';
const DATABASE = 'swayami_app';

// Development mode detection
const DEV_MODE = import.meta.env.VITE_NODE_ENV === 'development' || import.meta.env.DEV;

interface MongoAPIRequest {
  collection: string;
  database: string;
  dataSource: string;
  filter?: any;
  document?: any;
  documents?: any[];
  update?: any;
  sort?: any;
  limit?: number;
  projection?: any;
}

// Mock localStorage service for development
class MockMongoService {
  private getStorageKey(collection: string): string {
    return `swayami_mock_${collection}`;
  }

  private getCollection(collection: string): any[] {
    const data = localStorage.getItem(this.getStorageKey(collection));
    return data ? JSON.parse(data) : [];
  }

  private saveCollection(collection: string, data: any[]): void {
    localStorage.setItem(this.getStorageKey(collection), JSON.stringify(data));
  }

  async findOne(collection: string, filter: any): Promise<any> {
    console.log('🔧 Mock MongoDB: findOne', { collection, filter });
    const data = this.getCollection(collection);
    const result = data.find(item => {
      return Object.keys(filter).every(key => item[key] === filter[key]);
    });
    return { document: result || null };
  }

  async insertOne(collection: string, document: any): Promise<any> {
    console.log('🔧 Mock MongoDB: insertOne', { collection, document });
    const data = this.getCollection(collection);
    data.push(document);
    this.saveCollection(collection, data);
    return { insertedId: document._id };
  }

  async find(collection: string, filter: any = {}, options: any = {}): Promise<any> {
    console.log('🔧 Mock MongoDB: find', { collection, filter, options });
    let data = this.getCollection(collection);
    
    // Apply filter
    if (Object.keys(filter).length > 0) {
      data = data.filter(item => {
        return Object.keys(filter).every(key => item[key] === filter[key]);
      });
    }
    
    // Apply sort
    if (options.sort) {
      const sortKey = Object.keys(options.sort)[0];
      const sortOrder = options.sort[sortKey];
      data.sort((a, b) => {
        if (sortOrder === 1) return a[sortKey] > b[sortKey] ? 1 : -1;
        return a[sortKey] < b[sortKey] ? 1 : -1;
      });
    }
    
    // Apply limit
    if (options.limit) {
      data = data.slice(0, options.limit);
    }
    
    return { documents: data };
  }

  async updateOne(collection: string, filter: any, update: any): Promise<any> {
    console.log('🔧 Mock MongoDB: updateOne', { collection, filter, update });
    const data = this.getCollection(collection);
    const index = data.findIndex(item => {
      return Object.keys(filter).every(key => item[key] === filter[key]);
    });
    
    if (index !== -1) {
      if (update.$set) {
        Object.assign(data[index], update.$set);
      }
      this.saveCollection(collection, data);
      return { modifiedCount: 1 };
    }
    
    return { modifiedCount: 0 };
  }

  async deleteOne(collection: string, filter: any): Promise<any> {
    console.log('🔧 Mock MongoDB: deleteOne', { collection, filter });
    const data = this.getCollection(collection);
    const index = data.findIndex(item => {
      return Object.keys(filter).every(key => item[key] === filter[key]);
    });
    
    if (index !== -1) {
      data.splice(index, 1);
      this.saveCollection(collection, data);
      return { deletedCount: 1 };
    }
    
    return { deletedCount: 0 };
  }
}

class MongoService {
  private headers: HeadersInit;
  private useMockService: boolean;
  private mockService: MockMongoService;

  constructor() {
    // Log API key status for debugging
    console.log('🔧 MongoDB Service: Initializing...');
    console.log('🔧 API Key exists:', !!MONGO_API_KEY);
    console.log('🔧 API Key length:', MONGO_API_KEY?.length || 0);
    
    // Validate API key is not placeholder
    const isPlaceholder = MONGO_API_KEY === 'your_mongodb_data_api_key_here' || !MONGO_API_KEY;
    console.log('🔧 API Key is placeholder:', isPlaceholder);
    
    // Use mock service in development when API key is not configured
    this.useMockService = DEV_MODE && isPlaceholder;
    this.mockService = new MockMongoService();
    
    if (this.useMockService) {
      console.log('🔧 DEVELOPMENT MODE: Using localStorage mock service');
      console.log('🔧 Data will be stored locally until MongoDB is configured');
      console.log('🔧 To use real MongoDB, set VITE_MONGO_API_KEY in your .env file');
    } else {
      console.log('🔧 PRODUCTION MODE: Using MongoDB Atlas Data API');
    }
    
    if (isPlaceholder && !this.useMockService) {
      console.error('❌ CRITICAL: MongoDB API Key is not configured!');
      console.error('❌ Please set VITE_MONGO_API_KEY in your .env file');
      console.error('❌ Current value:', MONGO_API_KEY);
    }
    
    console.log('🔧 Base URL:', MONGO_API_BASE);
    console.log('🔧 Data Source:', DATA_SOURCE);
    console.log('🔧 Database:', DATABASE);
    console.log('🔧 Development Mode:', DEV_MODE);
    console.log('🔧 Using Mock Service:', this.useMockService);
    
    this.headers = {
      'Content-Type': 'application/json',
      'api-key': MONGO_API_KEY || '',
    };
    
    console.log('🔧 Headers configured (API key hidden for security)');
  }

  private async makeRequest(action: string, body: MongoAPIRequest) {
    // Use mock service in development
    if (this.useMockService) {
      switch (action) {
        case 'findOne':
          return this.mockService.findOne(body.collection, body.filter || {});
        case 'insertOne':
          return this.mockService.insertOne(body.collection, body.document);
        case 'find':
          return this.mockService.find(body.collection, body.filter || {}, { sort: body.sort, limit: body.limit });
        case 'updateOne':
          return this.mockService.updateOne(body.collection, body.filter || {}, body.update || {});
        case 'deleteOne':
          return this.mockService.deleteOne(body.collection, body.filter || {});
        default:
          throw new Error(`Mock service: Unsupported action ${action}`);
      }
    }

    // Use real MongoDB API
    const url = `${MONGO_API_BASE}/action/${action}`;
    console.log('🔧 MongoDB Request:', {
      url,
      action,
      headers: this.headers,
      body: JSON.stringify(body, null, 2)
    });

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(body),
      });

      console.log('🔧 MongoDB Response status:', response.status);
      console.log('🔧 MongoDB Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ MongoDB API Error Response:', errorText);
        throw new Error(`MongoDB API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ MongoDB Response success:', result);
      return result;
    } catch (error) {
      console.error('❌ MongoDB Request failed:', error);
      throw error;
    }
  }

  // USER OPERATIONS
  async createUser(userData: {
    google_id: string;
    email: string;
    full_name: string;
  }) {
    const userId = crypto.randomUUID();
    const userDoc = {
      _id: userId,
      google_id: userData.google_id,
      email: userData.email,
      full_name: userData.full_name,
      has_completed_onboarding: false,
      streak: 0,
      level: 'Mindful Novice',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      await this.makeRequest('insertOne', {
        collection: 'users',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: userDoc,
      });
      console.log('✅ MongoDB: Created user:', userData.email);
      return userDoc;
    } catch (error) {
      console.error('❌ MongoDB: Error creating user:', error);
      // Try to find existing user
      return this.getUserByEmail(userData.email);
    }
  }

  async getUserByEmail(email: string) {
    try {
      const result = await this.makeRequest('findOne', {
        collection: 'users',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { email },
      });
      return result.document;
    } catch (error) {
      console.error('❌ MongoDB: Error getting user by email:', error);
      return null;
    }
  }

  async getUserByGoogleId(googleId: string) {
    try {
      const result = await this.makeRequest('findOne', {
        collection: 'users',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { google_id: googleId },
      });
      return result.document;
    } catch (error) {
      console.error('❌ MongoDB: Error getting user by Google ID:', error);
      return null;
    }
  }

  async updateUserOnboarding(userId: string, completed = true) {
    try {
      await this.makeRequest('updateOne', {
        collection: 'users',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { _id: userId },
        update: {
          $set: {
            has_completed_onboarding: completed,
            updated_at: new Date().toISOString(),
          },
        },
      });
      console.log('✅ MongoDB: Updated user onboarding status');
      return true;
    } catch (error) {
      console.error('❌ MongoDB: Error updating user onboarding:', error);
      return false;
    }
  }

  // GOAL OPERATIONS
  async createGoal(goalData: {
    user_id: string;
    title: string;
    description: string;
    category?: string;
    priority?: string;
  }) {
    const goalId = crypto.randomUUID();
    const goalDoc = {
      _id: goalId,
      user_id: goalData.user_id,
      title: goalData.title,
      description: goalData.description,
      status: 'active',
      priority: goalData.priority || 'medium',
      progress: 0,
      category: goalData.category || 'general',
      created_at: new Date().toISOString(),
    };

    console.log('🎯 MONGO SERVICE DEBUG: Creating goal with data:', goalData);
    console.log('🎯 MONGO SERVICE DEBUG: Generated goal document:', goalDoc);
    console.log('🎯 MONGO SERVICE DEBUG: Using mock service:', this.useMockService);

    try {
      const result = await this.makeRequest('insertOne', {
        collection: 'goals',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: goalDoc,
      });
      
      console.log('✅ MONGO SERVICE DEBUG: Goal creation result:', result);
      console.log('✅ MONGO SERVICE DEBUG: Created goal:', goalData.title);
      
      // Verify the goal was actually stored
      if (this.useMockService) {
        const verifyResult = await this.mockService.findOne('goals', { _id: goalId });
        console.log('🔍 MONGO SERVICE DEBUG: Mock verification result:', verifyResult);
      }
      
      return goalDoc;
    } catch (error) {
      console.error('❌ MONGO SERVICE DEBUG: Error creating goal:', error);
      console.error('❌ MONGO SERVICE DEBUG: Goal data that failed:', goalData);
      console.error('❌ MONGO SERVICE DEBUG: Goal document that failed:', goalDoc);
      throw error;
    }
  }

  async getUserGoals(userId: string) {
    console.log('🔍 MONGO SERVICE DEBUG: Getting goals for user:', userId);
    console.log('🔍 MONGO SERVICE DEBUG: Using mock service:', this.useMockService);
    
    try {
      const result = await this.makeRequest('find', {
        collection: 'goals',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { user_id: userId },
        sort: { created_at: -1 },
      });
      
      const goals = result.documents || [];
      console.log('✅ MONGO SERVICE DEBUG: Retrieved goals count:', goals.length);
      console.log('✅ MONGO SERVICE DEBUG: Retrieved goals:', goals.map(g => ({ id: g._id, title: g.title, user_id: g.user_id })));
      
      if (this.useMockService) {
        console.log('🔍 MONGO SERVICE DEBUG: Mock localStorage content for goals:', 
          localStorage.getItem('swayami_mock_goals'));
      }
      
      return goals;
    } catch (error) {
      console.error('❌ MONGO SERVICE DEBUG: Error getting user goals:', error);
      console.error('❌ MONGO SERVICE DEBUG: User ID that failed:', userId);
      return [];
    }
  }

  async updateGoalProgress(goalId: string, progress: number) {
    try {
      await this.makeRequest('updateOne', {
        collection: 'goals',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { _id: goalId },
        update: { $set: { progress } },
      });
      return true;
    } catch (error) {
      console.error('❌ MongoDB: Error updating goal progress:', error);
      return false;
    }
  }

  // TASK OPERATIONS
  async createTask(taskData: {
    user_id: string;
    goal_id: string;
    title: string;
    description?: string;
    priority?: string;
    status?: string;
  }) {
    const taskId = crypto.randomUUID();
    const taskDoc = {
      _id: taskId,
      user_id: taskData.user_id,
      goal_id: taskData.goal_id,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      created_at: new Date().toISOString(),
    };

    try {
      await this.makeRequest('insertOne', {
        collection: 'tasks',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: taskDoc,
      });
      console.log('✅ MongoDB: Created task:', taskData.title);
      return taskDoc;
    } catch (error) {
      console.error('❌ MongoDB: Error creating task:', error);
      throw error;
    }
  }

  async getUserTasks(userId: string, status?: string) {
    try {
      const filter: any = { user_id: userId };
      if (status) filter.status = status;

      const result = await this.makeRequest('find', {
        collection: 'tasks',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter,
        sort: { created_at: -1 },
      });
      return result.documents || [];
    } catch (error) {
      console.error('❌ MongoDB: Error getting user tasks:', error);
      return [];
    }
  }

  async updateTaskStatus(taskId: string, status: string) {
    try {
      await this.makeRequest('updateOne', {
        collection: 'tasks',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { _id: taskId },
        update: { $set: { status } },
      });
      return true;
    } catch (error) {
      console.error('❌ MongoDB: Error updating task status:', error);
      return false;
    }
  }

  async deleteTask(taskId: string) {
    try {
      await this.makeRequest('deleteOne', {
        collection: 'tasks',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { _id: taskId },
      });
      return true;
    } catch (error) {
      console.error('❌ MongoDB: Error deleting task:', error);
      return false;
    }
  }

  // JOURNAL OPERATIONS
  async createJournalEntry(entryData: {
    user_id: string;
    content: string;
    mood_score?: number;
  }) {
    const entryId = crypto.randomUUID();
    const entryDoc = {
      _id: entryId,
      user_id: entryData.user_id,
      content: entryData.content,
      mood_score: entryData.mood_score,
      summary: entryData.content.length > 100 
        ? entryData.content.substring(0, 100) + '...' 
        : entryData.content,
      created_at: new Date().toISOString(),
    };

    try {
      await this.makeRequest('insertOne', {
        collection: 'journal_entries',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: entryDoc,
      });
      console.log('✅ MongoDB: Created journal entry');
      return entryDoc;
    } catch (error) {
      console.error('❌ MongoDB: Error creating journal entry:', error);
      throw error;
    }
  }

  async getUserJournalEntries(userId: string, limit = 10) {
    try {
      const result = await this.makeRequest('find', {
        collection: 'journal_entries',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { user_id: userId },
        sort: { created_at: -1 },
        limit,
      });
      return result.documents || [];
    } catch (error) {
      console.error('❌ MongoDB: Error getting journal entries:', error);
      return [];
    }
  }

  // HABITS OPERATIONS
  async createHabit(habitData: {
    user_id: string;
    emoji: string;
    label: string;
  }) {
    const habitId = crypto.randomUUID();
    const habitDoc = {
      _id: habitId,
      user_id: habitData.user_id,
      emoji: habitData.emoji,
      label: habitData.label,
      completed: false,
      created_at: new Date().toISOString(),
    };

    try {
      await this.makeRequest('insertOne', {
        collection: 'habits',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        document: habitDoc,
      });
      console.log('✅ MongoDB: Created habit:', habitData.label);
      return habitDoc;
    } catch (error) {
      console.error('❌ MongoDB: Error creating habit:', error);
      throw error;
    }
  }

  async getUserHabits(userId: string) {
    try {
      const result = await this.makeRequest('find', {
        collection: 'habits',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { user_id: userId },
        sort: { created_at: -1 },
      });
      return result.documents || [];
    } catch (error) {
      console.error('❌ MongoDB: Error getting user habits:', error);
      return [];
    }
  }

  async toggleHabit(habitId: string, completed: boolean) {
    try {
      await this.makeRequest('updateOne', {
        collection: 'habits',
        database: DATABASE,
        dataSource: DATA_SOURCE,
        filter: { _id: habitId },
        update: { $set: { completed } },
      });
      return true;
    } catch (error) {
      console.error('❌ MongoDB: Error toggling habit:', error);
      return false;
    }
  }
}

export const mongoService = new MongoService(); 