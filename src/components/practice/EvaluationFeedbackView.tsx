import React from 'react';
import { AIEvaluationResult, PracticeAttempt } from '../../types';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Sparkles,
  BarChart2
} from 'lucide-react';

interface EvaluationFeedbackViewProps {
  evaluation: AIEvaluationResult;
  attempt?: PracticeAttempt;
  onTryAgain: () => void;
  onDone: () => void;
}

export const EvaluationFeedbackView: React.FC<EvaluationFeedbackViewProps> = ({
  evaluation,
  attempt,
  onTryAgain,
  onDone
}) => {
  const score = evaluation.overallScore;

  const getScoreBadge = (sc: number) => {
    if (sc >= 85) return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    if (sc >= 70) return 'bg-blue-100 text-blue-900 border-blue-300';
    if (sc >= 55) return 'bg-amber-100 text-amber-900 border-amber-300';
    return 'bg-red-100 text-red-900 border-red-300';
  };

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 space-y-6 pb-24">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-100 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-500">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Diagnostic Communication Evaluation</span>
            </div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
              Session Assessment
            </h2>
            <p className="mt-1 text-xs text-stone-500">
              Analyzed through structured cognitive models, rhetorical clarity, and emotional composure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border text-center shadow-sm ${getScoreBadge(
                score
              )}`}
            >
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">{score}</span>
                <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">/ 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Dimension Breakdown Grid */}
        {evaluation.dimensionScores && (
          <div className="mt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <BarChart2 className="h-4 w-4" />
              <span>Dimension Breakdown</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {Object.entries(evaluation.dimensionScores).map(([dimension, dimScore]) => {
                const cleanName = dimension
                  .toLowerCase()
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, c => c.toUpperCase());

                return (
                  <div
                    key={dimension}
                    className="rounded-xl border border-stone-200 bg-stone-50/70 p-3 text-center"
                  >
                    <span className="block text-[11px] font-semibold text-stone-600 truncate" title={cleanName}>
                      {cleanName}
                    </span>
                    <span className="mt-1 block text-lg font-bold text-stone-900">
                      {dimScore}
                    </span>
                    <div className="mt-1.5 h-1 w-full rounded-full bg-stone-200 overflow-hidden">
                      <div
                        className="h-full bg-stone-900"
                        style={{ width: `${Math.min(100, Math.max(0, Number(dimScore) || 0))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* What Went Well & What Can Improve */}
        <div className="mt-8 grid sm:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>What You Did Well</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-800">
              {evaluation.whatYouDidWell.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-600">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Growth */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              <span>High-Leverage Adjustments</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-800">
              {evaluation.whatCanImprove.map((pt, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-amber-700">•</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Filler words & vocal presence notes */}
        {(evaluation.confidenceNotes || (evaluation.fillerWordsObserved && evaluation.fillerWordsObserved.length > 0)) && (
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs space-y-2">
            <div className="font-bold text-stone-800">Vocal Conviction & Cadence:</div>
            {evaluation.confidenceNotes && (
              <p className="text-stone-600">{evaluation.confidenceNotes}</p>
            )}
            {evaluation.fillerWordsObserved && evaluation.fillerWordsObserved.length > 0 && (
              <p className="text-amber-800">
                <strong>Hesitation markers noticed:</strong> {evaluation.fillerWordsObserved.join(', ')}
              </p>
            )}
          </div>
        )}

        {/* Structural Sequence Model */}
        {evaluation.betterStructure && (
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-50 p-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Ideal Structural Formula for This Prompt
            </span>
            <p className="text-sm font-semibold text-stone-900">
              {evaluation.betterStructure}
            </p>
          </div>
        )}

        {/* Polished Mastered Response Example */}
        {evaluation.exampleImprovedResponse && (
          <div className="mt-6 rounded-xl border border-stone-300 bg-stone-900 p-6 text-white space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
              <Lightbulb className="h-4 w-4" />
              <span>The Mastered Alternative (Gold Standard Model)</span>
            </div>
            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-serif italic">
              "{evaluation.exampleImprovedResponse}"
            </p>
          </div>
        )}

        {/* One Thing to Focus on Next */}
        {evaluation.oneThingToFocusOnNext && (
          <div className="mt-6 rounded-xl border border-stone-200 bg-stone-100 p-4 text-xs font-medium text-stone-800 flex items-start gap-2.5">
            <Award className="h-4 w-4 text-stone-900 shrink-0 mt-0.5" />
            <div>
              <strong>Single Habit to Take into Your Next Session: </strong>
              {evaluation.oneThingToFocusOnNext}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 pt-6">
          <button
            type="button"
            onClick={onTryAgain}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 px-5 py-2.5 text-xs font-bold text-stone-800 hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Practice This Prompt Again</span>
          </button>

          <button
            type="button"
            id="eval-done-btn"
            onClick={onDone}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition-colors shadow-sm"
          >
            <span>Finish & Return to Arena</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
