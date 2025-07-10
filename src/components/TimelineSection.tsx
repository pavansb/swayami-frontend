
import React from 'react';

const TimelineSection = () => {
  const steps = [
    { number: '1', title: 'Define', icon: '🎯' },
    { number: '2', title: 'Plan', icon: '📋' },
    { number: '3', title: 'Execute', icon: '⚡' },
    { number: '4', title: 'Reflect', icon: '🪞' }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            How It Works
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#6FCC7F] text-white rounded-full flex items-center justify-center text-2xl mb-4">
                {step.icon}
              </div>
              <div className="text-sm text-[#6FCC7F] font-semibold mb-2">
                Step {step.number}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">
                {step.title}
              </h3>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
