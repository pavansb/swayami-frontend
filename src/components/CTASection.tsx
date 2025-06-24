
import React from 'react';

const CTASection = () => {
  const scrollToWaitlist = () => {
    const element = document.getElementById('waitlist');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-swayami-black">
      <div className="swayami-container text-center">
        <div className="fade-up-on-scroll">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to meet the mirror?
          </h2>
          <button 
            onClick={scrollToWaitlist}
            className="bg-white text-swayami-black px-8 py-4 rounded font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:translate-y-[-4px]"
          >
            Join the wait-list
          </button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
