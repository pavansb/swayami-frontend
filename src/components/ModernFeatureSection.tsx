
import React from 'react';

const ModernFeatureSection = () => {
  const features = [
    {
      icon: "🎯",
      title: "Set Powerful Goals",
      description: "Define what truly matters."
    },
    {
      icon: "🤖", 
      title: "AI-Generated Tasks",
      description: "Smart recommendations every day."
    },
    {
      icon: "✍️",
      title: "Reflect with Insight",
      description: "Journal, analyze, grow."
    },
    {
      icon: "🎮",
      title: "Gamified Progress",
      description: "Make wins addictive."
    }
  ];

  return (
    <section className="py-20 bg-[#F9F9F9]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Everything you need to grow
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#9650D4]/20"
            >
              <div className="text-3xl mb-4" style={{ color: '#9650D4' }}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#4A4A4A] leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModernFeatureSection;
