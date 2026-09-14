import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ScriptPreference, ConversationalStyle } from '../../types';
import { Check, ArrowRight, Languages, Sparkles, MessageSquare } from 'lucide-react';
import { sound } from '../../services/soundEngine';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface LanguageOption {
  id: string;
  name: string;
  motherTongue: string;
  script: ScriptPreference;
  subtitle: string;
  example: string;
  badge: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: 'tenglish',
    name: 'Telugu (Tenglish)',
    motherTongue: 'Telugu',
    script: 'romanized',
    subtitle: 'Telugu written in English letters with natural code-switching',
    example: '"Hey Pranav, ela unnav? Eeroju em discuss cheddham?"',
    badge: 'Popular'
  },
  {
    id: 'english',
    name: 'English',
    motherTongue: 'English',
    script: 'romanized',
    subtitle: 'Clear, thoughtful international English',
    example: '"Hey Pranav, how are you? What would you like to explore today?"',
    badge: 'Global'
  },
  {
    id: 'hinglish',
    name: 'Hindi (Hinglish)',
    motherTongue: 'Hindi',
    script: 'romanized',
    subtitle: 'Hindi written in English alphabet with natural mix',
    example: '"Hey Pranav, kaise ho? Aaj kya discuss karein?"',
    badge: 'Conversational'
  },
  {
    id: 'telugu_native',
    name: 'Telugu (తెలుగు)',
    motherTongue: 'Telugu',
    script: 'native',
    subtitle: 'Traditional Telugu script for reading and reflection',
    example: '"హాయ్ ప్రణవ్, ఎలా ఉన్నావు? ఈరోజు ఏం మాట్లాడదాం?"',
    badge: 'Script'
  }
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const { user, completeOnboarding } = useAuth();
  const userName = user?.displayName?.trim() ? user.displayName.split(' ')[0] : 'Friend';

  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGE_OPTIONS[0]);
  const [selectedStyle, setSelectedStyle] = useState<ConversationalStyle>('natural');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleFinish = async () => {
    setIsSubmitting(true);
    sound.playSuccessChime();

    try {
      await completeOnboarding({
        learningLevel: 'Intermediate',
        goals: ['Improve conversations', 'Structure thoughts clearly'],
        motherTongue: selectedLang.motherTongue,
        learningLanguage: 'English',
        preferredAILanguage: selectedLang.name,
        scriptPreference: selectedLang.script,
        conversationalStyle: selectedStyle
      });
      onComplete();
    } catch (err) {
      console.error('Failed to complete onboarding:', err);
      // Even if API call has an issue, proceed so user is not blocked
      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-in fade-in zoom-in-95 duration-400">
        {/* Header */}
        <div className="space-y-2 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Companion Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
            How should I talk to you?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Welcome, {userName}. Choose your preferred conversational language. You can change it
            naturally anytime in conversation.
          </p>
        </div>

        {/* Language Selection Grid */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            Preferred Language
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {LANGUAGE_OPTIONS.map(opt => {
              const isSelected = selectedLang.id === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    sound.playClick();
                    setSelectedLang(opt);
                  }}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-slate-200 text-white ring-1 ring-slate-200/40 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-display font-bold text-white">{opt.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{opt.subtitle}</p>
                    <p className="text-xs text-slate-300 italic pt-1 font-mono">{opt.example}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected ? 'bg-white text-slate-950' : 'border border-slate-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conversational Style */}
        <div className="space-y-2">
          <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
            Conversational Tone
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'natural', label: 'Natural & Thoughtful' },
              { id: 'direct', label: 'Direct & Concise' },
              { id: 'reflective', label: 'Deep & Reflective' }
            ].map(style => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedStyle(style.id as ConversationalStyle);
                  }}
                  className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                    isSelected
                      ? 'bg-slate-100 border-white text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Preview Bubble */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3">
          <div className="w-7 h-7 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold text-slate-300">Cognita</span>
              <span className="text-[10px] text-slate-500 font-mono">Live Preview</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed italic">{selectedLang.example}</p>
          </div>
        </div>

        {/* Submit / Proceed */}
        <button
          type="button"
          disabled={isSubmitting}
          onClick={handleFinish}
          className="w-full py-3.5 px-6 rounded-2xl bg-slate-100 hover:bg-white text-slate-950 font-display font-bold text-sm tracking-wide shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2"
        >
          <span>{isSubmitting ? 'Setting up...' : 'Enter AI Companion'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-[11px] text-slate-500">
          You can say "English lo matladu" or "Telugu lo matladu" at any time during chat.
        </p>
      </div>
    </div>
  );
};
