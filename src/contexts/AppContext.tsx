
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Goal {
  id: string;
  type: string;
  description: string;
  status: 'active' | 'completed';
}

interface Task {
  id: string;
  title: string;
  linkedGoal?: string;
  date: string;
  isCompleted: boolean;
}

interface JournalEntry {
  id: string;
  mood: string;
  text: string;
  extractedTasks: string[];
  createdAt: string;
}

interface User {
  email?: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
}

interface AppContextType {
  user: User;
  goals: Goal[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  login: (email: string) => void;
  completeOnboarding: (selectedGoals: { type: string; description: string }[]) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>({
    isLoggedIn: false,
    hasCompletedOnboarding: false,
  });
  
  const [goals, setGoals] = useState<Goal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  const login = (email: string) => {
    setUser({
      email,
      isLoggedIn: true,
      hasCompletedOnboarding: false,
    });
  };

  const completeOnboarding = (selectedGoals: { type: string; description: string }[]) => {
    const newGoals = selectedGoals.map((goal, index) => ({
      id: `goal-${index}`,
      type: goal.type,
      description: goal.description,
      status: 'active' as const,
    }));
    
    setGoals(newGoals);
    setUser(prev => ({ ...prev, hasCompletedOnboarding: true }));
    
    // Generate AI-recommended tasks based on goals
    const aiTasks = generateTasksFromGoals(newGoals);
    setTasks(aiTasks);
  };

  const generateTasksFromGoals = (goals: Goal[]): Task[] => {
    const taskSuggestions: Record<string, string[]> = {
      'Personal Wellbeing': ['Meditate for 10 minutes', 'Take a 20-minute walk', 'Practice gratitude journaling'],
      'Health / Fitness': ['Complete 30-minute workout', 'Drink 8 glasses of water', 'Prepare healthy meal'],
      'Financial Discipline': ['Review monthly budget', 'Track daily expenses', 'Research investment options'],
      'Career Growth': ['Update LinkedIn profile', 'Read industry article', 'Network with one professional'],
      'Side Hustle': ['Work on project for 1 hour', 'Research market opportunities', 'Update business plan'],
      'Mental Clarity': ['Practice deep breathing', 'Organize workspace', 'Plan tomorrow\'s priorities'],
    };

    const tasks: Task[] = [];
    const today = new Date().toISOString().split('T')[0];

    goals.forEach((goal, goalIndex) => {
      const suggestions = taskSuggestions[goal.type] || ['Work on your goal'];
      suggestions.slice(0, 2).forEach((suggestion, taskIndex) => {
        tasks.push({
          id: `task-${goalIndex}-${taskIndex}`,
          title: suggestion,
          linkedGoal: goal.id,
          date: today,
          isCompleted: false,
        });
      });
    });

    return tasks;
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, isCompleted: !task.isCompleted }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJournalEntries(prev => [...prev, newEntry]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        goals,
        tasks,
        journalEntries,
        login,
        completeOnboarding,
        addTask,
        toggleTask,
        deleteTask,
        addJournalEntry,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
