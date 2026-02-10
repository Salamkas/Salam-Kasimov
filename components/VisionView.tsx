
import React, { useState, useRef } from 'react';

interface VisionViewProps {
  vision: string;
  onVisionChange: (vision: string) => void;
  onAudioReady: (data: string, mimeType: string) => void;
  onBack: () => void;
  onSubmit: () => void;
}

const VisionView: React.FC<VisionViewProps> = ({ vision, onVisionChange, onAudioReady, onBack, onSubmit }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const touchStart = useRef<number | null>(null);
  
  const showInput = activeStep >= 4;
  const isValid = vision.length >= 100 || isRecording;

  const INSTRUCTIONS = [
    {
      title: "1. Follow the Clock",
      content: "Start from the moment you open your eyes until your head hits the pillow. Describe your morning routine, your workday wins, your social life, and how your day winds down.",
      icon: "⏰"
    },
    {
      title: "2. Name the Details",
      content: "Don’t just say 'a nice hotel' or 'a watch.' Name them. Use specific locations (like Mayfair), brands (like Tom Ford), and people. Specificity tells your brain this is real.",
      icon: "📍"
    },
    {
      title: "3. Activate Your Body Sensations",
      content: "Describe the temperature (e.g., '19° and sunny'), the smells (e.g., 'the scent of luxury skincare'), and the physical sensations (e.g., 'the shock of a cold shower' or 'the weight of a Rolex on your wrist').",
      icon: "✨"
    },
    {
      title: "4. Focus on the 'High' feelings",
      content: "Don't just describe what you are doing—describe how it makes you feel. Are you feeling magnetic, proud, highly focused, or deeply grateful? State your success as a current fact (e.g., 'My startup is valued at $20 million').",
      icon: "💎"
    }
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (diff > 50 && activeStep < 4) {
      // Swipe left
      setActiveStep(prev => prev + 1);
    } else if (diff < -50 && activeStep > 0) {
      // Swipe right
      setActiveStep(prev => prev - 1);
    }
    touchStart.current = null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorder.current.ondataavailable = (event) => audioChunks.current.push(event.data);
      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          onAudioReady(base64data, 'audio/webm');
          onVisionChange("Recording received... I am processing your spoken vision into a vivid reality.");
        };
      };
      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (err) {
      alert("Microphone access is required for voice manifestation.");
    }
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-6 pb-8 gradient-bg overflow-x-hidden">
      <nav className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 -ml-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm mr-4 z-10">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2.5">
            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="flex-1 text-center font-bold text-slate-800 text-[10px] uppercase tracking-[0.2em]">Vision Phase</span>
      </nav>

      {!showInput && (
        <div className="flex-1 flex flex-col animate-in fade-in duration-500">
          <header className="mb-8">
            <h2 className="serif text-3xl heading-gradient italic mb-4">Designing Reality</h2>
            <p className="text-sm text-slate-700 leading-relaxed font-semibold">
              To get a meditation that feels like a real memory, your brief needs to be as vivid as possible. Follow these simple steps to write or record your vision:
            </p>
          </header>

          <div 
            className="relative flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {INSTRUCTIONS.map((step, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-all duration-700 transform ${
                  idx === activeStep 
                    ? 'opacity-100 translate-x-0 scale-100 rotate-0' 
                    : idx < activeStep 
                      ? 'opacity-0 -translate-x-full scale-90 -rotate-12' 
                      : 'opacity-0 translate-x-full scale-110 rotate-12 pointer-events-none'
                }`}
              >
                <div className="h-full w-full bg-white/30 backdrop-blur-3xl border border-white/80 rounded-[48px] p-8 shadow-2xl flex flex-col justify-center border-t-white/90 border-l-white/90">
                  <div className="text-6xl mb-8 drop-shadow-lg">{step.icon}</div>
                  <h3 className="serif text-3xl text-[#1E3A8A] mb-4 font-medium italic">{step.title}</h3>
                  <p className="text-slate-800 font-bold leading-relaxed text-base italic opacity-90">
                    "{step.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-6">
            <div className="flex gap-3">
              {INSTRUCTIONS.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === activeStep ? 'w-10 bg-[#1E3A8A]' : 'w-2 bg-slate-300'}`} 
                />
              ))}
            </div>
            
            <button 
              onClick={() => setActiveStep(prev => prev + 1)}
              className="w-full bg-[#1E3A8A] text-white py-5 rounded-[24px] font-bold uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all"
            >
              {activeStep === 3 ? "Open My Vision" : "Swipe Left or Tap to Continue"}
            </button>
          </div>
        </div>
      )}

      {showInput && (
        <div className="flex-1 flex flex-col animate-in fade-in zoom-in-95 duration-700">
          <header className="mb-6">
            <h2 className="serif text-4xl heading-gradient italic py-1">Manifesting Now</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">First-person, Present Tense</p>
          </header>

          <div className="relative mb-6">
            <textarea
              value={vision}
              onChange={(e) => onVisionChange(e.target.value)}
              placeholder="I am waking up to the sound of the ocean..."
              className="w-full h-80 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 text-base text-slate-900 focus:ring-2 focus:ring-[#1E3A8A] focus:outline-none transition-all resize-none shadow-inner font-medium placeholder:italic placeholder:opacity-40"
            />
            
            <div className="absolute bottom-6 right-6">
              <button 
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-2xl border-4 border-white ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-[#1E3A8A]'}`}
              >
                {isRecording ? (
                  <div className="w-5 h-5 bg-white rounded-sm" />
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { t: "Follow the Clock", d: "Sunrise to sunset" },
              { t: "Name the Details", d: "Be ultra specific" },
              { t: "Activate Body", d: "Sensory sensations" },
              { t: "High Feelings", d: "Emotional facts" }
            ].map((item, i) => (
              <div key={i} className="bg-white/40 p-3 rounded-2xl border border-white/60">
                <p className="text-[9px] font-bold text-[#1E3A8A] uppercase tracking-tighter">{item.t}</p>
                <p className="text-[8px] text-slate-600 font-bold opacity-70 leading-none">{item.d}</p>
              </div>
            ))}
          </div>

          <button
            disabled={!isValid || isRecording}
            onClick={onSubmit}
            className={`w-full py-5 rounded-[24px] font-bold flex items-center justify-center gap-3 transition-all shadow-2xl ${
              isValid && !isRecording 
                ? 'bg-[#1E3A8A] text-white active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span className="uppercase tracking-[0.2em] text-[10px]">Transform Vision</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 2L14.47 8.53L21 11L14.47 13.47L12 20L9.53 13.47L3 11L9.53 8.53L12 2Z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default VisionView;
