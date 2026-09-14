import React from 'react';
import {
  Compass,
  BookOpen,
  Layers,
  Flame,
  MessageSquare,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJourney } from '../../context/JourneyContext';
import { sound } from '../../services/soundEngine';

interface GameHUDProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenProfile: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  currentView,
  onNavigate,
  onOpenProfile
}) => {
  const { user } = useAuth();
  const { journeyState } = useJourney();

  const completedCount = journeyState?.completedCount ?? journeyState?.totalCompletedLevels ?? 0;
  const totalLevels = 75;
  const hudProgressPercent = Math.min(100, Math.round((completedCount / totalLevels) * 100));

  const navItems = [
    { id: 'journey', label: 'Map', icon: Compass },
    { id: 'learn', label: 'Curriculum', icon: BookOpen },
    { id: 'frameworks', label: 'Frameworks', icon: Layers },
    { id: 'practice', label: 'Practice', icon: Flame },
    { id: 'normal-ai', label: 'Sākshi', icon: MessageSquare }
  ];

  const profileInitial = (
    user?.displayName?.trim()?.slice(0, 1) ||
    user?.email?.trim()?.slice(0, 1) ||
    'P'
  ).toUpperCase();

  return (
    <>
      {/* Minimal Top Header: 'Communication Mastery', Progress Counter, User Profile Icon [P] */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 backdrop-blur-sm shadow-2xs">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Left: Brand & Progress Counter */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onNavigate('journey');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-display font-bold text-xs flex items-center justify-center tracking-tight shadow-sm">
                CM
              </div>
              <div>
                <div className="text-sm font-display font-bold text-zinc-900 leading-none group-hover:text-zinc-700 transition-colors">
                  Communication Mastery
                </div>
                <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>
                    <strong>{completedCount}</strong> / {totalLevels} Mastered
                  </span>
                  <div className="hidden sm:inline-flex items-center gap-1.5 ml-1">
                    <div className="w-12 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(completedCount > 0 ? 3 : 0, hudProgressPercent)}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-zinc-400">
                      {hudProgressPercent}%
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Right: User Profile Icon [P] */}
          <div className="flex items-center">
            <button
              type="button"
              id="user-profile-btn"
              onClick={() => {
                sound.playClick();
                onOpenProfile();
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-mono font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer"
              title="Learner Profile & Stats"
              aria-label="User Profile"
            >
              <span>{profileInitial}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Fixed Bottom Mobile App Navigation Bar (Map, Curriculum, Frameworks, Practice, Sākshi) */}
      <nav
        aria-label="Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-zinc-200 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] py-1.5 sm:py-2"
      >
        <div className="mx-auto max-w-lg md:max-w-xl flex items-center justify-around px-2 sm:px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                id={`bottom-nav-${item.id}`}
                onClick={() => {
                  sound.playClick();
                  onNavigate(item.id);
                }}
                className={`flex flex-col items-center justify-center min-w-[56px] py-1 px-2 rounded-xl transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-zinc-950 font-bold bg-zinc-100/90 shadow-2xs'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 font-medium'
                }`}
              >
                <Icon
                  className={`w-5 h-5 mb-0.5 transition-transform ${
                    isActive ? 'scale-110 text-zinc-950 stroke-[2.25]' : 'text-zinc-500 stroke-[1.75]'
                  }`}
                />
                <span className="text-[10.5px] leading-tight tracking-tight whitespace-nowrap">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
