
import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Swayami didn't just organize my life. It made me feel in control again.",
      author: "Sarah Chen",
      role: "Product Designer"
    },
    {
      quote: "I launched a side hustle, cleared my head, and found clarity. This thing works.",
      author: "Ahaan Sharma",
      role: "Co-pilot"
    },
    {
      quote: "Finally, a productivity tool that actually helps me think, not just do.",
      author: "Marcus Rivera",
      role: "Startup Founder"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-[#F9F9F9]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#1A1A1A] mb-4">
            Trusted by builders
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
              <blockquote className="text-lg text-[#1A1A1A] mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#6FCC7F] rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-[#1A1A1A]">{testimonial.author}</div>
                  <div className="text-sm text-[#4A4A4A]">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
