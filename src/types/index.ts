export type LearningLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CommunicationGoal =
  | 'Speak English confidently'
  | 'Improve conversations'
  | 'Structure thoughts clearly'
  | 'Excel in job interviews'
  | 'Speak under pressure'
  | 'Lead and persuade'
  | 'Public speaking'
  | 'Interviews'
  | 'Workplace communication'
  | 'Presentation skills'
  | 'Social confidence'
  | 'Listening'
  | 'Vocabulary in context'
  | 'Grammar in real communication'
  | 'Thinking and expressing clearly';

export type ScriptPreference = 'romanized' | 'native';
export type ConversationalStyle = 'natural' | 'reflective' | 'direct';

export type MentorEmotion =
  | 'neutral'
  | 'warmth'
  | 'concern'
  | 'curiosity'
  | 'seriousness'
  | 'disappointment'
  | 'encouragement'
  | 'calmness'
  | 'firmness'
  | 'surprise'
  | 'humour'
  | 'empathy'
  | 'silence'
  | 'reflective'
  | 'affirming'
  | 'challenging';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  learningLevel: LearningLevel;
  goals: CommunicationGoal[];
  motherTongue?: string; // e.g. 'Telugu', 'Hindi', 'Spanish', etc.
  learningLanguage?: string; // e.g. 'English'
  preferredAILanguage?: string; // e.g. 'Telugu (Tenglish)', 'Hindi (Hinglish)', 'English'
  scriptPreference?: ScriptPreference;
  conversationalStyle?: ConversationalStyle;
  locale?: string;
  currentModule?: string;
  isOnboarded: boolean;
  isGuest?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionTranslationResponse {
  translated: string;
  language: string;
  languageLabel: string;
  cached?: boolean;
}

export interface MentorChatMessage {
  id: string;
  role: 'user' | 'mentor';
  text: string;
  timestamp: string;
  emotion?: MentorEmotion;
}

export interface MentorConversationContext {
  levelNumber: number;
  levelTitle: string;
  stageTitle: string;
  exerciseTitle?: string;
  userChoiceOrAction?: string;
  scene?: string;
}

export type CommunicationDimension =
  | 'CLARITY'
  | 'STRUCTURE'
  | 'FLUENCY'
  | 'LISTENING'
  | 'REASONING'
  | 'PERSUASION'
  | 'EMOTIONAL_EXPRESSION'
  | 'ADAPTABILITY'
  | 'CONFLICT_HANDLING'
  | 'SPONTANEITY';

export interface DimensionScore {
  dimension: CommunicationDimension;
  score: number; // 0 to 100
  evaluatedCount: number;
}

export interface LessonSection {
  id?: string;
  type?: string;
  heading?: string;
  title?: string;
  body?: string;
  content?: string;
  dialogue?: Array<{
    speaker: string;
    role?: string;
    text: string;
    tone?: string;
    critique?: string;
  }>;
  takeaway?: string;
  keyTakeaway?: string;
  psychologicalInsight?: string;
  insight?: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order?: number;
  estimatedMinutes?: number;
  summary: string;
  psychologicalFocus?: string;
  coreTakeaway?: string;
  fundamentalTruth?: string;
  keyFramework?: string;
  sections: LessonSection[];
  content?: LessonSection[] | string;
  breakdown?: LessonSection[] | string;
  realisticExample?: {
    context: string;
    weakResponse: string;
    critique: string;
    strongResponse: string;
    breakdown: string;
  };
  practicePrompt?: string;
  interactivePrompt?: {
    prompt: string;
    sampleWeakAnswer: string;
    sampleStrongAnswer: string;
    tips: string[];
  };
}

export interface LearningModule {
  id: string;
  levelNumber?: 1 | 2 | 3 | 4;
  levelName?: string;
  level?: string;
  title: string;
  description: string;
  difficulty?: LearningLevel;
  iconName?: string;
  lessons: Lesson[];
}

export interface Framework {
  id: string;
  code: string;
  name: string;
  tagline: string;
  purpose: string;
  whenToUse: string;
  structureSteps: Array<{
    step: string;
    meaning: string;
    promptToAsk: string;
  }>;
  explanation: string;
  commonMistakes: string[];
  realisticScenario: {
    context: string;
    weakExample: string;
    weakCritique: string;
    strongExample: string;
    strongBreakdown: string;
  };
  practicePrompt: string;
}

export type PracticeType =
  | 'speaking'
  | 'written'
  | 'conversation_choice'
  | 'framework'
  | 'interview'
  | 'presentation'
  | 'pressure';

export interface PracticeExercise {
  id: string;
  title: string;
  type: PracticeType;
  category: 'PERSPECTIVE' | 'DILEMMA' | 'SOCIAL_SITUATION' | 'PRESSURE' | 'DEEP_QUESTION' | 'WORKPLACE';
  difficulty: LearningLevel;
  contextBrief: string;
  prompt: string;
  constraints?: string[];
  recommendedFramework?: string;
  choices?: Array<{
    id: string;
    label: string;
    isOptimal: boolean;
    explanation: string;
    psychologicalInsight: string;
  }>;
}

export interface AIEvaluationResult {
  overallScore: number;
  dimensionScores: Partial<Record<CommunicationDimension, number>>;
  whatYouDidWell: string[];
  whatCanImprove: string[];
  betterStructure: string;
  exampleImprovedResponse: string;
  oneThingToFocusOnNext: string;
  confidenceNotes?: string;
  fillerWordsObserved?: string[];
}

export interface PracticeAttempt {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseTitle: string;
  exerciseType: PracticeType;
  responseText: string;
  inputMode: 'TEXT' | 'AUDIO_TRANSCRIPT';
  audioDurationSeconds?: number;
  evaluation?: AIEvaluationResult;
  selectedChoiceId?: string;
  submittedAt: string;
}

export interface LessonProgress {
  lessonId: string;
  moduleId: string;
  isCompleted: boolean;
  completedAt?: string;
  lastAttemptNotes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface UserStats {
  lessonsCompleted: number;
  totalLessons: number;
  practiceSessionsCompleted: number;
  streakDays: number;
  overallScoreAverage: number;
  dimensionScores: Record<CommunicationDimension, number>;
  recentAttempts: PracticeAttempt[];
  achievements: Achievement[];
  journeyProgress?: {
    currentLevel: number;
    completedLevels: number;
    totalLevels: number;
    currentStageTitle: string;
  };
}

// ---------------- JOURNEY & AI TEACHER TYPES ----------------

export type JourneyLevelStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export interface JourneyStage {
  id: string;
  stageNumber: number; // 1 to 12
  title: string;
  subtitle: string;
  description: string;
  levelRange: [number, number];
  iconName: string;
  colorTheme: string;
  purpose?: string;
}

export interface FrameworkExample {
  context: string;
  weakResponse: string;
  weakCritique: string;
  strongResponse: string;
  strongBreakdown: string;
  keyDistinction: string;
}

export interface FrameworkExercise {
  prompt: string;
  scenario: string;
  frameworkGuidance: string;
  sampleFrameworkApplication?: string;
  placeholder: string;
}

export interface RealLifeExample {
  context: string;
  poorApproach: {
    behaviorOrWords: string;
    subconsciousSignal: string;
    listenerReaction: string;
  };
  masteredApproach: {
    behaviorOrWords: string;
    subconsciousSignal: string;
    listenerReaction: string;
  };
  psychologicalDifference: string;
}

export interface ReflectionQuestion {
  id: number;
  question: string;
  contextGuidance: string;
  placeholder: string;
  selfDiscoveryFocus: string;
}

export interface JourneyLevelData {
  levelNumber: number; // 1 to 75
  stageNumber: number; // 1 to 12
  stageId: string;
  stageTitle: string;
  title: string;
  subtitle: string;
  frameworkName: string;
  frameworkFormula: string;
  frameworkSteps: string[];
  estimatedMinutes: number;
  whenToUse: {
    idealSituations: string[];
    whenToAvoid?: string[];
  };
  introduction: {
    headline: string;
    greetingContext: string;
    whyItMatters: string;
    whatYouWillUnderstand: string;
    connectionToMastery: string;
  };
  coreExplanation: {
    corePremise: string;
    mechanisms: string[];
    commonPitfall: string;
    mentalModel: string;
  };
  frameworkExamples: FrameworkExample[];
  realLifeExamples?: RealLifeExample[];
  exercise: FrameworkExercise;
  reflectionQuestions?: ReflectionQuestion[];
  questions?: Array<{
    q: string;
    guide: string;
    placeholder: string;
    focus: string;
  }>;
  keyPrinciple: {
    rule: string;
    actionableHabit: string;
    closingReflection: string;
  };
  corePremise?: string;
}

export interface IndividualAnswerFeedback {
  questionNumber: number;
  questionText?: string;
  observation?: string;
  aiObservation?: string;
  psychologicalInterpretation: string;
  growthNuance?: string;
  userAnswerSnippet?: string;
  questionFocus?: string;
}

export interface JourneyEvaluationResult {
  overallScore?: number;
  clarity?: string;
  relevance?: string;
  structure?: string;
  reasoning?: string;
  depthOfReflection?: number;
  selfAwarenessScore?: number;
  communicationClarity?: number;
  individualAnswersFeedback?: IndividualAnswerFeedback[];
  whatYouUnderstood?: string[];
  whatYouNoticed?: string[];
  needsDeeperUnderstanding?: string[];
  communicationInsight?: string;
  feedbackSummary?: string;
  qualitativeStrengths?: string[];
  areasToRefine?: string[];
  frameworkObservation?: string;
  mentorVerdict: string;
  oneKeyPrinciple: string;
}

export interface DynamicAIExercise {
  id: string;
  title: string;
  context: string;
  scenario: string;
  prompt: string;
  frameworkGuidance?: string;
  placeholder?: string;
  hint?: string;
  exerciseIndex: number;
  totalMandatory: number;
}

export interface UserJourneyLevelRecord {
  levelNumber: number;
  status: JourneyLevelStatus;
  currentStep?: number;
  exerciseStep?: number; // 1, 2, 3 (progress through mandatory exercises)
  mandatoryExercisesCompleted?: number; // 0 to 3
  startedAt?: string;
  completedAt?: string;
  answers?: Record<number, string>; // 1-5 index -> answer text
  evaluation?: JourneyEvaluationResult;
  score?: number;
}

export interface JourneyStateSummary {
  currentLevel: number;
  completedCount: number;
  totalCompletedLevels?: number;
  totalLevels: number; // 75
  levels: Record<number, UserJourneyLevelRecord>;
  stages: Array<{
    id?: string;
    stageNumber: number;
    title: string;
    subtitle: string;
    levelRange?: [number, number];
    completedLevels: number;
    totalLevels: number;
    isUnlocked: boolean;
    isCompleted: boolean;
  }>;
}

// ---------------- NORMAL AI COMPANION TYPES ----------------

export interface NormalAiConversation {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroundingSource {
  title?: string;
  uri: string;
}

export interface ReasoningStep {
  id: string;
  label: string;
  detail?: string;
  status: 'pending' | 'in_progress' | 'completed';
  timestamp?: number;
}

export interface NormalAiMessage {
  id: string;
  conversationId: string;
  userId?: string;
  role: 'user' | 'model';
  content: string;
  reasoningSteps?: ReasoningStep[];
  groundingSources?: GroundingSource[];
  webSearchQueries?: string[];
  createdAt: string;
}

