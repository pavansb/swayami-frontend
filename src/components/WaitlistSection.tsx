
import React, { useState } from 'react';
import { toast } from 'sonner';

const WaitlistSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate webhook call - replace with actual endpoint
      console.log('Submitting email to waitlist:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Welcome to the waitlist! We\'ll be in touch soon.');
      setEmail('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="waitlist" className="py-20">
      <div className="swayami-container">
        <div className="max-w-lg mx-auto text-center fade-up-on-scroll">
          <h2 className="text-3xl font-bold text-swayami-black mb-8">
            Join the Waitlist
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@address.com"
              className="w-full px-4 py-3 border border-swayami-border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-swayami-black focus:border-transparent"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full swayami-button text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Joining...' : 'Join Waitlist'}
            </button>
          </form>
          
          <p className="text-sm text-swayami-light-text mt-4">
            No spam. Just clarity.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WaitlistSection;
