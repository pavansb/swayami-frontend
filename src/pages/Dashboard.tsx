
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { Trash2, Edit, Plus, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { tasks, goals, habits, addTask, toggleTask, deleteTask, editTask, toggleHabit, regenerateRecommendations, journalEntries, user } = useApp();
  const [newTaskTitles, setNewTaskTitles] = useState<Record<string, string>>({});
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
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

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* PLAN Section */}
        <div className="lg:col-span-2">
          <div className="swayami-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-swayami-black">
                PLAN
              </h3>
              <Button
                onClick={regenerateRecommendations}
                variant="outline"
                size="sm"
                className="border-swayami-primary text-swayami-primary hover:bg-purple-50"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Regenerate Recommendations
              </Button>
            </div>
            
            {Object.entries(tasksByGoal).map(([goalType, goalTasks]) => (
              <div key={goalType} className="mb-8">
                <h4 className="font-semibold text-swayami-black mb-4">{goalType}</h4>
                
                <div className="space-y-3 mb-4">
                  {goalTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-center space-x-3 p-3 rounded-lg border border-swayami-border"
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
                                ? 'line-through text-swayami-light-text' 
                                : 'text-swayami-black'
                            }`}
                          >
                            {task.title}
                            {task.isRecommended && (
                              <span className="ml-2 text-xs bg-purple-100 text-swayami-primary px-2 py-1 rounded-full">
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
            <h3 className="text-lg font-semibold text-swayami-black mb-4">
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
                  <span className="text-xl font-bold text-swayami-black">
                    {completionPercentage}%
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-swayami-light-text">Tasks Completed:</span>
                  <span className="font-medium">{completedTasks}/{totalTasks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-swayami-light-text">Habits Completed:</span>
                  <span className="font-medium">{completedHabits}/{habits.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-swayami-light-text">Current Streak:</span>
                  <span className="font-medium">{user.streak} days 🔥</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-swayami-black mb-3">Daily Habits</h4>
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
                          ? 'line-through text-swayami-light-text' 
                          : 'text-swayami-black'
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
            <h3 className="text-lg font-semibold text-swayami-black mb-4">
              REFLECT
            </h3>
            
            {lastJournalEntry ? (
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-swayami-light-text">Last mood:</span>
                  <span className="text-sm font-medium">{lastJournalEntry.mood}</span>
                </div>
                <p className="text-sm text-swayami-light-text line-clamp-2">
                  {lastJournalEntry.text.slice(0, 100)}...
                </p>
              </div>
            ) : (
              <p className="text-sm text-swayami-light-text mb-4">
                No reflections yet. Start your mindfulness journey!
              </p>
            )}
            
            <Button 
              onClick={() => navigate('/mindspace')}
              className="w-full bg-swayami-primary hover:bg-swayami-primary-hover"
            >
              Write a New Reflection
            </Button>
            
            <div className="mt-4 pt-4 border-t border-swayami-border">
              <p className="text-xs text-swayami-light-text text-center">
                "You're 1 reflection away from your next breakthrough."
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
