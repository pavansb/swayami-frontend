import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleStartToday = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="w-full py-4 bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/9cf37de0-ba28-4f72-9b5c-2c838d6562f4.png" 
                alt="Swayami" 
                className="h-16 sm:h-20 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
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
              <Button 
                onClick={handleStartToday}
                className="bg-[#6FCC7F] hover:bg-[#5bb96a] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg relative"
              >
                Start Today
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  BETA
                </span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile CTA Buttons */}
              <Link 
                to="/login"
                className="text-xs font-medium text-[#6FCC7F] hover:text-[#5bb96a] transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Button 
                onClick={handleStartToday}
                size="sm"
                className="bg-[#6FCC7F] hover:bg-[#5bb96a] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 relative"
              >
                Start Today
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold text-[10px]">
                  BETA
                </span>
              </Button>
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={toggleMobileMenu}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="p-6 pt-20">
              <div className="space-y-6">
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="block w-full text-left text-gray-700 hover:text-[#6FCC7F] text-lg font-medium transition-colors py-2"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('testimonials')}
                  className="block w-full text-left text-gray-700 hover:text-[#6FCC7F] text-lg font-medium transition-colors py-2"
                >
                  Testimonials
                </button>
                <hr className="border-gray-200" />
                <Link 
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-left text-gray-700 hover:text-[#6FCC7F] text-lg font-medium transition-colors py-2"
                >
                  Login
                </Link>
                <Button 
                  onClick={handleStartToday}
                  className="w-full bg-[#6FCC7F] hover:bg-[#5bb96a] text-white py-3 rounded-xl text-lg font-semibold transition-all duration-200 relative"
                >
                  Start Today
                  <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    BETA
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
