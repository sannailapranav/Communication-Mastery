import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LearningLevel, CommunicationGoal } from '../../types';
import {
  User,
  Mail,
  Target,
  Award,
  Save,
  Check,
  AlertCircle,
  LogOut,
  ShieldCheck,
  Languages
} from 'lucide-react';

const LANGUAGE_PREFERENCES = [
  {
    id: 'tenglish',
    label: 'Telugu (Tenglish)',
    motherTongue: 'Telugu',
    preferredAiLanguage: 'Telugu (Tenglish)',
    scriptPreference: 'romanized' as const,
    description: 'Conversational Telugu in English letters with natural Indian phrasing'
  },
  {
    id: 'telugu_native',
    label: 'Telugu (తెలుగు)',
    motherTongue: 'Telugu',
    preferredAiLanguage: 'Telugu (తెలుగు)',
    scriptPreference: 'native' as const,
    description: 'Authentic Telugu script (తెలుగు లిపి)'
  },
  {
    id: 'hinglish',
    label: 'Hindi (Hinglish)',
    motherTongue: 'Hindi',
    preferredAiLanguage: 'Hindi (Hinglish)',
    scriptPreference: 'romanized' as const,
    description: 'Conversational Hindi in Roman letters'
  },
  {
    id: 'hindi_native',
    label: 'Hindi (हिन्दी)',
    motherTongue: 'Hindi',
    preferredAiLanguage: 'Hindi (हिन्दी)',
    scriptPreference: 'native' as const,
    description: 'Authentic Devanagari Hindi script (हिन्दी)'
  },
  {
    id: 'english',
    label: 'English Only',
    motherTongue: 'English',
    preferredAiLanguage: 'English',
    scriptPreference: 'romanized' as const,
    description: 'English questions and exercises (question translation hidden)'
  }
];

const ALL_GOALS: CommunicationGoal[] = [
  'Speak English confidently',
  'Improve conversations',
  'Structure thoughts clearly',
  'Excel in job interviews',
  'Speak under pressure',
  'Lead and persuade'
];

export const ProfileSettingsView: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [learningLevel, setLearningLevel] = useState<LearningLevel>(user?.learningLevel || 'Beginner');
  const [goals, setGoals] = useState<CommunicationGoal[]>(user?.goals || ['Structure thoughts clearly']);
  const [preferredLanguageId, setPreferredLanguageId] = useState<string>(() => {
    if (user?.preferredAILanguage?.includes('తెలుగు') || (user?.motherTongue === 'Telugu' && user?.scriptPreference === 'native')) {
      return 'telugu_native';
    }
    if (user?.preferredAILanguage?.includes('हिन्दी') || (user?.motherTongue === 'Hindi' && user?.scriptPreference === 'native')) {
      return 'hindi_native';
    }
    if (user?.preferredAILanguage?.includes('Hinglish') || (user?.motherTongue === 'Hindi')) {
      return 'hinglish';
    }
    if (user?.preferredAILanguage === 'English' && user?.motherTongue === 'English') {
      return 'english';
    }
    return 'tenglish';
  });
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const toggleGoal = (goal: CommunicationGoal) => {
    if (goals.includes(goal)) {
      if (goals.length > 1) {
        setGoals(goals.filter(g => g !== goal));
      }
    } else {
      if (goals.length < 4) {
        setGoals([...goals, goal]);
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) return;

    setIsSaving(true);
    setStatusMessage(null);
    try {
      const selectedLang = LANGUAGE_PREFERENCES.find(l => l.id === preferredLanguageId);
      await updateProfile({
        displayName: displayName.trim(),
        learningLevel,
        goals,
        preferredAILanguage: selectedLang?.preferredAiLanguage,
        motherTongue: selectedLang?.motherTongue,
        scriptPreference: selectedLang?.scriptPreference
      });
      setStatusMessage({ type: 'success', text: 'Profile and language preferences updated successfully.' });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Failed to update profile.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-1.5 rounded-md bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-800 w-fit">
          <User className="h-3.5 w-3.5" />
          <span>Account Settings</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Profile & Training Objectives
        </h1>
        <p className="mt-1 text-sm text-stone-600">
          Manage your personal identity, calibrated learning level, and active communication goals.
        </p>
      </div>

      {statusMessage && (
        <div
          className={`flex items-start gap-2.5 rounded-xl p-4 text-xs font-medium border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <Check className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-base font-bold text-stone-900">Personal Information</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Full Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="mt-1.5 block w-full rounded-xl border border-stone-200 bg-stone-50 p-2.5 text-sm text-stone-500 cursor-not-allowed"
              />
              <span className="text-[11px] text-stone-400 mt-1 block">Managed account identifier</span>
            </div>
          </div>
        </div>

        {/* Language & Question Translation Preference */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Languages className="h-4 w-4 text-stone-700" />
            <h2 className="text-base font-bold text-stone-900">Language & Question Translation</h2>
          </div>
          <p className="text-xs text-stone-500">
            Choose your preferred language for learning accessibility. Practice questions can be translated into this language on demand with one tap.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {LANGUAGE_PREFERENCES.map(lang => {
              const isSelected = preferredLanguageId === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setPreferredLanguageId(lang.id)}
                  className={`rounded-xl border p-4 text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white shadow-sm ring-1 ring-stone-900'
                      : 'border-stone-200 bg-white text-stone-900 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{lang.label}</span>
                    {isSelected && <Check className="h-4 w-4 text-white" />}
                  </div>
                  <p className={`mt-1 text-xs leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {lang.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Learning Level Selection */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900">Calibrated Experience Tier</h2>
          <p className="text-xs text-stone-500">
            Adjust your self-assessment tier at any time.
          </p>

          <div className="grid sm:grid-cols-3 gap-3">
            {(['Beginner', 'Intermediate', 'Advanced'] as LearningLevel[]).map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setLearningLevel(lvl)}
                className={`rounded-xl border p-4 text-left transition-all ${
                  learningLevel === lvl
                    ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                    : 'border-stone-200 bg-white text-stone-900 hover:border-stone-300 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">{lvl}</span>
                  {learningLevel === lvl && <Check className="h-4 w-4" />}
                </div>
                <p className={`mt-1 text-xs ${learningLevel === lvl ? 'text-stone-300' : 'text-stone-500'}`}>
                  {lvl === 'Beginner' && 'Foundations & confidence'}
                  {lvl === 'Intermediate' && 'Conversational flow & frameworks'}
                  {lvl === 'Advanced' && 'Pressure, negotiation & persuasion'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Goals Selection */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-stone-900">Focal Communication Goals</h2>
          <p className="text-xs text-stone-500">
            Select 1 to 4 focus priorities for personalized practice recommendations.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {ALL_GOALS.map(goal => {
              const isSelected = goals.includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={`flex items-center justify-between rounded-xl border p-3.5 text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-stone-900 bg-stone-50 text-stone-900 ring-1 ring-stone-900'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{goal}</span>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      isSelected ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300'
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="profile-save-btn"
            disabled={isSaving}
            className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-7 py-3 text-xs font-bold text-white hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>

      {/* Sign Out Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-stone-900">Sign Out of Your Account</h3>
          <p className="text-xs text-stone-500">Your completed lessons and practice records are securely preserved.</p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
