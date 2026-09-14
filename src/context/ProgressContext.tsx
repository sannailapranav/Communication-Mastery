import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserStats, AIEvaluationResult, PracticeAttempt } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface ProgressContextType {
  stats: UserStats | null;
  completedLessonIds: Set<string>;
  isLoading: boolean;
  isLessonCompleted: (lessonId: string) => boolean;
  completeLesson: (lessonId: string, moduleId: string) => Promise<string[]>;
  submitPracticeAttempt: (payload: {
    exerciseId: string;
    exerciseTitle: string;
    exerciseType: string;
    responseText: string;
    inputMode: 'TEXT' | 'AUDIO_TRANSCRIPT';
    audioDurationSeconds?: number;
    selectedChoiceId?: string;
    category?: string;
    frameworkName?: string;
    prompt?: string;
  }) => Promise<{ attempt: PracticeAttempt; evaluation: AIEvaluationResult; newAchievements: string[] }>;
  refreshProgress: () => Promise<void>;
  recentUnlockedAchievements: string[];
  clearUnlockedAchievements: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [completedLessonIds, setCompletedLessonIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recentUnlockedAchievements, setRecentUnlockedAchievements] = useState<string[]>([]);

  const refreshProgress = useCallback(async () => {
    if (!user || isAuthLoading) {
      setStats(null);
      setCompletedLessonIds(new Set());
      return;
    }
    try {
      setIsLoading(true);
      const data = await api.getProgressSummary();
      setStats(data);
      setCompletedLessonIds(new Set(data.completedLessonIds || []));
    } catch (err: any) {
      if (err?.status === 401 || err?.message?.includes('User not found') || err?.message?.includes('session expired')) {
        setStats(null);
        setCompletedLessonIds(new Set());
        return;
      }
      console.warn('Could not load progress summary:', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);

  useEffect(() => {
    refreshProgress();
  }, [refreshProgress]);

  const isLessonCompleted = useCallback(
    (lessonId: string) => {
      return completedLessonIds.has(lessonId);
    },
    [completedLessonIds]
  );

  const completeLesson = async (lessonId: string, moduleId: string): Promise<string[]> => {
    try {
      const res = await api.completeLesson(lessonId, moduleId);
      setCompletedLessonIds(prev => new Set(prev).add(lessonId));
      if (res.newAchievements && res.newAchievements.length > 0) {
        setRecentUnlockedAchievements(prev => [...prev, ...res.newAchievements]);
      }
      await refreshProgress();
      return res.newAchievements || [];
    } catch (err) {
      console.error('Error completing lesson:', err);
      throw err;
    }
  };

  const submitPracticeAttempt = async (payload: {
    exerciseId: string;
    exerciseTitle: string;
    exerciseType: string;
    responseText: string;
    inputMode: 'TEXT' | 'AUDIO_TRANSCRIPT';
    audioDurationSeconds?: number;
    selectedChoiceId?: string;
    category?: string;
    frameworkName?: string;
    prompt?: string;
  }) => {
    try {
      const res = await api.submitPractice(payload);
      if (res.newAchievements && res.newAchievements.length > 0) {
        setRecentUnlockedAchievements(prev => [...prev, ...res.newAchievements]);
      }
      await refreshProgress();
      return res;
    } catch (err) {
      console.error('Error submitting practice attempt:', err);
      throw err;
    }
  };

  const clearUnlockedAchievements = () => setRecentUnlockedAchievements([]);

  return (
    <ProgressContext.Provider
      value={{
        stats,
        completedLessonIds,
        isLoading,
        isLessonCompleted,
        completeLesson,
        submitPracticeAttempt,
        refreshProgress,
        recentUnlockedAchievements,
        clearUnlockedAchievements
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
