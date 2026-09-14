import React, { useState } from 'react';
import { PracticeExercise, AIEvaluationResult, PracticeAttempt } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { AudioRecorder } from '../common/AudioRecorder';
import { EvaluationFeedbackView } from './EvaluationFeedbackView';
import { QuestionTranslator } from '../common/QuestionTranslator';
import {
  ArrowLeft,
  Mic,
  PenTool,
  Send,
  AlertCircle,
  Lightbulb,
  CheckCircle2,
  Layers,
  HelpCircle,
  Target
} from 'lucide-react';

interface ActivePracticeSessionProps {
  exercise: PracticeExercise;
  onBack: () => void;
}

export const ActivePracticeSession: React.FC<ActivePracticeSessionProps> = ({
  exercise,
  onBack
}) => {
  const { submitPracticeAttempt } = useProgress();

  const [inputMode, setInputMode] = useState<'TEXT' | 'AUDIO_TRANSCRIPT'>('TEXT');
  const [responseText, setResponseText] = useState('');
  const [audioDuration, setAudioDuration] = useState<number | undefined>(undefined);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [completedEvaluation, setCompletedEvaluation] = useState<AIEvaluationResult | null>(null);
  const [createdAttempt, setCreatedAttempt] = useState<PracticeAttempt | undefined>(undefined);

  const isChoiceExercise = exercise.type === 'conversation_choice' && exercise.choices;

  const handleVoiceTranscription = (transcript: string, durationSecs: number) => {
    setResponseText(transcript);
    setAudioDuration(durationSecs);
    setInputMode('AUDIO_TRANSCRIPT');
  };

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    const choice = exercise.choices?.find(c => c.id === choiceId);
    if (choice) {
      setResponseText(choice.explanation);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setErrorMessage(null);

    if (isChoiceExercise && !selectedChoiceId) {
      setErrorMessage('Please select one of the strategic conversational options.');
      return;
    }

    if (!responseText.trim()) {
      setErrorMessage('Please provide a spoken or written response before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await submitPracticeAttempt({
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        exerciseType: exercise.type,
        responseText: responseText.trim(),
        inputMode,
        audioDurationSeconds: audioDuration,
        selectedChoiceId: selectedChoiceId || undefined,
        category: exercise.category,
        frameworkName: exercise.recommendedFramework,
        prompt: exercise.prompt
      });

      setCompletedEvaluation(res.evaluation);
      setCreatedAttempt(res.attempt);
    } catch (err: any) {
      console.error('Failed to submit practice response:', err);
      setErrorMessage(err.message || 'Evaluation failed. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSession = () => {
    setCompletedEvaluation(null);
    setCreatedAttempt(undefined);
    setResponseText('');
    setSelectedChoiceId(null);
    setErrorMessage(null);
  };

  if (completedEvaluation) {
    return (
      <EvaluationFeedbackView
        evaluation={completedEvaluation}
        attempt={createdAttempt}
        onTryAgain={resetSession}
        onDone={onBack}
      />
    );
  }

  const wordCount = responseText.trim() ? responseText.trim().split(/\s+/).length : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Practice Arena</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-semibold text-stone-700 border border-stone-200">
            {exercise.difficulty}
          </span>
          <span className="rounded-md bg-stone-900 px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
            {exercise.category}
          </span>
        </div>
      </div>

      {/* Scenario Brief & Challenge Card */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 pb-10 shadow-sm space-y-5">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Live Drill
          </span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
            {exercise.title}
          </h1>
        </div>

        {/* Context Brief */}
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-xs sm:text-sm text-stone-800 leading-relaxed">
          <span className="font-bold text-stone-900 block mb-1">Scenario Background:</span>
          {exercise.contextBrief}
        </div>

        {/* The Prompt */}
        <div className="rounded-xl border border-stone-300 bg-stone-900 p-5 text-white space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-stone-400" />
            <span>Practice Directive</span>
          </span>
          <p className="text-sm sm:text-base font-medium leading-relaxed">
            {exercise.prompt}
          </p>
          <QuestionTranslator questionText={exercise.prompt} variant="dark" />
        </div>

        {/* Constraints & Framework Recommendations */}
        <div className="grid sm:grid-cols-2 gap-4 text-xs">
          {exercise.recommendedFramework && (
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
              <span className="font-bold text-stone-900 block flex items-center gap-1.5 mb-1">
                <Layers className="h-3.5 w-3.5 text-stone-700" />
                <span>Recommended Framework:</span>
              </span>
              <span className="font-semibold text-stone-800">{exercise.recommendedFramework}</span>
            </div>
          )}

          {exercise.constraints && exercise.constraints.length > 0 && (
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-3.5">
              <span className="font-bold text-stone-900 block mb-1">Constraints:</span>
              <ul className="list-disc list-inside space-y-0.5 text-stone-700">
                {exercise.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ERROR ALERT */}
      {errorMessage && (
        <div className="flex items-start gap-2 rounded-xl bg-red-50 p-4 text-xs font-medium text-red-800 border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Choice exercise layout */}
      {isChoiceExercise ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Select Your Response Strategy:
          </h3>

          <div className="space-y-3">
            {exercise.choices!.map((choice) => {
              const isSelected = selectedChoiceId === choice.id;
              return (
                <div
                  key={choice.id}
                  onClick={() => handleChoiceSelect(choice.id)}
                  className={`rounded-xl border p-5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-stone-900 bg-stone-50 ring-1 ring-stone-900'
                      : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-stone-900">{choice.label}</h4>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  </div>

                  <p className="mt-2 text-xs sm:text-sm text-stone-700 italic">
                    "{choice.explanation}"
                  </p>

                  {/* If selected, show psychological insight */}
                  {isSelected && (
                    <div className="mt-3 rounded-lg bg-stone-100 p-3 text-xs text-stone-800 border border-stone-200">
                      <span className="font-bold text-stone-900 block mb-0.5">
                        Psychological Insight:
                      </span>
                      {choice.psychologicalInsight}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Spoken vs Written Response Section */
        <div className="space-y-4">
          {/* Mode Selector */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-xl bg-stone-200 p-1">
              <button
                type="button"
                id="mode-toggle-text"
                onClick={() => setInputMode('TEXT')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  inputMode === 'TEXT'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>Written Delivery</span>
              </button>
              <button
                type="button"
                id="mode-toggle-audio"
                onClick={() => setInputMode('AUDIO_TRANSCRIPT')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  inputMode === 'AUDIO_TRANSCRIPT'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Vocal Recording</span>
              </button>
            </div>

            <div className="text-xs font-medium text-stone-500">
              {wordCount} words
            </div>
          </div>

          {/* Voice input mode */}
          {inputMode === 'AUDIO_TRANSCRIPT' && (
            <AudioRecorder
              disabled={isSubmitting}
              onTranscriptionComplete={handleVoiceTranscription}
            />
          )}

          {/* Text editor */}
          <div className="space-y-2">
            <textarea
              id="practice-response-textarea"
              rows={6}
              disabled={isSubmitting}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Speak or compose your answer here. Remember: Anchor your point first, support with reasons and concrete evidence, and conclude decisively..."
              className="w-full rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-900 shadow-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:opacity-60 placeholder:text-stone-400 leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Bottom Submission Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200 pt-6">
        <span className="text-xs text-stone-500">
          Evaluated against clarity, cognitive structure, and rhetorical persuasion.
        </span>

        <button
          type="button"
          id="practice-submit-btn"
          disabled={isSubmitting}
          onClick={handleSubmit}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-7 py-3 text-xs font-bold text-white hover:bg-stone-800 transition-colors shadow-sm disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>Analyzing Communication Structure...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Submit for AI Evaluation</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
