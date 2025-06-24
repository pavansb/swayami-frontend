
import React from 'react';

const FeatureSection = () => {
  const features = [
    {
      title: "Life Snapshot",
      description: "See today's tasks, calendar & focus timer on one card."
    },
    {
      title: "Habit Pulse", 
      description: "Track streaks—get a gentle nudge the moment you slip."
    },
    {
      title: "Goal Progress",
      description: "Quarterly objectives auto-break into weekly sprints you can actually finish."
    }
  ];

  return (
    <section id="features" className="py-20">
      <div className="swayami-container">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="swayami-card fade-up-on-scroll hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <h3 className="text-xl font-semibold text-swayami-black mb-3">
                {feature.title}
              </h3>
              <p className="text-swayami-light-text leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
