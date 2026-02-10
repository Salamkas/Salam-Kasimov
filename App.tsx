
import React, { useState, useEffect } from 'react';
import { Step, ManifestationData, SavedSession } from './types';
import LandingView from './components/LandingView';
import VisionView from './components/VisionView';
import ReviewScriptView from './components/ReviewScriptView';
import CustomizeView from './components/CustomizeView';
import GeneratingView from './components/GeneratingView';
import PlayerView from './components/PlayerView';
import ProfileView from './components/ProfileView';
import { generateMeditationScript, refineMeditationScript } from './services/geminiService';
import { generateSpeech } from './services/elevenLabsService';
import { mixAudio } from './services/audioMixer';
import { VOICES, SOUNDSCAPES } from './constants';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>(Step.INTRO);
  const [data, setData] = useState<ManifestationData>({
    vision: '',
    voiceId: VOICES[0].elevenLabsId,
    soundscapeId: SOUNDSCAPES[0].id,
    script: '',
  });
  const [recordedAudio, setRecordedAudio] = useState<{data: string, mimeType: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('visionary_sessions');
    if (saved) {
      try {
        setSavedSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load sessions", e);
      }
    }
  }, []);

  const handleVisionSubmit = async () => {
    setError(null);
    setCurrentStep(Step.GENERATING);
    try {
      const input = recordedAudio || data.vision;
      const script = await generateMeditationScript(input);
      setData(prev => ({ ...prev, script }));
      setCurrentStep(Step.REVIEW_SCRIPT);
    } catch (err: any) {
      setError(err.message || "Failed to generate script.");
      setCurrentStep(Step.VISION);
    }
  };

  const handleRefineScript = async (feedback: string) => {
    setIsProcessing(true);
    try {
      const newScript = await refineMeditationScript(data.script, feedback);
      setData(prev => ({ ...prev, script: newScript }));
    } catch (err: any) {
      setError("Failed to refine script.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinalSubmit = async (voiceId: string, soundscapeId: string) => {
    setError(null);
    setData(prev => ({ ...prev, voiceId, soundscapeId }));
    setCurrentStep(Step.GENERATING);
    
    try {
      // 1. Generate Voiceover
      const voiceoverUrl = await generateSpeech(data.script, voiceId);
      
      // 2. Find background URL
      const bgSound = SOUNDSCAPES.find(s => s.id === soundscapeId) || SOUNDSCAPES[0];
      
      // 3. Mix Audio
      const finalMixedUrl = await mixAudio(voiceoverUrl, bgSound.url);
      
      const sessionDate = new Date().toLocaleDateString();
      const sessionId = Math.random().toString(36).substr(2, 9);

      const updatedData = { 
        ...data,
        voiceId,
        soundscapeId,
        voiceoverUrl, 
        audioUrl: finalMixedUrl,
        date: sessionDate,
        id: sessionId
      };
      
      setData(updatedData);
      
      const newSession: SavedSession = {
        id: sessionId,
        date: sessionDate,
        vision: data.vision,
        script: data.script,
        audioUrl: finalMixedUrl,
        voiceId: voiceId,
        soundscapeId: soundscapeId
      };
      
      const newLibrary = [newSession, ...savedSessions];
      setSavedSessions(newLibrary);
      localStorage.setItem('visionary_sessions', JSON.stringify(newLibrary));

      setCurrentStep(Step.PLAYER);
    } catch (err: any) {
      console.error("Process Error:", err);
      setError(err.message || "Failed to create meditation.");
      setCurrentStep(Step.CUSTOMIZE);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-[#F9F9FB] overflow-hidden shadow-2xl border-x border-gray-100">
      <div className="absolute top-4 right-4 z-50">
        <button 
          onClick={() => setCurrentStep(Step.PROFILE)}
          className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-slate-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E3A8A" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
      </div>

      {currentStep === Step.INTRO && <LandingView onStart={() => setCurrentStep(Step.VISION)} />}
      
      {currentStep === Step.VISION && (
        <VisionView 
          vision={data.vision}
          onVisionChange={(v) => setData(prev => ({ ...prev, vision: v }))}
          onAudioReady={setRecordedAudio}
          onBack={() => setCurrentStep(Step.INTRO)} 
          onSubmit={handleVisionSubmit} 
        />
      )}

      {currentStep === Step.REVIEW_SCRIPT && (
        <ReviewScriptView 
          script={data.script}
          onScriptChange={(s) => setData(prev => ({ ...prev, script: s }))}
          onRegenerate={handleRefineScript}
          onNext={() => setCurrentStep(Step.CUSTOMIZE)}
          onBack={() => setCurrentStep(Step.VISION)}
          isRefining={isProcessing}
        />
      )}

      {currentStep === Step.CUSTOMIZE && (
        <CustomizeView 
          onBack={() => setCurrentStep(Step.REVIEW_SCRIPT)} 
          onSubmit={handleFinalSubmit} 
          currentVoiceId={data.voiceId} 
          currentSoundscapeId={data.soundscapeId} 
        />
      )}

      {currentStep === Step.GENERATING && <GeneratingView />}
      
      {currentStep === Step.PLAYER && <PlayerView data={data} onReset={() => setCurrentStep(Step.INTRO)} />}
      
      {currentStep === Step.PROFILE && (
        <ProfileView 
          sessions={savedSessions} 
          onBack={() => setCurrentStep(Step.INTRO)} 
          onSelect={(session) => {
            setData({
              vision: session.vision,
              voiceId: session.voiceId,
              soundscapeId: session.soundscapeId,
              script: session.script,
              audioUrl: session.audioUrl,
              id: session.id,
              date: session.date
            });
            setCurrentStep(Step.PLAYER);
          }}
        />
      )}
      
      {error && (
        <div className="fixed bottom-6 left-6 right-6 bg-white border-l-4 border-red-500 p-5 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom duration-300">
          <h3 className="font-bold text-red-500 text-[10px] uppercase mb-1">Error</h3>
          <p className="text-xs text-gray-700 font-medium">{error}</p>
          <button onClick={() => setError(null)} className="mt-4 w-full bg-slate-900 text-white text-[10px] font-bold py-3 rounded-xl uppercase">Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default App;
