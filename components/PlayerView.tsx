import React, { useState, useRef, useEffect } from 'react';
import { ManifestationData } from '../types';
import { SOUNDSCAPES } from '../constants';

interface PlayerViewProps {
  data: ManifestationData;
  onReset: () => void;
}

const PlayerView: React.FC<PlayerViewProps> = ({ data, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const voiceAudioRef = useRef<HTMLAudioElement>(null);
  const backgroundAudioRef = useRef<HTMLAudioElement>(null);

  const currentSoundscape = SOUNDSCAPES.find(s => s.id === data.soundscapeId) || SOUNDSCAPES[0];

  const togglePlay = () => {
    if (isPlaying) {
      voiceAudioRef.current?.pause();
      backgroundAudioRef.current?.pause();
    } else {
      voiceAudioRef.current?.play();
      backgroundAudioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const audio = voiceAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
      backgroundAudioRef.current?.pause();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen px-6 pt-6 pb-12 gradient-bg">
      <nav className="flex justify-between items-center mb-8">
        <button onClick={onReset} className="p-2 bg-white rounded-full shadow-md hover:bg-slate-50 transition-colors">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[10px] font-bold text-[#1E3A8A] uppercase tracking-[0.2em]">Live Meditation</span>
        <div className="w-10"></div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="relative w-72 h-72 flex items-center justify-center mb-16">
            <div className={`absolute w-full h-full border-2 border-blue-200 rounded-full animate-ping opacity-20 ${isPlaying ? 'block' : 'hidden'}`}></div>
            <div className={`w-64 h-64 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#9381BA] shadow-2xl transition-transform duration-1000 ${isPlaying ? 'scale-110' : 'scale-100'} orb-glow border-4 border-white`}>
                <div className="w-full h-full rounded-full opacity-30 bg-[radial-gradient(circle_at_30%_30%,white,transparent)]"></div>
            </div>
        </div>

        <div className="text-center mb-10">
            <h2 className="serif text-4xl mb-1 heading-gradient py-1 italic">Morning Manifestation</h2>
            <p className="text-[10px] font-bold text-slate-800 uppercase tracking-[0.2em]">Aligned to your specific vision</p>
        </div>

        <div className="w-full bg-white p-8 rounded-[40px] shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3 text-[10px] font-bold text-slate-900">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration || 0)}</span>
            </div>
            
            <div className="w-full h-2 bg-slate-100 rounded-full mb-10 overflow-hidden relative border border-slate-50">
                <div 
                    className="h-full bg-gradient-to-r from-[#1E3A8A] to-[#9381BA] rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex items-center justify-center">
                <button 
                    onClick={togglePlay}
                    className="w-20 h-20 bg-[#1E3A8A] rounded-full flex items-center justify-center shadow-xl shadow-blue-200 border-2 border-white active:scale-90 transition-all"
                >
                    {isPlaying ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                            <rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>
                        </svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="white" className="ml-1">
                            <path d="M5 3L19 12L5 21V3Z"/>
                        </svg>
                    )}
                </button>
            </div>
        </div>
        
        <audio ref={voiceAudioRef} src={data.audioUrl} />
        <audio ref={backgroundAudioRef} src={currentSoundscape.url} loop />
      </main>

      <div className="mt-auto pt-8 flex flex-col gap-4">
        <a 
          href={data.audioUrl} 
          download="manifestation_audio.mp3" 
          className="text-center text-sm font-bold text-white uppercase tracking-widest bg-[#1E3A8A] py-5 rounded-2xl shadow-xl hover:bg-[#162a63] transition-colors"
        >
          Download Session
        </a>
        <button onClick={onReset} className="text-center text-[10px] font-bold text-slate-900 uppercase tracking-widest py-2 hover:opacity-70">
            Create New Practice
        </button>
      </div>
    </div>
  );
};

export default PlayerView;