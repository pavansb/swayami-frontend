
import React from 'react';

const WhoItsForSection = () => {
  const personas = [
    {
      emoji: '🧠',
      title: 'Founders',
      description: 'Structure your day. Launch your vision.',
    },
    {
      emoji: '📈',
      title: 'Knowledge Workers',
      description: 'Reflect, act, and get shit done.',
    },
    {
      emoji: '🎨',
      title: 'Creators',
      description: 'Turn chaos into consistent output.',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="swayami-container">
        <div className="text-center mb-16 fade-up-on-scroll">
          <h2 className="text-3xl lg:text-4xl font-bold text-swayami-black dark:text-white mb-4">
            Built for People Who Build
          </h2>
          <p className="text-lg text-swayami-light-text dark:text-gray-300 max-w-2xl mx-auto">
            Whether you're scaling a startup, mastering your craft, or creating something new — Swayami meets you where you are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 fade-up-on-scroll">
          {personas.map((persona, index) => (
            <div 
              key={index}
              className="text-center p-8 rounded-2xl border border-swayami-border dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:border-swayami-primary dark:hover:border-purple-400 bg-white dark:bg-gray-800"
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
