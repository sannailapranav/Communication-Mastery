import {
  UserProfile,
  LearningModule,
  Framework,
  PracticeExercise,
  PracticeAttempt,
  UserStats,
  AIEvaluationResult,
  JourneyStage,
  JourneyStateSummary,
  JourneyLevelData,
  UserJourneyLevelRecord,
  JourneyEvaluationResult,
  NormalAiConversation,
  NormalAiMessage,
  QuestionTranslationResponse,
  DynamicAIExercise
} from '../types';

const TOKEN_KEY = 'comm_mastery_token';
const CACHED_USER_KEY = 'comm_mastery_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function getStoredUser(): UserProfile | null {
  const data = localStorage.getItem(CACHED_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setStoredUser(user: UserProfile | null): void {
  if (user) {
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CACHED_USER_KEY);
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {})
  };

  if (options.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const isIdempotent = !options.method || options.method === 'GET';
  const maxAttempts = isIdempotent ? 3 : 1;
  let lastFetchError: any = null;
  let res: Response | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      res = await fetch(endpoint, {
        ...options,
        headers
      });
      break;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      lastFetchError = err;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 200 * attempt));
        continue;
      }
    }
  }

  if (!res) {
    throw lastFetchError || new Error('Network request failed');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) {
      setStoredToken(null);
      setStoredUser(null);
      window.dispatchEvent(new CustomEvent('auth:session-expired'));
    }
    const error: any = new Error(data.error || data.message || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const api = {
  async register(email: string, password: string, displayName: string): Promise<{ token: string; user: UserProfile }> {
    const res = await request<{ token: string; user: UserProfile }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName })
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  async login(email: string, password: string): Promise<{ token: string; user: UserProfile }> {
    const res = await request<{ token: string; user: UserProfile }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    setStoredToken(res.token);
    setStoredUser(res.user);
    return res;
  },

  async syncSupabaseUser(supabaseAccessToken: string): Promise<{ user: UserProfile; isNewUser: boolean }> {
    const res = await request<{ user: UserProfile; isNewUser: boolean }>('/api/auth/sync-supabase-user', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${supabaseAccessToken}`
      }
    });
    setStoredToken(supabaseAccessToken);
    setStoredUser(res.user);
    return res;
  },

  async getAuthConfig(): Promise<{ supabaseUrl: string; supabaseAnonKey: string; isConfigured: boolean }> {
    return request<{ supabaseUrl: string; supabaseAnonKey: string; isConfigured: boolean }>('/api/auth/config');
  },

  async getMe(): Promise<UserProfile> {
    const user = await request<UserProfile>('/api/auth/me');
    setStoredUser(user);
    return user;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const user = await request<UserProfile>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    setStoredUser(user);
    return user;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async getCurriculum(): Promise<LearningModule[]> {
    return request<LearningModule[]>('/api/curriculum/modules');
  },

  async getFrameworks(): Promise<Framework[]> {
    return request<Framework[]>('/api/frameworks');
  },

  async getPracticeExercises(): Promise<PracticeExercise[]> {
    return request<PracticeExercise[]>('/api/practice/exercises');
  },

  async completeLesson(
    lessonId: string,
    moduleId: string
  ): Promise<{ success: boolean; lessonId: string; newAchievements: string[] }> {
    return request<{ success: boolean; lessonId: string; newAchievements: string[] }>(
      `/api/lessons/${lessonId}/complete`,
      {
        method: 'POST',
        body: JSON.stringify({ moduleId })
      }
    );
  },

  async submitPractice(payload: {
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
  }): Promise<{
    attempt: PracticeAttempt;
    evaluation: AIEvaluationResult;
    newAchievements: string[];
  }> {
    return request<{
      attempt: PracticeAttempt;
      evaluation: AIEvaluationResult;
      newAchievements: string[];
    }>('/api/practice/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async getProgressSummary(): Promise<UserStats & { completedLessonIds: string[] }> {
    return request<UserStats & { completedLessonIds: string[] }>('/api/progress/summary');
  },

  // ---------------- JOURNEY API CALLS ----------------
  async getJourneyStages(): Promise<JourneyStage[]> {
    return request<JourneyStage[]>('/api/journey/stages');
  },

  async getJourneyState(): Promise<JourneyStateSummary> {
    return request<JourneyStateSummary>('/api/journey/state');
  },

  async getJourneyLevel(levelNumber: number): Promise<{
    levelData: JourneyLevelData;
    stage: JourneyStage;
    userRecord: UserJourneyLevelRecord;
    isAccessible: boolean;
  }> {
    return request<{
      levelData: JourneyLevelData;
      stage: JourneyStage;
      userRecord: UserJourneyLevelRecord;
      isAccessible: boolean;
    }>(`/api/journey/level/${levelNumber}`);
  },

  async startJourneyLevel(levelNumber: number): Promise<{ success: boolean; record: UserJourneyLevelRecord }> {
    return request<{ success: boolean; record: UserJourneyLevelRecord }>(`/api/journey/level/${levelNumber}/start`, {
      method: 'POST'
    });
  },

  async evaluateJourneyReflections(
    levelNumber: number,
    answers: Record<number, string>
  ): Promise<{ evaluation: JourneyEvaluationResult; score: number }> {
    return request<{ evaluation: JourneyEvaluationResult; score: number }>(`/api/journey/level/${levelNumber}/evaluate`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  async completeJourneyLevel(
    levelNumber: number,
    data?: number | {
      answers?: Record<number, string>;
      evaluation?: JourneyEvaluationResult;
      score?: number;
    }
  ): Promise<{
    success: boolean;
    levelNumber: number;
    unlockedNextLevel: number | null;
    journeyState: JourneyStateSummary;
    newAchievements: string[];
  }> {
    const payload = typeof data === 'number' ? { score: data } : (data || {});
    return request<{
      success: boolean;
      levelNumber: number;
      unlockedNextLevel: number | null;
      journeyState: JourneyStateSummary;
      newAchievements: string[];
    }>(`/api/journey/level/${levelNumber}/complete`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async converseWithMentor(payload: {
    userMessage: string;
    levelNumber?: number;
    levelTitle?: string;
    stageTitle?: string;
    recentHistory?: Array<{ role: 'user' | 'mentor'; text: string }>;
    exerciseTitle?: string;
    userChoiceOrAction?: string;
    scene?: string;
  }): Promise<{
    text: string;
    emotion: import('../types').MentorEmotion;
    switchedLanguage?: string;
    timestamp: string;
  }> {
    return request<{
      text: string;
      emotion: import('../types').MentorEmotion;
      switchedLanguage?: string;
      timestamp: string;
    }>('/api/journey/mentor-converse', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // ---------------- NORMAL AI CONVERSATION METHODS ----------------

  async getConversations(): Promise<NormalAiConversation[]> {
    return request<NormalAiConversation[]>('/api/conversations');
  },

  async createConversation(): Promise<NormalAiConversation> {
    return request<NormalAiConversation>('/api/conversations', {
      method: 'POST'
    });
  },

  async getConversation(id: string): Promise<{ conversation: NormalAiConversation; messages: NormalAiMessage[] }> {
    return request<{ conversation: NormalAiConversation; messages: NormalAiMessage[] }>(`/api/conversations/${id}`);
  },

  async deleteConversation(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/conversations/${id}`, {
      method: 'DELETE'
    });
  },

  async evaluateExerciseAnswer(
    levelNumber: number,
    payload: {
      answer: string;
      frameworkName?: string;
      frameworkFormula?: string;
      exercisePrompt?: string;
      scenario?: string;
    }
  ): Promise<{
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
  }> {
    return request<{
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
    }>(`/api/journey/level/${levelNumber}/evaluate-answer`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  async generateDynamicAIExercise(
    levelNumber: number,
    payload?: {
      exerciseIndex?: number;
      previousPrompts?: string[];
      frameworkName?: string;
      frameworkFormula?: string;
      learningObjective?: string;
    }
  ): Promise<DynamicAIExercise> {
    return request<DynamicAIExercise>(`/api/journey/level/${levelNumber}/generate-question`, {
      method: 'POST',
      body: JSON.stringify(payload || {})
    });
  },

  async sendNormalAIMessage(
    conversationId: string,
    message: string,
    context?: {
      worldNumber?: number;
      worldTitle?: string;
      levelNumber?: number;
      levelTitle?: string;
      frameworkName?: string;
      frameworkFormula?: string;
      exercisePrompt?: string;
      userSubmittedAnswer?: string;
      evaluationFeedback?: string;
    },
    signal?: AbortSignal
  ): Promise<{
    userMessage: NormalAiMessage;
    assistantMessage: NormalAiMessage;
    conversation: NormalAiConversation;
    switchedLanguage?: string;
  }> {
    return request<{
      userMessage: NormalAiMessage;
      assistantMessage: NormalAiMessage;
      conversation: NormalAiConversation;
      switchedLanguage?: string;
    }>(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message, context }),
      signal
    });
  },

  async deleteMessage(conversationId: string, messageId: string): Promise<{ success: boolean; messageId: string }> {
    return request<{ success: boolean; messageId: string }>(`/api/conversations/${conversationId}/messages/${messageId}`, {
      method: 'DELETE'
    });
  },

  async clearConversationMessages(conversationId: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>(`/api/conversations/${conversationId}/messages`, {
      method: 'DELETE'
    });
  },

  async streamNormalAIMessage(
    conversationId: string,
    payload: {
      message: string;
      context?: {
        worldNumber?: number;
        worldTitle?: string;
        levelNumber?: number;
        levelTitle?: string;
        frameworkName?: string;
        frameworkFormula?: string;
        exercisePrompt?: string;
        userSubmittedAnswer?: string;
        evaluationFeedback?: string;
      };
      editMessageId?: string;
    },
    callbacks: {
      onStart?: (data: { userMessage: NormalAiMessage; removedMessageIds?: string[] }) => void;
      onDelta?: (text: string) => void;
      onDone?: (data: { assistantMessage: NormalAiMessage; conversation: NormalAiConversation; switchedLanguage?: string }) => void;
      onError?: (err: any) => void;
    },
    signal?: AbortSignal
  ): Promise<void> {
    const token = getStoredToken();
    const response = await fetch(`/api/conversations/${conversationId}/messages/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: JSON.stringify(payload),
      signal
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ReadableStream not supported');
    }

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const dataStr = trimmed.slice(6);
            if (dataStr === '[DONE]') continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === 'start' && callbacks.onStart) {
                callbacks.onStart(parsed);
              } else if (parsed.type === 'delta' && callbacks.onDelta) {
                callbacks.onDelta(parsed.text);
              } else if (parsed.type === 'done' && callbacks.onDone) {
                callbacks.onDone(parsed);
              } else if (parsed.type === 'error') {
                const err = new Error(parsed.error || 'Streaming error');
                if (callbacks.onError) callbacks.onError(err);
              }
            } catch (err) {
              console.warn('Failed to parse SSE line:', line);
            }
          }
        }
      }
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw err;
      }
      if (callbacks.onError) {
        callbacks.onError(err);
      } else {
        throw err;
      }
    }
  },

  async translateQuestion(payload: {
    text: string;
    targetLanguage?: string;
    scriptPreference?: 'romanized' | 'native';
  }): Promise<QuestionTranslationResponse> {
    return request<QuestionTranslationResponse>('/api/translate-question', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  logout(): void {
    setStoredToken(null);
    setStoredUser(null);
  }
};
