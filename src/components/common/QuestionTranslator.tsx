import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Languages, Loader2 } from 'lucide-react';

interface QuestionTranslatorProps {
  /** The English practice or exercise question to translate */
  questionText: string;
  /** Optional visual styling variant: 'neutral' (default light border) or 'dark' (for dark prompt cards) */
  variant?: 'neutral' | 'dark';
  /** Optional custom CSS class */
  className?: string;
}

export const QuestionTranslator: React.FC<QuestionTranslatorProps> = ({
  questionText,
  variant = 'neutral',
  className = ''
}) => {
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [languageLabel, setLanguageLabel] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Determine user's active selected language
  const userPreferredAiLang = user?.preferredAILanguage;
  const userMotherTongue = user?.motherTongue;
  const userScriptPref = user?.scriptPreference;

  // Determine if user selected English exclusively (where translation is unnecessary)
  const isStrictlyEnglish =
    (userPreferredAiLang === 'English' || !userPreferredAiLang) &&
    (userMotherTongue === 'English' || !userMotherTongue);

  // If user changes language in settings or AI, reset cached translation to ensure freshness
  useEffect(() => {
    setTranslatedText(null);
    setIsOpen(false);
    setErrorMessage(null);
  }, [userPreferredAiLang, userMotherTongue, userScriptPref, questionText]);

  // If strictly English and no other language was chosen, translation is unnecessary
  if (isStrictlyEnglish) {
    return null;
  }

  // Target language label for the current user preference
  const effectiveLangName = userPreferredAiLang || userMotherTongue || 'Telugu (Tenglish)';

  const handleTranslate = async () => {
    if (isLoading) return;

    if (isOpen && translatedText) {
      setIsOpen(false);
      return;
    }

    if (translatedText) {
      setIsOpen(true);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.translateQuestion({
        text: questionText,
        targetLanguage: effectiveLangName,
        scriptPreference: userScriptPref
      });

      if (res.translated) {
        setTranslatedText(res.translated);
        setLanguageLabel(res.languageLabel || effectiveLangName);
        setIsOpen(true);
      } else {
        throw new Error("Translation isn't available right now. Please try again.");
      }
    } catch (err: any) {
      console.warn('Question translation failed:', err);
      setErrorMessage(
        err?.message && err.message.includes("Translation isn't available")
          ? err.message
          : "Translation isn't available right now. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleHide = () => {
    setIsOpen(false);
    setErrorMessage(null);
  };

  // Color schemes based on container variant
  const isDark = variant === 'dark';
  const actionBtnColor = isDark
    ? 'text-stone-400 hover:text-white hover:bg-stone-800/80'
    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100';

  const boxBg = isDark
    ? 'bg-stone-800/90 border-stone-700/80 text-stone-100'
    : 'bg-zinc-100/90 border-zinc-200 text-zinc-900';

  const labelColor = isDark ? 'text-stone-400' : 'text-zinc-600';
  const hideBtnColor = isDark
    ? 'text-stone-400 hover:text-stone-200'
    : 'text-zinc-600 hover:text-zinc-950';

  return (
    <div className={`mt-2.5 pt-1 flex flex-col items-start select-text ${className}`}>
      {/* Secondary utility action button directly underneath the question */}
      {!isOpen ? (
        <button
          type="button"
          onClick={handleTranslate}
          disabled={isLoading}
          id="translate-question-action"
          aria-expanded={isOpen}
          aria-label="Translate question"
          className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer py-1 px-2 -ml-1 rounded-md ${actionBtnColor} disabled:opacity-60`}
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
          ) : (
            <Languages className="w-3.5 h-3.5 opacity-70" />
          )}
          <span>{isLoading ? 'Translating...' : 'Translate Question'}</span>
        </button>
      ) : (
        /* Inline expansion directly below the question */
        <div
          id="translated-question-box"
          className={`w-full mt-1.5 p-3.5 rounded-xl border transition-all text-left shadow-2xs ${boxBg}`}
        >
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-zinc-200/50 dark:border-stone-700/50">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${labelColor}`}>
              {languageLabel || effectiveLangName}
            </span>
            <button
              type="button"
              onClick={handleHide}
              id="hide-translation-action"
              className={`text-xs font-medium transition-colors cursor-pointer underline-offset-2 hover:underline px-1 rounded ${hideBtnColor}`}
            >
              Hide Translation
            </button>
          </div>

          <p className="text-sm sm:text-base font-medium leading-relaxed font-sans">
            {translatedText}
          </p>
        </div>
      )}

      {/* Graceful Error Display */}
      {errorMessage && (
        <div className="mt-1.5 text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center justify-between gap-2 w-full">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-[11px] text-amber-700 hover:text-amber-900 underline ml-auto"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
