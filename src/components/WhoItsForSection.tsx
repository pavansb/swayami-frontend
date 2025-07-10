
import React from 'react';

const WhoItsForSection = () => {
  const personas = [
    {
      emoji: '🧑‍💼',
      title: 'Founders',
      description: 'Build structure. Build traction. Build your vision.',
    },
    {
      emoji: '🎯',
      title: 'Creators',
      description: 'Turn scattered energy into consistent output.',
    },
    {
      emoji: '📈',
      title: 'Knowledge Workers',
      description: 'Get clarity on what matters most.',
    },
    {
      emoji: '😮‍💨',
      title: 'Burnt-out Professionals',
      description: 'Reflect. Reset. Realign.',
    },
    {
      emoji: '💡',
      title: 'Dreamers',
      description: 'Turn intentions into action, one day at a time.',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="swayami-container">
        <div className="text-center mb-16 fade-up-on-scroll">
          <h2 className="text-3xl lg:text-4xl font-bold text-swayami-black dark:text-white mb-4">
            Built for those who build themselves.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-up-on-scroll">
          {personas.map((persona, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-2xl border border-swayami-border dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:border-swayami-primary dark:hover:border-green-400 bg-white dark:bg-gray-800"
            >
              <div className="text-4xl mb-4">{persona.emoji}</div>
              <h3 className="text-xl font-semibold text-swayami-black dark:text-white mb-2">
                {persona.title}
              </h3>
              <p className="text-swayami-light-text dark:text-gray-300">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhoItsForSection;
