
import React from 'react';
import { QUOTES, COLORS } from '../constants';

interface LandingViewProps {
  onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  const introText = "Law of attraction works when you manifest your desired life in every little detail. We are here to create your personal dream life manifestation meditation.";

  return (
    <div className="flex flex-col min-h-screen px-6 pt-12 pb-8 gradient-bg overflow-y-auto">
      <header className="flex justify-center items-center mb-12">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.47 8.53L21 11L14.47 13.47L12 20L9.53 13.47L3 11L9.53 8.53L12 2Z" fill={COLORS.primary}/>
          </svg>
          <span className="text-sm font-bold text-[#1E3A8A] tracking-widest uppercase">Visionary AI</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center text-center">
        <h1 className="serif text-5xl leading-tight mb-6 heading-gradient py-2">
          Manifestation<br />requires<br />constant<br />practice.
        </h1>
        
        <p className="text-sm text-slate-800 max-w-[300px] mb-8 leading-relaxed font-bold">
          {introText}
        </p>

        <button 
          onClick={onStart}
          className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] transition-all mb-16"
        >
          Start My Manifestation
        </button>

        <div className="w-full text-left">
          <h2 className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-widest mb-6 text-center">The Power of Vision</h2>
          {QUOTES.map((quote, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 mb-4 card-shadow border-2 border-slate-100">
              <p className="italic text-slate-900 text-sm mb-4 leading-relaxed font-semibold">"{quote.text}"</p>
              <p className="text-[10px] font-bold text-[#1E3A8A] tracking-widest">— {quote.author}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="mt-20 flex flex-col items-center">
        <h3 className="serif text-3xl mb-4 heading-gradient">Ready to transform?</h3>
        <p className="text-xs text-slate-800 mb-8 text-center px-8 font-bold">Your future self is waiting for you to begin.</p>
        <button onClick={onStart} className="w-full bg-[#1E3A8A] text-white py-4 rounded-2xl font-bold shadow-lg">
            Get Started Now
        </button>
        <p className="text-[10px] text-slate-500 mt-12 uppercase font-bold tracking-widest">© 2024 Visionary AI</p>
      </footer>
    </div>
  );
};

export default LandingView;
