import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useJourney } from '../../context/JourneyContext';
import {
  X,
  Shield,
  Volume2,
  Music,
  LogOut,
  CheckCircle2,
  Lock,
  Compass,
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { sound } from '../../services/soundEngine';
import { JOURNEY_STAGES, getStageForLevel } from '../../data/journeyCurriculum';

interface GameProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLevel: (lvl: number) => void;
}

export const GameProfileModal: React.FC<GameProfileModalProps> = ({
  isOpen,
  onClose,
  onSelectLevel
}) => {
  const { user, logout } = useAuth();
  const { journeyState } = useJourney();

  const [activeTab, setActiveTab] = useState<'journey' | 'discoveries' | 'settings'>('journey');
  const [musicOn, setMusicOn] = useState(sound.getMusicEnabled());
  const [sfxOn, setSfxOn] = useState(sound.getSfxEnabled());
  const [volume, setVolume] = useState(sound.getVolume());

  if (!isOpen) return null;

  const currentLevelNum = journeyState?.currentLevel || 1;
  const currentStage = getStageForLevel(currentLevelNum);

  const completedCount = journeyState?.completedCount ?? journeyState?.totalCompletedLevels ?? 0;
  const totalLevels = 75;

  const discoveries = [
    {
      id: 'd1',
      title: 'First Step',
      desc: 'Completed your first communication framework lesson.',
      unlocked: completedCount >= 1,
      icon: Compass,
      tier: 'Bronze'
    },
    {
      id: 'd2',
      title: 'Direct Answers',
      desc: 'Mastered World 01 (Point First & PREP Architecture).',
      unlocked: completedCount >= 6,
      icon: Shield,
      tier: 'Silver'
    },
    {
      id: 'd3',
      title: 'Thinking Architecture',
      desc: 'Mastered World 02 (Pyramid Principle & Grouping).',
      unlocked: completedCount >= 12,
      icon: BookOpen,
      tier: 'Silver'
    },
    {
      id: 'd4',
      title: 'Conversational Fluency',
      desc: 'Mastered World 03 (Active Listening & Echoing).',
      unlocked: completedCount >= 18,
      icon: Sparkles,
      tier: 'Gold'
    },
    {
      id: 'd5',
      title: 'Master Communicator',
      desc: 'Mastered World 05 (High-Stakes Persuasion & Debate).',
      unlocked: completedCount >= 30,
      icon: Award,
      tier: 'Platinum'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white border border-zinc-200 rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-subtle-fade">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-200 bg-zinc-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-mono font-bold text-sm flex items-center justify-center shadow-xs">
              {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'CM'}
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-zinc-900">
                {user?.displayName || 'Learner'}
              </h2>
              <p className="text-xs text-zinc-500 font-mono">
                {completedCount} / {totalLevels} Levels Mastered · World {currentStage.stageNumber}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1.5 px-5 py-2.5 border-b border-zinc-200 bg-zinc-50/40">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('journey');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'journey'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            World Territories
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('discoveries');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'discoveries'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            Milestones ({discoveries.filter(d => d.unlocked).length}/{discoveries.length})
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              setActiveTab('settings');
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            Audio & Settings
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {activeTab === 'journey' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-zinc-500 block font-semibold">Total Progress</span>
                  <span className="text-2xl font-display font-bold text-zinc-900">
                    {completedCount} <span className="text-xs font-normal text-zinc-500">of {totalLevels} Levels Mastered</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onSelectLevel(currentLevelNum);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs cursor-pointer"
                >
                  Resume Level {currentLevelNum}
                </button>
              </div>

              {/* Worlds List */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block">
                  12 Worlds of Communication Mastery
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {JOURNEY_STAGES.map((stg) => {
                    const isCompleted = completedCount >= stg.levelRange[1];
                    const isCurrent = currentStage.stageNumber === stg.stageNumber;
                    const isStageUnlocked = stg.stageNumber === 1 || completedCount >= stg.levelRange[0] - 1;

                    return (
                      <div
                        key={stg.stageNumber}
                        onClick={() => {
                          sound.playClick();
                          if (!isStageUnlocked) {
                            onSelectLevel(currentLevelNum);
                          } else {
                            onSelectLevel(stg.levelRange[0]);
                          }
                          onClose();
                        }}
                        className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                            : isCompleted
                            ? 'bg-emerald-50/50 border-emerald-200 text-zinc-900 hover:border-emerald-300'
                            : isStageUnlocked
                            ? 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300'
                            : 'bg-zinc-50/70 border-zinc-200/80 text-zinc-400 opacity-80'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-[10px] font-mono font-bold uppercase ${isCurrent ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            World {stg.stageNumber} · L{stg.levelRange[0]}-{stg.levelRange[1]}
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : isCurrent ? (
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          ) : (
                            <Lock className="w-3 h-3 text-zinc-400" />
                          )}
                        </div>
                        <div className={`text-xs font-display font-bold ${isCurrent ? 'text-white' : isStageUnlocked ? 'text-zinc-900' : 'text-zinc-500'}`}>
                          {stg.title}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'discoveries' && (
            <div className="space-y-2.5">
              {discoveries.map((disc) => {
                const Icon = disc.icon;
                return (
                  <div
                    key={disc.id}
                    className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                      disc.unlocked
                        ? 'bg-white border-zinc-200 text-zinc-900 shadow-2xs'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-400 opacity-60'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        disc.unlocked
                          ? 'bg-zinc-900 text-white'
                          : 'bg-zinc-200 text-zinc-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-display font-bold text-zinc-900">
                          {disc.title}
                        </h4>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600">
                          {disc.tier}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {disc.desc}
                      </p>
                    </div>
                    {disc.unlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-zinc-400 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-700">
                  Sound & Audio Ambience
                </h3>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-800">
                    <Music className="w-4 h-4 text-zinc-600" />
                    <span>Atmospheric Background Chords</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={musicOn}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setMusicOn(v);
                      sound.setMusicEnabled(v);
                    }}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-xs text-zinc-800">
                    <Volume2 className="w-4 h-4 text-zinc-600" />
                    <span>Tactile Audio Effects (SFX)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sfxOn}
                    onChange={(e) => {
                      const v = e.target.checked;
                      setSfxOn(v);
                      sound.setSfxEnabled(v);
                    }}
                    className="w-4 h-4 rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                  <div className="flex items-center justify-between text-xs text-zinc-600 font-mono">
                    <span>Master Volume</span>
                    <span>{Math.round(volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      setVolume(v);
                      sound.setVolume(v);
                    }}
                    className="w-full accent-zinc-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Account Sign Out */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onClose();
                    logout();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 hover:bg-zinc-100 text-zinc-700 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out of Communication Mastery</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
