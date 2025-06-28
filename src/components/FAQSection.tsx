
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
  const faqs = [
    {
      question: "How does Swayami help me stay focused?",
      answer: "Swayami gives you a single, distraction-free mirror of your goals, tasks, and habits. Every day starts with clarity on what truly matters."
    },
    {
      question: "How does AI power my daily tasks?",
      answer: "Our LLM analyzes your goals to generate specific, actionable tasks, breaking big ambitions into achievable daily steps — so you build momentum instead of feeling overwhelmed."
    },
    {
      question: "What's the benefit of journaling with Swayami?",
      answer: "Your Mindspace journal is analyzed by our AI to extract patterns, highlight blockers, and surface powerful insights — helping you understand yourself and adapt faster."
    },
    {
      question: "How is my progress tracked?",
      answer: "Every task you complete and journal you write contributes to your progress metrics: streaks, goal completion percentages, and personalized reflections keep you accountable."
    },
    {
      question: "How does Swayami build self-discipline?",
      answer: "By turning your long-term goals into small, daily wins and surfacing insights on your habits, Swayami transforms discipline from a chore into an empowering, rewarding experience."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="swayami-container">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-swayami-black text-center mb-12 fade-up-on-scroll">
            Frequently Asked Questions
          </h2>
          
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index}
                value={`item-${index}`}
                className="swayami-card fade-up-on-scroll border-0 bg-white rounded-xl shadow-sm"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-swayami-black px-6 py-6 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-swayami-light-text px-6 pb-6 pt-0 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
