
import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import WhoItsForSection from '../components/WhoItsForSection';
import FeatureSection from '../components/FeatureSection';
import HowItWorksSection from '../components/HowItWorksSection';
import SocialProofSection from '../components/SocialProofSection';
import CTASection from '../components/CTASection';
import WaitlistSection from '../components/WaitlistSection';
import FAQSection from '../components/FAQSection';
import Footer from '../components/Footer';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Index = () => {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navigation />
      <HeroSection />
      <WhoItsForSection />
      <FeatureSection />
      <HowItWorksSection />
      <SocialProofSection />
      <CTASection />
      <WaitlistSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
