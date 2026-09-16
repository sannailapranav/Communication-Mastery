import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  JourneyStage,
  JourneyStateSummary,
  JourneyLevelData,
  JourneyLevelStatus,
  UserJourneyLevelRecord,
  JourneyEvaluationResult,
  DynamicAIExercise
} from '../types';
import {
  api,
  getLocalProgressSnapshot,
  saveLocalProgressSnapshot,
  getLocalGuestProgress,
  recordLocalGuestCompletion
} from '../services/api';
import { JOURNEY_STAGES, JOURNEY_LEVELS, getStageForLevel } from '../data/journeyCurriculum';
import { useAuth } from './AuthContext';
import { useProgress } from './ProgressContext';

export interface LevelLoadError {
  isLocked: boolean;
  message: string;
  requiredLevel: number;
  currentUnlockedLevel?: number;
}

interface JourneyContextType {
  journeyState: JourneyStateSummary | null;
  stages: JourneyStage[];
  isLoading: boolean;
  activeLevelData: JourneyLevelData | null;
  activeUserRecord: UserJourneyLevelRecord | null;
  activeStage: JourneyStage | null;
  levelLoadError: LevelLoadError | null;
  loadJourneyState: () => Promise<void>;
  mergeProgressWithRemote: () => Promise<JourneyStateSummary | null>;
  loadLevel: (levelNumber: number) => Promise<boolean>;
  startLevel: (levelNumber: number) => Promise<void>;
  evaluateReflections: (
    levelNumber: number,
    answers: Record<number, string>
  ) => Promise<JourneyEvaluationResult>;
  completeLevel: (
    levelNumber: number,
    data?: number | {
      answers?: Record<number, string>;
      evaluation?: JourneyEvaluationResult;
      score?: number;
    }
  ) => Promise<{ nextLevelNumber: number | null }>;
  generateAIExercise: (
    levelNumber: number,
    payload?: {
      exerciseIndex?: number;
      previousPrompts?: string[];
      frameworkName?: string;
      frameworkFormula?: string;
      learningObjective?: string;
    }
  ) => Promise<DynamicAIExercise>;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

function buildGuestJourneyState(): JourneyStateSummary {
  const guest = getLocalGuestProgress() || { completedLevels: [], levels: {}, currentLevel: 1 };
  const levels: Record<number, UserJourneyLevelRecord> = {};
  for (let i = 1; i <= 75; i++) {
    const isCompleted = guest.completedLevels.includes(i);
    const custom = guest.levels[i];
    let status: JourneyLevelStatus = 'LOCKED';
    if (isCompleted) {
      status = 'COMPLETED';
    } else if (i === (guest.currentLevel || 1) || (i === 1 && guest.completedLevels.length === 0)) {
      status = custom?.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'AVAILABLE';
    }
    levels[i] = {
      levelNumber: i,
      status,
      score: isCompleted ? (custom?.score || 85) : undefined,
      currentStep: custom?.currentStep || (isCompleted ? 7 : 1),
      completedAt: custom?.completedAt,
      answers: custom?.answers
    };
  }
  const stages = JOURNEY_STAGES.map(s => {
    let completed = 0;
    const [start, end] = s.levelRange;
    for (let l = start; l <= end; l++) {
      if (guest.completedLevels.includes(l)) completed++;
    }
    const total = end - start + 1;
    return {
      stageNumber: s.stageNumber,
      title: s.title,
      subtitle: s.subtitle,
      levelRange: s.levelRange,
      completedLevels: completed,
      totalLevels: total,
      isUnlocked: s.stageNumber === 1 || (levels[start]?.status !== 'LOCKED'),
      isCompleted: completed >= total
    };
  });
  return {
    currentLevel: guest.currentLevel || (guest.completedLevels.length + 1),
    completedCount: guest.completedLevels.length,
    totalCompletedLevels: guest.completedLevels.length,
    totalLevels: 75,
    levels,
    stages
  };
}

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { refreshProgress } = useProgress();

  // Instant hydration from local snapshot or guest progress to avoid blank screen
  const [journeyState, setJourneyState] = useState<JourneyStateSummary | null>(() => {
    return getLocalProgressSnapshot() || (user?.isGuest ? buildGuestJourneyState() : null);
  });
  const [stages, setStages] = useState<JourneyStage[]>(JOURNEY_STAGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeLevelData, setActiveLevelData] = useState<JourneyLevelData | null>(null);
  const [activeUserRecord, setActiveUserRecord] = useState<UserJourneyLevelRecord | null>(null);
  const [activeStage, setActiveStage] = useState<JourneyStage | null>(null);
  const [levelLoadError, setLevelLoadError] = useState<LevelLoadError | null>(null);

  // Listen for cross-window / OAuth / login state sync events
  useEffect(() => {
    const handleStateSynced = (e: any) => {
      if (e?.detail) {
        console.log('[JourneyContext] Received journey:state-synced event with', Object.keys(e.detail.levels || {}).length, 'levels');
        setJourneyState(e.detail);
        saveLocalProgressSnapshot(e.detail);
      }
    };
    window.addEventListener('journey:state-synced', handleStateSynced);
    return () => {
      window.removeEventListener('journey:state-synced', handleStateSynced);
    };
  }, []);

  const loadJourneyState = useCallback(async () => {
    if (user?.isGuest) {
      setJourneyState(buildGuestJourneyState());
      return;
    }
    if (!user || isAuthLoading) {
      if (!user) {
        setJourneyState(null);
      }
      return;
    }
    try {
      setIsLoading(true);
      const [stagesData, stateData] = await Promise.all([
        api.getJourneyStages(),
        api.getJourneyState()
      ]);
      setStages(stagesData);
      setJourneyState(stateData);
      saveLocalProgressSnapshot(stateData);
    } catch (err: any) {
      if (err?.status === 401 || err?.message?.includes('User not found') || err?.message?.includes('session expired')) {
        setJourneyState(null);
        return;
      }
      console.warn('Could not load journey state:', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthLoading]);

  const mergeProgressWithRemote = useCallback(async (): Promise<JourneyStateSummary | null> => {
    if (!user || user.isGuest) return null;
    try {
      const res = await api.mergeJourneyProgress();
      if (res.journeyState) {
        setJourneyState(res.journeyState);
        saveLocalProgressSnapshot(res.journeyState);
        return res.journeyState;
      }
    } catch (err) {
      console.warn('[JourneyContext] Error merging progress with remote:', err);
    }
    return null;
  }, [user]);

  useEffect(() => {
    loadJourneyState();
  }, [loadJourneyState]);

  const loadLevel = useCallback(async (levelNumber: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setLevelLoadError(null);

      // In guest mode, load directly from curriculum
      if (user?.isGuest) {
        const localLevel = JOURNEY_LEVELS[levelNumber];
        const localStage = getStageForLevel(levelNumber);
        const guestState = journeyState || buildGuestJourneyState();
        const record = guestState.levels[levelNumber] || {
          levelNumber,
          status: levelNumber === 1 ? 'AVAILABLE' : 'LOCKED'
        };
        const isAccessible = record.status === 'AVAILABLE' || record.status === 'IN_PROGRESS' || record.status === 'COMPLETED';

        if (!isAccessible && levelNumber > 1) {
          setLevelLoadError({
            isLocked: true,
            message: `Level ${levelNumber} is locked. Complete previous levels first.`,
            requiredLevel: levelNumber - 1,
            currentUnlockedLevel: guestState.currentLevel || 1
          });
          return false;
        }

        setActiveLevelData(localLevel || null);
        setActiveStage(localStage || null);
        setActiveUserRecord(record);
        return true;
      }

      const res = await api.getJourneyLevel(levelNumber);
      setActiveLevelData(res.levelData);
      setActiveStage(res.stage);
      setActiveUserRecord(res.userRecord);
      return res.isAccessible;
    } catch (err: any) {
      const isLocked = err?.status === 403 || err?.data?.isLocked || (err?.message && err.message.toLowerCase().includes('locked'));
      const requiredLevel = err?.data?.requiredLevel || (levelNumber > 1 ? levelNumber - 1 : 1);
      if (isLocked) {
        console.warn(`Level ${levelNumber} is locked. Required prerequisite: Level ${requiredLevel}.`);
        setLevelLoadError({
          isLocked: true,
          message: err?.data?.error || err?.message || `Level ${levelNumber} is locked. Complete previous levels first.`,
          requiredLevel,
          currentUnlockedLevel: err?.data?.currentUnlockedLevel
        });
        setActiveLevelData(null);
        setActiveUserRecord(null);
        return false;
      }

      // Progression authorization guard: check if this level is actually unlocked
      const knownStatus = journeyState?.levels[levelNumber]?.status;
      const isActuallyUnlocked = levelNumber === 1 || knownStatus === 'COMPLETED' || knownStatus === 'IN_PROGRESS' || knownStatus === 'AVAILABLE';

      if (!isActuallyUnlocked) {
        setLevelLoadError({
          isLocked: true,
          message: err?.data?.error || err?.message || `Level ${levelNumber} is locked. Complete prerequisite levels first.`,
          requiredLevel,
          currentUnlockedLevel: journeyState?.currentLevel || 1
        });
        setActiveLevelData(null);
        setActiveUserRecord(null);
        return false;
      }

      // If it's a network glitch or server restart, only fall back for legitimately accessible levels
      const localLevel = JOURNEY_LEVELS[levelNumber];
      const localStage = getStageForLevel(levelNumber);
      if (localLevel && localStage) {
        console.warn(`Network lookup deferred for Level ${levelNumber}. Using local curriculum data.`);
        setActiveLevelData(localLevel);
        setActiveStage(localStage);
        setActiveUserRecord({
          levelNumber,
          status: knownStatus || (levelNumber === 1 ? 'AVAILABLE' : 'LOCKED')
        });
        setLevelLoadError(null);
        return true;
      }

      console.warn(`Failed to load level ${levelNumber}:`, err?.message || err);
      setLevelLoadError({
        isLocked: true,
        message: err?.data?.error || err?.message || `Level ${levelNumber} is locked. Complete previous levels first.`,
        requiredLevel,
        currentUnlockedLevel: journeyState?.currentLevel || 1
      });
      setActiveLevelData(null);
      setActiveUserRecord(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [journeyState, user]);

  const startLevel = useCallback(async (levelNumber: number): Promise<void> => {
    if (user?.isGuest) {
      setActiveUserRecord(prev => ({
        ...(prev || { levelNumber }),
        status: 'IN_PROGRESS'
      }));
      return;
    }
    try {
      const res = await api.startJourneyLevel(levelNumber);
      if (res.record) {
        setActiveUserRecord(res.record);
        setJourneyState(prev => {
          if (!prev) return prev;
          const next = {
            ...prev,
            levels: {
              ...prev.levels,
              [levelNumber]: res.record
            }
          };
          saveLocalProgressSnapshot(next);
          return next;
        });
      }
    } catch (err) {
      console.warn(`Could not sync start of level ${levelNumber}:`, err);
      setActiveUserRecord(prev => prev || {
        levelNumber,
        status: 'IN_PROGRESS'
      });
    }
  }, [user]);

  const evaluateReflections = useCallback(
    async (
      levelNumber: number,
      answers: Record<number, string>
    ): Promise<JourneyEvaluationResult> => {
      const res = await api.evaluateJourneyReflections(levelNumber, answers);
      setActiveUserRecord(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          answers,
          evaluation: res.evaluation,
          score: res.score
        };
      });
      return res.evaluation;
    },
    []
  );

  const completeLevel = useCallback(
    async (
      levelNumber: number,
      data?: number | {
        answers?: Record<number, string>;
        evaluation?: JourneyEvaluationResult;
        score?: number;
      }
    ): Promise<{ nextLevelNumber: number | null }> => {
      const payload = typeof data === 'number' ? { score: data } : (data || {});

      // If guest user, persist in local storage immediately
      if (user?.isGuest) {
        recordLocalGuestCompletion(levelNumber, payload);
        const nextState = buildGuestJourneyState();
        setJourneyState(nextState);
        saveLocalProgressSnapshot(nextState);
        const nextLevelNumber = levelNumber < 75 ? levelNumber + 1 : null;
        return { nextLevelNumber };
      }

      // Authenticated user: persistent saving directly into database & Supabase
      const res = await api.completeJourneyLevel(levelNumber, payload);
      if (res.journeyState) {
        setJourneyState(res.journeyState);
        saveLocalProgressSnapshot(res.journeyState);
      }
      await refreshProgress();
      return { nextLevelNumber: res.unlockedNextLevel };
    },
    [user, refreshProgress]
  );

  const generateAIExercise = useCallback(
    async (
      levelNumber: number,
      payload?: {
        exerciseIndex?: number;
        previousPrompts?: string[];
        frameworkName?: string;
        frameworkFormula?: string;
        learningObjective?: string;
      }
    ): Promise<DynamicAIExercise> => {
      return await api.generateDynamicAIExercise(levelNumber, payload);
    },
    []
  );

  return (
    <JourneyContext.Provider
      value={{
        journeyState,
        stages,
        isLoading,
        activeLevelData,
        activeUserRecord,
        activeStage,
        levelLoadError,
        loadJourneyState,
        mergeProgressWithRemote,
        loadLevel,
        startLevel,
        evaluateReflections,
        completeLevel,
        generateAIExercise
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
