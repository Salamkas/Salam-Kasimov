
/**
 * Utility to mix voiceover and background music using Web Audio API
 * Enhanced with fallback logic to ensure the meditation is created even if 
 * background assets fail to load.
 */
export const mixAudio = async (voiceoverUrl: string, backgroundUrl: string): Promise<string> => {
  const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Helper to load and decode a single audio source
  const loadAndDecode = async (url: string, name: string): Promise<AudioBuffer | null> => {
    try {
      console.log(`[AudioMixer] Processing ${name}: ${url}`);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const arrayBuffer = await response.arrayBuffer();
      if (arrayBuffer.byteLength === 0) throw new Error("Empty audio data received");

      return await new Promise((resolve, reject) => {
        audioCtx.decodeAudioData(
          arrayBuffer, 
          (buffer) => resolve(buffer), 
          (error) => {
            console.warn(`[AudioMixer] ${name} decoding failed:`, error);
            reject(new Error(`Browser could not decode ${name} format.`));
          }
        );
      });
    } catch (err: any) {
      console.warn(`[AudioMixer] Could not load ${name}:`, err.message);
      return null; // Return null so we can handle the failure gracefully
    }
  };

  // 1. Load Voiceover (Mandatory)
  const voiceBuffer = await loadAndDecode(voiceoverUrl, "voiceover");
  if (!voiceBuffer) {
    throw new Error("Critical error: Failed to process the voiceover audio.");
  }

  // 2. Load Background (Optional)
  const bgBuffer = await loadAndDecode(backgroundUrl, "background");

  // Fallback: If no background music was loaded, return the voiceover URL directly
  if (!bgBuffer) {
    console.log("[AudioMixer] Proceeding with voiceover only.");
    return voiceoverUrl;
  }

  // 3. Perform the Mix
  try {
    const duration = voiceBuffer.duration;
    const sampleRate = voiceBuffer.sampleRate;
    
    // Offline context for high-quality rendering
    const offlineCtx = new OfflineAudioContext(
      voiceBuffer.numberOfChannels, 
      Math.ceil(sampleRate * duration), 
      sampleRate
    );

    // Set up voiceover
    const voiceSource = offlineCtx.createBufferSource();
    voiceSource.buffer = voiceBuffer;
    const voiceGain = offlineCtx.createGain();
    voiceGain.gain.value = 1.0;
    voiceSource.connect(voiceGain);
    voiceGain.connect(offlineCtx.destination);

    // Set up background music
    const bgSource = offlineCtx.createBufferSource();
    bgSource.buffer = bgBuffer;
    bgSource.loop = true;
    const bgGain = offlineCtx.createGain();
    bgGain.gain.value = 0.12; // Gentle background level
    bgSource.connect(bgGain);
    bgGain.connect(offlineCtx.destination);

    voiceSource.start(0);
    bgSource.start(0);

    const renderedBuffer = await offlineCtx.startRendering();
    const wavBlob = bufferToWav(renderedBuffer);
    return URL.createObjectURL(wavBlob);
  } catch (mixErr) {
    console.error("[AudioMixer] Final mixing failed:", mixErr);
    return voiceoverUrl; // Last resort fallback
  }
};

/**
 * Encodes an AudioBuffer into a valid WAV file Blob
 */
function bufferToWav(abuffer: AudioBuffer) {
  const numOfChan = abuffer.numberOfChannels;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let i;
  let sample;
  let offset = 0;
  let pos = 0;

  function setUint16(data: any) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: any) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  // RIFF header
  setUint32(0x46464952);                         // "RIFF"
  setUint32(length - 8);                         // file length - 8
  setUint32(0x45564157);                         // "WAVE"

  // fmt chunk
  setUint32(0x20746d66);                         // "fmt "
  setUint32(16);                                 // chunk length
  setUint16(1);                                  // PCM
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // byte rate
  setUint16(numOfChan * 2);                      // block align
  setUint16(16);                                 // bits per sample

  // data chunk
  setUint32(0x61746164);                         // "data"
  setUint32(length - pos - 4);                   // chunk length

  for(i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while(pos < length) {
    for(i = 0; i < numOfChan; i++) {
      sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF);
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([buffer], {type: "audio/wav"});
}
