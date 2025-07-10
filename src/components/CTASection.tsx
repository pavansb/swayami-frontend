
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();
  
  const handleStartToday = () => {
    navigate('/login');
  };

  return (
    <section className="py-20 bg-gradient-to-r from-swayami-primary to-green-600 dark:from-purple-800 dark:to-purple-900">
      <div className="swayami-container text-center">
        <div className="max-w-3xl mx-auto fade-up-on-scroll">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            You don't need another productivity app. You need a mirror.
          </h2>
          <p className="text-xl text-green-100 mb-10 leading-relaxed">
            Join 100+ early users already building self-discipline with Swayami.
          </p>
          <button 
            onClick={handleStartToday}
            className="bg-white text-swayami-primary hover:bg-gray-100 text-xl font-semibold px-12 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px] relative"
          >
            Start Today →
            <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
              BETA
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
