import React from 'react';
import { Check, Lock, Play, Compass } from 'lucide-react';
import { JourneyLevelStatus } from '../../types';
import { sound } from '../../services/soundEngine';

interface LevelNodeProps {
  levelNumber: number;
  title: string;
  subtitle?: string;
  status: JourneyLevelStatus;
  score?: number;
  isCurrentTarget?: boolean;
  align?: 'left' | 'center' | 'right';
  xPercent: number; // 20 to 80%
  onSelect: (levelNumber: number) => void;
}

export const LevelNode: React.FC<LevelNodeProps> = ({
  levelNumber,
  title,
  subtitle,
  status,
  score,
  isCurrentTarget = false,
  xPercent,
  onSelect
}) => {
  const isCompleted = status === 'COMPLETED';
  const isAvailable = status === 'AVAILABLE' || status === 'IN_PROGRESS';
  const isLocked = status === 'LOCKED';

  const handleClick = (e: React.MouseEvent) => {
    if (isLocked) {
      sound.playClick();
      onSelect(levelNumber); // Opens informative locked prerequisite modal
      return;
    }
    if (isCompleted) {
      sound.playClick();
    } else if (isCurrentTarget || isAvailable) {
      sound.playNodeSelect();
    }
    onSelect(levelNumber);
  };

  return (
    <div
      id={`journey-node-${levelNumber}`}
      className={`relative flex flex-col items-center my-5 group select-none transition-transform ${
        isLocked ? 'opacity-70' : ''
      }`}
      style={{
        left: `${xPercent}%`,
        transform: 'translateX(-50%)',
        position: 'relative'
      }}
    >
      {/* Current Active Indicator Tag */}
      {isCurrentTarget && (
        <div className="absolute -top-7 px-2.5 py-0.5 rounded-full bg-zinc-900 text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-sm z-20 flex items-center gap-1">
          <Compass className="w-3 h-3 text-white" />
          <span>Current</span>
        </div>
      )}

      {/* Main Node Disc — Tactical Editorial Seal */}
      <button
        type="button"
        disabled={isLocked}
        onClick={handleClick}
        className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200 z-10 ${
          isLocked
            ? 'bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
            : isCurrentTarget
            ? 'bg-zinc-900 text-white border-2 border-zinc-900 ring-4 ring-zinc-300 shadow-md scale-105 cursor-pointer'
            : isCompleted
            ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 hover:border-emerald-600 hover:shadow-sm cursor-pointer'
            : isAvailable
            ? 'bg-white border-2 border-zinc-300 text-zinc-800 hover:border-zinc-800 hover:shadow-sm cursor-pointer'
            : 'bg-zinc-100 border border-zinc-200 text-zinc-400 cursor-not-allowed'
        }`}
        aria-disabled={isLocked}
        title={isLocked ? `Level ${levelNumber} is Locked. Complete Level ${levelNumber - 1} with a passing score first.` : `Level ${levelNumber}: ${title}`}
      >
        {isCompleted ? (
          <div className="flex flex-col items-center">
            <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span className="text-[10px] font-mono font-bold text-emerald-800">{levelNumber}</span>
          </div>
        ) : isCurrentTarget ? (
          <div className="flex flex-col items-center">
            <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
            <span className="text-[10px] font-mono font-bold text-white">{levelNumber}</span>
          </div>
        ) : isAvailable ? (
          <span className="font-mono font-bold text-sm text-zinc-800">{levelNumber}</span>
        ) : (
          <div className="flex flex-col items-center">
            <Lock className="w-4 h-4 text-zinc-400 stroke-[2.5]" />
            <span className="text-[10px] font-mono text-zinc-400">{levelNumber}</span>
          </div>
        )}
      </button>

      {/* Info Plate */}
      <div
        onClick={handleClick}
        className={`mt-2 px-3 py-1.5 rounded-xl border text-center max-w-[170px] sm:max-w-[210px] transition-all ${
          isLocked
            ? 'bg-zinc-50/80 border-zinc-200 text-zinc-400 cursor-not-allowed'
            : isCurrentTarget
            ? 'bg-white border-zinc-400 text-zinc-950 shadow-sm cursor-pointer'
            : isCompleted
            ? 'bg-white/95 border-zinc-200 text-zinc-800 hover:border-zinc-300 cursor-pointer'
            : isAvailable
            ? 'bg-white/90 border-zinc-200 text-zinc-700 hover:border-zinc-300 cursor-pointer'
            : 'bg-zinc-50 border-zinc-200 text-zinc-400 cursor-not-allowed'
        }`}
      >
        <div className={`text-[11px] sm:text-xs font-display font-semibold truncate flex items-center justify-center gap-1 ${
          isLocked ? 'text-zinc-500' : 'text-zinc-900'
        }`}>
          {isLocked && <Lock className="w-2.5 h-2.5 text-zinc-400 shrink-0" />}
          <span>{title}</span>
        </div>
        <div className="text-[10px] text-zinc-400 font-mono truncate">
          {isLocked ? `Locked • Level ${levelNumber - 1} required` : (subtitle || '')}
        </div>
      </div>
    </div>
  );
};
