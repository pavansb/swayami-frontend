import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import AudienceSection from '../components/AudienceSection';
import ModernFeatureSection from '../components/ModernFeatureSection';
import TimelineSection from '../components/TimelineSection';
import TestimonialsSection from '../components/TestimonialsSection';
import StickyCTASection from '../components/StickyCTASection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Index = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <AudienceSection />
      <ModernFeatureSection />
      <TimelineSection />
      <TestimonialsSection />
      <StickyCTASection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
