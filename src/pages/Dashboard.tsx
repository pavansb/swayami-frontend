import React, { useState, useEffect } from 'react';
import { useApp } from '@/contexts/AppContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, Clock, ArrowRight, Filter, TrendingUp, Lightbulb, Plus, Calendar, Sparkles, Edit, Trash2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { tasks, goals, habits, addTask, toggleTask, deleteTask, editTask, toggleHabit, regenerateRecommendations, journalEntries, user } = useApp();
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks; // All tasks for now since we don't have date filtering
  
  // Group tasks by goal
  const tasksByGoal = goals.reduce((acc, goal) => {
    acc[goal.title] = todaysTasks.filter(task => task.goal_id === goal._id);
    return acc;
  }, {} as Record<string, typeof todaysTasks>);

  // Add ungrouped tasks
  const ungroupedTasks = todaysTasks.filter(task => !task.goal_id);
  if (ungroupedTasks.length > 0) {
    tasksByGoal['General'] = ungroupedTasks;
  }

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

  const completedTasks = todaysTasks.filter(task => task.status === 'completed').length;
  const totalTasks = todaysTasks.length;
  const completedHabits = habits.filter(habit => habit.completed).length;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const lastJournalEntry = journalEntries[journalEntries.length - 1];

  // Daily motivation quotes
  const motivationQuotes = [
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It is during our darkest moments that we must focus to see the light. - Aristotle",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis"
  ];
  
  const [currentQuote, setCurrentQuote] = useState(0);

  const rotateQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % motivationQuotes.length);
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
                  className="border-[#9650D4] text-[#9650D4] hover:bg-purple-50 text-xs sm:text-sm"
                >
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Regenerate Suggestions
                </Button>
              </div>
              
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
                          onCheckedChange={() => toggleTask(task._id)}
                          className="flex-shrink-0"
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
                                  : 'text-gray-900'
                              }`}
                            >
                              {task.title}
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
                      className="bg-[#9650D4] hover:bg-[#8547C4] h-10 px-4 flex-shrink-0"
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
                      stroke="#9650D4"
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
                      stroke="#9650D4"
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
                    <div className="text-xl sm:text-2xl font-bold text-[#9650D4]">{completedTasks}/{totalTasks}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Tasks Completed</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="text-xl sm:text-2xl font-bold text-[#9650D4]">{user?.streak || 0} 🔥</div>
                    <div className="text-xs sm:text-sm text-gray-600">Day Streak</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
                    <div className="text-base sm:text-lg font-bold text-[#9650D4]">{user?.level || 'Mindful Novice'}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Current Rank</div>
                  </div>
                </div>

                {completionPercentage < 100 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <p className="font-medium text-[#9650D4] text-sm sm:text-base">
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
                className="w-full bg-[#9650D4] hover:bg-[#8547C4] mb-4 sm:mb-6 h-12 text-sm sm:text-base font-semibold"
              >
                Write a New Reflection
              </Button>

              {/* Daily Motivation Quote */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
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
                <p className="text-xs sm:text-sm text-gray-700 italic leading-relaxed">
                  {motivationQuotes[currentQuote]}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
