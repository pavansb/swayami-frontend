import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { apiService } from '@/services/api';
import { Sparkles, RefreshCw, Star, Clock, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Define task types here since we removed the dangerous OpenAI service
interface TaskSuggestion {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  estimatedDuration?: number; // in minutes
}

interface TaskGenerationResponse {
  tasks: TaskSuggestion[];
  goalAnalysis: string;
}

interface GoalWithTasks {
  goalId: string;
  goalTitle: string;
  goalDescription: string;
  tasks: TaskSuggestion[];
  analysis: string;
  rating: number;
  selectedTasks: boolean[];
}

// Define types for dailyBreakdown and day if not already defined
// type DailyBreakdownType = { weeklyPlan: DayPlanType[]; ... };
// type DayPlanType = { tasks: TaskSuggestion[]; ... };

const TaskGeneration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { goals, addTask, completeOnboarding, loadUserData } = useApp();
  const [goalsWithTasks, setGoalsWithTasks] = useState<GoalWithTasks[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Daily breakdown feature states
  const [showDailyBreakdownPrompt, setShowDailyBreakdownPrompt] = useState(false);
  const [isGeneratingDailyBreakdown, setIsGeneratingDailyBreakdown] = useState(false);
  const [dailyBreakdown, setDailyBreakdown] = useState<null | DailyBreakdownType>(null);
  const [showDailyBreakdown, setShowDailyBreakdown] = useState(false);

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
        const response = await apiService.generateTasksFromGoalTitle(
          goal.title || goal.type,
          goal.description || ''
        );

        // Type-safe conversion of backend response
        const typedTasks: TaskSuggestion[] = (response.tasks || []).map((task: TaskSuggestion) => ({
          title: task.title,
          description: task.description,
          priority: (task.priority as 'low' | 'medium' | 'high') || 'medium',
          estimatedDuration: task.estimatedDuration || 60
        }));

        newGoalsWithTasks.push({
          goalId: goal._id || goal.type,
          goalTitle: goal.title || goal.type,
          goalDescription: goal.description || '',
          tasks: typedTasks,
          analysis: response.goalAnalysis || 'This goal requires focused effort and consistent action.',
          rating: 0,
          selectedTasks: typedTasks.map(() => true) // Select all by default
        });
      } catch (error) {
        console.error('Error generating tasks for goal:', goal.title, error);
        // Add fallback task
        newGoalsWithTasks.push({
          goalId: goal._id || goal.type,
          goalTitle: goal.title || goal.type,
          goalDescription: goal.description || '',
          tasks: [{
            title: `Work on ${goal.title}`,
            description: goal.description || 'Focus on achieving this goal',
            priority: 'medium' as const,
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
    
    // Show daily breakdown prompt after task generation is complete
    if (newGoalsWithTasks.length > 0) {
      setTimeout(() => {
        setShowDailyBreakdownPrompt(true);
      }, 1000);
    }
  };

  const regenerateTasksForGoal = async (goalId: string) => {
    setIsRegenerating(goalId);
    const goalToRegenerate = goalsWithTasks.find(g => g.goalId === goalId);
    if (!goalToRegenerate) return;

    try {
      const response = await apiService.generateTasksFromGoalTitle(
        goalToRegenerate.goalTitle,
        goalToRegenerate.goalDescription
      );

      // Type-safe conversion of backend response
      const typedTasks: TaskSuggestion[] = (response.tasks || []).map((task: TaskSuggestion) => ({
        title: task.title,
        description: task.description,
        priority: (task.priority as 'low' | 'medium' | 'high') || 'medium',
        estimatedDuration: task.estimatedDuration || 60
      }));

      setGoalsWithTasks(prev => prev.map(goal => 
        goal.goalId === goalId 
          ? {
              ...goal,
              tasks: typedTasks,
              analysis: response.goalAnalysis || 'This goal requires focused effort and consistent action.',
              selectedTasks: typedTasks.map(() => true)
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
    try {
      console.log('🚀 TASK GENERATION DEBUG: Starting complete setup process');
      console.log('🚀 Goals from context before onboarding:', goals);
      console.log('🚀 Goals with tasks to process:', goalsWithTasks);
      setIsCompleting(true);
      
      // Complete onboarding first and get the created goals directly
      console.log('📝 TASK GENERATION DEBUG: Completing onboarding with selected goals');
      const createdGoals = await completeOnboarding(
        goalsWithTasks.map(g => ({ type: g.goalTitle, description: g.goalDescription }))
      );
      
      console.log('✅ TASK GENERATION DEBUG: Onboarding completed, received goals:', createdGoals);
      console.log('✅ TASK GENERATION DEBUG: Total goals received:', createdGoals.length);
      console.log('✅ TASK GENERATION DEBUG: Goal details:', createdGoals.map(g => ({ id: g._id, title: g.title })));

      if (createdGoals.length === 0) {
        console.error('❌ TASK GENERATION DEBUG: No goals were created during onboarding');
        throw new Error('Goals were not created properly during onboarding. Please try again.');
      }

      // Use the created goals directly instead of waiting for context state
      console.log('🎯 TASK GENERATION DEBUG: Starting task creation with created goals');
      
      for (const goalWithTasks of goalsWithTasks) {
        // Find the corresponding goal ID from the created goals
        const matchingGoal = createdGoals.find(g => 
          g.title === goalWithTasks.goalTitle || 
          g.title === goalWithTasks.goalId
        );
        
        console.log('🔍 TASK GENERATION DEBUG: Goal matching result:', {
          searchingFor: goalWithTasks.goalTitle,
          foundGoal: matchingGoal,
          availableGoals: createdGoals.map(g => ({ id: g._id, title: g.title }))
        });
        
        if (!matchingGoal) {
          console.error('❌ TASK GENERATION DEBUG: No matching goal found for:', goalWithTasks.goalTitle);
          console.error('❌ TASK GENERATION DEBUG: Available goals:', createdGoals);
          continue; // Skip this goal if we can't find a match
        }
        
        const goalId = matchingGoal._id;
        
        const selectedTasksData = goalWithTasks.tasks.filter((_, index) => 
          goalWithTasks.selectedTasks[index]
        );

        console.log('✅ TASK GENERATION DEBUG: Adding', selectedTasksData.length, 'tasks for goal:', goalWithTasks.goalTitle, 'with ID:', goalId);

        for (const task of selectedTasksData) {
          console.log('📝 TASK GENERATION DEBUG: Creating task:', {
            title: task.title,
            goal_id: goalId,
            goal_title: goalWithTasks.goalTitle
          });
          
          await addTask({
            title: task.title,
            description: task.description,
            goal_id: goalId,
            status: 'pending',
            priority: task.priority,
          });
        }
      }

      console.log('🎉 TASK GENERATION DEBUG: All tasks created successfully');
      console.log('🎯 TASK GENERATION DEBUG: About to navigate to dashboard');
      
      // Navigate to dashboard
      setTimeout(() => {
        console.log('🎯 TASK GENERATION DEBUG: Calling navigate to dashboard');
        navigate('/dashboard');
      }, 100);
      
    } catch (error) {
      console.error('❌ TASK GENERATION DEBUG: Error in handleCompleteSetup:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
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

  const handleDailyBreakdownYes = async () => {
    setShowDailyBreakdownPrompt(false);
    setIsGeneratingDailyBreakdown(true);
    
    try {
      // Get all selected tasks from all goals
      const allSelectedTasks: TaskSuggestion[] = [];
      let primaryGoal = goalsWithTasks[0]; // Use first goal as primary context
      
      goalsWithTasks.forEach(goalWithTasks => {
        const selectedTasks = goalWithTasks.tasks.filter((_, index) => 
          goalWithTasks.selectedTasks[index]
        );
        allSelectedTasks.push(...selectedTasks);
      });

      console.log('🗓️ Generating daily breakdown for tasks:', allSelectedTasks);
      
      const breakdown = await apiService.generateDailyBreakdown(
        allSelectedTasks,
        primaryGoal.goalTitle,
        primaryGoal.goalDescription,
        '7 days'
      );
      
      console.log('✅ Daily breakdown generated:', breakdown);
      setDailyBreakdown(breakdown);
      setShowDailyBreakdown(true);
    } catch (error) {
      console.error('❌ Error generating daily breakdown:', error);
      toast({
        title: "Error",
        description: "Failed to generate daily breakdown. You can still proceed with your tasks.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDailyBreakdown(false);
    }
  };

  const handleDailyBreakdownNo = () => {
    setShowDailyBreakdownPrompt(false);
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#6FCC7F] mx-auto mb-6"></div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 lg:p-8 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎯 Your Personalized Action Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            AI has analyzed your goals and generated smart, actionable tasks. Review, customize, and get started!
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Setup Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isGenerating ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Generating your personalized tasks...</p>
            <p className="text-sm text-gray-500 mt-2">This may take a moment as we analyze your goals</p>
          </div>
        ) : (
          <div className="space-y-8 mb-12">
            {goalsWithTasks.map((goalWithTasks) => (
              <div key={goalWithTasks.goalId} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Goal Header */}
                <div className="bg-gradient-to-r from-[#6FCC7F] to-[#5bb96a] text-white p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{goalWithTasks.goalTitle}</h3>
                      <p className="text-green-100 text-sm">{goalWithTasks.goalDescription}</p>
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
                <div className="p-6 bg-green-50 border-b border-green-100">
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
                            ? 'border-[#6FCC7F] bg-green-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-green-200'
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
        )}

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
              className="bg-[#6FCC7F] hover:bg-[#5bb96a] text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50"
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
        
        {/* Daily Breakdown Prompt Modal */}
        {showDailyBreakdownPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-[#6FCC7F]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ✨ Want Daily Action Steps?
                </h3>
                <p className="text-gray-600">
                  Would you like AI to break these tasks into daily actionable steps? 
                  This creates a personalized weekly schedule for better tracking.
                </p>
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleDailyBreakdownYes}
                  className="flex-1 bg-[#6FCC7F] hover:bg-[#5bb96a] text-white"
                >
                  Yes, Break It Down! 🗓️
                </Button>
                <Button
                  onClick={handleDailyBreakdownNo}
                  variant="outline"
                  className="flex-1"
                >
                  No, Continue
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Daily Breakdown Generation Loading */}
        {isGeneratingDailyBreakdown && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-xl text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#6FCC7F] mx-auto mb-6"></div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                🧠 AI is planning your week...
              </h3>
              <p className="text-gray-600">
                Creating your personalized daily action plan. This won't take long!
              </p>
            </div>
          </div>
        )}
        
        {/* Daily Breakdown Display */}
        {showDailyBreakdown && dailyBreakdown && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6">
                <h3 className="text-2xl font-bold mb-2">🗓️ Your Weekly Action Plan</h3>
                <p className="text-green-100">
                  AI has created a personalized daily schedule for maximum productivity
                </p>
              </div>
              
              {/* Weekly Schedule */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-6">
                  {dailyBreakdown.weeklyPlan.map((day: DayPlanType, dayIndex: number) => (
                    <div key={dayIndex} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                      <h4 className="font-bold text-gray-900 mb-3 text-center border-b border-gray-100 pb-2">
                        {day.day}
                      </h4>
                      <div className="space-y-2">
                        {day.tasks.map((task: TaskSuggestion, taskIndex: number) => (
                          <div key={taskIndex} className="bg-gray-50 rounded-lg p-3">
                            <h5 className="font-medium text-gray-900 text-sm mb-1">{task.title}</h5>
                            <p className="text-gray-600 text-xs mb-2">{task.description}</p>
                            <div className="flex items-center justify-between">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                              </span>
                              <div className="flex items-center text-gray-500 text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                {task.estimatedDuration}m
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Weekly Summary */}
                <div className="bg-gradient-to-r from-green-50 to-pink-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#6FCC7F]">{dailyBreakdown.totalDuration} min</div>
                      <div className="text-sm text-gray-600">Total Weekly Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#6FCC7F]">
                        {Math.round(dailyBreakdown.totalDuration / 60)}h {dailyBreakdown.totalDuration % 60}m
                      </div>
                      <div className="text-sm text-gray-600">Daily Average</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#6FCC7F]">{dailyBreakdown.weeklyPlan.length}</div>
                      <div className="text-sm text-gray-600">Active Days</div>
                    </div>
                  </div>
                </div>
                
                {/* AI Tips */}
                {dailyBreakdown.tips && dailyBreakdown.tips.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      💡 AI Productivity Tips
                    </h4>
                    <ul className="space-y-2">
                      {dailyBreakdown.tips.map((tip: string, tipIndex: number) => (
                        <li key={tipIndex} className="text-gray-700 text-sm flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskGeneration; 