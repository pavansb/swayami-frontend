
import React from 'react';

const AudienceSection = () => {
  const audiences = [
    {
      title: 'For Founders',
      description: 'Focus on vision, ship faster.',
      icon: '🚀'
    },
    {
      title: 'For Creators',
      description: 'Stay consistent with your craft.',
      icon: '🎨'
    },
    {
      title: 'For Professionals',
      description: 'Build habits and measure progress.',
      icon: '📊'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {audiences.map((audience, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200"
            >
              <div className="text-4xl mb-4">{audience.icon}</div>
              <h3 className="text-xl font-bold text-[#1A1A1A] mb-3">
                {audience.title}
              </h3>
              <p className="text-[#4A4A4A] leading-relaxed">
                {audience.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AudienceSection;
