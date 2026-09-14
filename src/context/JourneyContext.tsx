import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  JourneyStage,
  JourneyStateSummary,
  JourneyLevelData,
  UserJourneyLevelRecord,
  JourneyEvaluationResult,
  DynamicAIExercise
} from '../types';
import { api } from '../services/api';
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

export function JourneyProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { refreshProgress } = useProgress();

  const [journeyState, setJourneyState] = useState<JourneyStateSummary | null>(null);
  const [stages, setStages] = useState<JourneyStage[]>(JOURNEY_STAGES);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeLevelData, setActiveLevelData] = useState<JourneyLevelData | null>(null);
  const [activeUserRecord, setActiveUserRecord] = useState<UserJourneyLevelRecord | null>(null);
  const [activeStage, setActiveStage] = useState<JourneyStage | null>(null);
  const [levelLoadError, setLevelLoadError] = useState<LevelLoadError | null>(null);

  const loadJourneyState = useCallback(async () => {
    if (!user || isAuthLoading) {
      setJourneyState(null);
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

  useEffect(() => {
    loadJourneyState();
  }, [loadJourneyState]);

  const loadLevel = useCallback(async (levelNumber: number): Promise<boolean> => {
    try {
      setIsLoading(true);
      setLevelLoadError(null);
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
  }, [journeyState]);

  const startLevel = useCallback(async (levelNumber: number): Promise<void> => {
    try {
      const res = await api.startJourneyLevel(levelNumber);
      if (res.record) {
        setActiveUserRecord(res.record);
        setJourneyState(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            levels: {
              ...prev.levels,
              [levelNumber]: res.record
            }
          };
        });
      }
    } catch (err) {
      console.warn(`Could not sync start of level ${levelNumber}:`, err);
      setActiveUserRecord(prev => prev || {
        levelNumber,
        status: 'IN_PROGRESS'
      });
    }
  }, []);

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
      const res = await api.completeJourneyLevel(levelNumber, payload);
      if (res.journeyState) {
        setJourneyState(res.journeyState);
      }
      await refreshProgress();
      return { nextLevelNumber: res.unlockedNextLevel };
    },
    [refreshProgress]
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
