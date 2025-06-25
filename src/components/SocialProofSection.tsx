
import React from 'react';

const SocialProofSection = () => {
  const testimonials = [
    {
      quote: "Swayami didn't just organize my life. It made me feel in control again.",
      author: "Early Beta User"
    },
    {
      quote: "I launched a side hustle, cleared my head, and found clarity. This thing works.",
      author: "Ahaan, co-pilot"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="swayami-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 fade-up-on-scroll">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="text-center">
              <blockquote className="text-xl lg:text-2xl font-medium text-swayami-black dark:text-white mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <cite className="text-swayami-light-text dark:text-gray-300 text-lg">
                — {testimonial.author}
              </cite>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
