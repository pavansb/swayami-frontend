import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const goalTypes = [
  { id: 'personal', emoji: '🧘', title: 'Personal Wellbeing' },
  { id: 'health', emoji: '💪', title: 'Health / Fitness' },
  { id: 'financial', emoji: '💰', title: 'Financial Discipline' },
  { id: 'career', emoji: '📈', title: 'Career Growth' },
  { id: 'hustle', emoji: '🎯', title: 'Side Hustle' },
  { id: 'mental', emoji: '🧠', title: 'Mental Clarity' },
];

const examplePrompts = {
  'personal': [
    "Help me build a morning meditation routine and practice gratitude daily.",
    "Guide me to better work-life balance and stress management techniques.",
    "Create a self-care routine with regular relaxation and mindfulness.",
    "Build habits for better emotional regulation and mental peace."
  ],
  'health': [
    "Help me lose 10kg in 6 months through sustainable diet and exercise.",
    "Guide me to run my first 5K marathon within 3 months.",
    "Create a strength training routine to build muscle and confidence.",
    "Develop healthy eating habits and meal prep strategies."
  ],
  'financial': [
    "Help me build a ₹10 lakh emergency fund in 2 years.",
    "Guide me to save 30% of my income and invest wisely.",
    "Create a debt-free plan and build multiple income streams.",
    "Develop smart spending habits and financial discipline."
  ],
  'career': [
    "Plan a roadmap to get a promotion within 6 months.",
    "Help me transition to a new career in tech/design.",
    "Build my professional network and personal brand.",
    "Develop leadership skills and advance to management."
  ],
  'hustle': [
    "Launch my freelance business and earn ₹50k/month extra.",
    "Build an online course and create passive income.",
    "Start an e-commerce store and scale to 6 figures.",
    "Develop a SaaS product and find my first 100 customers."
  ],
  'mental': [
    "Improve focus and productivity with better time management.",
    "Develop critical thinking and decision-making skills.",
    "Build reading habits and continuous learning routines.",
    "Enhance creativity and problem-solving abilities."
  ]
};

const ExamplePrompts = ({ 
  selectedGoals, 
  onSuggestionClick 
}: { 
  selectedGoals: string[];
  onSuggestionClick: (goalId: string, suggestion: string) => void;
}) => {
  const [currentExamples, setCurrentExamples] = useState<Record<string, number>>({});
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentExamples(prev => {
        const newExamples: Record<string, number> = {};
        selectedGoals.forEach(goalId => {
          const examples = examplePrompts[goalId as keyof typeof examplePrompts] || [];
          const currentIndex = prev[goalId] || 0;
          newExamples[goalId] = (currentIndex + 1) % examples.length;
        });
        return newExamples;
      });
    }, 6000); // Slower rotation for better readability

    return () => clearInterval(interval);
  }, [selectedGoals]);

  const regenerateSuggestions = (goalId: string) => {
    setIsRegenerating(goalId);
    setCurrentExamples(prev => {
      const examples = examplePrompts[goalId as keyof typeof examplePrompts] || [];
      return {
        ...prev,
        [goalId]: Math.floor(Math.random() * examples.length)
      };
    });
    setTimeout(() => setIsRegenerating(null), 800);
  };

  if (selectedGoals.length === 0) {
    return (
      <div className="lg:w-1/3 bg-gradient-to-br from-green-50 to-green-100 p-8 flex items-center justify-center">
        <div className="text-center">
                      <Sparkles className="w-16 h-16 text-[#6FCC7F] mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Example Prompts
          </h3>
          <p className="text-gray-600">
            Select your goals to see inspiring examples
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:w-1/3 bg-gradient-to-br from-green-50 to-green-100 p-8">
      <div className="sticky top-8">
        <div className="flex items-center mb-6">
                              <Sparkles className="w-6 h-6 text-[#6FCC7F] mr-2" />
          <h3 className="text-xl font-semibold text-gray-800">
            Example Goals
          </h3>
        </div>
        
        <div className="space-y-6">
          {selectedGoals.map((goalId) => {
            const goalType = goalTypes.find(g => g.id === goalId);
            const examples = examplePrompts[goalId as keyof typeof examplePrompts] || [];
            const currentIndex = currentExamples[goalId] || 0;
            const currentExample = examples[currentIndex];
            
            if (!goalType || !currentExample) return null;

            return (
              <div 
                key={goalId}
                className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/50 transition-all duration-500"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{goalType.emoji}</span>
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {goalType.title}
                    </h4>
                  </div>
                  <button
                    onClick={() => regenerateSuggestions(goalId)}
                    disabled={isRegenerating === goalId}
                    className="p-1.5 rounded-lg hover:bg-white/50 transition-colors disabled:opacity-50"
                    title="Generate new suggestions"
                  >
                    <Sparkles className={`w-4 h-4 text-[#6FCC7F] ${isRegenerating === goalId ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div 
                  key={currentIndex} // Force re-render for animation
                  onClick={() => onSuggestionClick(goalId, currentExample)}
                  className="text-gray-700 text-sm leading-relaxed animate-in fade-in duration-500 cursor-pointer hover:bg-white/30 rounded-lg p-2 transition-colors border border-transparent hover:border-[#6FCC7F]/30"
                  title="Click to use this suggestion"
                >
                  "{currentExample}"
                </div>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-1">
                    {examples.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-[#6FCC7F]' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">Click to use</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 p-4 bg-white/50 rounded-xl border border-white/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
                                  <Sparkles className="w-4 h-4 text-[#6FCC7F]" />
              <span className="text-xs font-semibold text-gray-700">Pro Tips</span>
            </div>
            <p className="text-xs text-gray-600">
              💡 Click suggestions to add them instantly<br />
              🔄 Use the sparkle button to generate new ideas<br />
              ✏️ Edit and personalize as needed!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Onboarding = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [goalDescriptions, setGoalDescriptions] = useState<Record<string, string>>({});

  const handleGoalToggle = (goalId: string) => {
    setSelectedGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSuggestionClick = (goalId: string, suggestion: string) => {
    setGoalDescriptions(prev => ({
      ...prev,
      [goalId]: suggestion
    }));
    
    const goalType = goalTypes.find(g => g.id === goalId);
    toast({
      title: "Suggestion Added! ✨",
      description: `Added suggestion to ${goalType?.title || 'your goal'}`,
    });
    
    // Add a smooth scroll to the textarea for this goal
    setTimeout(() => {
      const element = document.getElementById(`goal-textarea-${goalId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }, 100);
  };

  const handleNext = () => {
    if (step === 1 && selectedGoals.length > 0) {
      setStep(2);
    }
  };

  const handleComplete = () => {
    const goalsWithDescriptions = selectedGoals.map(goalId => {
      const goalType = goalTypes.find(g => g.id === goalId);
      return {
        type: goalType?.title || '',
        description: goalDescriptions[goalId] || '',
      };
    });
    
    // Navigate to task generation page with goals data
    navigate('/task-generation', { 
      state: { goals: goalsWithDescriptions }
    });
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What's your top focus right now?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select all that apply. We'll help you break these down into actionable steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {goalTypes.map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleGoalToggle(goal.id)}
                className={`bg-white border-2 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:translate-y-[-4px] ${
                  selectedGoals.includes(goal.id) 
                    ? 'border-[#6FCC7F] bg-green-50 shadow-lg' 
                    : 'border-gray-200 hover:border-green-200'
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{goal.emoji}</div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {goal.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button 
              onClick={handleNext}
              disabled={selectedGoals.length === 0}
              className="bg-[#6FCC7F] hover:bg-[#5bb96a] text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next Step
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Main Content */}
        <div className="lg:w-2/3 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Let's go deeper.
              </h1>
              <p className="text-lg text-gray-600">
                Tell us more about your goals so we can create personalized recommendations.
              </p>
            </div>

            <div className="space-y-8">
              {selectedGoals.map((goalId) => {
                const goal = goalTypes.find(g => g.id === goalId);
                if (!goal) return null;

                const hasContent = goalDescriptions[goalId]?.length > 0;
                
                return (
                  <div key={goalId} className={`bg-white border-2 rounded-2xl p-6 shadow-sm transition-all duration-300 ${
                    hasContent ? 'border-[#6FCC7F] bg-green-50/30' : 'border-gray-200'
                  }`}>
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{goal.emoji}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {goal.title}
                      </h3>
                      {hasContent && (
                        <div className="ml-auto flex items-center text-[#6FCC7F] text-sm">
                          <Sparkles className="w-4 h-4 mr-1" />
                          Ready
                        </div>
                      )}
                    </div>
                    <Textarea
                      id={`goal-textarea-${goalId}`}
                      placeholder={`What does ${goal.title.toLowerCase()} look like for you? Be specific about your goals and timeline.`}
                      value={goalDescriptions[goalId] || ''}
                      onChange={(e) => setGoalDescriptions(prev => ({
                        ...prev,
                        [goalId]: e.target.value
                      }))}
                      className={`min-h-24 resize-none transition-all duration-200 ${
                        hasContent 
                          ? 'border-[#6FCC7F] focus:border-[#6FCC7F] focus:ring-[#6FCC7F] bg-white' 
                          : 'border-gray-200 focus:border-[#6FCC7F] focus:ring-[#6FCC7F]'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <div className="mb-4">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                  <span>{selectedGoals.filter(goalId => goalDescriptions[goalId]?.length > 0).length}</span>
                  <span>of</span>
                  <span>{selectedGoals.length}</span>
                  <span>goals detailed</span>
                </div>
              </div>
              <Button 
                onClick={handleComplete}
                disabled={selectedGoals.some(goalId => !goalDescriptions[goalId]?.trim())}
                className="bg-[#6FCC7F] hover:bg-[#5bb96a] text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Let's Begin
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Example Prompts Side Panel */}
        <ExamplePrompts 
          selectedGoals={selectedGoals} 
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
    </div>
  );
};

export default Onboarding;
