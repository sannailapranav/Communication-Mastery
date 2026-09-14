import React, { useState } from 'react';
import { PRACTICE_EXERCISES } from '../../data/practiceScenarios';
import { PracticeExercise } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { ActivePracticeSession } from './ActivePracticeSession';
import {
  Target,
  Mic,
  PenTool,
  HelpCircle,
  Zap,
  Layers,
  ArrowRight,
  PlusCircle,
  History,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PracticeArenaProps {
  initialPrompt?: string;
  initialFramework?: string;
  onLaunchMandatoryExercises?: (levelNumber?: number) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  initialPrompt,
  initialFramework,
  onLaunchMandatoryExercises
}) => {
  const { stats } = useProgress();

  const [activeExercise, setActiveExercise] = useState<PracticeExercise | null>(() => {
    if (initialPrompt) {
      return {
        id: `custom-${Date.now()}`,
        title: initialFramework ? `Custom Drill: ${initialFramework}` : 'Targeted Practice Challenge',
        type: 'written',
        category: 'DILEMMA',
        difficulty: 'Intermediate',
        contextBrief: 'Real-world communication challenge transferred from your curriculum or framework study.',
        prompt: initialPrompt,
        recommendedFramework: initialFramework
      };
    }
    return null;
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeTab, setActiveTab] = useState<'ARENA' | 'HISTORY'>('ARENA');

  // Custom prompt modal state
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [customCategory, setCustomCategory] = useState<any>('PERSPECTIVE');

  const filteredExercises =
    selectedCategory === 'ALL'
      ? PRACTICE_EXERCISES
      : PRACTICE_EXERCISES.filter(ex => ex.type === selectedCategory);

  const handleLaunchCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customPrompt.trim()) return;

    const newEx: PracticeExercise = {
      id: `custom-${Date.now()}`,
      title: customTitle.trim(),
      type: 'written',
      category: customCategory,
      difficulty: 'Intermediate',
      contextBrief: 'Custom scenario created for immediate diagnostic practice.',
      prompt: customPrompt.trim()
    };

    setShowCustomModal(false);
    setActiveExercise(newEx);
  };

  if (activeExercise) {
    return (
      <ActivePracticeSession
        exercise={activeExercise}
        onBack={() => setActiveExercise(null)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-800">
              <Target className="h-3.5 w-3.5" />
              <span>Simulated Practice Arena</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Communication Drills & Simulations
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-2xl">
              Apply frameworks to realistic scenarios. Record your speech or craft written responses to receive detailed diagnostic critique.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCustomModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-300 bg-white px-4 py-2 text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors shadow-sm"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Custom Drill</span>
            </button>
          </div>
        </div>

        {/* View Switcher: Arena vs History */}
        <div className="mt-6 flex items-center gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('ARENA')}
            className={`border-b-2 pb-2 transition-colors ${
              activeTab === 'ARENA'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            Exercise Scenarios
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`flex items-center gap-1.5 border-b-2 pb-2 transition-colors ${
              activeTab === 'HISTORY'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <History className="h-3.5 w-3.5" />
            <span>Past Evaluations ({stats?.recentAttempts?.length || 0})</span>
          </button>
        </div>
      </div>

      {/* ARENA TAB */}
      {activeTab === 'ARENA' && (
        <div className="space-y-6">
          {/* Mandatory Level Drills Banner */}
          {onLaunchMandatoryExercises && (
            <div className="rounded-2xl border-2 border-stone-900 bg-stone-900 p-5 sm:p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-amber-400/20 px-2.5 py-0.5 text-xs font-mono font-bold text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Curriculum Connection</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Ready for the 3 Mandatory Sequential Exercises?
                </h3>
                <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
                  Complete the 3 mandatory exercises with live speech recognition, diagnostic scoring, and direct progress tracking to advance your level.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onLaunchMandatoryExercises(1)}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 px-5 py-3 text-xs font-bold uppercase tracking-wider font-display transition-all active:scale-95 shadow-xs cursor-pointer"
              >
                <span>Start 3 Mandatory Exercises</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'ALL', label: 'All Scenarios' },
              { id: 'speaking', label: 'Vocal Speaking', icon: Mic },
              { id: 'conversation_choice', label: 'Tactical Choices', icon: HelpCircle },
              { id: 'pressure', label: 'Pressure Briefings', icon: Zap },
              { id: 'framework', label: 'Framework Drills', icon: Layers },
              { id: 'written', label: 'Written Defenses', icon: PenTool }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-stone-900 text-white'
                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                }`}
              >
                {cat.icon && <cat.icon className="h-3 w-3" />}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Exercise Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map(exercise => (
              <div
                key={exercise.id}
                id={`exercise-card-${exercise.id}`}
                onClick={() => setActiveExercise(exercise)}
                className="group flex flex-col justify-between rounded-2xl border border-stone-200 bg-white p-6 shadow-sm hover:border-stone-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-stone-100 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-stone-700 border border-stone-200">
                      {exercise.type.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {exercise.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 group-hover:text-stone-950 transition-colors">
                    {exercise.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {exercise.contextBrief}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  {exercise.recommendedFramework ? (
                    <span className="font-semibold text-stone-700 truncate max-w-[170px]">
                      {exercise.recommendedFramework}
                    </span>
                  ) : (
                    <span className="text-stone-400">Open Response</span>
                  )}
                  <div className="flex items-center gap-1 font-bold text-stone-900 group-hover:underline">
                    <span>Enter Drill</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === 'HISTORY' && (
        <div className="space-y-4">
          {!stats || !stats.recentAttempts || stats.recentAttempts.length === 0 ? (
            <div className="rounded-2xl border border-stone-200 bg-white p-12 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-stone-100 text-stone-400 mx-auto">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900">No Practice Attempts Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Step into any simulation scenario or craft a custom drill above to record your first diagnostic evaluation.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm">
              {stats.recentAttempts.map(attempt => (
                <div key={attempt.id} className="p-6 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="text-base font-bold text-stone-900">
                        {attempt.exerciseTitle}
                      </h4>
                      <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                        <span>{new Date(attempt.submittedAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>Mode: {attempt.inputMode}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1 text-center">
                        <span className="text-xs font-bold text-stone-900">
                          Score: {attempt.evaluation?.overallScore || '—'}/100
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-stone-50 p-3 text-xs text-stone-700 italic border border-stone-200">
                    "{attempt.responseText}"
                  </div>

                  {attempt.evaluation?.oneThingToFocusOnNext && (
                    <div className="text-xs text-stone-600">
                      <strong>Focus takeaway:</strong> {attempt.evaluation.oneThingToFocusOnNext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Custom Scenario Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-stone-900">Create Custom Communication Drill</h3>
            <p className="text-xs text-stone-500">
              Prepare for an upcoming real-life conversation, high-stakes meeting, or interview question.
            </p>

            <form onSubmit={handleLaunchCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Scenario Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  placeholder="e.g., Pitching a promotion to my executive director"
                  className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={e => setCustomCategory(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                >
                  <option value="PERSPECTIVE">Perspective / Point of View</option>
                  <option value="SOCIAL_SITUATION">Social / Meeting Situation</option>
                  <option value="DILEMMA">Difficult Dilemma</option>
                  <option value="PRESSURE">Pressure / Crisis</option>
                  <option value="DEEP_QUESTION">Deep Psychological Question</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Exact Prompt or Question to Answer
                </label>
                <textarea
                  rows={4}
                  required
                  value={customPrompt}
                  onChange={e => setCustomPrompt(e.target.value)}
                  placeholder="e.g., How would you respond when asked: 'Why should we allocate budget to your team rather than marketing?'"
                  className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-stone-900 px-5 py-2 text-xs font-bold text-white hover:bg-stone-800"
                >
                  Launch Custom Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
