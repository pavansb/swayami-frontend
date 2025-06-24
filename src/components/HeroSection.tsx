
import React from 'react';

const HeroSection = () => {
  const scrollToDemo = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="swayami-container">
        <div className="text-center max-w-4xl mx-auto mb-16 fade-up-on-scroll">
          <h1 className="text-5xl lg:text-7xl font-bold text-swayami-black mb-6 leading-tight">
            Own your day before it owns you.
          </h1>
          <p className="text-xl lg:text-2xl text-swayami-light-text mb-10 leading-relaxed">
            Swayami turns goals, habits and tasks into one clear mirror—so every decision starts with focus.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={scrollToWaitlist}
              className="swayami-button text-lg px-8 py-4"
            >
              Join the wait-list →
            </button>
            <button 
              onClick={scrollToDemo}
              className="swayami-button-ghost text-lg font-medium"
            >
              See it in action ↓
            </button>
          </div>
        </div>

        {/* Browser mockup with product screenshot */}
        <div className="max-w-5xl mx-auto fade-up-on-scroll">
          <div className="bg-gray-100 rounded-t-xl p-4 border border-swayami-border border-b-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="bg-white rounded border border-gray-300 px-4 py-2 text-sm text-gray-600">
              app.swayami.com
            </div>
          </div>
          <div className="border border-swayami-border border-t-0 rounded-b-xl overflow-hidden">
            <img 
              src="/lovable-uploads/c4a475f3-8a30-4985-971e-34084beb6e74.png" 
              alt="Swayami Dashboard - Daily planning interface"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
