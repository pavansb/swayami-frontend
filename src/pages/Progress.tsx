
import React from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Progress = () => {
  const { tasks, goals, journalEntries, user } = useApp();
  const navigate = useNavigate();

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeGoals = goals.filter(goal => goal.status === 'active').length;
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const reflectionStreak = user.streak;

  // Calculate user level
  const getLevelInfo = (streak: number) => {
    if (streak >= 30) return { level: 'Self-Mastery Guru', color: 'text-yellow-600', progress: 100 };
    if (streak >= 14) return { level: 'Mindful Practitioner', color: 'text-purple-600', progress: (streak / 30) * 100 };
    if (streak >= 7) return { level: 'Disciplined Seeker', color: 'text-blue-600', progress: (streak / 30) * 100 };
    return { level: 'Mindful Novice', color: 'text-green-600', progress: (streak / 30) * 100 };
  };

  const levelInfo = getLevelInfo(reflectionStreak);

  // Mock weekly activity data
  const weeklyData = [
    { day: 'Mon', tasks: 3, habits: 2 },
    { day: 'Tue', tasks: 5, habits: 3 },
    { day: 'Wed', tasks: 2, habits: 1 },
    { day: 'Thu', tasks: 4, habits: 3 },
    { day: 'Fri', tasks: 6, habits: 2 },
    { day: 'Sat', tasks: 2, habits: 3 },
    { day: 'Sun', tasks: 1, habits: 2 },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Level & Streak Info */}
        <div className="swayami-card mb-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-swayami-black mb-2">
              Your Rank: <span className={levelInfo.color}>{levelInfo.level}</span>
            </h3>
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-lg font-semibold">{reflectionStreak}</span>
              <span className="text-2xl">🔥</span>
              <span className="text-swayami-light-text">day streak</span>
            </div>
            
            {/* Level Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-swayami-primary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${levelInfo.progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-swayami-light-text mt-2">
                {30 - reflectionStreak} more days to next level
              </p>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="swayami-card text-center">
            <div className="text-3xl font-bold text-swayami-black mb-2">
              {completionRate}%
            </div>
            <div className="text-swayami-light-text">Task Completion</div>
            <div className="text-sm text-swayami-light-text mt-1">
              {completedTasks} of {totalTasks} tasks
            </div>
          </div>

          <div className="swayami-card text-center">
            <div className="text-3xl font-bold text-swayami-black mb-2">
              {goalCompletionRate}%
            </div>
            <div className="text-swayami-light-text">Goal Progress</div>
            <div className="text-sm text-swayami-light-text mt-1">
              {activeGoals} active goals
            </div>
          </div>

          <div className="swayami-card text-center">
            <div className="text-3xl font-bold text-swayami-black mb-2">
              {journalEntries.length}
            </div>
            <div className="text-swayami-light-text">Reflection Entries</div>
            <div className="text-sm text-swayami-light-text mt-1">
              Total journal entries
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Activity */}
          <div className="swayami-card">
            <h3 className="text-xl font-semibold text-swayami-black mb-6">
              Weekly Activity
            </h3>
            
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-swayami-light-text">
                    {day.day}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="text-sm text-swayami-black">Tasks</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-swayami-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.tasks / 6) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-swayami-light-text w-8">
                        {day.tasks}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-swayami-black">Habits</div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gray-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(day.habits / 3) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-swayami-light-text w-8">
                        {day.habits}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Goal Breakdown */}
          <div className="swayami-card">
            <h3 className="text-xl font-semibold text-swayami-black mb-6">
              Goal Breakdown
            </h3>
            
            <div className="space-y-4">
              {goals.map((goal) => {
                const goalTasks = tasks.filter(task => task.linkedGoal === goal.id);
                const completedGoalTasks = goalTasks.filter(task => task.isCompleted);
                const progress = goalTasks.length > 0 ? (completedGoalTasks.length / goalTasks.length) * 100 : 0;
                
                const getStatusColor = (status: string, progress: number) => {
                  if (status === 'completed' || progress === 100) return 'bg-green-100 text-green-800';
                  if (progress > 50) return 'bg-yellow-100 text-yellow-800';
                  return 'bg-red-100 text-red-800';
                };

                return (
                  <div key={goal.id} className="border-b border-swayami-border pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-swayami-black">
                        {goal.type}
                      </div>
                      <div className={`text-sm px-2 py-1 rounded ${getStatusColor(goal.status, progress)}`}>
                        {progress === 100 ? 'Complete' : progress > 50 ? 'In Progress' : 'Stalled'}
                      </div>
                    </div>
                    <div className="text-sm text-swayami-light-text mb-2">
                      {goal.description || 'No description provided'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-swayami-primary h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-swayami-light-text">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <p className="text-swayami-light-text text-center py-8">
                  Complete onboarding to see your goals here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="swayami-card mt-8 text-center">
          <h3 className="text-xl font-semibold text-swayami-black mb-4">
            Keep the Momentum Going!
          </h3>
          <p className="text-swayami-light-text mb-6">
            "You're 1 reflection away from your next breakthrough."
          </p>
          <Button 
            onClick={() => navigate('/mindspace')}
            className="bg-swayami-primary hover:bg-swayami-primary-hover px-8 py-3"
          >
            Reflect to Boost Your Streak 🔥
          </Button>
        </div>

        {/* Daily Reward Quote (show if all tasks completed) */}
        {completionRate === 100 && totalTasks > 0 && (
          <div className="swayami-card mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-swayami-black mb-2">
                Daily Achievement Unlocked!
              </h3>
              <p className="text-swayami-light-text italic">
                "The man who moves a mountain begins by carrying away small stones." - Confucius
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Progress;
