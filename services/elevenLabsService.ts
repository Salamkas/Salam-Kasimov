
const ELEVEN_LABS_API_KEY = "sk_1063696314d93cb55f747f1201084551c4a8e7985ad44d00";

/**
 * Generates speech with meditation-optimized settings.
 */
export const generateSpeech = async (text: string, voiceId: string): Promise<string> => {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2', 
        voice_settings: {
          stability: 0.92, // Increased stability for a very "flat", non-erratic meditation tone
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 404) {
        throw new Error(`Voice ID not active. Please ensure the voice is in your ElevenLabs Lab.`);
      }
      throw new Error(errorData?.detail?.message || `ElevenLabs Error: ${response.status}`);
    }

    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error("ElevenLabs Service Exception:", error);
    throw error;
  }
};
