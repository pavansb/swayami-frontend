
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { Trash2, Edit, Plus, Sparkles, ChevronDown, ChevronRight, Archive, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const Dashboard = () => {
  const { tasks, goals, habits, addTask, toggleTask, deleteTask, editTask, toggleHabit, regenerateRecommendations, journalEntries, user } = useApp();
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [goalsExpanded, setGoalsExpanded] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(task => task.date === today);
  
  // Group tasks by goal
  const tasksByGoal = goals.reduce((acc, goal) => {
    acc[goal.type] = todaysTasks.filter(task => task.linkedGoal === goal.id);
    return acc;
  }, {} as Record<string, typeof todaysTasks>);

  // Add ungrouped tasks
  const ungroupedTasks = todaysTasks.filter(task => !task.linkedGoal);
  if (ungroupedTasks.length > 0) {
    tasksByGoal['General'] = ungroupedTasks;
  }

  const handleAddTask = (goalType: string) => {
    const title = newTaskTitles[goalType];
    if (title?.trim()) {
      const linkedGoal = goals.find(g => g.type === goalType)?.id;
      addTask({
        title,
        date: today,
        isCompleted: false,
        linkedGoal,
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
      editTask(editingTask, editTitle);
      setEditingTask(null);
      setEditTitle('');
    }
  };

  const completedTasks = todaysTasks.filter(task => task.isCompleted).length;
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
      <div className="space-y-6">
        {/* My Goals Section */}
        <Collapsible open={goalsExpanded} onOpenChange={setGoalsExpanded}>
          <div className="swayami-card">
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="text-xl font-semibold text-swayami-black dark:text-white">
                My Goals
              </h3>
              {goalsExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="mt-4">
              {goals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-swayami-light-text dark:text-gray-400 mb-4">
                    No goals yet. Complete onboarding to set your goals.
                  </p>
                  <Button 
                    onClick={() => navigate('/onboarding')}
                    className="bg-swayami-primary hover:bg-swayami-primary-hover"
                  >
                    Set Your Goals
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goals.map((goal) => {
                    const goalTasks = tasks.filter(task => task.linkedGoal === goal.id);
                    const completedGoalTasks = goalTasks.filter(task => task.isCompleted);
                    const progress = goalTasks.length > 0 ? (completedGoalTasks.length / goalTasks.length) * 100 : 0;
                    
                    return (
                      <div key={goal.id} className="border border-swayami-border dark:border-gray-700 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-swayami-black dark:text-white">{goal.type}</h4>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Archive className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-swayami-light-text dark:text-gray-400 mb-3">
                          {goal.description || 'No description provided'}
                        </p>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-swayami-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-swayami-light-text dark:text-gray-400">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        <div className={`text-xs mt-2 px-2 py-1 rounded-full inline-block ${
                          goal.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 
                          goal.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                        }`}>
                          {goal.status}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Tabbed Dashboard */}
        <div className="swayami-card">
          <Tabs defaultValue="plan" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="plan">PLAN</TabsTrigger>
              <TabsTrigger value="progress">PROGRESS</TabsTrigger>
              <TabsTrigger value="reflect">REFLECT</TabsTrigger>
            </TabsList>

            {/* PLAN Tab */}
            <TabsContent value="plan" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-swayami-black dark:text-white mb-2">
                  Today's Plan, Rooted in Your Intentions
                </h2>
                <p className="text-swayami-light-text dark:text-gray-400">
                  Focus on what matters most today
                </p>
              </div>

              <div className="flex justify-end mb-6">
                <Button
                  onClick={regenerateRecommendations}
                  variant="outline"
                  size="sm"
                  className="border-swayami-primary text-swayami-primary hover:bg-purple-50 dark:hover:bg-purple-900"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Regenerate Suggestions
                </Button>
              </div>
              
              {Object.entries(tasksByGoal).map(([goalType, goalTasks]) => (
                <div key={goalType} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🎯</span>
                    <h3 className="text-xl font-semibold text-swayami-black dark:text-white">{goalType}</h3>
                  </div>
                  
                  <div className="space-y-3 mb-4">
                    {goalTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center space-x-3 p-4 rounded-lg border border-swayami-border dark:border-gray-700 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                      >
                        <Checkbox
                          checked={task.isCompleted}
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        
                        {editingTask === task.id ? (
                          <div className="flex-1 flex space-x-2">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && saveEditTask()}
                              className="flex-1"
                            />
                            <Button size="sm" onClick={saveEditTask}>Save</Button>
                          </div>
                        ) : (
                          <>
                            <span 
                              className={`flex-1 ${
                                task.isCompleted 
                                  ? 'line-through text-swayami-light-text dark:text-gray-400' 
                                  : 'text-swayami-black dark:text-white'
                              }`}
                            >
                              {task.title}
                              {task.isRecommended && (
                                <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-swayami-primary dark:text-purple-300 px-2 py-1 rounded-full">
                                  Recommended
                                </span>
                              )}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTask(task.id, task.title)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteTask(task.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <Input
                      placeholder={`Add task to ${goalType}...`}
                      value={newTaskTitles[goalType] || ''}
                      onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [goalType]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask(goalType)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleAddTask(goalType)} className="bg-swayami-primary hover:bg-swayami-primary-hover">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            {/* PROGRESS Tab */}
            <TabsContent value="progress" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-swayami-black dark:text-white mb-2">
                  Track What You're Becoming
                </h2>
                <p className="text-swayami-light-text dark:text-gray-400">
                  Every step forward counts
                </p>
              </div>

              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#E5E5E5"
                      strokeWidth="12"
                      fill="none"
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
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-swayami-black dark:text-white">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-swayami-primary">{completedTasks}/{totalTasks}</div>
                    <div className="text-sm text-swayami-light-text dark:text-gray-400">Tasks Completed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-swayami-primary">{user.streak} 🔥</div>
                    <div className="text-sm text-swayami-light-text dark:text-gray-400">Day Streak</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-lg font-bold text-swayami-primary">{user.level}</div>
                    <div className="text-sm text-swayami-light-text dark:text-gray-400">Current Rank</div>
                  </div>
                </div>

                {completionPercentage < 100 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-4 mb-6">
                    <p className="font-medium text-swayami-primary dark:text-purple-300">
                      Finish Strong Today 💪
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-swayami-black dark:text-white mb-4">Daily Habits</h3>
                <div className="space-y-3">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center space-x-3 p-3 rounded-lg border border-swayami-border dark:border-gray-700 bg-white dark:bg-gray-800">
                      <Checkbox
                        checked={habit.completed}
                        onCheckedChange={() => toggleHabit(habit.id)}
                      />
                      <span className="text-xl">{habit.emoji}</span>
                      <span 
                        className={`flex-1 ${
                          habit.completed 
                            ? 'line-through text-swayami-light-text dark:text-gray-400' 
                            : 'text-swayami-black dark:text-white'
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
            <TabsContent value="reflect" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-swayami-black dark:text-white mb-2">
                  Pause. Write. Understand.
                </h2>
                <p className="text-swayami-light-text dark:text-gray-400">
                  Transform your thoughts into clarity
                </p>
              </div>
              
              {lastJournalEntry ? (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-swayami-light-text dark:text-gray-400">Last mood:</span>
                    <span className="font-medium dark:text-white">{lastJournalEntry.mood}</span>
                  </div>
                  <p className="text-sm text-swayami-light-text dark:text-gray-400 line-clamp-2">
                    {lastJournalEntry.text.slice(0, 100)}...
                  </p>
                </div>
              ) : (
                <p className="text-center text-swayami-light-text dark:text-gray-400 mb-6">
                  No reflections yet. Start your mindfulness journey!
                </p>
              )}
              
              <Button 
                onClick={() => navigate('/mindspace')}
                className="w-full bg-swayami-primary hover:bg-swayami-primary-hover mb-6"
              >
                Write a New Reflection
              </Button>

              {/* Daily Motivation Quote */}
              <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/50 dark:to-pink-900/50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-swayami-black dark:text-white">Daily Motivation</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={rotateQuote}
                    className="text-swayami-primary hover:bg-purple-100 dark:hover:bg-purple-800"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-swayami-light-text dark:text-gray-300 italic leading-relaxed">
                  {motivationQuotes[currentQuote]}
                </p>
              </div>
              
              <div className="pt-6 border-t border-swayami-border dark:border-gray-700">
                <p className="text-sm text-swayami-light-text dark:text-gray-400 text-center italic">
                  "You're 1 reflection away from your next breakthrough."
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
