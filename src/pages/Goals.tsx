import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { Edit, Archive, RefreshCw, Plus, Target, Calendar, TrendingUp, Settings, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Goals = () => {
  const { goals, tasks, user } = useApp();
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  // Calculate goal progress based on completed tasks
  const getGoalProgress = (goalId: string) => {
    const goalTasks = tasks.filter(task => task.goal_id === goalId);
    if (goalTasks.length === 0) return 0;
    const completedTasks = goalTasks.filter(task => task.status === 'completed');
    return Math.round((completedTasks.length / goalTasks.length) * 100);
  };

  const getGoalStats = (goalId: string) => {
    const goalTasks = tasks.filter(task => task.goal_id === goalId);
    const completedTasks = goalTasks.filter(task => task.status === 'completed');
    const pendingTasks = goalTasks.filter(task => task.status === 'pending');
    const inProgressTasks = goalTasks.filter(task => task.status === 'in_progress');
    
    return {
      total: goalTasks.length,
      completed: completedTasks.length,
      pending: pendingTasks.length,
      inProgress: inProgressTasks.length
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'stalled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Only include picked goals
  const pickedGoals = goals.filter(g => g.status === 'active');

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Goals</h1>
            <p className="text-gray-600">
              Track your progress and manage your goals with detailed insights
            </p>
          </div>
          <Button 
            onClick={() => navigate('/onboarding')}
            className="bg-[#6FCC7F] hover:bg-[#5bb96a] px-6 py-3"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Goal
          </Button>
        </div>

        {/* Goals Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{goals.length}</p>
              </div>
              <Target className="w-8 h-8 text-[#6FCC7F]" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-green-600">
                  {goals.filter(g => g.status === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Goals</p>
                <p className="text-2xl font-bold text-blue-600">
                  {goals.filter(g => g.status === 'completed').length}
                </p>
              </div>
              <Archive className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-green-600">
                  {goals.length > 0 
                    ? Math.round(goals.reduce((acc, goal) => acc + getGoalProgress(goal._id), 0) / goals.length) 
                    : 0}%
                </p>
              </div>
              <Settings className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Goals List */}
        {pickedGoals.length === 0 ? (
          <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center">
            <CheckCircle2 className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <h4 className="text-md font-semibold text-gray-600 mb-2">No goals yet. Pick a goal to get started!</h4>
            {/* Optionally, add a button to onboarding or goal creation */}
          </div>
        ) : (
          <div className="space-y-6">
            {pickedGoals.map((goal) => {
              const progress = getGoalProgress(goal._id);
              const stats = getGoalStats(goal._id);
              
              return (
                <div 
                  key={goal._id} 
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Goal Header */}
                  <div className="p-6 bg-gradient-to-r from-green-50 to-pink-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{goal.title}</h3>
                          <Badge className={`text-xs ${getStatusColor(goal.status)}`}>
                            {goal.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-4">{goal.description}</p>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">Progress</span>
                            <span className="text-sm font-bold text-[#6FCC7F]">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-3" />
                        </div>
                        
                        {/* Goal Metadata */}
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {goal.created_at ? formatDate(goal.created_at) : 'Recently'}
                          </div>
                          <div className="flex items-center">
                            <Target className="w-4 h-4 mr-1" />
                            Category: {goal.category || 'General'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-6">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Reset Goal Progress?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will reset all task progress for "{goal.title}". This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                Reset Progress
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                  
                  {/* Goal Stats */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-600">Total Tasks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                        <div className="text-sm text-gray-600">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                        <div className="text-sm text-gray-600">In Progress</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-600">{stats.pending}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Goals; 