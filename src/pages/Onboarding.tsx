
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

const goalTypes = [
  { id: 'personal', emoji: '🧘', title: 'Personal Wellbeing' },
  { id: 'health', emoji: '💪', title: 'Health / Fitness' },
  { id: 'financial', emoji: '💰', title: 'Financial Discipline' },
  { id: 'career', emoji: '📈', title: 'Career Growth' },
  { id: 'hustle', emoji: '🎯', title: 'Side Hustle' },
  { id: 'mental', emoji: '🧠', title: 'Mental Clarity' },
];

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
    
    completeOnboarding(goalsWithDescriptions);
    navigate('/dashboard');
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="swayami-container max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-swayami-black mb-4">
              What's your top focus right now?
            </h1>
            <p className="text-swayami-light-text">
              Select all that apply. We'll help you break these down into actionable steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {goalTypes.map((goal) => (
              <div
                key={goal.id}
                onClick={() => handleGoalToggle(goal.id)}
                className={`swayami-card cursor-pointer transition-all duration-200 hover:shadow-lg hover:translate-y-[-4px] ${
                  selectedGoals.includes(goal.id) 
                    ? 'ring-2 ring-swayami-black bg-gray-50' 
                    : ''
                }`}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{goal.emoji}</div>
                  <h3 className="text-lg font-semibold text-swayami-black">
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
              className="swayami-button"
            >
              Next Step
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      <div className="swayami-container max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-swayami-black mb-4">
            Let's go deeper.
          </h1>
          <p className="text-swayami-light-text">
            Tell us more about your goals so we can create personalized recommendations.
          </p>
        </div>

        <div className="space-y-8">
          {selectedGoals.map((goalId) => {
            const goal = goalTypes.find(g => g.id === goalId);
            if (!goal) return null;

            return (
              <div key={goalId} className="swayami-card">
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{goal.emoji}</span>
                  <h3 className="text-lg font-semibold text-swayami-black">
                    {goal.title}
                  </h3>
                </div>
                <Textarea
                  placeholder={`What does ${goal.title.toLowerCase()} look like for you?`}
                  value={goalDescriptions[goalId] || ''}
                  onChange={(e) => setGoalDescriptions(prev => ({
                    ...prev,
                    [goalId]: e.target.value
                  }))}
                  className="min-h-20"
                />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button 
            onClick={handleComplete}
            className="swayami-button"
          >
            Let's Begin
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
