
import { GoogleGenAI } from "@google/genai";

const cleanupScript = (text: string) => {
  return text
    .replace(/\[Pause \d+s\]/g, ' ... ')
    .replace(/\[Deep Breath\]/g, ' ... [pause] ... ')
    .replace(/\*+/g, '') // Remove markdown bolding
    .replace(/\n\n/g, ' ... \n\n') // Add pauses at paragraph breaks
    .trim();
};

export const generateMeditationScript = async (input: string | { data: string, mimeType: string }): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const isAudio = typeof input !== 'string';
  
  const prompt = `
    TASK: Transform the following vision into a 5-minute professional guided manifestation meditation script.
    
    PACING (CRITICAL): 
    - The delivery must be VERY SLOW (equivalent to 0.8x speed).
    - Insert "..." frequently between phrases to force the narrator to pause.
    - Use longer sentences with soothing, rhythmic flow.
    
    RULES:
    - NARRATIVE: Written EXCLUSIVELY in the first-person present tense (e.g., "I am standing...", "I feel...").
    - SENSORY ENHANCEMENT: Add vivid sights, smells, sounds, and physical sensations.
    - STRUCTURE:
        1. Relaxation & Breathwork (60s). Use phrases like "I breathe in light... I breathe out resistance..."
        2. The Vision Walkthrough (3 mins). Deeply specific immersion.
        3. Gratitude Anchor (1 min).
    
    ${!isAudio ? `USER VISION: "${input}"` : 'Transcribe and then apply the rules above.'}

    IMPORTANT: Return ONLY the spoken words. Use "..." for pauses. No metadata or titles.
  `;

  try {
    const contents = isAudio 
      ? { parts: [ { inlineData: input }, { text: prompt } ] }
      : { parts: [ { text: prompt } ] };

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [contents],
      config: {
        systemInstruction: "You are a master manifestation coach. Your scripts are hypnotic, luxurious, and paced specifically for deep subconscious reprogramming. You use frequent pauses to allow the listener to visualize.",
        temperature: 0.8,
      },
    });

    return cleanupScript(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const refineMeditationScript = async (currentScript: string, feedback: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    CURRENT SCRIPT:
    "${currentScript}"

    USER FEEDBACK/REQUESTED CHANGES:
    "${feedback}"

    TASK: Refine the script while MAINTAINING THE SLOW PACE (0.8x).
    Ensure there are frequent "..." markers for pauses.
    Keep the first-person present tense.
    
    IMPORTANT: Return ONLY the refined spoken words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        systemInstruction: "You are an expert script editor for slow-paced manifestation meditations.",
        temperature: 0.7,
      },
    });

    return cleanupScript(response.text);
  } catch (error) {
    console.error("Refinement Error:", error);
    throw error;
  }
};
