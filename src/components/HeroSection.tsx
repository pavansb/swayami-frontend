
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleStartToday = () => {
    navigate('/login');
  };

  return (
    <section className="relative py-20 lg:py-32 bg-gradient-to-br from-white via-green-50/30 to-white overflow-hidden">
      {/* Subtle background waves */}
      <div className="absolute inset-0 opacity-20">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1440 800" fill="none">
          <path d="M0,320 C480,380 960,200 1440,280 L1440,800 L0,800 Z" fill="url(#gradient)" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6FCC7F" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#6FCC7F" stopOpacity="0.05" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <div className="mb-16 animate-fade-in">
          <h1 className="text-5xl lg:text-7xl font-bold text-[#1A1A1A] mb-6 leading-tight tracking-tight">
            Command Your Growth.<br />
            <span className="text-[#6FCC7F]">Shape Your Destiny.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-[#4A4A4A] mb-10 leading-relaxed font-normal max-w-4xl mx-auto">
            Swayami is your AI-powered self-reliance mirror — guiding you to set meaningful goals, act with clarity, and reflect with depth.
          </p>
          
          <div className="mb-4">
            <button 
              onClick={handleStartToday}
              className="bg-[#6FCC7F] hover:bg-[#5bb96a] text-white text-lg font-semibold px-10 py-4 rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105 relative"
            >
              Start Today →
              <span className="absolute -top-3 -right-3 bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-bold">
                BETA
              </span>
            </button>
          </div>
          
          <p className="text-sm text-[#4A4A4A] font-medium">
            Loved by early adopters. Try for free now.
          </p>
        </div>

        {/* Mac-style browser mockup placeholder */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-gray-100 rounded-t-2xl p-4 border border-gray-200 border-b-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
            <div className="bg-white rounded border border-gray-300 px-4 py-2 text-sm text-gray-600">
              app.swayami.com
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-green-200 border border-gray-200 border-t-0 rounded-b-2xl h-96 flex items-center justify-center shadow-2xl">
            <div className="text-[#6FCC7F] text-6xl font-bold opacity-30">
              Swayami
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
