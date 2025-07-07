import { useState } from 'react';
import { Leaf, BrainCircuit, BarChart2 } from 'lucide-react';

const userLogos = [
  'https://placehold.co/80x32?text=Logo',
  'https://placehold.co/80x32?text=Logo',
  'https://placehold.co/80x32?text=Logo',
  'https://placehold.co/80x32?text=Logo',
  'https://placehold.co/80x32?text=Logo',
  'https://placehold.co/80x32?text=Logo',
];

const valueProps = [
  {
    icon: <Leaf className="w-8 h-8 text-[#28A745]" />, 
    title: 'Effortless Habit Building',
    desc: 'Form and sustain positive routines with daily nudges.'
  },
  {
    icon: <BrainCircuit className="w-8 h-8 text-[#28A745]" />, 
    title: 'AI Productivity Coach',
    desc: 'Personalized task and habit suggestions, always adapting.'
  },
  {
    icon: <BarChart2 className="w-8 h-8 text-[#28A745]" />, 
    title: 'Progress Visualized',
    desc: 'See your growth with clear, motivating dashboards.'
  }
];

const testimonials = [
  {
    quote: 'Swayami made habit tracking a joy. I feel calm and in control every day.',
    name: 'Priya K.',
    avatar: 'https://placehold.co/56x56?text=PK',
    role: 'Marketing Manager'
  },
  {
    quote: 'The AI suggestions are spot on. My productivity has never been better.',
    name: 'Rahul S.',
    avatar: 'https://placehold.co/56x56?text=RS',
    role: 'Entrepreneur'
  }
];

const faqs = [
  {
    q: 'How does Swayami use AI?',
    a: 'Swayami analyzes your routines and goals to recommend the best next steps.'
  },
  {
    q: 'Can I integrate it with my calendar?',
    a: 'It is on our roadmap, Swayami will sync with your favorite calendar apps.'
  },
  {
    q: 'Is there a mobile app?',
    a: 'Mobile apps are coming soon for iOS and Android.'
  },
  {
    q: 'How secure is my data?',
    a: 'Your data is encrypted and never shared.'
  }
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  return (
    <div className="bg-[#F4F8FB] min-h-screen w-full font-['Inter','Lexend_Deca',sans-serif] text-[#1A2A36]">
      <header className="flex items-center justify-between px-6 md:px-16 py-6 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="text-2xl font-extrabold tracking-tight text-[#28A745]">Swayami</div>
        <nav className="hidden md:flex gap-8 text-[#4A5568] font-medium">
          <a href="#" className="hover:text-[#28A745]">Home</a>
          <a href="#how" className="hover:text-[#28A745]">How It Works</a>
          <a href="#why" className="hover:text-[#28A745]">Why Swayami</a>
          <a href="#testimonials" className="hover:text-[#28A745]">Testimonials</a>
          <a href="#faq" className="hover:text-[#28A745]">FAQ</a>
        </nav>
        <button className="bg-[#28A745] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#219150] transition">Start Free</button>
      </header>
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 pt-16 pb-10 gap-12 md:gap-0">
        <div className="max-w-xl space-y-7 animate-fadein-up">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">Achieve More, Effortlessly.</h1>
          <p className="text-lg text-[#4A5568]">Calm productivity meets AI. Swayami helps you build habits, manage tasks, and reach your goals, without the overwhelm.</p>
          <div className="flex gap-4 mt-6">
            <button className="bg-[#28A745] text-white px-7 py-3 rounded-full font-semibold text-base hover:bg-[#219150] transition">Start Building Habits</button>
            <button className="bg-white border border-[#28A745] text-[#28A745] px-7 py-3 rounded-full font-semibold text-base hover:bg-[#E6F4EA] transition">Learn More</button>
          </div>
          <div className="flex items-center gap-4 mt-8">
            {userLogos.map((logo, i) => (
              <img key={i} src={logo} alt="User logo" className="h-8 w-auto opacity-70 grayscale" />
            ))}
          </div>
        </div>
        <div className="flex-1 flex justify-center animate-fadein-up delay-100">
          <div className="w-[900px] h-[420px] bg-gradient-to-tr from-[#E3F2FD] to-[#E6F4EA] rounded-3xl flex items-center justify-center shadow-xl overflow-hidden">
            <img src="/lovable-uploads/hero-illustration.png" alt="Swayami Hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>
      <section id="how" className="py-20 px-6 md:px-0 max-w-5xl mx-auto flex flex-col items-center gap-12">
        <div className="text-center max-w-2xl mx-auto animate-fadein-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-[#4A5568] mb-8">Swayami combines intelligent recommendations, seamless task management, and effortless habit formation—all in one calming dashboard.</p>
        </div>
        <div className="w-full flex justify-center animate-fadein-up delay-100">
          <div className="w-full max-w-3xl h-64 bg-white/70 rounded-2xl shadow-lg flex items-center justify-center overflow-hidden backdrop-blur-md border border-[#E3F2FD]">
            <img src="https://undraw.co/api/illustrations/undraw_dashboard_re_3b76.svg" alt="Swayami Dashboard Preview" className="w-full h-full object-contain opacity-90" />
          </div>
        </div>
      </section>
      <section id="why" className="py-20 px-6 md:px-0 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 animate-fadein-up">
          {valueProps.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-10 flex flex-col items-center text-center gap-4">
              <div className="mb-2">{v.icon}</div>
              <div className="font-bold text-lg">{v.title}</div>
              <div className="text-[#4A5568]">{v.desc}</div>
            </div>
          ))}
        </div>
      </section>
      <section id="testimonials" className="py-20 px-6 md:px-0 max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold text-center mb-12 animate-fadein-up">What Our Users Say</h3>
        <div className="grid md:grid-cols-2 gap-10 animate-fadein-up delay-100">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-4 border border-[#E3F2FD]">
              <div className="w-16 h-16 rounded-full bg-[#E6F4EA] flex items-center justify-center overflow-hidden mb-2">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 object-cover rounded-full" />
              </div>
              <div className="text-[#1A2A36] text-lg font-medium leading-relaxed">“{t.quote}”</div>
              <div className="font-semibold text-[#28A745]">{t.name}</div>
              <div className="text-[#4A5568] text-sm">{t.role}</div>
            </div>
          ))}
        </div>
      </section>
      <section id="faq" className="max-w-2xl mx-auto px-6 pb-24">
        <h4 className="text-2xl font-bold mb-8 text-center animate-fadein-up">Frequently Asked Questions</h4>
        <div className="space-y-4 animate-fadein-up delay-100">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-6">
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full text-left flex justify-between items-center font-semibold text-[#1A2A36] text-lg">
                {faq.q}
                <span>{openFaq === i ? '-' : '+'}</span>
              </button>
              {openFaq === i && <div className="mt-2 text-[#4A5568] text-base">{faq.a}</div>}
            </div>
          ))}
        </div>
      </section>
      <footer className="bg-white/90 py-12 flex flex-col items-center border-t border-[#E3F2FD]">
        <h6 className="text-2xl font-bold text-[#28A745] mb-4">Ready to Achieve More?</h6>
        <button className="bg-[#28A745] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#219150] transition">Start Free</button>
        <div className="text-[#4A5568] mt-6 opacity-70 text-sm">© {new Date().getFullYear()} Swayami. All rights reserved.</div>
      </footer>
      <style>{`
        .animate-fadein-up { opacity: 0; transform: translateY(32px); animation: fadein-up 0.7s cubic-bezier(.4,0,.2,1) forwards; }
        .animate-fadein-up.delay-100 { animation-delay: 0.15s; }
        @keyframes fadein-up { to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
} 