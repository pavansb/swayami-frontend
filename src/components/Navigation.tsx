
import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full py-4 bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/9cf37de0-ba28-4f72-9b5c-2c838d6562f4.png" 
            alt="Swayami" 
            className="h-8 w-auto"
          />
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => scrollToSection('how-it-works')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Testimonials
          </button>
          <Link 
            to="/login"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <button 
            onClick={() => scrollToSection('waitlist')}
            className="bg-[#9650D4] hover:bg-[#8547C4] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg"
          >
            Join Waitlist
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
