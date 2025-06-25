
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Define What Matters',
      description: 'Start with 1–3 goals. Be honest. Be ambitious. We\'ll help you shape them.',
    },
    {
      number: '2',
      title: 'Get Guided By AI',
      description: 'You\'ll see smart suggestions — what to do, when to do it, and how it ladders up to your vision.',
    },
    {
      number: '3',
      title: 'Build Daily Momentum',
      description: 'Track habits, complete focused tasks, and get nudges when you drift.',
    },
    {
      number: '4',
      title: 'Reflect. Grow. Reset.',
      description: 'Your journal helps you zoom out. Your insights help you zoom in.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="swayami-container">
        <div className="text-center mb-16 fade-up-on-scroll">
          <h2 className="text-3xl lg:text-4xl font-bold text-swayami-black dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-lg text-swayami-light-text dark:text-gray-300 max-w-2xl mx-auto">
            A story-driven timeline to transform your daily chaos into purposeful action.
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
