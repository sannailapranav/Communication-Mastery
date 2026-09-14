import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useJourney } from '../../context/JourneyContext';
import { JOURNEY_LEVELS, JOURNEY_STAGES, getStageForLevel } from '../../data/journeyCurriculum';
import {
  Compass,
  ArrowRight,
  Shield,
  Volume2,
  Brain,
  MessagesSquare,
  Sparkles,
  Eye,
  ShieldAlert,
  Crown,
  Play,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../../services/soundEngine';

interface GameHomeViewProps {
  onEnterJourney: () => void;
  onEnterLevel: (levelNum: number) => void;
  onOpenFrameworks: () => void;
}

export const GameHomeView: React.FC<GameHomeViewProps> = ({
  onEnterJourney,
  onEnterLevel,
  onOpenFrameworks
}) => {
  const { user } = useAuth();
  const { journeyState } = useJourney();

  const currentLevelNum = journeyState?.currentLevel || 1;
  const currentLevelData = JOURNEY_LEVELS[currentLevelNum];
  const completedCount = journeyState?.completedCount ?? journeyState?.totalCompletedLevels ?? 0;
  const totalLevels = 75;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLevels) * 100));

  const currentStage = getStageForLevel(currentLevelNum);

  useEffect(() => {
    sound.setMood('map');
  }, []);

  const stageIcons: Record<number, any> = {
    1: Shield,
    2: Volume2,
    3: Brain,
    4: MessagesSquare,
    5: Sparkles,
    6: Eye,
    7: ShieldAlert,
    8: Crown,
    9: Sparkles,
    10: Shield,
    11: Brain,
    12: Crown
  };

  const StageIcon = stageIcons[currentStage?.stageNumber || 1] || Compass;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between py-6 sm:py-10 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Subtle depth lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Expedition Gate */}
      <div className="relative z-10 text-center space-y-6 pt-4 sm:pt-8">
        {/* Territory Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-medium text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>TERRITORY 0{currentStage?.stageNumber || 1} · {currentStage?.title.toUpperCase()}</span>
        </div>

        {/* Level Announcement */}
        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold block">
            Welcome, {user?.displayName || 'Learner'}
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight text-slate-100 max-w-3xl mx-auto">
            Level {currentLevelNum < 10 ? '0' + currentLevelNum : currentLevelNum}
            <span className="block text-2xl sm:text-3xl font-display font-medium text-slate-300 mt-2">
              "{currentLevelData?.title || 'Point First (PREP)'}"
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed">
            {currentLevelData?.subtitle || currentLevelData?.frameworkFormula || 'Lead with the core message before unpacking reasons and evidence.'}
          </p>
        </div>

        {/* Primary Action: ENTER LEVEL */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => {
              sound.playWhoosh();
              onEnterLevel(currentLevelNum);
            }}
            className="w-full sm:w-auto flex-1 px-8 py-3.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
            <span>Enter Level {currentLevelNum}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onEnterJourney();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-200 font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4 text-slate-400" />
            <span>World Map</span>
          </button>
        </div>
      </div>

      {/* Territory Progression Strip */}
      <div className="relative z-10 mt-8 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
              <StageIcon className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block font-semibold">Active Territory</span>
              <h3 className="text-sm font-display font-bold text-slate-100">{currentStage?.title}</h3>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-100 font-bold">{completedCount}</span>
              <span className="text-slate-500">/</span>
              <span>{totalLevels} Mastered</span>
              <span className="text-emerald-400 font-bold ml-1">({progressPercent}%)</span>
            </div>
            <div className="w-full sm:w-48 h-2 bg-slate-950/80 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(completedCount > 0 ? 3 : 0, progressPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Territory Grid */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {JOURNEY_STAGES.slice(0, 4).map(st => {
            const stageMeta = journeyState?.stages?.find(s => s.id === st.id);
            const isCompleted = stageMeta?.isCompleted ?? (currentLevelNum > st.levelRange[1]);
            const isUnlocked = stageMeta?.isUnlocked ?? (st.stageNumber === 1 || currentLevelNum >= st.levelRange[0]);
            const isCurrent = currentLevelNum >= st.levelRange[0] && currentLevelNum <= st.levelRange[1];

            return (
              <div
                key={st.id}
                className={`p-3 rounded-lg border flex flex-col justify-between transition-all ${
                  isCurrent
                    ? 'bg-slate-800/90 border-slate-600 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-950/60 border-emerald-800/50 text-emerald-400'
                    : !isUnlocked
                    ? 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span>W0{st.stageNumber}</span>
                  {isCompleted ? (
                    <span className="text-emerald-400 font-bold">✓ DONE</span>
                  ) : isCurrent ? (
                    <span className="text-slate-200 font-bold">ACTIVE</span>
                  ) : isUnlocked ? (
                    <span className="text-slate-400 font-medium">READY</span>
                  ) : (
                    <span>🔒 LOCKED</span>
                  )}
                </div>
                <span className="font-display font-bold text-slate-200 mt-1 truncate">
                  {st.title}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {stageMeta ? `${stageMeta.completedLevels}/${stageMeta.totalLevels}` : `Levels ${st.levelRange[0]}-${st.levelRange[1]}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
