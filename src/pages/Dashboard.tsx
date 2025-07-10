import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Clock, ArrowRight, Filter, TrendingUp, Lightbulb, Plus, Calendar, Sparkles, Edit, Trash2, RefreshCw, CheckCircle2, Heart, DollarSign, Briefcase, GraduationCap, Home, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface DailyTask {
  id: string;
  title: string;
  description: string;
  goalCategory: string;
  goalTitle: string;
  completed: boolean;
  estimatedDuration: string;
  priority: 'high' | 'medium' | 'low';
  day: string;
}

const Dashboard = () => {
  const { tasks, goals, habits, addTask, toggleTask, deleteTask, editTask, toggleHabit, regenerateRecommendations, journalEntries, user, quotes } = useApp();
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>([]);
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  // Mock daily breakdown tasks - in real app this would come from the AI breakdown
  const mockDailyTasks: DailyTask[] = [
    {
      id: 'dt-1',
      title: 'Morning 20-minute walk',
      description: 'Start your day with a brisk walk around the neighborhood',
      goalCategory: 'Health & Fitness',
      goalTitle: 'Lose 15 pounds in 3 months',
      completed: false,
      estimatedDuration: '20 min',
      priority: 'high',
      day: 'today'
    },
    {
      id: 'dt-2', 
      title: 'Track daily calories in app',
      description: 'Log all meals and snacks to stay within calorie goal',
      goalCategory: 'Health & Fitness',
      goalTitle: 'Lose 15 pounds in 3 months',
      completed: true,
      estimatedDuration: '10 min',
      priority: 'high',
      day: 'today'
    },
    {
      id: 'dt-3',
      title: 'Review weekly budget',
      description: 'Check expenses vs budget and adjust spending plan',
      goalCategory: 'Financial',
      goalTitle: 'Save $5000 for emergency fund',
      completed: false,
      estimatedDuration: '15 min',
      priority: 'medium',
      day: 'today'
    },
    {
      id: 'dt-4',
      title: 'Transfer $100 to savings',
      description: 'Weekly automated savings transfer',
      goalCategory: 'Financial',
      goalTitle: 'Save $5000 for emergency fund',
      completed: false,
      estimatedDuration: '5 min',
      priority: 'high',
      day: 'today'
    },
    {
      id: 'dt-5',
      title: 'Study JavaScript for 1 hour',
      description: 'Continue with React components tutorial',
      goalCategory: 'Career & Education',
      goalTitle: 'Learn web development',
      completed: false,
      estimatedDuration: '60 min',
      priority: 'medium',
      day: 'today'
    }
  ];

  useEffect(() => {
    setDailyTasks(mockDailyTasks);
  }, []);

  const toggleDailyTask = (taskId: string) => {
    setDailyTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health & fitness':
        return <Heart className="w-4 h-4" />;
      case 'financial':
        return <DollarSign className="w-4 h-4" />;
      case 'career & education':
        return <GraduationCap className="w-4 h-4" />;
      case 'personal development':
        return <User className="w-4 h-4" />;
      case 'relationships':
        return <Heart className="w-4 h-4" />;
      case 'home & lifestyle':
        return <Home className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health & fitness':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'financial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'career & education':
        return 'bg-green-100 text-purple-800 border-green-200';
      case 'personal development':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'relationships':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'home & lifestyle':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  // Group daily tasks by category
  const tasksByCategory = dailyTasks.reduce((acc, task) => {
    if (!acc[task.goalCategory]) {
      acc[task.goalCategory] = [];
    }
    acc[task.goalCategory].push(task);
    return acc;
  }, {} as Record<string, DailyTask[]>);

  // Calculate daily tasks completion
  const completedDailyTasks = dailyTasks.filter(task => task.completed);
  const dailyCompletionRate = dailyTasks.length > 0 ? (completedDailyTasks.length / dailyTasks.length) * 100 : 0;

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks; // All tasks for now since we don't have date filtering
  
  // Only include picked goals (user-selected)
  const pickedGoals = goals.filter(g => g.status === 'active');
  const pickedGoalIds = pickedGoals.map(g => g._id);
  const pickedTasks = tasks.filter(task => pickedGoalIds.includes(task.goal_id));

  // Only keep:
  const tasksByGoal = pickedGoals.reduce((acc, goal) => {
    acc[goal.title] = pickedTasks.filter(task => task.goal_id === goal._id);
    return acc;
  }, {} as Record<string, typeof pickedTasks>);

  // Add ungrouped tasks
  const ungroupedTasks = todaysTasks.filter(task => !task.goal_id);
  if (ungroupedTasks.length > 0) {
    tasksByGoal['General'] = ungroupedTasks;
  }

  // Use pickedGoals.length for any goal count/statistics
  // When rendering goals, use pickedGoals.map instead of goals.map
  // Example for a goal summary:
  // <div>{pickedGoals.length} Picked Goals</div>

  // When rendering tasks by goal:
  // const tasksByGoal = pickedGoals.reduce((acc, goal) => {
  //   acc[goal.title] = pickedTasks.filter(task => task.goal_id === goal._id);
  //   return acc;
  // }, {} as Record<string, typeof pickedTasks>);

  const handleAddTask = (goalType: string) => {
    const title = newTaskTitles[goalType];
    if (title?.trim()) {
      const linkedGoal = goals.find(g => g.title === goalType)?._id;
      addTask({
        title,
        status: 'pending',
        goal_id: linkedGoal,
      });
      setNewTaskTitles(prev => ({ ...prev, [goalType]: '' }));
    }
  };

  const handleEditTask = (taskId: string, currentTitle: string) => {
    setEditingTask(taskId);
    setEditTitle(currentTitle);
  };

  const saveEditTask = () => {
    if (editingTask && editTitle.trim()) {
      editTask(editingTask, { title: editTitle });
      setEditingTask(null);
      setEditTitle('');
    }
  };

  // Helper function to check if a task can be completed (for sequential tasks)
  const canCompleteTask = (taskId: string): boolean => {
    const task = tasks.find(t => t._id === taskId);
    if (!task || !task.sequential || !task.goal_id) return true;
    
    // Get all tasks for the same goal, ordered by their order property
    const goalTasks = tasks
      .filter(t => t.goal_id === task.goal_id && t.sequential)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // Find the current task's position
    const currentTaskIndex = goalTasks.findIndex(t => t._id === taskId);
    if (currentTaskIndex === -1) return true;
    
    // Check if all previous tasks are completed
    for (let i = 0; i < currentTaskIndex; i++) {
      if (goalTasks[i].status !== 'completed') {
        return false;
      }
    }
    
    return true;
  };

  // Enhanced toggle task function with sequential logic
  const handleToggleTask = (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (!task) return;

    // Check if task can be completed (for sequential tasks)
    if (task.status !== 'completed' && !canCompleteTask(taskId)) {
      // You could show a toast here: "Complete previous tasks first"
      console.log('⚠️ Task cannot be completed yet - previous sequential tasks must be completed first');
      return;
    }

    toggleTask(taskId);
  };

  const completedTasks = todaysTasks.filter(task => task.status === 'completed').length;
  const totalTasks = todaysTasks.length;
  const completedHabits = habits.filter(habit => habit.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const lastJournalEntry = journalEntries[journalEntries.length - 1];

  // Remove hardcoded motivationQuotes array
  // const motivationQuotes = [ ... ];
  // Use dynamic quotes from context or API
  const [currentQuote, setCurrentQuote] = useState(0);

  const rotateQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % (quotes.length || 1));
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6 max-w-full">
        {/* Tabbed Dashboard */}
        <div className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <Tabs defaultValue="plan" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-12">
              <TabsTrigger value="plan" className="text-xs sm:text-sm font-semibold">PLAN</TabsTrigger>
              <TabsTrigger value="progress" className="text-xs sm:text-sm font-semibold">PROGRESS</TabsTrigger>
              <TabsTrigger value="reflect" className="text-xs sm:text-sm font-semibold">REFLECT</TabsTrigger>
            </TabsList>

            {/* PLAN Tab */}
            <TabsContent value="plan" className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Today's Plan, Rooted in Your Intentions
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Focus on what matters most today
                </p>
              </div>

              <div className="flex justify-end mb-4 sm:mb-6">
                <Button
                  onClick={regenerateRecommendations}
                  variant="outline"
                  size="sm"
                  className="border-[#6FCC7F] text-[#6FCC7F] hover:bg-green-50 text-xs sm:text-sm"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Regenerate Suggestions
                </Button>
              </div>

              {/* Today's Action Steps Section */}
              <>
                {pickedGoals.length === 0 ? (
                  <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-md font-semibold text-gray-600 mb-2">No goals yet. Pick a goal to get started!</h4>
                    <Button 
                      size="sm"
                      className="bg-[#6FCC7F] hover:bg-[#5bb96a]"
                      onClick={() => navigate('/goals')}
                    >
                      Pick a Goal
                    </Button>
                  </div>
                ) : pickedTasks.length === 0 ? (
                  <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                    <h4 className="text-md font-semibold text-gray-600 mb-2">No tasks yet. Add a task to begin!</h4>
                    <Button 
                      size="sm"
                      className="bg-[#6FCC7F] hover:bg-[#5bb96a]"
                      onClick={() => navigate('/goals')}
                    >
                      Add a Task
                    </Button>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <CheckCircle2 className="w-5 h-5 text-[#6FCC7F] mr-3" />
                        <h3 className="text-lg font-bold text-gray-900">Today's Action Steps</h3>
                      </div>
                      <div className="text-sm text-gray-600">
                        {pickedTasks.filter(t => t.status === 'completed').length}/{pickedTasks.length} completed
                      </div>
                    </div>

                    {/* Progress Bar for Daily Tasks */}
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[#6FCC7F] to-[#5bb96a] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${dailyCompletionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Tasks organized by category */}
                    {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
                      <div key={category} className="mb-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(category)}
                            <h4 className="text-md font-semibold text-gray-800">{category}</h4>
                          </div>
                          <Badge className={`text-xs ${getCategoryColor(category)}`}>
                            {categoryTasks.filter(task => task.completed).length}/{categoryTasks.length} done
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {categoryTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className={`p-3 rounded-lg border transition-all duration-300 ${
                                task.completed
                                  ? 'border-green-200 bg-green-50'
                                  : 'border-gray-200 bg-white hover:border-green-200'
                              }`}
                            >
                              <div className="flex items-start space-x-3">
                                <Checkbox
                                  checked={task.completed}
                                  onCheckedChange={() => toggleDailyTask(task.id)}
                                  className="mt-0.5"
                                />
                                
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h5 className={`font-medium text-sm ${
                                      task.completed ? 'text-green-700 line-through' : 'text-gray-900'
                                    }`}>
                                      {task.title}
                                    </h5>
                                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                                      {task.priority}
                                    </Badge>
                                  </div>
                                  
                                  <p className={`text-xs mb-1 ${
                                    task.completed ? 'text-green-600' : 'text-gray-600'
                                  }`}>
                                    {task.description}
                                  </p>
                                  
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">
                                      📋 {task.goalTitle}
                                    </span>
                                    <span className="text-gray-500">
                                      ⏱️ {task.estimatedDuration}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          {categoryTasks.length > 2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate('/progress')}
                              className="w-full text-xs text-[#6FCC7F] hover:text-[#5bb96a] hover:bg-green-50"
                            >
                              View {categoryTasks.length - 2} more {category} tasks →
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}

                    {dailyTasks.length === 0 && (
                      <div className="text-center py-6">
                        <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-md font-semibold text-gray-600 mb-2">No Daily Tasks Yet</h4>
                        <p className="text-gray-500 mb-3 text-sm">
                          Complete task generation to get AI-powered daily action steps for your goals.
                        </p>
                        <Button 
                          size="sm"
                          className="bg-[#6FCC7F] hover:bg-[#5bb96a]"
                          onClick={() => navigate('/task-generation')}
                        >
                          Generate Daily Tasks
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </>

              {Object.entries(tasksByGoal).map(([goalType, goalTasks]) => (
                <div key={goalType} className="bg-gray-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <div className="flex items-center mb-4">
                    <span className="text-xl sm:text-2xl mr-3">🎯</span>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{goalType}</h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {goalTasks.map((task) => (
                      <div 
                        key={task._id} 
                        className="flex items-center space-x-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow bg-white"
                      >
                        <Checkbox
                          checked={task.status === 'completed'}
                          onCheckedChange={() => handleToggleTask(task._id)}
                          className="flex-shrink-0"
                          disabled={task.sequential && !canCompleteTask(task._id) && task.status !== 'completed'}
                        />
                        
                        {editingTask === task._id ? (
                          <div className="flex-1 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveEditTask()}
                              className="flex-1 h-9"
                            />
                            <Button size="sm" onClick={saveEditTask} className="h-9 px-4">Save</Button>
                          </div>
                        ) : (
                          <>
                                                    <span 
                          className={`flex-1 text-sm sm:text-base ${
                            task.status === 'completed'
                              ? 'line-through text-gray-500' 
                              : task.sequential && !canCompleteTask(task._id)
                                ? 'text-gray-400'
                                : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                          {task.sequential && (
                            <span className="ml-2 text-xs text-gray-400">
                              {task.order ? `#${task.order}` : 'Sequential'}
                            </span>
                          )}
                        </span>
                            <div className="flex space-x-1 flex-shrink-0">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditTask(task._id, task.title)}
                                className="h-8 w-8 p-0"
                              >
                                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteTask(task._id)}
                                className="h-8 w-8 p-0"
                              >
                                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <Input
                      placeholder={`Add task to ${goalType}...`}
                      value={newTaskTitles[goalType] || ''}
                      onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [goalType]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask(goalType)}
                      className="flex-1 h-10"
                    />
                    <Button 
                      onClick={() => handleAddTask(goalType)} 
                      className="bg-[#6FCC7F] hover:bg-[#5bb96a] h-10 px-4 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4 sm:w-4 sm:h-4 sm:mr-2" />
                      <span className="hidden sm:inline">Add Task</span>
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* PROGRESS Tab */}
            <TabsContent value="progress" className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Track What You're Becoming
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Every step forward counts
                </p>
              </div>

              <div className="text-center mb-4 sm:mb-6">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 sm:mb-6">
                  <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#E5E5E5"
                      strokeWidth="8"
                      fill="none"
                      className="sm:hidden"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#6FCC7F"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - completionPercentage / 100)}`}
                      className="transition-all duration-500 sm:hidden"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E5E5"
                      strokeWidth="12"
                      fill="none"
                      className="hidden sm:block"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#6FCC7F"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - completionPercentage / 100)}`}
                      className="transition-all duration-500 hidden sm:block"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-[#6FCC7F]">{completedTasks}/{totalTasks}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-[#6FCC7F]">{user?.streak || 0} 🔥</div>
                    <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="text-base sm:text-lg font-bold text-[#6FCC7F]">{user?.level || 'Mindful Novice'}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Current Rank</div>
                  </div>
                </div>

                {completionPercentage < 100 && (
                  <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="font-medium text-[#6FCC7F] text-sm sm:text-base">
                      Finish Strong Today 💪
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4 text-base sm:text-lg">Daily Habits</h3>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div key={habit._id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white">
                      <Checkbox
                        checked={habit.completed}
                        onCheckedChange={() => toggleHabit(habit._id)}
                        className="flex-shrink-0"
                      />
                      <span className="text-lg sm:text-xl">{habit.emoji}</span>
                      <span 
                        className={`flex-1 text-sm sm:text-base ${
                          habit.completed 
                            ? 'line-through text-gray-500' 
                            : 'text-gray-900'
                        }`}
                      >
                        {habit.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* REFLECT Tab */}
            <TabsContent value="reflect" className="space-y-4 sm:space-y-6">
              <div className="text-center mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Pause. Write. Understand.
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Transform your thoughts into clarity
                </p>
              </div>
              
              {lastJournalEntry ? (
                <div className="mb-4 sm:mb-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs sm:text-sm text-gray-600">Last entry:</span>
                    <span className="font-medium text-gray-900 text-xs sm:text-sm">
                      {new Date(lastJournalEntry.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                    {lastJournalEntry.content.slice(0, 100)}...
                  </p>
                </div>
              ) : (
                <p className="text-center text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  No reflections yet. Start your mindfulness journey!
                </p>
              )}
              
              <Button 
                onClick={() => navigate('/mindspace')}
                className="w-full bg-[#6FCC7F] hover:bg-[#5bb96a] mb-4 sm:mb-6 h-12 text-sm sm:text-base font-semibold"
              >
                Write a New Reflection
              </Button>

              {/* Daily Motivation Quote */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-green-50 to-pink-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 text-sm sm:text-base">Daily Motivation</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={rotateQuote}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
                {quotes.length > 0 ? (
                  <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                    {quotes[currentQuote]}
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500 italic leading-relaxed">
                    No quotes yet. Add your first motivational quote!
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
