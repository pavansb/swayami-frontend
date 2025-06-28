import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Goal {
  id: string;
  type: string;
  description: string;
  status: 'active' | 'completed' | 'stalled';
}

interface Task {
  id: string;
  title: string;
  linkedGoal?: string;
  date: string;
  isCompleted: boolean;
  isRecommended?: boolean;
}

interface JournalEntry {
  id: string;
  mood: string;
  text: string;
  extractedTasks: string[];
  createdAt: string;
  summary?: string;
  moodAnalysis?: string;
}

interface User {
  email?: string;
  isLoggedIn: boolean;
  hasCompletedOnboarding: boolean;
  streak: number;
  level: string;
}

interface AppContextType {
  user: User;
  goals: Goal[];
  tasks: Task[];
  journalEntries: JournalEntry[];
  habits: Array<{ id: string; emoji: string; label: string; completed: boolean }>;
  login: (email: string) => void;
  loginWithToken: (userData: { id: string; email: string; name?: string }) => void;
  logout: () => void;
  completeOnboarding: (selectedGoals: { type: string; description: string }[]) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  editTask: (taskId: string, newTitle: string) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  updateJournalEntry: (entryId: string, updates: Partial<JournalEntry>) => void;
  toggleHabit: (habitId: string) => void;
  regenerateRecommendations: () => void;
  resetAllData: () => void;
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
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('swayami_user');
    return saved ? JSON.parse(saved) : {
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      streak: 0,
      level: 'Mindful Novice',
    };
  });
  
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('swayami_goals');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('swayami_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('swayami_journal');
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('swayami_habits');
    return saved ? JSON.parse(saved) : [
      { id: '1', emoji: '💧', label: 'Drink Water', completed: false },
      { id: '2', emoji: '🏃', label: 'Exercise', completed: false },
      { id: '3', emoji: '📚', label: 'Read', completed: false },
    ];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('swayami_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('swayami_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('swayami_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('swayami_journal', JSON.stringify(journalEntries));
  }, [journalEntries]);

  useEffect(() => {
    localStorage.setItem('swayami_habits', JSON.stringify(habits));
  }, [habits]);

  const login = (email: string) => {
    setUser({
      email,
      isLoggedIn: true,
      hasCompletedOnboarding: false,
      streak: 0,
      level: 'Mindful Novice',
    });
  };

  const loginWithToken = (userData: { id: string; email: string; name?: string }) => {
    setUser({
      email: userData.email,
      isLoggedIn: true,
      hasCompletedOnboarding: false,
      streak: 0,
      level: 'Mindful Novice',
    });
  };

  const logout = () => {
    setUser({
      isLoggedIn: false,
      hasCompletedOnboarding: false,
      streak: 0,
      level: 'Mindful Novice',
    });
    localStorage.removeItem('swayami_user');
    localStorage.removeItem('swayami_goals');
    localStorage.removeItem('swayami_tasks');
    localStorage.removeItem('swayami_journal');
    localStorage.removeItem('swayami_habits');
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
      suggestions.forEach((suggestion, taskIndex) => {
        tasks.push({
          id: `task-${goalIndex}-${taskIndex}`,
          title: suggestion,
          linkedGoal: goal.id,
          date: today,
          isCompleted: false,
          isRecommended: true,
        });
      });
    });

    return tasks;
  };

  const regenerateRecommendations = () => {
    const aiTasks = generateTasksFromGoals(goals);
    const today = new Date().toISOString().split('T')[0];
    
    // Remove old recommendations and add new ones
    setTasks(prev => [
      ...prev.filter(task => !task.isRecommended || task.date !== today),
      ...aiTasks
    ]);
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

  const editTask = (taskId: string, newTitle: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId 
          ? { ...task, title: newTitle }
          : task
      )
    );
  };

  const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => {
    const newEntry = {
      ...entry,
      id: `journal-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setJournalEntries(prev => [...prev, newEntry]);
    
    // Update streak
    setUser(prev => ({ ...prev, streak: prev.streak + 1 }));
  };

  const updateJournalEntry = (entryId: string, updates: Partial<JournalEntry>) => {
    setJournalEntries(prev => 
      prev.map(entry => 
        entry.id === entryId 
          ? { ...entry, ...updates }
          : entry
      )
    );
  };

  const toggleHabit = (habitId: string) => {
    setHabits(prev => 
      prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, completed: !habit.completed }
          : habit
      )
    );
  };

  const resetAllData = () => {
    // Clear all localStorage data
    localStorage.removeItem('swayami_user');
    localStorage.removeItem('swayami_goals');
    localStorage.removeItem('swayami_tasks');
    localStorage.removeItem('swayami_journal');
    localStorage.removeItem('swayami_habits');
    
    // Reset all state to initial values
    setUser({
      isLoggedIn: true,
      hasCompletedOnboarding: false,
      streak: 0,
      level: 'Mindful Novice',
    });
    setGoals([]);
    setTasks([]);
    setJournalEntries([]);
    setHabits([
      { id: '1', emoji: '💧', label: 'Drink Water', completed: false },
      { id: '2', emoji: '🏃', label: 'Exercise', completed: false },
      { id: '3', emoji: '📚', label: 'Read', completed: false },
    ]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        goals,
        tasks,
        journalEntries,
        habits,
        login,
        loginWithToken,
        logout,
        completeOnboarding,
        addTask,
        toggleTask,
        deleteTask,
        editTask,
        addJournalEntry,
        updateJournalEntry,
        toggleHabit,
        regenerateRecommendations,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
