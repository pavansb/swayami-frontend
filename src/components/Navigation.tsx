
import React from 'react';

const Navigation = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full py-6 border-b border-swayami-border bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="swayami-container flex items-center justify-between">
        <div className="text-xl font-bold text-swayami-black">
          Swayami
        </div>
        
        <div className="flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('features')}
            className="swayami-button-ghost text-sm font-medium"
          >
            See Features
          </button>
          <button 
            onClick={() => scrollToSection('waitlist')}
            className="swayami-button text-sm"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
