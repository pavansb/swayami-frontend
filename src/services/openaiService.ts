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
}

export const openaiService = new OpenAIService();
export type { TaskSuggestion, TaskGenerationResponse, JournalAnalysisResponse }; 