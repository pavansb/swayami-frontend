interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: number; // in minutes
}

interface TaskGenerationResponse {
  tasks: TaskSuggestion[];
  goalAnalysis: string;
}

interface JournalAnalysisResponse {
  summary: string;
  mood: number; // 1-5 scale
  insights: string[];
  recommendations: string[];
}

interface DailyTask {
  day: string; // e.g., "Monday", "Day 1", etc.
  tasks: {
    title: string;
    description: string;
    estimatedDuration: number; // in minutes
    priority: 'low' | 'medium' | 'high';
  }[];
}

interface DailyBreakdownResponse {
  weeklyPlan: DailyTask[];
  totalDuration: number; // total estimated minutes for the week
  tips: string[];
}

class OpenAIService {
  private baseURL = 'https://api.openai.com/v1';
  private apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  constructor() {
    console.log('OpenAI Service initialized. API Key configured:', !!this.apiKey, 'Key length:', this.apiKey?.length);
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured. Using fallback responses.');
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    return response.json();
  }

  async generateTasksFromGoal(goalTitle: string, goalDescription: string): Promise<TaskGenerationResponse> {
    const prompt = `You are a personal productivity assistant helping someone achieve their goals. 

Goal: ${goalTitle}
Description: ${goalDescription}

Generate 5 specific, actionable tasks that will help them achieve this goal. Each task should be:
- Concrete and measurable
- Achievable within 1-7 days
- Progressive towards the larger goal
- Include estimated time duration

Also provide a brief analysis of their goal.

Respond in this exact JSON format:
{
  "tasks": [
    {
      "title": "Task title (max 50 chars)",
      "description": "Detailed description with specific steps",
      "priority": "low|medium|high",
      "estimatedDuration": 60
    }
  ],
  "goalAnalysis": "Brief analysis of their goal and approach"
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful productivity assistant. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        // Fallback response
        return {
          tasks: [
            {
              title: `Work on ${goalTitle}`,
              description: goalDescription || 'Focus on achieving this goal',
              priority: 'medium' as const,
              estimatedDuration: 60
            }
          ],
          goalAnalysis: 'This goal requires focused effort and consistent action.'
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback response
      return {
        tasks: [
          {
            title: `Work on ${goalTitle}`,
            description: goalDescription || 'Focus on achieving this goal',
            priority: 'medium' as const,
            estimatedDuration: 60
          }
        ],
        goalAnalysis: 'This goal requires focused effort and consistent action.'
      };
    }
  }

  async analyzeJournal(content: string): Promise<JournalAnalysisResponse> {
    const prompt = `Analyze this journal entry and provide insights:

"${content}"

Provide:
1. A brief summary (max 100 words)
2. Mood score (1-5, where 1=very negative, 5=very positive)
3. Key insights about their mental state/progress
4. Actionable recommendations

Respond in this exact JSON format:
{
  "summary": "Brief summary of the entry",
  "mood": 3,
  "insights": ["Insight 1", "Insight 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful journal analysis assistant. Always respond with valid JSON.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const responseContent = response.choices[0]?.message?.content;
      if (!responseContent) {
        throw new Error('No response from OpenAI');
      }

      try {
        return JSON.parse(responseContent);
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', responseContent);
        // Fallback response
        return {
          summary: 'Journal entry recorded successfully.',
          mood: 3,
          insights: ['Reflection is valuable for personal growth'],
          recommendations: ['Continue journaling regularly']
        };
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fallback response
      return {
        summary: 'Journal entry recorded successfully.',
        mood: 3,
        insights: ['Reflection is valuable for personal growth'],
        recommendations: ['Continue journaling regularly']
      };
    }
  }

  async generateMotivationalMessage(goalTitle: string, recentProgress: string): Promise<string> {
    const prompt = `Generate a motivational message for someone working on: ${goalTitle}

Their recent progress: ${recentProgress}

Create an encouraging, personalized message (max 50 words) that acknowledges their effort and motivates them to continue.`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a supportive coach providing brief, encouraging messages.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 100,
      });

      return response.choices[0]?.message?.content || 'Keep up the great work! Every step forward counts.';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return 'Keep up the great work! Every step forward counts.';
    }
  }

  async generateDailyBreakdown(tasks: TaskSuggestion[], goalTitle: string, goalDescription: string, timeframe: string = '7 days'): Promise<any> {
    const taskList = tasks.map(task => `- ${task.title}: ${task.description} (${task.priority} priority, ${task.estimatedDuration || 60} min)`).join('\n');
    
    const prompt = `You are a productivity expert helping someone break down their tasks into a manageable daily schedule.

Goal: ${goalTitle}
Description: ${goalDescription}
Timeframe: ${timeframe}

Tasks to break down:
${taskList}

Create a detailed daily action plan that:
1. Spreads these tasks across ${timeframe}
2. Considers weekdays vs weekends
3. Balances workload daily
4. Includes specific actionable sub-tasks
5. Accounts for the user's goal context (e.g., weight loss = meal prep on Sunday, cardio on weekdays)

Respond in this exact JSON format:
{
  "weeklyPlan": [
    {
      "day": "Monday",
      "tasks": [
        {
          "title": "Specific daily task",
          "description": "Detailed steps for this day",
          "estimatedDuration": 30,
          "priority": "medium"
        }
      ]
    }
  ],
  "totalDuration": 420,
  "tips": ["Helpful tip 1", "Helpful tip 2", "Helpful tip 3"]
}`;

    try {
      const response = await this.makeRequest('/chat/completions', {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a productivity expert. Always respond with valid JSON that breaks down tasks into manageable daily steps.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      try {
        const parsed = JSON.parse(content);
        console.log('✅ Daily breakdown generated successfully:', parsed);
        return parsed;
      } catch (parseError) {
        console.error('Failed to parse OpenAI daily breakdown response:', content);
        // Fallback response
        return {
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
        };
      }
    } catch (error) {
      console.error('OpenAI API error for daily breakdown:', error);
      // Fallback response
      return {
        weeklyPlan: [
          {
            day: "Monday", 
            tasks: [
              {
                title: "Work on your goal",
                description: "Focus on achieving your goal step by step",
                estimatedDuration: 60,
                priority: "medium"
              }
            ]
          }
        ],
        totalDuration: 420,
        tips: ["Stay consistent", "Track your progress", "Be patient with yourself"]
      };
    }
  }
}

export const openaiService = new OpenAIService();
export type { TaskSuggestion, TaskGenerationResponse, JournalAnalysisResponse }; 