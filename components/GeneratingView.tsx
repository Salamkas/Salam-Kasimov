import React, { useState, useEffect } from 'react';

const GeneratingView: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Weaving your vision...",
    "Selecting sensory details...",
    "Calibrating frequencies...",
    "Synthesizing the perfect voice...",
    "Almost ready..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-10 text-center gradient-bg">
      <div className="relative mb-16">
        <div className="w-32 h-32 rounded-full bg-blue-100/50 flex items-center justify-center animate-pulse">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#1E3A8A] to-[#9381BA] animate-float orb-glow"></div>
        </div>
      </div>
      
      <h2 className="serif text-3xl mb-4 heading-gradient py-1">Creating your reality</h2>
      <p className="text-sm text-slate-700 font-bold min-h-[1.5em] transition-all duration-500 uppercase tracking-widest">
        {steps[step]}
      </p>
      
      <div className="mt-12 w-full max-w-[200px] h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-purple-500 transition-all duration-500" 
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
      
      <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] animate-pulse">Processing Frequencies</p>
    </div>
  );
};

export default GeneratingView;