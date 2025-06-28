
import React from 'react';
import { useNavigate } from 'react-router-dom';

const StickyCTASection = () => {
  const navigate = useNavigate();
  
  const handleStartToday = () => {
    navigate('/login');
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#9650D4] to-[#8547C4]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
          Stop drifting. Build your momentum with Swayami.
        </h2>
        <button 
          onClick={handleStartToday}
          className="bg-white text-[#9650D4] hover:bg-gray-100 text-xl font-semibold px-12 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 relative"
        >
          Start Today
          <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
            BETA
          </span>
        </button>
      </div>
    </section>
  );
};

export default StickyCTASection;
