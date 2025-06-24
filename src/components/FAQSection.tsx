
import React from 'react';

const FAQSection = () => {
  const faqs = [
    {
      question: "Is it free?",
      answer: "Early beta is 100% free."
    },
    {
      question: "Do I need integrations?",
      answer: "Manual first; Google Calendar & Notion coming soon."
    },
    {
      question: "Launch date?",
      answer: "Q4 2025—wait-listers get first invites."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="swayami-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-swayami-black text-center mb-12 fade-up-on-scroll">
            FAQ
          </h2>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="swayami-card fade-up-on-scroll"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <h3 className="text-lg font-semibold text-swayami-black mb-2">
                  {faq.question}
                </h3>
                <p className="text-swayami-light-text">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
