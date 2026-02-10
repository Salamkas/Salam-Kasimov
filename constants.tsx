
import { VoiceOption, Soundscape } from './types';

export const COLORS = {
  primary: '#9381BA',
  deepBlue: '#1E3A8A',
  secondary: '#F0EBF9',
  background: '#F8FAFC',
  text: '#0F172A',
  textMuted: '#475569',
};

export const VOICES: VoiceOption[] = [
  {
    id: 'charlotte',
    name: 'Charlotte',
    description: 'Serene & Gentle',
    gender: 'female',
    elevenLabsId: 'cgSgspJ2msm6clMCkdW9',
  },
  {
    id: 'dominic',
    name: 'Dominic',
    description: 'Deep & Grounded',
    gender: 'male',
    elevenLabsId: 'pNInz6obpgnuM076YoAt',
  }
];

export const SOUNDSCAPES: Soundscape[] = [
  {
    id: 'expansive',
    name: 'Expansive Ambient',
    description: 'Ethereal Space & Clarity',
    // Using a high-quality ambient track from a reliable CORS-friendly source
    url: 'https://cdn.pixabay.com/audio/2022/01/18/audio_d0a13f69d2.mp3', 
  },
  {
    id: 'dreamscape',
    name: 'Dreamscape Ritual',
    description: 'Deep Theta Wave Immersion',
    url: 'https://cdn.pixabay.com/audio/2023/02/24/audio_34b693259a.mp3',
  }
];

export const QUOTES = [
  { text: "I would visualize things coming to me. It would just make me feel better. Visualization works if you work hard.", author: "JIM CARREY" },
  { text: "Create the highest, grandest vision possible for your life, because you become what you believe.", author: "OPRAH WINFREY" },
  { text: "Focus on where you want to go, not on what you fear. Energy flows where attention goes.", author: "TONY ROBBINS" }
];
