
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { Trash2 } from 'lucide-react';

const Dashboard = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useApp();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [focusTime, setFocusTime] = useState(25);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [habits, setHabits] = useState([
    { id: '1', emoji: '💧', label: 'Drink Water', completed: false },
    { id: '2', emoji: '🏃', label: 'Exercise', completed: false },
    { id: '3', emoji: '📚', label: 'Read', completed: false },
  ]);

  const today = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(task => task.date === today);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask({
        title: newTaskTitle,
        date: today,
        isCompleted: false,
      });
      setNewTaskTitle('');
    }
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

  const generateAISuggestions = () => {
    const suggestions = [
      'Review weekly goals progress',
      'Plan tomorrow\'s priorities',
      'Take a 15-minute mindfulness break',
      'Organize digital workspace',
      'Connect with a mentor or colleague',
    ];
    
    suggestions.forEach(suggestion => {
      addTask({
        title: suggestion,
        date: today,
        isCompleted: false,
      });
    });
  };

  return (
    <Layout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks Today */}
        <div className="lg:col-span-2">
          <div className="swayami-card">
            <h3 className="text-xl font-semibold text-swayami-black mb-6">
              Tasks Today
            </h3>
            
            <div className="space-y-3 mb-6">
              {todaysTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg border border-swayami-border"
                >
                  <Checkbox
                    checked={task.isCompleted}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <span 
                    className={`flex-1 ${
                      task.isCompleted 
                        ? 'line-through text-swayami-light-text' 
                        : 'text-swayami-black'
                    }`}
                  >
                    {task.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Add a new task..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                className="flex-1"
              />
              <Button onClick={handleAddTask}>Add</Button>
            </div>

            <div className="mt-6 pt-6 border-t border-swayami-border">
              <Button 
                onClick={generateAISuggestions}
                variant="outline"
                className="w-full"
              >
                What should I do today? ✨
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Focus Timer */}
          <div className="swayami-card">
            <h3 className="text-lg font-semibold text-swayami-black mb-4">
              Focus Timer
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-swayami-black mb-2">
                {focusTime}:00
              </div>
              <div className="flex justify-center space-x-2 mb-4">
                <Button 
                  size="sm" 
                  variant={focusTime === 15 ? "default" : "outline"}
                  onClick={() => setFocusTime(15)}
                >
                  15m
                </Button>
                <Button 
                  size="sm" 
                  variant={focusTime === 25 ? "default" : "outline"}
                  onClick={() => setFocusTime(25)}
                >
                  25m
                </Button>
                <Button 
                  size="sm" 
                  variant={focusTime === 45 ? "default" : "outline"}
                  onClick={() => setFocusTime(45)}
                >
                  45m
                </Button>
              </div>
              <Button 
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="w-full"
              >
                {isTimerRunning ? 'Pause' : 'Start'} Focus
              </Button>
            </div>
          </div>

          {/* Daily Habits */}
          <div className="swayami-card">
            <h3 className="text-lg font-semibold text-swayami-black mb-4">
              Daily Habits
            </h3>
            
            <div className="space-y-3">
              {habits.map((habit) => (
                <div 
                  key={habit.id}
                  className="flex items-center space-x-3"
                >
                  <Checkbox
                    checked={habit.completed}
                    onCheckedChange={() => toggleHabit(habit.id)}
                  />
                  <span className="text-lg">{habit.emoji}</span>
                  <span 
                    className={`flex-1 ${
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

          {/* Quick Calendar */}
          <div className="swayami-card">
            <h3 className="text-lg font-semibold text-swayami-black mb-4">
              Today's Schedule
            </h3>
            <div className="text-swayami-light-text text-sm">
              <div className="mb-2">9:00 AM - Team Standup</div>
              <div className="mb-2">11:00 AM - Project Review</div>
              <div className="mb-2">2:00 PM - Client Call</div>
              <div className="text-xs mt-4 text-swayami-light-text">
                Google Calendar integration coming soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
