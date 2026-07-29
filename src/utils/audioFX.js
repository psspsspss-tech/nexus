// Web Audio API & Web Speech API Sound FX System

class AudioFXSystem {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.speechEnabled = true;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn("Audio click failed", e);
    }
  }

  playSuccess() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio success failed", e);
    }
  }

  playScan() {
    if (!this.soundEnabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(1200, this.ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch (e) {
      console.warn("Audio scan failed", e);
    }
  }

  speak(text) {
    if (!this.speechEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel(); // Stop ongoing speech

    // Clean markdown symbols for cleaner voice speech
    const cleanText = text.replace(/[`*#_]/g, '').slice(0, 200);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.pitch = 0.95;
    utterance.rate = 1.05;
    
    // Pick a good English voice if available
    const voices = window.speechSynthesis.getVoices();
    const cyberVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en'));
    if (cyberVoice) utterance.voice = cyberVoice;

    window.speechSynthesis.speak(utterance);
  }
}

export const audioFX = new AudioFXSystem();
