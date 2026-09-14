import React from 'react';
import { useProgress } from '../../context/ProgressContext';
import { MASTER_ACHIEVEMENTS } from '../../data/achievements';
import { Award, X } from 'lucide-react';

export const AchievementToast: React.FC = () => {
  const { recentUnlockedAchievements, clearUnlockedAchievements } = useProgress();

  if (recentUnlockedAchievements.length === 0) return null;

  const unlockedId = recentUnlockedAchievements[0];
  const achievement = MASTER_ACHIEVEMENTS.find(a => a.id === unlockedId);
  if (!achievement) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-xl shadow-amber-900/10 transition-all animate-bounce">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-sm">
          <Award className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
            Achievement Unlocked!
          </p>
          <h4 className="text-sm font-bold text-stone-900">{achievement.title}</h4>
          <p className="text-xs text-stone-600 mt-0.5">{achievement.description}</p>
        </div>
        <button
          onClick={clearUnlockedAchievements}
          className="text-stone-400 hover:text-stone-700"
          aria-label="Dismiss Achievement Notification"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
