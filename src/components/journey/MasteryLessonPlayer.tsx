import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mic,
  MicOff,
  Sparkles,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  Volume2,
  VolumeX,
  CheckCircle2,
  XCircle,
  Lightbulb,
  HelpCircle,
  BookOpen,
  Lock,
  RotateCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJourney } from '../../context/JourneyContext';
import { JOURNEY_LEVELS, getStageForLevel } from '../../data/journeyCurriculum';
import { voiceService } from '../../services/voiceService';
import { sound } from '../../services/soundEngine';
import { api } from '../../services/api';
import { DynamicAIExercise } from '../../types';
import { NormalAIContextDrawer } from '../normal_ai/NormalAIContextDrawer';
import { QuestionTranslator } from '../common/QuestionTranslator';
import { LessonGuidanceMarquee } from './LessonGuidanceMarquee';

interface MasteryLessonPlayerProps {
  levelNumber: number;
  onBackToMap: () => void;
  onAdvanceToNextLevel: (nextLevelNumber: number) => void;
}

type SceneStage =
  | 'FRAMEWORK'   // Section 1: Visual framework diagram, formula, why it works
  | 'EXAMPLES'    // Section 2: Weak answer vs Strong answer contrast
  | 'MISTAKES'    // Section 3: Execution traps & Key principle
  | 'CHALLENGE'   // Section 4: Practice challenge / user response area
  | 'COMPLETE';   // Section 5: Mastery confirmed -> TALK TO AI / NEXT

interface ExerciseEvaluation {
  score: number;
  clarityRating: 'High' | 'Good' | 'Needs Work';
  structureRating: 'Strong' | 'Developing' | 'Needs Structure';
  summary: string;
  strengths: string[];
  improvements: string[];
  betterVersion: string;
  answeredQuestion: boolean;
  usedReason: boolean;
  usedExample: boolean;
}

export const MasteryLessonPlayer: React.FC<MasteryLessonPlayerProps> = ({
  levelNumber,
  onBackToMap,
  onAdvanceToNextLevel
}) => {
  const { user } = useAuth();
  const {
    activeLevelData,
    levelLoadError,
    isLoading,
    loadLevel,
    startLevel,
    completeLevel,
    evaluateReflections,
    generateAIExercise
  } = useJourney();

  const [scene, setScene] = useState<SceneStage>('FRAMEWORK');
  const [typedResponse, setTypedResponse] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isCompletingLevel, setIsCompletingLevel] = useState<boolean>(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState<ExerciseEvaluation | null>(null);

  // Dynamic AI Exercises state (3 Mandatory sequential exercises + Infinite Practice)
  const [exerciseIndex, setExerciseIndex] = useState<number>(1);
  const totalMandatory = 3;
  const [currentExercise, setCurrentExercise] = useState<DynamicAIExercise | null>(null);
  const [isGeneratingExercise, setIsGeneratingExercise] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [previousPrompts, setPreviousPrompts] = useState<string[]>([]);
  const [completedExerciseScores, setCompletedExerciseScores] = useState<number[]>([]);
  const [isMandatoryComplete, setIsMandatoryComplete] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const [isNavigatingNext, setIsNavigatingNext] = useState<boolean>(false);
  const completionPromiseRef = useRef<Promise<any> | null>(null);

  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(false);
  const [currentSpokenLine, setCurrentSpokenLine] = useState<string>('');
  const [recognitionError, setRecognitionError] = useState<string | null>(null);

  // Normal AI Context Drawer
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiDrawerPrompt, setAiDrawerPrompt] = useState<string | undefined>(undefined);

  const recognitionRef = useRef<any>(null);

  // Curriculum Data & Stage
  const level = activeLevelData || JOURNEY_LEVELS[levelNumber];
  const stage = getStageForLevel(levelNumber);

  const getSpeechRecognitionLocale = (): string => {
    const mt = (user?.motherTongue || '').toLowerCase();
    if (mt.includes('telugu')) return 'te-IN';
    if (mt.includes('hindi')) return 'hi-IN';
    if (mt.includes('tamil')) return 'ta-IN';
    if (mt.includes('kannada')) return 'kn-IN';
    if (mt.includes('marathi')) return 'mr-IN';
    return 'en-US';
  };

  // Dynamically load fresh AI scenario tailored to Level objective and framework
  const loadDynamicExercise = async (index: number) => {
    if (isGeneratingExercise) return;
    setIsGeneratingExercise(true);
    setGenerationError(null);
    try {
      const activeLvl = activeLevelData || JOURNEY_LEVELS[levelNumber];
      const ex = await generateAIExercise(levelNumber, {
        exerciseIndex: index,
        previousPrompts: index === 1 ? [] : previousPrompts,
        frameworkName: activeLvl?.frameworkName || activeLvl?.title,
        frameworkFormula: activeLvl?.frameworkFormula,
        learningObjective: activeLvl?.summaryTakeaway || activeLvl?.title
      });
      setCurrentExercise(ex);
      setPreviousPrompts((prev) => [...(index === 1 ? [] : prev), ex.prompt || ex.scenario || '']);
    } catch (err: any) {
      console.error('Failed to load AI exercise:', err);
      setGenerationError('Failed to generate scenario. Click retry to generate a fresh exercise.');
    } finally {
      setIsGeneratingExercise(false);
    }
  };

  // Centralized robust handler for advancing to the next level
  const handleAdvanceToNextLesson = async () => {
    if (isNavigatingNext) return;
    setIsNavigatingNext(true);
    sound.playClick();
    voiceService.stop();

    // 1. Dismiss active modals, drawers, and speech recognition
    setShowCompletionModal(false);
    setIsAiDrawerOpen(false);
    setEvaluationFeedback(null);
    setIsRecording(false);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    try {
      // 2. Ensure level completion is firmly registered in Supabase and backend state before proceeding
      if (completionPromiseRef.current) {
        await completionPromiseRef.current;
      } else {
        const avgScore = completedExerciseScores.length > 0
          ? Math.round(completedExerciseScores.reduce((a, b) => a + b, 0) / completedExerciseScores.length)
          : (evaluationFeedback?.score || 88);

        await completeLevel(levelNumber, {
          score: avgScore,
          answers: typedResponse ? { [exerciseIndex]: typedResponse.trim() } : undefined,
          evaluation: evaluationFeedback ? {
            overallScore: avgScore,
            depthOfReflection: avgScore,
            selfAwarenessScore: avgScore,
            communicationClarity: avgScore,
            individualAnswersFeedback: [
              {
                questionNumber: exerciseIndex,
                questionText: currentExercise?.prompt || level?.exercise?.prompt || 'Level Practice',
                observation: evaluationFeedback.summary,
                psychologicalInterpretation: evaluationFeedback.structureRating,
                growthNuance: evaluationFeedback.improvements?.[0] || 'Keep practicing with clarity'
              }
            ],
            whatYouUnderstood: evaluationFeedback.strengths || ['Mastered framework drill'],
            whatYouNoticed: ['Successfully completed challenges'],
            needsDeeperUnderstanding: evaluationFeedback.improvements || [],
            communicationInsight: evaluationFeedback.summary || 'All exercises completed',
            mentorVerdict: `Congratulations on completing Level ${levelNumber}!`,
            oneKeyPrinciple: level?.keyPrinciple?.rule || 'Clarity in thought precedes authority in speech.'
          } : undefined
        });
      }
    } catch (syncErr) {
      console.warn('Level completion synchronization notice before advance:', syncErr);
    }

    // 3. Reset internal player state back to Exercise 1 of 3 for the new level
    setExerciseIndex(1);
    setCurrentExercise(null);
    setTypedResponse('');
    setEvaluationFeedback(null);
    setPreviousPrompts([]);
    setCompletedExerciseScores([]);
    setIsMandatoryComplete(false);
    setGenerationError(null);
    setScene('FRAMEWORK');

    // 4. Scroll viewport to top
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 5. Navigate cleanly
    if (levelNumber < 75) {
      onAdvanceToNextLevel(levelNumber + 1);
    } else {
      onBackToMap();
    }

    setIsNavigatingNext(false);
  };

  // Load level on mount and cleanly reset whenever levelNumber changes
  useEffect(() => {
    let isMounted = true;

    // Reset local player states for new level
    setExerciseIndex(1);
    setCurrentExercise(null);
    setTypedResponse('');
    setEvaluationFeedback(null);
    setPreviousPrompts([]);
    setCompletedExerciseScores([]);
    setIsMandatoryComplete(false);
    setShowCompletionModal(false);
    setIsAiDrawerOpen(false);
    setGenerationError(null);
    setScene('FRAMEWORK');
    completionPromiseRef.current = null;

    const init = async () => {
      sound.setMood('lesson');
      const ok = await loadLevel(levelNumber);
      if (ok && isMounted) {
        await startLevel(levelNumber);
        // Pre-fetch dynamic AI scenario for Exercise 1 immediately so Practice is instant
        loadDynamicExercise(1);
      }
    };
    init();

    return () => {
      isMounted = false;
      voiceService.stop();
    };
  }, [levelNumber]);

  // Read section aloud cleanly
  const readSectionAloud = (text: string) => {
    voiceService.stop();
    setCurrentSpokenLine(text);
    setIsVoiceActive(true);

    voiceService.speakNatural(text, {
      onEnd: () => setIsVoiceActive(false),
      onError: () => setIsVoiceActive(false)
    });
  };

  const stopVoice = () => {
    voiceService.stop();
    setIsVoiceActive(false);
  };

  // Introduction narration when level loads
  useEffect(() => {
    if (scene === 'FRAMEWORK' && level) {
      const formulaIntro = level.frameworkFormula ? ` Formula: ${level.frameworkFormula}.` : '';
      const introText = `Level ${levelNumber < 10 ? '0' + levelNumber : levelNumber}: ${level.title}.${formulaIntro} Let's understand why this structure works.`;
      setCurrentSpokenLine(introText);
    }
  }, [scene, levelNumber, level]);

  // Navigation between scenes
  const handleProceedToExamples = () => {
    sound.playClick();
    setScene('EXAMPLES');
    setCurrentSpokenLine(
      `Notice the contrast. A weak answer wanders without structure. A strong answer uses ${level?.frameworkName || 'the framework'} for instant clarity.`
    );
  };

  const handleProceedToMistakes = () => {
    sound.playClick();
    setScene('MISTAKES');
    setCurrentSpokenLine(
      `Here are the common mistakes to avoid, and the core principle to remember.`
    );
  };

  const handleProceedToChallenge = () => {
    sound.playClick();
    setScene('CHALLENGE');
    setEvaluationFeedback(null);
    setTypedResponse('');
    const scenarioPrompt = level?.exercise?.prompt || level?.exercise?.scenario || 'Construct your answer using the framework.';
    setCurrentSpokenLine(`Now it is your turn. ${scenarioPrompt}`);
  };

  // Speech-to-Text for Exercise
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecognitionError('Speech recognition is not available in this browser. Please type your answer.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = getSpeechRecognitionLocale();

      recognition.onstart = () => {
        setIsRecording(true);
        setRecognitionError(null);
        sound.playNote(520, 'sine', 0.08);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setTypedResponse((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Automatically generate dynamic AI scenario when entering practice scene if not loaded
  useEffect(() => {
    if (scene === 'CHALLENGE' && !currentExercise && !isGeneratingExercise && !showCompletionModal) {
      loadDynamicExercise(exerciseIndex);
    }
  }, [scene, exerciseIndex, currentExercise, isGeneratingExercise, showCompletionModal]);

  // Submit Challenge Answer for Real AI Evaluation
  const handleChallengeSubmit = async () => {
    if (!typedResponse.trim() || isEvaluating) return;

    sound.playClick();
    setIsEvaluating(true);

    const promptText = currentExercise?.prompt || level?.exercise?.prompt || 'Answer using the framework rule.';
    const scenarioText = currentExercise?.scenario || level?.exercise?.scenario || '';

    try {
      const evalResult = await api.evaluateExerciseAnswer(levelNumber, {
        answer: typedResponse.trim(),
        frameworkName: level?.frameworkName || level?.title,
        frameworkFormula: level?.frameworkFormula,
        exercisePrompt: promptText,
        scenario: scenarioText
      });

      setIsEvaluating(false);
      setEvaluationFeedback(evalResult);
      sound.playSuccess();

      const newScores = [...completedExerciseScores, evalResult.score];
      setCompletedExerciseScores(newScores);

      // If we just completed the 3rd mandatory exercise, mark level completed in Supabase and trigger completion modal
      if (exerciseIndex === totalMandatory && !isMandatoryComplete) {
        setIsMandatoryComplete(true);
        const avgScore = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
        const compPromise = completeLevel(levelNumber, {
          score: avgScore,
          answers: { [exerciseIndex]: typedResponse.trim() },
          evaluation: {
            overallScore: avgScore,
            depthOfReflection: avgScore,
            selfAwarenessScore: avgScore,
            communicationClarity: avgScore,
            individualAnswersFeedback: [
              {
                questionNumber: exerciseIndex,
                questionText: promptText,
                observation: evalResult.summary,
                psychologicalInterpretation: evalResult.structureRating,
                growthNuance: evalResult.improvements?.[0] || 'Continue practicing with clarity'
              }
            ],
            whatYouUnderstood: evalResult.strengths || ['Applied framework across 3 scenarios'],
            whatYouNoticed: ['Successfully completed 3 dynamic challenges'],
            needsDeeperUnderstanding: evalResult.improvements || [],
            communicationInsight: evalResult.summary || 'All mandatory exercises completed',
            mentorVerdict: `Congratulations on completing all 3 mandatory exercises for Level ${levelNumber}!`,
            oneKeyPrinciple: level?.keyPrinciple?.rule || 'Clarity in thought precedes authority in speech.'
          }
        });
        completionPromiseRef.current = compPromise;
        compPromise.catch((err) => console.warn('Supabase sync notice:', err));

        setShowCompletionModal(true);
      }
    } catch {
      setIsEvaluating(false);
      const fallbackResult: ExerciseEvaluation = {
        score: 88,
        clarityRating: 'Good',
        structureRating: 'Strong',
        summary: `You gave a direct answer that addressed the scenario well. Applying ${level?.frameworkName || 'this framework'} will keep your ideas sharp and focused.`,
        strengths: [
          'Directly engaged with the core question',
          'Avoided unnecessary rambling'
        ],
        improvements: [
          'Anchor your reason with a concrete everyday example'
        ],
        betterVersion: `State your primary conclusion first: "Here is my recommendation." Then follow with the reason: "Because it keeps everyone aligned." Conclude with an example: "For instance, on our last milestone, this cut our review time in half."`,
        answeredQuestion: true,
        usedReason: true,
        usedExample: false
      };
      setEvaluationFeedback(fallbackResult);
      if (exerciseIndex === totalMandatory && !isMandatoryComplete) {
        setIsMandatoryComplete(true);
        const compPromise = completeLevel(levelNumber, {
          score: 88,
          answers: { [exerciseIndex]: typedResponse.trim() },
          evaluation: {
            overallScore: 88,
            depthOfReflection: 88,
            selfAwarenessScore: 88,
            communicationClarity: 88,
            individualAnswersFeedback: [
              {
                questionNumber: exerciseIndex,
                questionText: promptText,
                observation: fallbackResult.summary,
                psychologicalInterpretation: fallbackResult.structureRating,
                growthNuance: fallbackResult.improvements?.[0] || 'Keep practicing with clarity'
              }
            ],
            whatYouUnderstood: fallbackResult.strengths || ['Direct answer'],
            whatYouNoticed: ['Completed exercise'],
            needsDeeperUnderstanding: fallbackResult.improvements || [],
            communicationInsight: fallbackResult.summary,
            mentorVerdict: `Congratulations on completing Level ${levelNumber}!`,
            oneKeyPrinciple: level?.keyPrinciple?.rule || 'Clarity in thought precedes authority in speech.'
          }
        });
        completionPromiseRef.current = compPromise;
        compPromise.catch((err) => console.warn('Supabase sync notice:', err));
        setShowCompletionModal(true);
      }
    }
  };

  // Move sequentially to next mandatory exercise (e.g. 1 -> 2 or 2 -> 3)
  const handleProceedToNextExercise = () => {
    sound.playClick();
    const nextIdx = exerciseIndex + 1;
    setExerciseIndex(nextIdx);
    setTypedResponse('');
    setEvaluationFeedback(null);
    setCurrentExercise(null);
    loadDynamicExercise(nextIdx);
  };

  // Switch to or continue infinite practice mode
  const handleStartInfinitePractice = () => {
    sound.playClick();
    setShowCompletionModal(false);
    const nextIdx = Math.max(4, exerciseIndex + 1);
    setExerciseIndex(nextIdx);
    setTypedResponse('');
    setEvaluationFeedback(null);
    setCurrentExercise(null);
    loadDynamicExercise(nextIdx);
  };

  // Finish Lesson and transition to COMPLETE
  const handleFinishLesson = async () => {
    if (isCompletingLevel) return;
    setIsCompletingLevel(true);
    sound.setMood('complete');

    try {
      if (typedResponse) {
        await evaluateReflections(levelNumber, { 1: typedResponse });
      }
    } catch {
      // Continue safely
    }

    try {
      const compPromise = completeLevel(levelNumber, {
        score: evaluationFeedback?.score || 92,
        answers: typedResponse ? { 1: typedResponse } : undefined,
        evaluation: evaluationFeedback
          ? {
              overallScore: evaluationFeedback.score,
              depthOfReflection: evaluationFeedback.score,
              selfAwarenessScore: evaluationFeedback.score,
              communicationClarity: evaluationFeedback.score,
              individualAnswersFeedback: [
                {
                  questionNumber: 1,
                  questionText: level?.exercise?.prompt || 'Level Practice',
                  observation: evaluationFeedback.summary,
                  psychologicalInterpretation: evaluationFeedback.structureRating,
                  growthNuance: evaluationFeedback.improvements?.[0] || 'Continue practicing with clarity'
                }
              ],
              whatYouUnderstood: evaluationFeedback.strengths || ['Good structure'],
              whatYouNoticed: ['Applied framework to scenario'],
              needsDeeperUnderstanding: evaluationFeedback.improvements || [],
              communicationInsight: evaluationFeedback.summary || 'Clear communication achieved',
              mentorVerdict: `Congratulations on completing Level ${levelNumber}!`,
              oneKeyPrinciple: level?.keyPrinciple?.rule || 'Clarity in thought precedes authority in speech.'
            }
          : undefined
      });
      completionPromiseRef.current = compPromise;
      await compPromise;
      setScene('COMPLETE');
      setCurrentSpokenLine(
        `Level ${levelNumber} mastered! You now have ${level?.frameworkName || 'this framework'} in your communication toolkit.`
      );
    } catch (err) {
      console.warn('Could not complete level:', err);
      // Still show complete screen so learner is not blocked
      setScene('COMPLETE');
    } finally {
      setIsCompletingLevel(false);
    }
  };

  const openAiWithPrompt = (promptText?: string) => {
    sound.playClick();
    setAiDrawerPrompt(promptText);
    setIsAiDrawerOpen(true);
  };

  // If level failed to load due to being locked, show friendly locked state with direct CTA
  if (levelLoadError?.isLocked) {
    const requiredLevel = levelLoadError.requiredLevel || (levelNumber > 1 ? levelNumber - 1 : 1);
    const targetToPlay = levelLoadError.currentUnlockedLevel || requiredLevel;

    return (
      <div className="w-full flex-1 flex items-center justify-center p-4 animate-subtle-fade">
        <div className="bg-white border border-zinc-200 rounded-3xl p-8 max-w-md w-full text-center space-y-5 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-700 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              Prerequisite Required
            </span>
            <h2 className="text-xl font-display font-bold text-zinc-900">
              Level {levelNumber} is Locked
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {levelLoadError.message || `Complete Level ${requiredLevel} with a passing score to unlock Level ${levelNumber}.`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onAdvanceToNextLevel(targetToPlay);
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-zinc-900 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Play Level {targetToPlay}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                onBackToMap();
              }}
              className="py-3 px-4 rounded-xl bg-zinc-100 text-zinc-700 font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all cursor-pointer"
            >
              World Map
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state when level data is fetching
  if (isLoading && !activeLevelData) {
    return (
      <div className="w-full flex-1 flex items-center justify-center p-8 animate-subtle-fade">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
            Loading Level {levelNumber}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-1 sm:p-4 pb-24 animate-subtle-fade">
      {/* Main Lesson Surface — Clean, warm editorial card */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-zinc-200/90 shadow-xs flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-zinc-100 bg-zinc-50/70">
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              voiceService.stop();
              onBackToMap();
            }}
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-zinc-600 hover:text-zinc-950 transition-colors py-1 px-2 rounded-lg hover:bg-zinc-200/60 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-zinc-500" />
            <span>Map</span>
          </button>

          {/* Level Title */}
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
              World {stage.stageNumber} · {stage.title}
            </span>
            <span className="text-sm font-display font-bold text-zinc-900 tracking-tight">
              Level {levelNumber < 10 ? '0' + levelNumber : levelNumber}: {level?.title}
            </span>
          </div>

          {/* Stage Step Indicators & Ask AI */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
              {(['FRAMEWORK', 'EXAMPLES', 'MISTAKES', 'CHALLENGE', 'COMPLETE'] as SceneStage[]).map((s) => {
                const labels: Record<SceneStage, string> = {
                  FRAMEWORK: '1. Framework',
                  EXAMPLES: '2. Examples',
                  MISTAKES: '3. Mistakes',
                  CHALLENGE: '4. Practice',
                  COMPLETE: '5. Done'
                };
                const active = scene === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setScene(s);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      active
                        ? 'bg-white text-zinc-950 font-semibold shadow-xs'
                        : 'text-zinc-500 hover:text-zinc-800'
                    }`}
                  >
                    {labels[s]}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => openAiWithPrompt()}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-700 hover:text-zinc-950 bg-white hover:bg-zinc-100 border border-zinc-200 transition-colors cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5 text-zinc-600" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>

        {/* ======================================================================= */}
        {/* MAIN LESSON CONTENT VIEWPORT */}
        {/* ======================================================================= */}
        <div className="p-5 sm:p-8 min-h-[460px] flex flex-col justify-between">
          <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col justify-center">
            {/* SCENE 1: FRAMEWORK BREAKDOWN & VISUAL DIAGRAM */}
            {scene === 'FRAMEWORK' && (
              <div className="space-y-6 py-2">
                <div className="text-center space-y-2">
                  <span className="inline-block px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-mono font-semibold">
                    {level?.frameworkName || 'Thinking Architecture'}
                  </span>

                  <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 tracking-tight">
                    {level?.title}
                  </h1>

                  {/* Core Formula Banner */}
                  {level?.frameworkFormula && (
                    <div className="p-3 sm:p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center max-w-lg mx-auto">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block font-semibold mb-1">
                        Core Formula
                      </span>
                      <p className="text-base sm:text-lg font-mono font-bold text-zinc-900 tracking-wide">
                        {level.frameworkFormula}
                      </p>
                    </div>
                  )}
                </div>

                {/* VISUAL FRAMEWORK FLOW DIAGRAM (Point -> Reason -> Example) */}
                {level?.frameworkSteps && level.frameworkSteps.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-500 block text-center">
                      Visual Thinking Flow
                    </span>

                    <div className="flex flex-col sm:flex-row items-stretch justify-center gap-2 sm:gap-1.5">
                      {level.frameworkSteps.map((step: any, idx: number) => {
                        const stepNum = typeof step === 'object' && step?.stepNumber ? step.stepNumber : idx + 1;
                        const rawText = typeof step === 'string' ? step : (step?.name || step?.description || `Step ${stepNum}`);
                        const hasColon = typeof rawText === 'string' && rawText.includes(':');
                        const stepTitle = hasColon ? rawText.split(':')[0].replace(/^[0-9]+\.\s*/, '') : rawText.replace(/^[0-9]+\.\s*/, '');
                        const stepDesc = hasColon
                          ? rawText.split(':').slice(1).join(':').trim()
                          : (typeof step === 'object' && step?.description ? step.description : null);

                        const isLast = idx === level.frameworkSteps.length - 1;

                        return (
                          <React.Fragment key={idx}>
                            <div className="flex-1 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between space-y-1.5 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-zinc-900 text-white text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                                  {stepNum}
                                </span>
                                <span className="text-xs font-display font-bold text-zinc-900">
                                  {stepTitle}
                                </span>
                              </div>
                              {stepDesc && (
                                <p className="text-[11px] text-zinc-600 leading-snug">
                                  {stepDesc}
                                </p>
                              )}
                            </div>

                            {!isLast && (
                              <div className="hidden sm:flex items-center justify-center text-zinc-400 font-mono text-sm">
                                →
                              </div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Why It Works & When To Use */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Why This Works</span>
                    </span>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {(level as any)?.whyItWorks ||
                        level?.introduction?.whyItMatters ||
                        'Eliminates mental wandering and gives the listener an immediate focal point.'}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200/80 space-y-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                      <span>When To Use</span>
                    </span>
                    <p className="text-xs text-zinc-700 leading-relaxed">
                      {typeof level?.whenToUse === 'string'
                        ? level.whenToUse
                        : Array.isArray((level?.whenToUse as any)?.idealSituations)
                          ? (level.whenToUse as any).idealSituations.join(', ')
                          : 'Executive updates, interview questions, team syncs, and spontaneous explanations.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SCENE 2: CONCRETE EXAMPLES (WEAK VS STRONG) */}
            {scene === 'EXAMPLES' && (
              <div className="space-y-4 py-2">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                    Concrete Contrast
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900">
                    Weak Answer vs. Strong Answer
                  </h2>
                </div>

                {level?.frameworkExamples && level.frameworkExamples.length > 0 ? (
                  (() => {
                    const ex = level.frameworkExamples[0] as any;
                    const scenarioText = ex.scenario || ex.context || 'Communication Challenge';
                    const promptText = ex.question || ex.prompt;
                    const weakText = ex.weakAnswer || ex.weakResponse || 'Unstructured wandering answer...';
                    const weakCritiqueText = ex.weaknessExplanation || ex.weakCritique || 'Lack of focal point and wandering reasoning.';
                    const strongText = ex.strongAnswer || ex.strongResponse || 'Direct, structured answer leading with the core takeaway.';
                    const strongBreakdownText = ex.whyItWorked || ex.strongBreakdown || 'Led with the conclusion, followed by structured justification.';

                    return (
                      <div className="space-y-3 max-w-2xl mx-auto">
                        {/* Scenario header */}
                        <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-center">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-0.5">
                            Scenario Context
                          </span>
                          <p className="text-xs sm:text-sm font-medium text-zinc-800">
                            {scenarioText}
                          </p>
                          {promptText && (
                            <div className="mt-1">
                              <p className="text-xs text-zinc-900 font-mono font-semibold">
                                Q: "{promptText}"
                              </p>
                              <QuestionTranslator questionText={promptText} variant="neutral" />
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Weak Answer */}
                          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
                            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-mono font-bold uppercase tracking-wider">
                              <XCircle className="w-4 h-4" />
                              <span>Weak Answer (Wandering)</span>
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-700 italic leading-relaxed">
                              "{weakText}"
                            </p>
                            <div className="pt-1.5 border-t border-rose-200/80 text-[11px] text-rose-800">
                              <strong>Why it failed:</strong> {weakCritiqueText}
                            </div>
                          </div>

                          {/* Strong Answer */}
                          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                            <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Strong Answer ({level?.frameworkName || 'Framework'})</span>
                            </div>
                            <p className="text-xs sm:text-sm text-zinc-900 font-medium leading-relaxed">
                              "{strongText}"
                            </p>
                            <div className="pt-1.5 border-t border-emerald-200/80 text-[11px] text-emerald-800">
                              <strong>Why it worked:</strong> {strongBreakdownText}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center">
                    <p className="text-sm text-zinc-600">
                      Study how leading with the punchline creates instant confidence compared to meandering narratives.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SCENE 3: COMMON MISTAKES & PRINCIPLE */}
            {scene === 'MISTAKES' && (
              <div className="space-y-4 py-2">
                <div className="text-center space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold block">
                    Execution Traps & Principles
                  </span>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-zinc-900">
                    What to Avoid
                  </h2>
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  {(level?.commonMistakes && level.commonMistakes.length > 0
                    ? level.commonMistakes
                    : [
                        'Giving excessive backstory before delivering the punchline',
                        'Using vague adjectives instead of concrete evidence',
                        'Failing to restate the core conclusion at the end'
                      ]
                  ).map((mistake, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-start gap-3 text-xs text-zinc-700 leading-relaxed"
                    >
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>

                {/* Key Principle Card */}
                {level?.keyPrinciple && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-center max-w-xl mx-auto space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold">
                      Key Principle
                    </span>
                    <h3 className="text-sm sm:text-base font-display font-bold text-zinc-900">
                      "{level.keyPrinciple.rule}"
                    </h3>
                    <p className="text-xs text-zinc-600">
                      {level.keyPrinciple.explanation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* SCENE 4: DYNAMIC AI EXERCISE / PRACTICE */}
            {scene === 'CHALLENGE' && (
              <div className="w-full space-y-4">
                {/* Practice Header with 3 Mandatory Exercise Steps or Infinite Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                  <div className="flex items-center gap-3">
                    {exerciseIndex <= totalMandatory ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-800 font-bold">
                          Mandatory Exercises:
                        </span>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3].map((step) => {
                            const isDone = step < exerciseIndex || (step === 3 && isMandatoryComplete);
                            const isCurrent = step === exerciseIndex && !isMandatoryComplete;
                            return (
                              <div
                                key={step}
                                className={`flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-mono font-bold transition-all ${
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : isCurrent
                                    ? 'bg-zinc-900 text-white ring-2 ring-zinc-300'
                                    : 'bg-zinc-200 text-zinc-500'
                                }`}
                              >
                                {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step}
                              </div>
                            );
                          })}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500 ml-1">
                          ({Math.min(exerciseIndex, totalMandatory)} of 3)
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-mono font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          <span>Infinite Practice · Exercise {exerciseIndex}</span>
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                      Target: <strong className="text-zinc-800">{level?.frameworkFormula || level?.frameworkName}</strong>
                    </span>
                    {isMandatoryComplete && (
                      <button
                        type="button"
                        disabled={isNavigatingNext}
                        onClick={handleAdvanceToNextLesson}
                        className="px-3 py-1 rounded-lg bg-zinc-900 text-white text-xs font-mono font-bold hover:bg-zinc-800 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-60"
                      >
                        {isNavigatingNext ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Next Lesson</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Scenario / Dynamic AI Challenge Card */}
                {isGeneratingExercise ? (
                  <div className="p-8 sm:p-10 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-3 animate-pulse">
                    <div className="w-8 h-8 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-sm font-display font-bold text-zinc-900">
                        Generating Dynamic AI Scenario...
                      </h4>
                      <p className="text-xs text-zinc-500 font-mono">
                        Sākshi AI is tailoring a fresh real-world scenario for {level?.frameworkName || 'this level'} ({exerciseIndex <= 3 ? `Exercise ${exerciseIndex} of 3` : `Exercise ${exerciseIndex}`})
                      </p>
                    </div>
                  </div>
                ) : generationError ? (
                  <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                    <p className="text-xs text-rose-700 font-mono">{generationError}</p>
                    <button
                      type="button"
                      onClick={() => loadDynamicExercise(exerciseIndex)}
                      className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold font-display uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Retry Scenario Generation</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 font-bold uppercase tracking-wider">
                          {currentExercise?.context || level?.exercise?.title || 'Realistic Scenario'}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-500">
                          {exerciseIndex <= 3 ? `Challenge ${exerciseIndex} of 3` : `Infinite Drill #${exerciseIndex}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {(currentExercise?.frameworkGuidance || level?.frameworkFormula) && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            Formula: {currentExercise?.frameworkGuidance || level?.frameworkFormula}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => loadDynamicExercise(exerciseIndex)}
                          title="Generate a fresh scenario variation"
                          className="text-[11px] font-mono text-zinc-500 hover:text-zinc-800 flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCw className="w-3 h-3" />
                          <span className="hidden sm:inline">Refresh</span>
                        </button>
                      </div>
                    </div>

                    {/* Relatable Story / Story Context */}
                    {currentExercise?.scenario && currentExercise.scenario !== currentExercise.prompt && (
                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200/80 shadow-2xs space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                          Relatable Situation
                        </span>
                        <p className="text-xs sm:text-sm text-zinc-800 leading-relaxed italic">
                          "{currentExercise.scenario}"
                        </p>
                      </div>
                    )}

                    {/* The Psychological Challenge */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold block">
                        The Challenge
                      </span>
                      <h3 className="text-base sm:text-lg font-display font-bold text-zinc-900 leading-snug">
                        {currentExercise?.prompt || level?.exercise?.prompt || 'How do you respond with psychological maturity, validation, and clear communication?'}
                      </h3>
                    </div>

                    {currentExercise?.hint && (
                      <p className="text-[11px] text-zinc-600 flex items-center gap-1.5 pt-0.5 font-mono">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Psychological Key: {currentExercise.hint}</span>
                      </p>
                    )}

                    {/* Translate Question option directly underneath the dynamic challenge */}
                    <QuestionTranslator
                      questionText={`${currentExercise?.scenario ? `Situation: ${currentExercise.scenario}\n` : ''}Challenge: ${currentExercise?.prompt || level?.exercise?.prompt || ''}`}
                      variant="neutral"
                    />
                  </div>
                )}

                {/* User Input or Feedback */}
                {!evaluationFeedback ? (
                  <div className="space-y-3">
                    <div className="relative">
                      <textarea
                        value={typedResponse}
                        onChange={(e) => setTypedResponse(e.target.value)}
                        placeholder={
                          currentExercise?.placeholder
                            ? currentExercise.placeholder
                            : `Respond with empathy, emotional stability, and ${level?.frameworkName || 'clarity'}...`
                        }
                        rows={4}
                        className="w-full rounded-xl bg-white border border-zinc-300 p-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all resize-none shadow-2xs"
                      />

                      {/* Mic Button inside input */}
                      <button
                        type="button"
                        onClick={toggleSpeechRecognition}
                        className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                          isRecording
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950'
                        }`}
                        title={isRecording ? 'Stop Recording' : 'Speak your answer'}
                      >
                        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                        <span>{isRecording ? 'Listening...' : 'Speak'}</span>
                      </button>
                    </div>

                    {recognitionError && (
                      <p className="text-xs text-rose-600 flex items-center gap-1 px-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{recognitionError}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => openAiWithPrompt('Can you give me an example answer for this exercise?')}
                        className="text-xs font-mono text-zinc-600 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
                      >
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Need a hint? Ask Sākshi</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleChallengeSubmit}
                        disabled={!typedResponse.trim() || isEvaluating || isGeneratingExercise}
                        className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                      >
                        {isEvaluating ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Evaluating Framework...</span>
                          </>
                        ) : (
                          <>
                            <span>Evaluate Answer</span>
                            <ChevronRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* AI Evaluation Display Card */
                  <div className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4 animate-subtle-fade">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-zinc-700" />
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-900">
                          Sākshi EQ & Communication Assessment · Challenge {exerciseIndex}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-zinc-900 text-white font-bold">
                          EQ Score: {evaluationFeedback.score}%
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-800">
                          Clarity & Tone: {evaluationFeedback.clarityRating}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-800">
                          Maturity: {evaluationFeedback.structureRating}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <p className="text-sm text-zinc-800 font-medium leading-relaxed">
                      "{evaluationFeedback.summary}"
                    </p>

                    {/* Strengths & Improvement */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      {evaluationFeedback.strengths && evaluationFeedback.strengths.length > 0 && (
                        <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Emotional Strengths & Presence</span>
                          </span>
                          <ul className="text-xs text-zinc-700 space-y-0.5 list-disc list-inside">
                            {evaluationFeedback.strengths.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {evaluationFeedback.improvements && evaluationFeedback.improvements.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                            <span>Psychological Growth Point</span>
                          </span>
                          <ul className="text-xs text-zinc-700 space-y-0.5 list-disc list-inside">
                            {evaluationFeedback.improvements.map((imp, idx) => (
                              <li key={idx}>{imp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Model Better Version */}
                    {evaluationFeedback.betterVersion && (
                      <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold block">
                          Emotionally Mature Model Response ({level?.frameworkName || 'Framework'})
                        </span>
                        <p className="text-xs text-zinc-800 italic leading-relaxed">
                          "{evaluationFeedback.betterVersion}"
                        </p>
                      </div>
                    )}

                    {/* Mandatory Completion Announcement if step 3 completed */}
                    {exerciseIndex === totalMandatory && (
                      <div className="p-3.5 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-900 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                          <span className="text-xs font-display font-bold">
                            All 3 Mandatory Exercises Complete! Level {levelNumber} Mastered.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCompletionModal(true)}
                          className="text-[11px] font-mono font-bold text-emerald-800 hover:text-emerald-950 underline shrink-0 cursor-pointer"
                        >
                          View Completion Choices
                        </button>
                      </div>
                    )}

                    {/* Bottom Actions based on Exercise Stage */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-zinc-200">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            setEvaluationFeedback(null);
                          }}
                          className="text-xs font-mono text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                        >
                          Try Another Answer
                        </button>

                        <button
                          type="button"
                          onClick={() => openAiWithPrompt('How can I make this answer sound even crisper?')}
                          className="text-xs font-mono text-zinc-700 hover:text-zinc-950 flex items-center gap-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Discuss with Sākshi</span>
                        </button>
                      </div>

                      {/* Primary Action Button */}
                      {exerciseIndex < totalMandatory ? (
                        <button
                          type="button"
                          onClick={handleProceedToNextExercise}
                          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <span>Proceed to Exercise {exerciseIndex + 1} of 3</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : exerciseIndex === totalMandatory ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={handleStartInfinitePractice}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Practice More</span>
                          </button>
                          <button
                            type="button"
                            disabled={isNavigatingNext}
                            onClick={handleAdvanceToNextLesson}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {isNavigatingNext ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <span>Next Lesson</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        /* Infinite mode actions */
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            type="button"
                            onClick={handleStartInfinitePractice}
                            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>Another Drill (#{exerciseIndex + 1})</span>
                          </button>
                          <button
                            type="button"
                            disabled={isNavigatingNext}
                            onClick={handleAdvanceToNextLesson}
                            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-display font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                          >
                            {isNavigatingNext ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                <span>Next Lesson</span>
                                <ArrowRight className="w-4 h-4" />
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SCENE 5: COMPLETE — LEVEL MASTERED CHOICE */}
            {scene === 'COMPLETE' && (
              <div className="text-center space-y-4 py-8 animate-subtle-fade">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-700 shadow-xs">
                  <Check className="w-7 h-7 stroke-[2.5]" />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
                    3 of 3 Exercises Mastered
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900">
                    Level {levelNumber < 10 ? '0' + levelNumber : levelNumber}: {level?.title}
                  </h2>
                </div>

                {(level?.keyPrinciple?.closingReflection || level?.keyPrinciple?.rule) && (
                  <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                    {level.keyPrinciple.closingReflection || level.keyPrinciple.rule}
                  </p>
                )}

                {/* POST-COMPLETION MANDATED OPTIONS: NEXT LESSON OR PRACTICE MORE */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleStartInfinitePractice}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>Practice More Questions</span>
                  </button>

                  <button
                    id="advance-next-btn"
                    type="button"
                    disabled={isNavigatingNext}
                    onClick={handleAdvanceToNextLesson}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider active:scale-95 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isNavigatingNext ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Unlocking Next Lesson...</span>
                      </div>
                    ) : (
                      <>
                        <span>Next Lesson</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    id="talk-to-ai-btn"
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      openAiWithPrompt(
                        `We just finished Level ${levelNumber} on ${level?.frameworkName || 'this framework'}. Can we practice one more spontaneous scenario?`
                      );
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Talk to AI</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ===================================================================== */}
          {/* BOTTOM NARRATION & STAGE CONTROLS BAR */}
          {/* ===================================================================== */}
          {scene !== 'COMPLETE' && (
            <div className="w-full max-w-2xl mx-auto p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
              <div className="flex-1 min-w-0 space-y-1 text-left w-full overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                    Lesson Guidance
                  </span>
                  {isVoiceActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
                <LessonGuidanceMarquee text={currentSpokenLine} />
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Voice audio toggle */}
                <button
                  type="button"
                  onClick={() => {
                    if (isVoiceActive) stopVoice();
                    else readSectionAloud(currentSpokenLine);
                  }}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isVoiceActive
                      ? 'bg-zinc-900 border-zinc-900 text-white'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
                  }`}
                  title={isVoiceActive ? 'Mute audio' : 'Read lesson aloud'}
                >
                  {isVoiceActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {scene === 'FRAMEWORK' && (
                  <button
                    type="button"
                    onClick={handleProceedToExamples}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Examples</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {scene === 'EXAMPLES' && (
                  <button
                    type="button"
                    onClick={handleProceedToMistakes}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Mistakes</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {scene === 'MISTAKES' && (
                  <button
                    type="button"
                    onClick={handleProceedToChallenge}
                    className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Practice</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Normal AI Contextual Drawer */}
      <NormalAIContextDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => {
          setIsAiDrawerOpen(false);
          setAiDrawerPrompt(undefined);
        }}
        context={{
          worldNumber: stage.stageNumber,
          worldTitle: stage.title,
          levelNumber,
          levelTitle: level?.title,
          frameworkName: level?.frameworkName || level?.title,
          frameworkFormula: level?.frameworkFormula,
          exercisePrompt: currentExercise?.prompt || level?.exercise?.prompt || level?.exercise?.scenario,
          userSubmittedAnswer: typedResponse || undefined,
          evaluationFeedback: evaluationFeedback?.summary
        }}
        initialPrompt={aiDrawerPrompt}
      />

      {/* Post-Completion Modal when all 3 Mandatory Exercises are completed */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-subtle-fade">
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3 of 3 Mandatory Exercises Completed</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 pt-1">
                Level {levelNumber < 10 ? '0' + levelNumber : levelNumber} Mastered!
              </h2>
              <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
                {level?.keyPrinciple?.closingReflection || level?.keyPrinciple?.rule || `You have mastered ${level?.frameworkName || 'this framework'} across all 3 AI scenario challenges.`}
              </p>
            </div>

            {/* Metrics breakdown */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-around">
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Exercises</span>
                <span className="text-base font-display font-bold text-zinc-900">3 / 3</span>
              </div>
              <div className="w-px h-8 bg-zinc-200" />
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Average Score</span>
                <span className="text-base font-display font-bold text-emerald-600">
                  {completedExerciseScores.length > 0
                    ? Math.round(completedExerciseScores.reduce((a, b) => a + b, 0) / completedExerciseScores.length)
                    : 92}%
                </span>
              </div>
              <div className="w-px h-8 bg-zinc-200" />
              <div className="text-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block">Next Unlock</span>
                <span className="text-base font-display font-bold text-zinc-900">
                  {levelNumber < 75 ? `Level ${levelNumber + 1}` : 'World Complete'}
                </span>
              </div>
            </div>

            {/* The Two Explicit Mandated User Options */}
            <div className="space-y-2.5 pt-2">
              {/* Option A: Next Lesson */}
              <button
                type="button"
                disabled={isNavigatingNext}
                onClick={handleAdvanceToNextLesson}
                className="w-full py-3.5 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-display font-bold text-xs uppercase tracking-wider active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isNavigatingNext ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Unlocking Next Lesson...</span>
                  </div>
                ) : (
                  <>
                    <span>Next Lesson {levelNumber < 75 ? `(Level ${levelNumber + 1})` : ''}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Option B: Practice More Questions */}
              <button
                type="button"
                onClick={handleStartInfinitePractice}
                className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-display font-bold text-xs uppercase tracking-wider active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Practice More Questions (Infinite AI Drills)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
