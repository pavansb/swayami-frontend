
import React from 'react';

const SocialProofSection = () => {
  const testimonials = [
    {
      quote: "It's Notion meets Headspace, but 10x more actionable.",
      author: "Early Beta User #12"
    },
    {
      quote: "I started a side hustle, fixed my sleep, and landed my dream role. It works.",
      author: "Ahaan (Beta Tester)"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
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
