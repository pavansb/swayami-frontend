
import React from 'react';

const FeatureSection = () => {
  const features = [
    {
      icon: "🗂",
      title: "Set Meaningful Goals",
      description: "Break down your vision into manageable milestones — personal, professional, and everything in between."
    },
    {
      icon: "🧠", 
      title: "LLM-Powered Task Recommendations",
      description: "Don't just set goals — let AI guide your next move, every day."
    },
    {
      icon: "📈",
      title: "Track Progress Like a Game",
      description: "Habit rings, streaks, XP bars — watch momentum build as you stay consistent."
    },
    {
      icon: "✍️",
      title: "Reflect With Depth",
      description: "Mindspace, your AI journaling companion, turns chaos into clarity."
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="swayami-container">
        <div className="text-center mb-16 fade-up-on-scroll">
          <h2 className="text-3xl lg:text-4xl font-bold text-swayami-black dark:text-white mb-4">
            Your goals. Your rhythm. Your mirror.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 fade-up-on-scroll">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="swayami-card hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-swayami-black dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-swayami-light-text dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
