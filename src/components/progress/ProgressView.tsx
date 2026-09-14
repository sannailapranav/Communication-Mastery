import React, { useState } from 'react';
import { useProgress } from '../../context/ProgressContext';
import { CommunicationDimension } from '../../types';
import {
  BarChart3,
  Award,
  Flame,
  BookOpen,
  Target,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lock,
  Calendar
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { stats } = useProgress();

  const dimensions: { key: CommunicationDimension; label: string; desc: string }[] = [
    { key: 'CLARITY', label: 'Clarity', desc: 'Precision of message and elimination of ambiguity.' },
    { key: 'STRUCTURE', label: 'Structure', desc: 'Logical sequence and application of frameworks like PREP.' },
    { key: 'FLUENCY', label: 'Fluency', desc: 'Cadence, rhythm, and elimination of filler words.' },
    { key: 'LISTENING', label: 'Active Listening', desc: 'Deep comprehension of nuance before formulating reply.' },
    { key: 'REASONING', label: 'Reasoning', desc: 'Soundness of supporting arguments and evidence.' },
    { key: 'PERSUASION', label: 'Persuasion', desc: 'Ability to influence perspectives and align incentives.' },
    { key: 'EMOTIONAL_EXPRESSION', label: 'Emotional Expression', desc: 'Authenticity, empathy, and emotional resonance.' },
    { key: 'ADAPTABILITY', label: 'Adaptability', desc: 'Flexibility to shift tone across diverse audiences.' },
    { key: 'CONFLICT_HANDLING', label: 'Conflict De-escalation', desc: 'Composure and non-defensiveness in friction.' },
    { key: 'SPONTANEITY', label: 'Spontaneity', desc: 'Impromptu verbal presence without panic.' }
  ];

  // Radar Polygon math
  const size = 300;
  const center = size / 2;
  const radius = center - 40;
  const totalDims = dimensions.length;

  const points = dimensions.map((dim, i) => {
    const angle = (Math.PI * 2 / totalDims) * i - Math.PI / 2;
    const rawScore = stats?.dimensionScores?.[dim.key] || 0;
    const scoreVal = rawScore > 0 ? rawScore : 45; // Default baseline visual representation
    const r = (scoreVal / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle, label: dim.label, score: rawScore };
  });

  const polygonPath = points.map(p => `${p.x},${p.y}`).join(' ');

  // Identify strengths & focus areas
  const scoredDims = dimensions
    .map(d => ({ ...d, score: stats?.dimensionScores?.[d.key] || 0 }))
    .filter(d => d.score > 0)
    .sort((a, b) => b.score - a.score);

  const topStrengths = scoredDims.slice(0, 2);
  const growthEdges = [...scoredDims].reverse().slice(0, 2);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex items-center gap-1.5 rounded-md bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-800 w-fit">
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Longitudinal Intelligence</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Communication Profile & Mastery Radar
        </h1>
        <p className="mt-1 text-sm text-stone-600 max-w-2xl">
          Track your progress across all ten communication dimensions, observe unlocked milestones, and target high-leverage growth areas.
        </p>
      </div>

      {/* Top Stat Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Overall Communication Score</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">
              {stats && stats.overallScoreAverage > 0 ? stats.overallScoreAverage : '—'}
            </span>
            <span className="text-xs text-stone-500">/ 100</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Multi-session weighted average</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Curriculum Completed</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">
              {stats?.lessonsCompleted || 0}
            </span>
            <span className="text-xs text-stone-500">/ {stats?.totalLessons || 12} lessons</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Across 4 progressive levels</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Simulations Completed</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">
              {stats?.practiceSessionsCompleted || 0}
            </span>
            <span className="text-xs text-stone-500">drills</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Vocal recordings & written analyses</p>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Current Habit Streak</span>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">
              {stats?.streakDays || 0}
            </span>
            <span className="text-xs text-stone-500">days</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">Daily disciplined focus</p>
        </div>
      </div>

      {/* Radar Section & Dimension Detail Bars */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Radar Chart Visualizer */}
        <div className="lg:col-span-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="w-full text-left mb-4">
            <h3 className="text-base font-bold text-stone-900">The 10-Dimension Radar</h3>
            <p className="text-xs text-stone-500">Holistic balance of your communication capabilities</p>
          </div>

          <div className="relative w-[300px] h-[300px] flex items-center justify-center">
            <svg width={size} height={size} className="overflow-visible">
              {/* Concentric guide rings (25%, 50%, 75%, 100%) */}
              {[0.25, 0.5, 0.75, 1].map((scale, idx) => (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius * scale}
                  fill="none"
                  stroke="#e7e5e4"
                  strokeWidth="1"
                  strokeDasharray={scale === 1 ? 'none' : '3 3'}
                />
              ))}

              {/* Axis spokes */}
              {points.map((p, idx) => (
                <line
                  key={idx}
                  x1={center}
                  y1={center}
                  x2={center + radius * Math.cos(p.angle)}
                  y2={center + radius * Math.sin(p.angle)}
                  stroke="#e7e5e4"
                  strokeWidth="1"
                />
              ))}

              {/* Data Polygon */}
              <polygon
                points={polygonPath}
                fill="rgba(28, 25, 23, 0.15)"
                stroke="#1c1917"
                strokeWidth="2"
              />

              {/* Point Markers */}
              {points.map((p, idx) => (
                <circle
                  key={idx}
                  cx={p.x}
                  cy={p.y}
                  r="3.5"
                  fill="#1c1917"
                />
              ))}
            </svg>
          </div>

          <div className="mt-4 text-center text-xs text-stone-500">
            {stats && stats.practiceSessionsCompleted > 0
              ? 'Calibrated from your actual recorded practice evaluations.'
              : 'Initial baseline displayed. Complete practice sessions to record active scores.'}
          </div>
        </div>

        {/* Dimension Breakdown List */}
        <div className="lg:col-span-6 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-stone-900">Dimension Analysis</h3>

          <div className="space-y-3 divide-y divide-stone-100 max-h-[460px] overflow-y-auto pr-1">
            {dimensions.map(dim => {
              const score = stats?.dimensionScores?.[dim.key] || 0;
              return (
                <div key={dim.key} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-stone-900">{dim.label}</span>
                      <p className="text-[11px] text-stone-500">{dim.desc}</p>
                    </div>
                    <span className="font-bold text-stone-900 ml-2">
                      {score > 0 ? `${score}/100` : '—'}
                    </span>
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className="h-full bg-stone-900 transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
              Identified Core Strengths
            </h3>
          </div>
          {topStrengths.length > 0 ? (
            <ul className="space-y-2 text-xs text-stone-800">
              {topStrengths.map(s => (
                <li key={s.key} className="flex items-start gap-2">
                  <span className="font-bold text-emerald-700">•</span>
                  <span>
                    <strong>{s.label} ({s.score}/100):</strong> {s.desc}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-stone-600">
              Complete your first practice session to identify your strongest communication levers.
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-700" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900">
              Highest-Leverage Growth Edges
            </h3>
          </div>
          {growthEdges.length > 0 ? (
            <ul className="space-y-2 text-xs text-stone-800">
              {growthEdges.map(g => (
                <li key={g.key} className="flex items-start gap-2">
                  <span className="font-bold text-amber-700">•</span>
                  <span>
                    <strong>{g.label} ({g.score}/100):</strong> {g.desc}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-stone-600">
              Practice simulation scenarios to highlight specific areas for structural tuning.
            </p>
          )}
        </div>
      </div>

      {/* Achievements Showcase */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-stone-900">Mastery Achievements</h3>
            <p className="text-xs text-stone-500">Milestones recognizing genuine commitment and vocal command</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(stats?.achievements || []).map(ach => {
            const isUnlocked = Boolean(ach.unlockedAt);

            return (
              <div
                key={ach.id}
                className={`rounded-xl border p-4 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'border-amber-300 bg-amber-50/40 text-stone-900'
                    : 'border-stone-200 bg-stone-50/60 opacity-60 text-stone-600'
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isUnlocked ? 'bg-amber-500 text-white shadow-sm' : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {isUnlocked ? <Award className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900">{ach.title}</h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-semibold text-amber-800">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11px] text-stone-600 leading-snug">
                    {ach.description}
                  </p>
                  {isUnlocked && ach.unlockedAt && (
                    <span className="mt-1 block text-[10px] text-stone-400">
                      {new Date(ach.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
