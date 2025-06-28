import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';

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

const ExamplePrompts = ({ selectedGoals }: { selectedGoals: string[] }) => {
  const [currentExamples, setCurrentExamples] = useState<Record<string, number>>({});

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
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, [selectedGoals]);

  if (selectedGoals.length === 0) {
    return (
      <div className="lg:w-1/3 bg-gradient-to-br from-purple-50 to-purple-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-[#9650D4] mx-auto mb-4 opacity-50" />
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
    <div className="lg:w-1/3 bg-gradient-to-br from-purple-50 to-purple-100 p-8">
      <div className="sticky top-8">
        <div className="flex items-center mb-6">
          <Sparkles className="w-6 h-6 text-[#9650D4] mr-2" />
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
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{goalType.emoji}</span>
                  <h4 className="font-semibold text-gray-800 text-sm">
                    {goalType.title}
                  </h4>
                </div>
                <div 
                  key={currentIndex} // Force re-render for animation
                  className="text-gray-700 text-sm leading-relaxed animate-in fade-in duration-500"
                >
                  "{currentExample}"
                </div>
                <div className="flex justify-center mt-3">
                  <div className="flex space-x-1">
                    {examples.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-[#9650D4]' 
                            : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-8 p-4 bg-white/50 rounded-xl border border-white/50">
          <p className="text-xs text-gray-600 text-center">
            💡 Use these as inspiration for your own goals. Be specific about what you want to achieve!
          </p>
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
                    ? 'border-[#9650D4] bg-purple-50 shadow-lg' 
                    : 'border-gray-200 hover:border-purple-200'
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
              className="bg-[#9650D4] hover:bg-[#8547C4] text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

                return (
                  <div key={goalId} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{goal.emoji}</span>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {goal.title}
                      </h3>
                    </div>
                    <Textarea
                      placeholder={`What does ${goal.title.toLowerCase()} look like for you? Be specific about your goals and timeline.`}
                      value={goalDescriptions[goalId] || ''}
                      onChange={(e) => setGoalDescriptions(prev => ({
                        ...prev,
                        [goalId]: e.target.value
                      }))}
                      className="min-h-24 resize-none border-gray-200 focus:border-[#9650D4] focus:ring-[#9650D4]"
                    />
                  </div>
                );
              })}
            </div>

            <div className="text-center mt-12">
              <Button 
                onClick={handleComplete}
                className="bg-[#9650D4] hover:bg-[#8547C4] text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-200 hover:shadow-lg"
              >
                Let's Begin
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Example Prompts Side Panel */}
        <ExamplePrompts selectedGoals={selectedGoals} />
      </div>
    </div>
  );
};

export default Onboarding;
