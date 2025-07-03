import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { Calendar, Flame, Trophy, Target, Star, Zap, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  target?: number;
}

const Progress = () => {
  const { tasks, user, journalEntries, goals } = useApp();
  const [showStreakAnimation, setShowStreakAnimation] = useState(false);

  const completedTasks = tasks.filter(task => task.status === 'completed');
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  const currentStreak = user?.streak || 0;

  // Mock achievements system
  const achievements: Achievement[] = [
    {
      id: 'first_task',
      title: 'First Steps',
      description: 'Complete your first task',
      icon: <Target className="w-6 h-6" />,
      unlocked: completedTasks.length >= 1,
    },
    {
      id: 'task_marathon',
      title: 'Task Marathon',
      description: 'Complete 10 tasks',
      icon: <Trophy className="w-6 h-6" />,
      unlocked: completedTasks.length >= 10,
      progress: completedTasks.length,
      target: 10,
    },
    {
      id: 'week_warrior',
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: <Flame className="w-6 h-6" />,
      unlocked: currentStreak >= 7,
      progress: currentStreak,
      target: 7,
    },
    {
      id: 'reflection_master',
      title: 'Reflection Master',
      description: 'Write 5 journal entries',
      icon: <Star className="w-6 h-6" />,
      unlocked: journalEntries.length >= 5,
      progress: journalEntries.length,
      target: 5,
    },
    {
      id: 'consistency_king',
      title: 'Consistency King',
      description: 'Maintain a 30-day streak',
      icon: <Zap className="w-6 h-6" />,
      unlocked: currentStreak >= 30,
      progress: currentStreak,
      target: 30,
    },
    {
      id: 'productivity_legend',
      title: 'Productivity Legend',
      description: 'Complete 50 tasks',
      icon: <Award className="w-6 h-6" />,
      unlocked: completedTasks.length >= 50,
      progress: completedTasks.length,
      target: 50,
    },
  ];

  // Animation for streak milestones
  useEffect(() => {
    if (currentStreak > 0 && currentStreak % 7 === 0) {
      setShowStreakAnimation(true);
      setTimeout(() => setShowStreakAnimation(false), 3000);
    }
  }, [currentStreak]);

  const getProgressRing = (percentage: number) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="#E5E5E5"
            strokeWidth="6"
            fill="none"
            className="sm:hidden"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            stroke="url(#progressGradient)"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out sm:hidden"
            strokeLinecap="round"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="#E5E5E5"
            strokeWidth="8"
            fill="none"
            className="hidden sm:block"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="url(#progressGradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            className="transition-all duration-1000 ease-out hidden sm:block"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#9650D4" />
              <stop offset="50%" stopColor="#C146C7" />
              <stop offset="100%" stopColor="#FF6B9D" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl sm:text-3xl font-bold text-gray-900">
            {Math.round(percentage)}%
          </span>
        </div>
      </div>
    );
  };

  const getLevelInfo = (tasksCompleted: number) => {
    const levels = [
      { name: 'Mindful Novice', min: 0, max: 5, color: 'bg-gray-100 text-gray-800' },
      { name: 'Focused Explorer', min: 6, max: 15, color: 'bg-blue-100 text-blue-800' },
      { name: 'Dedicated Achiever', min: 16, max: 30, color: 'bg-green-100 text-green-800' },
      { name: 'Productivity Master', min: 31, max: 50, color: 'bg-purple-100 text-purple-800' },
      { name: 'Self-Reliance Legend', min: 51, max: 999, color: 'bg-yellow-100 text-yellow-800' },
    ];

    const currentLevel = levels.find(level => 
      tasksCompleted >= level.min && tasksCompleted <= level.max
    ) || levels[0];

    const nextLevel = levels.find(level => level.min > tasksCompleted);
    const progressToNext = nextLevel ? 
      ((tasksCompleted - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100 : 100;

    return { currentLevel, nextLevel, progressToNext };
  };

  const { currentLevel, nextLevel, progressToNext } = getLevelInfo(completedTasks.length);

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Streak Animation Overlay */}
        {showStreakAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-in fade-in duration-500">
            <div className="bg-white rounded-2xl p-8 text-center animate-in zoom-in duration-700">
              <div className="text-6xl mb-4">🔥</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStreak} Day Streak!
              </h2>
              <p className="text-gray-600">You're on fire! Keep the momentum going!</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Your Growth Journey
          </h1>
          <p className="text-gray-600">
            Every step forward is a victory worth celebrating
          </p>
        </div>

        {/* Main Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            {getProgressRing(completionRate)}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-2xl sm:text-3xl font-bold text-[#9650D4] mb-1">
                {completedTasks.length}
              </div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-100 rounded-xl">
              <div className="flex items-center justify-center text-2xl sm:text-3xl font-bold text-orange-600 mb-1">
                {currentStreak} <Flame className="w-6 h-6 ml-1" />
              </div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-lg sm:text-xl font-bold text-green-700 mb-1">
                {currentLevel.name}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
          </div>

          {/* Level Progress */}
          {nextLevel && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress to {nextLevel.name}
                </span>
                <span className="text-sm text-gray-600">
                  {completedTasks.length}/{nextLevel.min} tasks
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-[#9650D4] to-[#C146C7] h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="flex-1 bg-[#9650D4] hover:bg-[#8547C4] h-12"
              onClick={() => window.location.href = '/dashboard'}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Continue Progress
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 border-[#9650D4] text-[#9650D4] hover:bg-purple-50 h-12"
              onClick={() => window.location.href = '/mindspace'}
            >
              <Star className="w-4 h-4 mr-2" />
              Reflect & Journal
            </Button>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Trophy className="w-6 h-6 text-[#9650D4] mr-3" />
            <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'border-[#9650D4] bg-purple-50 shadow-md'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked ? 'bg-[#9650D4] text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className={`font-semibold text-sm ${
                      achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h3>
                    {achievement.unlocked && (
                      <span className="text-xs text-green-600 font-medium">✓ Unlocked</span>
                    )}
                  </div>
                </div>

                <p className={`text-xs mb-3 ${
                  achievement.unlocked ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {achievement.description}
                </p>

                {achievement.target && !achievement.unlocked && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Progress</span>
                      <span>{achievement.progress || 0}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#9650D4] h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(((achievement.progress || 0) / achievement.target) * 100, 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-[#9650D4] mr-3" />
            <h2 className="text-xl font-bold text-gray-900">This Week's Highlights</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {Math.min(currentStreak, 7)}
              </div>
              <div className="text-xs text-gray-600">Active Days</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {completedTasks.slice(-7).length}
              </div>
              <div className="text-xs text-gray-600">Tasks Done</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {journalEntries.slice(-7).length}
              </div>
              <div className="text-xs text-gray-600">Reflections</div>
            </div>

            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {completionRate > 80 ? '🔥' : completionRate > 60 ? '👍' : '💪'}
              </div>
              <div className="text-xs text-gray-600">Mood</div>
            </div>
          </div>
        </div>


      </div>
    </Layout>
  );
};

export default Progress;
