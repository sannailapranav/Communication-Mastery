import React from 'react';
import { CheckCircle2, Lock, Play, ArrowRight, Star } from 'lucide-react';
import { JourneyLevelStatus } from '../../types';

interface LevelCardNodeProps {
  key?: React.Key;
  levelNumber: number;
  title: string;
  subtitle?: string;
  status: JourneyLevelStatus;
  estimatedMinutes?: number;
  score?: number;
  isCurrentTarget?: boolean;
  onSelect: (levelNumber: number) => void;
}

export const LevelCardNode: React.FC<LevelCardNodeProps> = ({
  levelNumber,
  title,
  subtitle,
  status,
  estimatedMinutes = 8,
  score,
  isCurrentTarget = false,
  onSelect
}) => {
  const isCompleted = status === 'COMPLETED';
  const isAvailable = status === 'AVAILABLE' || status === 'IN_PROGRESS';
  const isLocked = status === 'LOCKED';

  return (
    <div
      id={`journey-node-${levelNumber}`}
      onClick={isLocked ? undefined : () => onSelect(levelNumber)}
      className={`relative group rounded-xl p-5 border transition-all duration-200 select-none ${
        isCurrentTarget
          ? 'bg-amber-500/10 border-amber-500/50 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20 cursor-pointer'
          : isCompleted
          ? 'bg-stone-900/60 border-stone-800 hover:border-emerald-500/40 hover:bg-stone-900 cursor-pointer'
          : isAvailable
          ? 'bg-stone-900/40 border-stone-700/60 hover:border-amber-500/40 hover:bg-stone-900/80 cursor-pointer'
          : 'bg-stone-950/40 border-stone-800/30 opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Status Badge / Icon */}
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-semibold transition-colors ${
              isCompleted
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/50'
                : isCurrentTarget
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/30 animate-pulse'
                : isAvailable
                ? 'bg-stone-800 text-stone-200 border border-stone-700'
                : 'bg-stone-900 text-stone-500 border border-stone-800/60'
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : isLocked ? (
              <Lock className="w-4 h-4 text-stone-500" />
            ) : (
              <span>{levelNumber}</span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono tracking-wider uppercase text-stone-400">
                Level {levelNumber}
              </span>
              {isCurrentTarget && (
                <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                  Current
                </span>
              )}
              {status === 'IN_PROGRESS' && !isCurrentTarget && (
                <span className="px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                  In Progress
                </span>
              )}
            </div>
            <h4
              className={`text-base font-medium mt-0.5 transition-colors ${
                isLocked ? 'text-stone-400' : 'text-stone-100 group-hover:text-amber-200'
              }`}
            >
              {title}
            </h4>
          </div>
        </div>

        {/* Right side status / score */}
        <div className="text-right flex flex-col items-end">
          {isCompleted && score ? (
            <div className="flex items-center gap-1 text-xs font-mono px-2 py-1 bg-emerald-950/40 text-emerald-300 border border-emerald-800/30 rounded-md">
              <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>{score}%</span>
            </div>
          ) : (
            <span className="text-xs text-stone-400 font-mono">
              ~{estimatedMinutes}m
            </span>
          )}
        </div>
      </div>

      {subtitle && (
        <p className="text-xs text-stone-400 mt-2.5 line-clamp-1 pl-13">
          {subtitle}
        </p>
      )}

      <div className="mt-4 pt-3 border-t border-stone-800/40 flex items-center justify-between text-xs">
        <span className="text-stone-400">
          {isCompleted
            ? 'Completed • Review'
            : isCurrentTarget
            ? 'Ready to master'
            : isAvailable
            ? 'Unlocked • Start'
            : `Complete Level ${levelNumber - 1} to unlock`}
        </span>

        <div className="flex items-center gap-1 font-medium">
          {isCompleted ? (
            <span className="text-stone-400 group-hover:text-stone-200 flex items-center gap-1">
              Review <ArrowRight className="w-3.5 h-3.5" />
            </span>
          ) : isAvailable ? (
            <span className="text-amber-400 group-hover:text-amber-300 flex items-center gap-1 font-semibold">
              <Play className="w-3 h-3 fill-amber-400" />
              Start Lesson
            </span>
          ) : (
            <span className="text-stone-400 flex items-center gap-1">
              Locked <Lock className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
