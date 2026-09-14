// Normal AI Voice Synthesis Engine
// Delivers clear, natural spoken output for conversational AI responses with language adaptability.

import { sound } from './soundEngine';
import { WORLD_LANGUAGES } from '../data/languages';

export interface VoiceListener {
  onStart?: () => void;
  onSentence?: (sentence: string, index: number) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

class VoiceEngine {
  private voices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private isSpeaking: boolean = false;
  private isInitialized: boolean = false;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices() || [];
    if (this.voices.length > 0) {
      this.selectedVoice = this.pickBestVoice();
      this.isInitialized = true;
    }
  }

  private pickBestVoice(): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) return null;

    const preferredNames = [
      'Natural',
      'Google US English',
      'Google UK English',
      'Samantha',
      'Daniel',
      'Microsoft Jenny',
      'Microsoft Aria'
    ];

    for (const name of preferredNames) {
      const match = this.voices.find(v => v.name.includes(name));
      if (match) return match;
    }

    return this.voices.find(v => v.lang.startsWith('en')) || this.voices[0] || null;
  }

  public getVoiceForLanguage(langCodeOrLocale: string): SpeechSynthesisVoice | null {
    if (!this.voices || this.voices.length === 0) {
      this.initVoices();
    }
    if (!this.voices || this.voices.length === 0) return null;

    const target = langCodeOrLocale.toLowerCase();
    const match = this.voices.find(v => v.lang.toLowerCase() === target);
    if (match) return match;

    const langPrefix = target.split('-')[0];
    const prefixMatch = this.voices.find(v => v.lang.toLowerCase().startsWith(langPrefix));
    if (prefixMatch) return prefixMatch;

    return this.selectedVoice || this.voices[0] || null;
  }

  public speakNatural(
    text: string,
    listener?: VoiceListener,
    languageHint?: string
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (listener?.onEnd) listener.onEnd();
      return;
    }

    this.stop();

    const cleanText = text
      .replace(/\*+/g, '')
      .replace(/#+/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      .trim();

    if (!cleanText) {
      if (listener?.onEnd) listener.onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    let targetVoice: SpeechSynthesisVoice | null = null;
    if (languageHint) {
      const matchedConfig = WORLD_LANGUAGES.find(
        l => l.name.toLowerCase() === languageHint.toLowerCase() ||
             l.locale.toLowerCase() === languageHint.toLowerCase()
      );
      if (matchedConfig) {
        targetVoice = this.getVoiceForLanguage(matchedConfig.locale);
        utterance.lang = matchedConfig.locale;
      }
    }

    if (!targetVoice) {
      targetVoice = this.selectedVoice || this.pickBestVoice();
    }

    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (listener?.onStart) listener.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.activeUtterance = null;
      if (listener?.onEnd) listener.onEnd();
    };

    utterance.onerror = (err) => {
      this.isSpeaking = false;
      this.activeUtterance = null;
      if (listener?.onError) listener.onError(err);
    };

    this.activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.activeUtterance = null;
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const voiceService = new VoiceEngine();
// Alias for backwards compatibility
export const mentorVoice = voiceService;
