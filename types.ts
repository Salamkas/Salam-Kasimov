
export enum Step {
  INTRO = 'INTRO',
  VISION = 'VISION',
  REVIEW_SCRIPT = 'REVIEW_SCRIPT',
  CUSTOMIZE = 'CUSTOMIZE',
  GENERATING = 'GENERATING',
  PLAYER = 'PLAYER',
  PROFILE = 'PROFILE'
}

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female';
  elevenLabsId: string;
}

export interface Soundscape {
  id: string;
  name: string;
  description: string;
  url: string;
}

export interface ManifestationData {
  id?: string;
  date?: string;
  vision: string;
  voiceId: string;
  soundscapeId: string;
  script: string;
  audioUrl?: string;
  voiceoverUrl?: string;
}

export interface SavedSession {
  id: string;
  date: string;
  vision: string;
  script: string;
  audioUrl: string;
  voiceId: string;
  soundscapeId: string;
}
