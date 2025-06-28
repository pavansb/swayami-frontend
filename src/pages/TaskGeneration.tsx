import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { openaiService, TaskSuggestion } from '@/services/openaiService';
import { Sparkles, RefreshCw, Star, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GoalWithTasks {
  goalId: string;
  goalTitle: string;
  goalDescription: string;
  tasks: TaskSuggestion[];
  analysis: string;
  rating: number;
  selectedTasks: boolean[];
}

const TaskGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goals, addTask, completeOnboarding, loadUserData } = useApp();
  const [goalsWithTasks, setGoalsWithTasks] = useState<GoalWithTasks[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  // Get goals from location state (passed from onboarding) or from context
  const goalsToProcess = location.state?.goals || goals;

  useEffect(() => {
    if (goalsToProcess.length === 0) {
      navigate('/dashboard');
      return;
    }
    generateTasksForAllGoals();
  }, []);

  const generateTasksForAllGoals = async () => {
    setIsGenerating(true);
    const newGoalsWithTasks: GoalWithTasks[] = [];

    for (const goal of goalsToProcess) {
      try {
        const response = await openaiService.generateTasksFromGoal(
          goal.title || goal.type,
          goal.description || ''
        );

        newGoalsWithTasks.push({
          goalId: goal.id || goal.type,
          goalTitle: goal.title || goal.type,
          goalDescription: goal.description || '',
          tasks: response.tasks,
          analysis: response.goalAnalysis,
          rating: 0,
          selectedTasks: response.tasks.map(() => true) // Select all by default
        });
      } catch (error) {
        console.error('Error generating tasks for goal:', goal.title, error);
        // Add fallback task
        newGoalsWithTasks.push({
          goalId: goal.id || goal.type,
          goalTitle: goal.title || goal.type,
          goalDescription: goal.description || '',
          tasks: [{
            title: `Work on ${goal.title}`,
            description: goal.description || 'Focus on achieving this goal',
            priority: 'medium',
            estimatedDuration: 60
          }],
          analysis: 'This goal requires focused effort and consistent action.',
          rating: 0,
          selectedTasks: [true]
        });
      }
    }

    setGoalsWithTasks(newGoalsWithTasks);
    setIsGenerating(false);
  };

  const regenerateTasksForGoal = async (goalId: string) => {
    setIsRegenerating(goalId);
    const goalToRegenerate = goalsWithTasks.find(g => g.goalId === goalId);
    if (!goalToRegenerate) return;

    try {
      const response = await openaiService.generateTasksFromGoal(
        goalToRegenerate.goalTitle,
        goalToRegenerate.goalDescription
      );

      setGoalsWithTasks(prev => prev.map(goal => 
        goal.goalId === goalId 
          ? {
              ...goal,
              tasks: response.tasks,
              analysis: response.goalAnalysis,
              selectedTasks: response.tasks.map(() => true)
            }
          : goal
      ));

      toast({
        title: "Tasks Regenerated!",
        description: "New AI suggestions have been generated for your goal.",
      });
    } catch (error) {
      console.error('Error regenerating tasks:', error);
      toast({
        title: "Error",
        description: "Failed to regenerate tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRegenerating(null);
    }
  };

  const setRating = (goalId: string, rating: number) => {
    setGoalsWithTasks(prev => prev.map(goal => 
      goal.goalId === goalId ? { ...goal, rating } : goal
    ));
  };

  const toggleTaskSelection = (goalId: string, taskIndex: number) => {
    setGoalsWithTasks(prev => prev.map(goal => 
      goal.goalId === goalId 
        ? {
            ...goal,
            selectedTasks: goal.selectedTasks.map((selected, index) => 
              index === taskIndex ? !selected : selected
            )
          }
        : goal
    ));
  };

  const handleCompleteSetup = async () => {
    setIsCompleting(true);
    
    try {
      let savedGoals = goals;
      
      console.log('TaskGeneration: Starting setup completion', {
        hasLocationGoals: !!location.state?.goals,
        currentGoalsLength: goals.length
      });
      
      // First, complete onboarding if we have goals from onboarding
      if (location.state?.goals) {
        console.log('TaskGeneration: Completing onboarding with goals:', location.state.goals);
        await completeOnboarding(location.state.goals);
        
        // Wait for goals to be properly saved
        let attempts = 0;
        while (attempts < 15 && savedGoals.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 300));
          await loadUserData(); // Refresh the data from Supabase
          if (goals.length > 0) {
            savedGoals = goals;
            console.log('TaskGeneration: Goals loaded successfully after', attempts + 1, 'attempts');
            break;
          }
          attempts++;
        }
        
        if (savedGoals.length === 0) {
          console.warn('TaskGeneration: Goals still not loaded after all attempts');
        }
      }

      // Add selected tasks to Supabase
      for (const goalWithTasks of goalsWithTasks) {
        // Find the corresponding goal ID from the context
        const matchingGoal = savedGoals.find(g => 
          g.title === goalWithTasks.goalTitle || 
          g.id === goalWithTasks.goalId
        );
        
        const goalId = matchingGoal?.id || goalWithTasks.goalId;
        
        const selectedTasksData = goalWithTasks.tasks.filter((_, index) => 
          goalWithTasks.selectedTasks[index]
        );

        console.log('TaskGeneration: Adding tasks for goal:', goalWithTasks.goalTitle, 'Tasks:', selectedTasksData.length);

        for (const task of selectedTasksData) {
          await addTask({
            title: task.title,
            description: task.description,
            goal_id: goalId,
            status: 'pending',
            priority: task.priority,
          });
        }
      }

      toast({
        title: "Setup Complete! 🎉",
        description: "Your personalized tasks have been added to your dashboard.",
      });

      console.log('TaskGeneration: About to navigate to dashboard');
      
      // Wait a bit for React state updates to process before navigating
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Navigate to dashboard
      console.log('TaskGeneration: Calling navigate to dashboard');
      navigate('/dashboard');
      
      // Backup: If navigation doesn't work after 2 seconds, force reload to dashboard
      setTimeout(() => {
        if (window.location.pathname !== '/dashboard') {
          console.log('TaskGeneration: Navigation failed, forcing page reload to dashboard');
          window.location.href = '/dashboard';
        }
      }, 2000);
      
    } catch (error) {
      console.error('Error saving tasks:', error);
      toast({
        title: "Error",
        description: "Failed to save tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalSelectedTasks = goalsWithTasks.reduce((total, goal) => 
    total + goal.selectedTasks.filter(Boolean).length, 0
  );

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#9650D4] mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI is crafting your perfect tasks...
          </h2>
          <p className="text-gray-600">
            Analyzing your goals and generating personalized action steps. This won't take long!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#9650D4] mr-3" />
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              Your AI-Generated Action Plan
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We've analyzed your goals and created specific, actionable tasks. Select the ones that resonate with you!
          </p>
        </div>

        {/* Goals and Tasks */}
        <div className="space-y-8 mb-12">
          {goalsWithTasks.map((goalWithTasks) => (
            <div key={goalWithTasks.goalId} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Goal Header */}
              <div className="bg-gradient-to-r from-[#9650D4] to-[#8547C4] text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{goalWithTasks.goalTitle}</h3>
                    <p className="text-purple-100 text-sm">{goalWithTasks.goalDescription}</p>
                  </div>
                  <Button
                    onClick={() => regenerateTasksForGoal(goalWithTasks.goalId)}
                    disabled={isRegenerating === goalWithTasks.goalId}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    {isRegenerating === goalWithTasks.goalId ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    <span className="ml-2">Regenerate</span>
                  </Button>
                </div>
              </div>

              {/* AI Analysis */}
              <div className="p-6 bg-purple-50 border-b border-purple-100">
                <h4 className="font-semibold text-gray-900 mb-2">🧠 AI Analysis</h4>
                <p className="text-gray-700 text-sm">{goalWithTasks.analysis}</p>
              </div>

              {/* Tasks */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goalWithTasks.tasks.map((task, taskIndex) => (
                    <div 
                      key={taskIndex}
                      className={`border-2 rounded-xl p-4 transition-all duration-200 ${
                        goalWithTasks.selectedTasks[taskIndex]
                          ? 'border-[#9650D4] bg-purple-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={goalWithTasks.selectedTasks[taskIndex]}
                          onCheckedChange={() => toggleTaskSelection(goalWithTasks.goalId, taskIndex)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-2">{task.title}</h5>
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              {task.estimatedDuration && (
                                <div className="flex items-center text-gray-500 text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {task.estimatedDuration}m
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Rate these suggestions</h4>
                    <p className="text-gray-600 text-sm">Help us improve future recommendations</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(goalWithTasks.goalId, star)}
                        className="p-1"
                      >
                        <Star 
                          className={`w-5 h-5 transition-colors ${
                            star <= goalWithTasks.rating 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">
                {totalSelectedTasks} tasks selected
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Ready to start your productivity journey? These tasks will be added to your dashboard.
            </p>
            
            <Button
              onClick={handleCompleteSetup}
              disabled={totalSelectedTasks === 0 || isCompleting}
              className="bg-[#9650D4] hover:bg-[#8547C4] text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
            >
              {isCompleting ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Setting up your dashboard...
                </>
              ) : (
                <>
                  Start My Journey
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskGeneration; 