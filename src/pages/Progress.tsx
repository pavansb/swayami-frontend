
import React from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';

const Progress = () => {
  const { tasks, goals, journalEntries } = useApp();

  const completedTasks = tasks.filter(task => task.isCompleted).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const activeGoals = goals.filter(goal => goal.status === 'active').length;
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const goalCompletionRate = goals.length > 0 ? Math.round((completedGoals / goals.length) * 100) : 0;

  const reflectionStreak = journalEntries.length;

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
              {reflectionStreak}
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
                          className="bg-swayami-black h-2 rounded-full"
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
                          className="bg-gray-400 h-2 rounded-full"
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
              {goals.map((goal) => (
                <div key={goal.id} className="border-b border-swayami-border pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-swayami-black">
                      {goal.type}
                    </div>
                    <div className={`text-sm px-2 py-1 rounded ${
                      goal.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {goal.status}
                    </div>
                  </div>
                  <div className="text-sm text-swayami-light-text">
                    {goal.description || 'No description provided'}
                  </div>
                  <div className="mt-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-swayami-black h-2 rounded-full"
                        style={{ 
                          width: goal.status === 'completed' ? '100%' : '45%' 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
              {goals.length === 0 && (
                <p className="text-swayami-light-text text-center py-8">
                  Complete onboarding to see your goals here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="swayami-card mt-8">
          <h3 className="text-xl font-semibold text-swayami-black mb-6">
            Weekly Insights
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-swayami-black mb-2">Strengths</h4>
              <ul className="space-y-1 text-swayami-light-text">
                <li>• Consistent task completion on weekdays</li>
                <li>• Strong habit tracking momentum</li>
                <li>• Regular reflection practice</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-swayami-black mb-2">Areas for Growth</h4>
              <ul className="space-y-1 text-swayami-light-text">
                <li>• Weekend productivity could improve</li>
                <li>• Consider adding more challenging goals</li>
                <li>• Focus timer usage could increase</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
