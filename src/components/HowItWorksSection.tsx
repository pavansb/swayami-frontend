
import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "1",
      title: "Define",
      description: "Add goals, habits & today's tasks in seconds."
    },
    {
      number: "2", 
      title: "Plan",
      description: "Drag cards to fit your flow (work / personal)."
    },
    {
      number: "3",
      title: "Focus", 
      description: "Start a 25 m timer; stay distraction-free."
    },
    {
      number: "4",
      title: "Reflect",
      description: "Weekly scorecard surfaces wins, misses & next tweaks."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="swayami-container">
        <div className="text-center mb-16 fade-up-on-scroll">
          <h2 className="text-4xl font-bold text-swayami-black mb-4">
            How It Works
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center fade-up-on-scroll"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-12 h-12 bg-swayami-black text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="text-xl font-semibold text-swayami-black mb-3">
                {step.title}
              </h3>
              <p className="text-swayami-light-text leading-relaxed">
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
