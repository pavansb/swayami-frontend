
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
                          goal.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          goal.status === 'active' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* PLAN Section */}
          <div className="lg:col-span-2">
            <div className="swayami-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-swayami-black dark:text-white">
                  PLAN
                </h3>
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
                <div key={goalType} className="mb-8">
                  <h4 className="font-semibold text-swayami-black dark:text-white mb-4">{goalType}</h4>
                  
                  <div className="space-y-3 mb-4">
                    {goalTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className="flex items-center space-x-3 p-3 rounded-lg border border-swayami-border dark:border-gray-700 hover:shadow-md transition-shadow"
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
                                  Recommended by AI
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
                      placeholder="Add a new task..."
                      value={newTaskTitles[goalType] || ''}
                      onChange={(e) => setNewTaskTitles(prev => ({ ...prev, [goalType]: e.target.value }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTask(goalType)}
                      className="flex-1"
                    />
                    <Button onClick={() => handleAddTask(goalType)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PROGRESS & REFLECT Sidebar */}
          <div className="space-y-6">
            
            {/* PROGRESS */}
            <div className="swayami-card">
              <h3 className="text-lg font-semibold text-swayami-black dark:text-white mb-4">
                PROGRESS
              </h3>
              
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#E5E5E5"
                      strokeWidth="8"
                      fill="none"
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
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold text-swayami-black dark:text-white">
                      {completionPercentage}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-swayami-light-text dark:text-gray-400">Tasks Completed:</span>
                    <span className="font-medium dark:text-white">{completedTasks}/{totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-swayami-light-text dark:text-gray-400">Habits Completed:</span>
                    <span className="font-medium dark:text-white">{completedHabits}/{habits.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-swayami-light-text dark:text-gray-400">Current Streak:</span>
                    <span className="font-medium dark:text-white">{user.streak} days 🔥</span>
                  </div>
                </div>

                {completionPercentage < 100 && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-lg p-3 mb-4">
                    <p className="text-sm font-medium text-swayami-primary dark:text-purple-300">
                      Finish Strong Today 💪
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium text-swayami-black dark:text-white mb-3">Daily Habits</h4>
                <div className="space-y-2">
                  {habits.map((habit) => (
                    <div key={habit.id} className="flex items-center space-x-3">
                      <Checkbox
                        checked={habit.completed}
                        onCheckedChange={() => toggleHabit(habit.id)}
                      />
                      <span className="text-lg">{habit.emoji}</span>
                      <span 
                        className={`flex-1 text-sm ${
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
            </div>

            {/* REFLECT */}
            <div className="swayami-card">
              <h3 className="text-lg font-semibold text-swayami-black dark:text-white mb-4">
                REFLECT
              </h3>
              
              {lastJournalEntry ? (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-swayami-light-text dark:text-gray-400">Last mood:</span>
                    <span className="text-sm font-medium dark:text-white">{lastJournalEntry.mood}</span>
                  </div>
                  <p className="text-sm text-swayami-light-text dark:text-gray-400 line-clamp-2">
                    {lastJournalEntry.text.slice(0, 100)}...
                  </p>
                </div>
              ) : (
                <p className="text-sm text-swayami-light-text dark:text-gray-400 mb-4">
                  No reflections yet. Start your mindfulness journey!
                </p>
              )}
              
              <Button 
                onClick={() => navigate('/mindspace')}
                className="w-full bg-swayami-primary hover:bg-swayami-primary-hover mb-4"
              >
                Write a New Reflection
              </Button>

              {/* Daily Motivation Quote */}
              <div className="border-t border-swayami-border dark:border-gray-700 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-swayami-black dark:text-white">Daily Motivation</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={rotateQuote}
                    className="text-swayami-primary hover:bg-purple-50 dark:hover:bg-purple-900"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-swayami-light-text dark:text-gray-400 italic">
                  {motivationQuotes[currentQuote]}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-swayami-border dark:border-gray-700">
                <p className="text-xs text-swayami-light-text dark:text-gray-400 text-center">
                  "You're 1 reflection away from your next breakthrough."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
