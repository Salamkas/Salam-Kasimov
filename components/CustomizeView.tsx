import React, { useState } from 'react';
import { VOICES, SOUNDSCAPES } from '../constants';

interface CustomizeViewProps {
  onBack: () => void;
  onSubmit: (voiceId: string, soundscapeId: string) => void;
  currentVoiceId: string;
  currentSoundscapeId: string;
}

const CustomizeView: React.FC<CustomizeViewProps> = ({ onBack, onSubmit, currentVoiceId, currentSoundscapeId }) => {
  const [voiceId, setVoiceId] = useState(currentVoiceId);
  const [soundscapeId, setSoundscapeId] = useState(currentSoundscapeId);

  return (
    <div className="flex flex-col min-h-screen px-6 pt-6 pb-8 gradient-bg overflow-y-auto">
      <nav className="flex items-center mb-10">
        <button onClick={onBack} className="p-2 -ml-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="flex-1 text-center font-bold text-slate-800 text-[10px] uppercase tracking-widest">Step 2: Customization</span>
      </nav>

      <header className="mb-10 text-center">
        <h1 className="serif text-4xl mb-3 heading-gradient py-1">Personalize</h1>
        <p className="text-sm text-slate-800 leading-relaxed font-bold">
          Align the frequency with your vision.
        </p>
      </header>

      <div className="space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-widest">1. Select Voice</h3>
          </div>
          <div className="space-y-3">
            {VOICES.map((v) => (
              <label 
                key={v.id} 
                className={`flex items-center p-4 rounded-3xl cursor-pointer transition-all border-2 ${
                  voiceId === v.elevenLabsId ? 'bg-white border-[#1E3A8A] shadow-lg scale-[1.02]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-2xl">
                  {v.gender === 'female' ? '👩' : '👨'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{v.name}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{v.description}</p>
                </div>
                <input 
                  type="radio" 
                  name="voice" 
                  checked={voiceId === v.elevenLabsId} 
                  onChange={() => setVoiceId(v.elevenLabsId)}
                  className="w-5 h-5 accent-[#1E3A8A]"
                />
              </label>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-widest">2. Background Sound</h3>
          </div>
          <div className="space-y-3">
            {SOUNDSCAPES.map((s) => (
              <label 
                key={s.id} 
                className={`flex items-center p-4 rounded-3xl cursor-pointer transition-all border-2 ${
                  soundscapeId === s.id ? 'bg-white border-[#1E3A8A] shadow-lg scale-[1.02]' : 'bg-white border-slate-200'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-4 text-2xl">
                  ✨
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{s.name}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{s.description}</p>
                </div>
                <input 
                  type="radio" 
                  name="soundscape" 
                  checked={soundscapeId === s.id} 
                  onChange={() => setSoundscapeId(s.id)}
                  className="w-5 h-5 accent-[#1E3A8A]"
                />
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-16 sticky bottom-4">
        <button 
          onClick={() => onSubmit(voiceId, soundscapeId)}
          className="w-full bg-[#1E3A8A] text-white py-5 rounded-full flex items-center justify-center gap-4 shadow-xl shadow-blue-200 font-bold active:scale-[0.98] transition-all"
        >
          <span className="uppercase tracking-widest text-sm">Generate Meditation</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12H19M19 12L12 5M19 12L12 19"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CustomizeView;