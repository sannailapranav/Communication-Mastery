// Generative Procedural Ambient Music & SFX Engine using Web Audio API
// 100% self-contained, zero external network requests, zero copyright issues, instantaneous response.

type SoundMood = 'map' | 'lesson' | 'challenge' | 'complete' | 'silence';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private isMusicOn: boolean = true;
  private isSfxOn: boolean = true;
  private masterVolume: number = 0.6;
  private currentMood: SoundMood = 'silence';
  private activeOscillators: OscillatorNode[] = [];
  private ambientTimer: number | null = null;
  private isAudioUnlocked: boolean = false;

  constructor() {
    // Read persisted settings
    try {
      const savedMusic = localStorage.getItem('cm_music_enabled');
      if (savedMusic !== null) this.isMusicOn = savedMusic === 'true';
      const savedSfx = localStorage.getItem('cm_sfx_enabled');
      if (savedSfx !== null) this.isSfxOn = savedSfx === 'true';
      const savedVol = localStorage.getItem('cm_master_volume');
      if (savedVol !== null) this.masterVolume = parseFloat(savedVol);
    } catch {
      // localStorage may fail in restricted iframes
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(this.isMusicOn ? 0.35 : 0, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(this.isSfxOn ? 0.6 : 0, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
  }

  public activateAudio(): boolean {
    this.initContext();
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().then(() => {
          this.isAudioUnlocked = true;
          if (this.isMusicOn && this.currentMood !== 'silence') {
            this.setMood(this.currentMood, true);
          }
        });
      } else {
        this.isAudioUnlocked = true;
        if (this.isMusicOn && this.currentMood !== 'silence' && this.activeOscillators.length === 0) {
          this.setMood(this.currentMood, true);
        }
      }
    }
    return this.isAudioUnlocked;
  }

  public isUnlocked(): boolean {
    return this.isAudioUnlocked && this.ctx !== null && this.ctx.state === 'running';
  }

  // --- AMBIENT SOUNDSCAPE GENERATION ---
  public setMood(mood: SoundMood, force: boolean = false) {
    if (!force && this.currentMood === mood) return;
    this.currentMood = mood;

    this.stopAmbient();
    if (!this.isMusicOn || mood === 'silence') return;
    this.initContext();
    if (!this.ctx || this.ctx.state !== 'running') return;

    if (mood === 'map') {
      this.playMapAmbience();
    } else if (mood === 'lesson') {
      this.playLessonAmbience();
    } else if (mood === 'challenge') {
      this.playChallengeAmbience();
    } else if (mood === 'complete') {
      this.playCompletionAmbience();
    }
  }

  private stopAmbient() {
    if (this.ambientTimer) {
      window.clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    const now = this.ctx ? this.ctx.currentTime : 0;
    this.activeOscillators.forEach(osc => {
      try {
        osc.stop(now + 0.6);
      } catch {
        // ignore already stopped
      }
    });
    this.activeOscillators = [];
  }

  private playMapAmbience() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Adventurous, expansive ethereal chord (D minor 9 / A modal)
    // Frequencies: D2 (73.4), A2 (110), F3 (174.6), C4 (261.6), E4 (329.6)
    const freqs = [73.4, 110.0, 174.6, 261.6, 329.6];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(480, now);
    filter.Q.setValueAtTime(1.5, now);
    filter.connect(this.musicGain);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Subtle slow detune for living breath
      const detuneLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      detuneLfo.frequency.setValueAtTime(0.08 + idx * 0.03, now);
      lfoGain.gain.setValueAtTime(3.5, now);
      detuneLfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      detuneLfo.start(now);
      this.activeOscillators.push(detuneLfo);

      // Slow fading envelope
      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.08 / (idx + 1), now + 3);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      this.activeOscillators.push(osc);
    });
  }

  private playLessonAmbience() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Focused, grounded meditative resonance (Low C, G, D)
    const freqs = [65.4, 98.0, 146.8, 196.0];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, now);
    filter.connect(this.musicGain);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.09 / (idx + 1), now + 2.5);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      this.activeOscillators.push(osc);
    });
  }

  private playChallengeAmbience() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Focused clarity drone (E minor pentatonic bed)
    const freqs = [82.4, 123.5, 164.8, 246.9];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(420, now);
    filter.connect(this.musicGain);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.06 / (idx + 1), now + 2);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      this.activeOscillators.push(osc);
    });
  }

  private playCompletionAmbience() {
    if (!this.ctx || !this.musicGain) return;
    const now = this.ctx.currentTime;

    // Uplifting luminous resonance
    const freqs = [130.8, 196.0, 261.6, 329.6, 392.0];

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, now);
    filter.connect(this.musicGain);

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      oscGain.gain.setValueAtTime(0.001, now);
      oscGain.gain.exponentialRampToValueAtTime(0.1 / (idx + 1), now + 1.5);

      osc.connect(oscGain);
      oscGain.connect(filter);
      osc.start(now);
      this.activeOscillators.push(osc);
    });
  }

  // --- DUCKING DURING VOICE SPEECH ---
  public duckMusic(durationMs?: number) {
    if (!this.ctx || !this.musicGain || !this.isMusicOn) return;
    const now = this.ctx.currentTime;
    try {
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.setValueAtTime(this.musicGain.gain.value, now);
      this.musicGain.gain.linearRampToValueAtTime(0.08, now + 0.3);

      if (durationMs && durationMs > 0) {
        const restoreTime = now + durationMs / 1000;
        this.musicGain.gain.setValueAtTime(0.08, restoreTime);
        this.musicGain.gain.linearRampToValueAtTime(0.35, restoreTime + 1.2);
      }
    } catch {
      // ignore
    }
  }

  public restoreMusic() {
    if (!this.musicGain || !this.ctx || !this.isMusicOn) return;
    try {
      const now = this.ctx.currentTime;
      this.musicGain.gain.cancelScheduledValues(now);
      this.musicGain.gain.linearRampToValueAtTime(0.30, now + 0.8);
    } catch {
      // ignore
    }
  }

  public playNote(freq: number = 440, type: OscillatorType = 'sine', duration: number = 0.1) {
    if (!this.isSfxOn) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch {}
  }

  // --- SOUND EFFECTS (SFX) ---
  public playClick() {
    if (!this.isSfxOn) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  public playNodeSelect() {
    if (!this.isSfxOn) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    [523.25, 659.25].forEach((f, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + i * 0.03);

      gain.gain.setValueAtTime(0.15, now + i * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now + i * 0.03);
      osc.stop(now + 0.3);
    });
  }

  public playUnlockChime() {
    if (!this.isSfxOn) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    // Ascending shimmer arpeggio
    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = now + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.18, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 0.5);
    });
  }

  public playSuccessChime() {
    if (!this.isSfxOn) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    // Resonant triumph chord (C major 9)
    const chord = [261.63, 329.63, 392.0, 493.88, 523.25];
    chord.forEach((freq, i) => {
      if (!this.ctx || !this.sfxGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const startTime = now + i * 0.05;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.2, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 1.4);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(startTime);
      osc.stop(startTime + 1.5);
    });
  }

  public playSuccess() {
    this.playSuccessChime();
  }

  public playWhoosh() {
    if (!this.isSfxOn) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(150, now + 0.35);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 0.38);
  }

  public playChallengeTone() {
    if (!this.isSfxOn) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain || this.ctx.state !== 'running') return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(554.37, now + 0.08);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(now);
    osc.stop(now + 0.38);
  }

  // --- USER SETTINGS CONTROLS ---
  public setMusicEnabled(val: boolean): boolean {
    this.isMusicOn = val;
    try {
      localStorage.setItem('cm_music_enabled', String(this.isMusicOn));
    } catch {}

    if (this.musicGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.musicGain.gain.setValueAtTime(this.isMusicOn ? 0.35 : 0, now);
    }

    if (this.isMusicOn) {
      this.activateAudio();
      this.setMood(this.currentMood, true);
    } else {
      this.stopAmbient();
    }
    return this.isMusicOn;
  }

  public setSfxEnabled(val: boolean): boolean {
    this.isSfxOn = val;
    try {
      localStorage.setItem('cm_sfx_enabled', String(this.isSfxOn));
    } catch {}

    if (this.sfxGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.sfxGain.gain.setValueAtTime(this.isSfxOn ? 0.6 : 0, now);
    }
    return this.isSfxOn;
  }

  public toggleMusic(): boolean {
    return this.setMusicEnabled(!this.isMusicOn);
  }

  public toggleSfx(): boolean {
    return this.setSfxEnabled(!this.isSfxOn);
  }

  public setVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    try {
      localStorage.setItem('cm_master_volume', String(this.masterVolume));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public getMusicEnabled(): boolean {
    return this.isMusicOn;
  }

  public getSfxEnabled(): boolean {
    return this.isSfxOn;
  }

  public getVolume(): number {
    return this.masterVolume;
  }
}

export const sound = new SoundEngine();
