
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Set Your Intentions',
      description: 'Choose what matters — career growth, health, finances, clarity.',
    },
    {
      number: '2',
      title: 'Let the AI Assist',
      description: 'Swayami recommends tasks, routines, and reflections to help you act.',
    },
    {
      number: '3',
      title: 'Track Progress, Not Perfection',
      description: 'See your journey evolve through tasks, habits, and mood shifts.',
    },
    {
      number: '4',
      title: 'Reflect With Insight',
      description: 'Mindspace journaling + AI gives you clarity, not just noise.',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="swayami-container">
        <div className="text-center mb-16 fade-up-on-scroll">
          <h2 className="text-3xl lg:text-4xl font-bold text-swayami-black dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-swayami-light-text dark:text-gray-300 max-w-2xl mx-auto">
            Four simple steps to transform your daily chaos into purposeful action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 fade-up-on-scroll">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-swayami-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-swayami-black dark:text-white mb-4">
                {step.title}
              </h3>
              <p className="text-swayami-light-text dark:text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
