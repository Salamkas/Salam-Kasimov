
import React, { useState } from 'react';

interface ReviewScriptViewProps {
  script: string;
  onScriptChange: (newScript: string) => void;
  onRegenerate: (feedback: string) => void;
  onNext: () => void;
  onBack: () => void;
  isRefining: boolean;
}

const ReviewScriptView: React.FC<ReviewScriptViewProps> = ({ 
  script, 
  onScriptChange, 
  onRegenerate, 
  onNext, 
  onBack,
  isRefining 
}) => {
  const [feedback, setFeedback] = useState("");

  return (
    <div className="flex flex-col min-h-screen px-6 pt-6 pb-8 gradient-bg overflow-y-auto">
      <nav className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full shadow-md">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2.5">
            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="flex-1 text-center font-bold text-slate-800 text-[10px] uppercase tracking-widest">Script Review</span>
      </nav>

      <header className="mb-6">
        <h2 className="serif text-4xl heading-gradient py-1">The Blueprint</h2>
        <p className="text-xs text-slate-800 font-bold mt-2 leading-relaxed">
          Please review your manifestation script. If you wish to change anything, you can press regenerate, make manual adjustments in specific parts, or give comments on what exactly you wish to change.
        </p>
      </header>

      <div className="flex-1 flex flex-col space-y-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-200 to-purple-200 rounded-[32px] blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
          <textarea
            value={script}
            onChange={(e) => onScriptChange(e.target.value)}
            className="relative w-full h-80 bg-white/90 backdrop-blur-xl border border-white rounded-[32px] p-6 text-sm text-slate-900 focus:outline-none shadow-xl font-medium leading-relaxed"
          />
        </div>

        <div className="bg-white/50 border border-white p-5 rounded-[28px] shadow-sm">
          <h3 className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-widest mb-3">AI Refinement (Optional)</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="e.g. 'Make it sound more luxurious' or 'Focus more on the luxury car details'..."
            className="w-full h-20 bg-transparent text-xs text-slate-700 focus:outline-none italic font-medium"
          />
          <button
            disabled={!feedback.trim() || isRefining}
            onClick={() => {
              onRegenerate(feedback);
              setFeedback("");
            }}
            className="mt-2 w-full py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-[10px] font-bold text-slate-600 rounded-xl uppercase tracking-widest transition-all"
          >
            {isRefining ? "Refining..." : "Apply AI Refinement"}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={onNext}
          disabled={script.length < 50 || isRefining}
          className="w-full bg-[#1E3A8A] text-white py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95"
        >
          <span className="uppercase tracking-[0.2em] text-[10px]">Continue to Voice</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ReviewScriptView;
