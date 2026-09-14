import React, { useState } from 'react';
import { FRAMEWORKS_LIBRARY } from '../../data/frameworks';
import { Framework } from '../../types';
import {
  Sparkles,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FrameworksLibraryProps {
  onPracticeFramework: (frameworkName: string, promptText: string) => void;
}

export const FrameworksLibrary: React.FC<FrameworksLibraryProps> = ({
  onPracticeFramework
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<string>(FRAMEWORKS_LIBRARY[0].id);

  const filteredFrameworks = FRAMEWORKS_LIBRARY.filter(fw => {
    const q = searchQuery.toLowerCase();
    return (
      fw.name.toLowerCase().includes(q) ||
      fw.code.toLowerCase().includes(q) ||
      fw.tagline.toLowerCase().includes(q) ||
      fw.purpose.toLowerCase().includes(q)
    );
  });

  const activeFramework =
    FRAMEWORKS_LIBRARY.find(fw => fw.id === selectedFrameworkId) || FRAMEWORKS_LIBRARY[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-800">
              <Layers className="h-3.5 w-3.5" />
              <span>Cognitive Models</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Communication Frameworks Library
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-2xl">
              Internalize mental structures that transform rambling hesitation into decisive verbal presence under any circumstance.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search frameworks (e.g. PREP, STAR)..."
              className="w-full rounded-xl border border-stone-200 pl-9 pr-4 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            />
          </div>
        </div>
      </div>

      {/* Main Framework Layout: Sidebar List + Deep Dive Viewer */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Framework Selection List */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Select Framework ({filteredFrameworks.length})
          </span>

          <div className="space-y-2">
            {filteredFrameworks.map(fw => {
              const isSelected = fw.id === activeFramework.id;
              return (
                <button
                  key={fw.id}
                  id={`framework-tab-${fw.code.toLowerCase()}`}
                  onClick={() => setSelectedFrameworkId(fw.id)}
                  className={`w-full rounded-xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                      : 'border-stone-200 bg-white text-stone-900 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                      {fw.code}
                    </span>
                    <ArrowRight className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-stone-400'}`} />
                  </div>
                  <h3 className="mt-1 text-sm font-bold">{fw.name}</h3>
                  <p className={`mt-0.5 text-xs line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    {fw.tagline}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Framework Dossier */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            {/* Header info */}
            <div className="border-b border-stone-100 pb-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-md bg-stone-100 px-2.5 py-1 font-mono text-xs font-bold text-stone-800 border border-stone-200">
                  {activeFramework.code}
                </span>
                <button
                  id="framework-practice-btn"
                  onClick={() =>
                    onPracticeFramework(activeFramework.name, activeFramework.practicePrompt)
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2 text-xs font-bold text-white hover:bg-stone-800 transition-colors shadow-sm"
                >
                  <Target className="h-3.5 w-3.5" />
                  <span>Practice This Framework</span>
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
                {activeFramework.name}
              </h2>
              <p className="text-sm font-semibold text-stone-700">
                {activeFramework.tagline}
              </p>
              <p className="text-sm text-stone-600 leading-relaxed">
                {activeFramework.explanation}
              </p>
            </div>

            {/* When to use & Purpose */}
            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-1">
                <span className="font-bold uppercase tracking-wider text-stone-500">Core Purpose</span>
                <p className="text-stone-800 font-medium leading-relaxed">{activeFramework.purpose}</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 space-y-1">
                <span className="font-bold uppercase tracking-wider text-stone-500">Ideal Situations</span>
                <p className="text-stone-800 font-medium leading-relaxed">{activeFramework.whenToUse}</p>
              </div>
            </div>

            {/* Step-by-Step Anatomy */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-stone-700" />
                <span>The Step-by-Step Sequence</span>
              </h3>

              <div className="grid gap-3">
                {activeFramework.structureSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-stone-200 bg-stone-50/70 p-4 gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-900 text-white font-bold text-xs">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-stone-900">{step.step}</h4>
                        <p className="text-xs text-stone-600">{step.meaning}</p>
                      </div>
                    </div>

                    <div className="rounded-md bg-white px-3 py-1.5 border border-stone-200 text-xs font-semibold text-stone-700 self-start sm:self-center">
                      <span className="text-stone-400 font-normal">Ask yourself: </span>
                      "{step.promptToAsk}"
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Realistic Scenario Contrast: Weak vs Strong */}
            <div className="space-y-3 border-t border-stone-100 pt-6">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-stone-700" />
                <span>Realistic Simulation Case</span>
              </h3>

              <div className="rounded-xl border border-stone-200 bg-stone-100 p-4 text-xs font-medium text-stone-700">
                <strong>Context:</strong> {activeFramework.realisticScenario.context}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Weak */}
                <div className="rounded-xl border border-red-200 bg-red-50/40 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-800 uppercase tracking-wider">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                    <span>Amateur / Wandering</span>
                  </div>
                  <p className="text-xs text-stone-800 italic leading-relaxed">
                    "{activeFramework.realisticScenario.weakExample}"
                  </p>
                  <p className="text-xs text-red-800 pt-2 border-t border-red-200">
                    <strong>Critique:</strong> {activeFramework.realisticScenario.weakCritique}
                  </p>
                </div>

                {/* Strong */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Mastered Delivery</span>
                  </div>
                  <p className="text-xs text-stone-900 font-medium leading-relaxed">
                    "{activeFramework.realisticScenario.strongExample}"
                  </p>
                  <p className="text-xs text-emerald-900 pt-2 border-t border-emerald-200">
                    <strong>Anatomy:</strong> {activeFramework.realisticScenario.strongBreakdown}
                  </p>
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="space-y-2 border-t border-stone-100 pt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Common Execution Pitfalls
              </h3>
              <ul className="space-y-1.5 text-xs text-stone-600 list-disc list-inside">
                {activeFramework.commonMistakes.map((mistake, i) => (
                  <li key={i}>{mistake}</li>
                ))}
              </ul>
            </div>

            {/* Practice Prompt Banner */}
            <div className="rounded-xl border border-stone-300 bg-stone-900 p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Ready to test this framework?
                </span>
                <p className="mt-1 text-xs text-stone-200 max-w-xl">
                  {activeFramework.practicePrompt}
                </p>
              </div>
              <button
                onClick={() =>
                  onPracticeFramework(activeFramework.name, activeFramework.practicePrompt)
                }
                className="shrink-0 rounded-lg bg-white px-4 py-2 text-xs font-bold text-stone-900 hover:bg-stone-100 transition-colors"
              >
                Apply in Practice Arena
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
