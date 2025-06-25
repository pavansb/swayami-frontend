
import React from 'react';

const HeroSection = () => {
  const scrollToDemo = () => {
    const element = document.getElementById('how-it-works');
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
    <section className="py-20 lg:py-32 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="swayami-container">
        <div className="text-center max-w-4xl mx-auto mb-16 fade-up-on-scroll">
          <h1 className="text-5xl lg:text-7xl font-bold text-swayami-black dark:text-white mb-6 leading-tight tracking-tight">
            Own your growth. Every single day.
          </h1>
          <h2 className="text-xl lg:text-2xl text-swayami-light-text dark:text-gray-300 mb-10 leading-relaxed font-light">
            Swayami is your AI-powered self-reliance dashboard — helping you set meaningful goals, build powerful habits, and reflect deeply.<br />
            A tool to bring structure, clarity, and progress to your most important work — both personal and professional.
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button 
              onClick={scrollToWaitlist}
              className="bg-swayami-primary hover:bg-swayami-primary-hover text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:translate-y-[-2px]"
            >
              Join the Early Access Waitlist
            </button>
            <button 
              onClick={scrollToDemo}
              className="swayami-button-ghost text-lg font-medium border border-swayami-primary dark:border-purple-400 px-8 py-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all duration-200"
            >
              See How It Works ↓
            </button>
          </div>
        </div>

        {/* Browser mockup with product screenshot */}
        <div className="max-w-5xl mx-auto fade-up-on-scroll">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-t-xl p-4 border border-swayami-border dark:border-gray-700 border-b-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
              app.swayami.com
            </div>
          </div>
          <div className="border border-swayami-border dark:border-gray-700 border-t-0 rounded-b-xl overflow-hidden shadow-2xl">
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
