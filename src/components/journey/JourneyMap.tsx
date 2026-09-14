import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Lock,
  ArrowRight,
  Shield,
  ChevronRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useJourney } from '../../context/JourneyContext';
import { LevelNode } from './LevelNode';
import { JOURNEY_LEVELS, JOURNEY_STAGES, getStageForLevel, CURRICULUM_LOCKING_ENABLED } from '../../data/journeyCurriculum';
import { sound } from '../../services/soundEngine';

interface JourneyMapProps {
  onSelectLevel: (levelNumber: number) => void;
}

export const JourneyMap: React.FC<JourneyMapProps> = ({ onSelectLevel }) => {
  const { journeyState, isLoading } = useJourney();
  const [selectedStageTab, setSelectedStageTab] = useState<number | null>(null);
  const [lockedModalData, setLockedModalData] = useState<{
    levelNumber: number;
    title: string;
    prevLevelNumber: number;
    targetToPlay: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const currentLevelNumber = journeyState?.currentLevel || 1;
  const currentStage = getStageForLevel(currentLevelNumber);
  const currentLevelData = JOURNEY_LEVELS[currentLevelNumber];
  const completedCount = journeyState?.completedCount ?? journeyState?.totalCompletedLevels ?? 0;
  const totalLevels = 75;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLevels) * 100));

  // Set ambient audio
  useEffect(() => {
    sound.setMood('map');
  }, []);

  // Smooth scroll to current active level node
  useEffect(() => {
    if (journeyState && currentLevelNumber) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`journey-node-${currentLevelNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentLevelNumber, selectedStageTab]);

  const handleLevelSelect = (levelNumber: number) => {
    const record = journeyState?.levels[levelNumber];
    const isLocked = CURRICULUM_LOCKING_ENABLED && (!record || record.status === 'LOCKED');

    if (isLocked) {
      sound.playClick();
      const prev = levelNumber > 1 ? levelNumber - 1 : 1;
      const prevRecord = journeyState?.levels[prev];
      const targetToPlay = (prevRecord && prevRecord.status !== 'LOCKED') ? prev : currentLevelNumber;

      setLockedModalData({
        levelNumber,
        title: JOURNEY_LEVELS[levelNumber]?.title || `Level ${levelNumber}`,
        prevLevelNumber: prev,
        targetToPlay
      });
      return;
    }

    onSelectLevel(levelNumber);
  };

  const scrollToStage = (stageNum: number) => {
    sound.playClick();
    setSelectedStageTab(stageNum);
    const el = document.getElementById(`world-territory-${stageNum}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Coordinates sequence: rhythmic winding path
  const getXPercentForLevel = (lvl: number): number => {
    const pattern = [25, 42, 65, 78, 65, 45, 28, 18, 32, 54, 75, 80, 65, 45, 25, 18];
    return pattern[(lvl - 1) % pattern.length];
  };

  const displayStages = journeyState?.stages && journeyState.stages.length > 0
    ? journeyState.stages
    : JOURNEY_STAGES;

  if (isLoading && !journeyState) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="w-6 h-6 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs tracking-wider text-zinc-500 uppercase">
            Loading Curriculum Map...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative pb-24 space-y-6">
      {/* Locked Prerequisite Notification Modal */}
      {lockedModalData && (
        <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl animate-subtle-fade">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700">
              <Lock className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                Sequential Prerequisite
              </span>
              <h3 className="text-lg font-display font-bold text-zinc-900">
                Level {lockedModalData.levelNumber} is Locked
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Complete Level {lockedModalData.prevLevelNumber}:{' '}
                <strong className="font-semibold text-zinc-900">
                  {JOURNEY_LEVELS[lockedModalData.prevLevelNumber]?.title}
                </strong>{' '}
                first to unlock this level.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setLockedModalData(null);
                  onSelectLevel(lockedModalData.targetToPlay);
                }}
                className="flex-1 py-2.5 rounded-xl bg-zinc-900 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Play Level {lockedModalData.targetToPlay}</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setLockedModalData(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAP HEADER / EXPEDITION BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-7 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 border border-zinc-200 text-[10px] font-mono font-bold tracking-wider text-zinc-700 uppercase">
                World Map · 75 Levels
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                World {currentStage?.stageNumber} of 12
              </span>
              {!CURRICULUM_LOCKING_ENABLED && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700 uppercase">
                  All Levels Unlocked
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 tracking-tight">
              Communication Mastery Journey
            </h1>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-xl">
              Currently on{' '}
              <strong className="text-zinc-900 font-semibold">
                Level {currentLevelNumber}: {currentLevelData?.title || 'Point First (PREP)'}
              </strong>{' '}
              in <span className="text-zinc-800 font-medium">World {currentStage?.stageNumber} ({currentStage?.title})</span>.
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong className="text-zinc-900">{completedCount}</strong> of {totalLevels} Mastered
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-zinc-400" />
                <span>{!CURRICULUM_LOCKING_ENABLED ? 'Free Exploration' : 'Sequential Curriculum'}</span>
              </div>
            </div>
          </div>

          {/* Enter Current Level Action */}
          <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-3 shrink-0">
            <button
              type="button"
              id="cta-continue-journey-map"
              onClick={() => {
                sound.playWhoosh();
                onSelectLevel(currentLevelNumber);
              }}
              className="px-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs sm:text-sm tracking-wide uppercase transition-all shadow-xs flex items-center justify-center gap-2 group active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white text-white" />
              <span>Resume Level {currentLevelNumber}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="w-full md:w-48 bg-zinc-50 rounded-xl p-2.5 border border-zinc-200">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-1">
                <span>Progress</span>
                <span className="text-zinc-900 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(completedCount > 0 ? 2 : 0, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* World Fast Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            setSelectedStageTab(null);
            const el = document.getElementById(`journey-node-${currentLevelNumber}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium whitespace-nowrap transition-all ${
            selectedStageTab === null
              ? 'bg-zinc-900 text-white font-bold shadow-xs'
              : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
          }`}
        >
          All Worlds (1–12)
        </button>

        {displayStages.map((stg) => {
          const isCurrent = currentStage?.stageNumber === stg.stageNumber;
          const isSelected = selectedStageTab === stg.stageNumber;

          return (
            <button
              key={stg.id || stg.stageNumber}
              type="button"
              onClick={() => scrollToStage(stg.stageNumber)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-zinc-900 text-white font-bold shadow-xs'
                  : isCurrent
                  ? 'bg-zinc-100 text-zinc-900 border border-zinc-400 font-semibold'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200'
              }`}
            >
              <span>W{stg.stageNumber}:</span>
              <span>{stg.title}</span>
              {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* THE CONTINUOUS WORLD JOURNEY MAP CANVAS */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl border border-zinc-200/90 bg-white overflow-hidden shadow-xs p-4 sm:p-8">
        {displayStages.map((stg) => {
          const isSelected = selectedStageTab === null || selectedStageTab === stg.stageNumber;
          if (!isSelected) return null;

          const [startLvl, endLvl] = stg.levelRange;
          const stageLevels = Array.from(
            { length: endLvl - startLvl + 1 },
            (_, i) => startLvl + i
          );

          return (
            <div
              key={stg.id || stg.stageNumber}
              id={`world-territory-${stg.stageNumber}`}
              className="relative my-8 pt-4 pb-12 border-b border-zinc-100 last:border-b-0"
            >
              {/* Territory Landmark Header */}
              <div className="relative mb-8 text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-200 text-[10px] font-mono tracking-wider text-zinc-600 uppercase font-semibold">
                  <MapPin className="w-3 h-3 text-zinc-500" />
                  <span>
                    WORLD 0{stg.stageNumber} · LEVELS {startLvl} TO {endLvl}
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900">
                  {stg.title}
                </h2>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  {stg.subtitle}
                </p>
              </div>

              {/* Sequential Winding Path of Level Nodes */}
              <div className="relative w-full max-w-2xl mx-auto min-h-[380px]">
                {/* SVG Connecting Guide Path */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ minHeight: `${stageLevels.length * 96}px` }}
                >
                  {/* Subtle connecting lines */}
                  {stageLevels.map((lvl, idx) => {
                    if (idx === stageLevels.length - 1) return null;
                    const nextLvl = lvl + 1;
                    const x1 = `${getXPercentForLevel(lvl)}%`;
                    const y1 = idx * 102 + 36;
                    const x2 = `${getXPercentForLevel(nextLvl)}%`;
                    const y2 = (idx + 1) * 102 + 36;

                    return (
                      <line
                        key={`path-line-${lvl}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="#E4E4E7"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                      />
                    );
                  })}
                </svg>

                {/* Render Level Nodes */}
                <div className="relative flex flex-col space-y-4">
                  {stageLevels.map((lvl) => {
                    const record = journeyState?.levels[lvl];
                    const status = record?.status || (lvl === 1 ? 'AVAILABLE' : 'LOCKED');
                    const isCurrent = lvl === currentLevelNumber;
                    const levelData = JOURNEY_LEVELS[lvl];
                    const xPercent = getXPercentForLevel(lvl);

                    return (
                      <LevelNode
                        key={`level-node-${lvl}`}
                        levelNumber={lvl}
                        title={levelData?.title || `Level ${lvl}`}
                        subtitle={levelData?.subtitle}
                        status={status}
                        score={record?.score}
                        isCurrentTarget={isCurrent}
                        xPercent={xPercent}
                        onSelect={handleLevelSelect}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
