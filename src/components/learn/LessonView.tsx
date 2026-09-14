import React, { useState } from 'react';
import { Lesson, LearningModule, LessonSection } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Target,
  ArrowRight,
  Brain,
  Quote
} from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  module: LearningModule;
  onBack: () => void;
  onGoToPractice: (exercisePrompt?: string, levelNumber?: number) => void;
  onNextLesson?: () => void;
}

interface NormalizedSection {
  id: string;
  type: string;
  title: string;
  content: string;
  takeaway: string;
  psychologicalInsight: string;
  dialogue?: Array<{
    speaker: string;
    role?: string;
    text: string;
    tone?: string;
    critique?: string;
  }>;
}

function getSectionTypeByIndex(idx: number): string {
  const types = [
    'understand',
    'why_it_matters',
    'real_situation',
    'breakdown',
    'framework',
    'better_communication',
    'reflection',
    'practice'
  ];
  return types[idx] || 'concept';
}

function getDefaultSectionTitle(idx: number, lessonTitle: string): string {
  const titles = [
    'What Is True Communication?',
    'Why It Matters in Everyday Life',
    'Real Situation: Unconscious vs Mastered Delivery',
    'Psychological Breakdown & Ego Defenses',
    'The Core Communication Framework',
    'What Better Communication Looks Like',
    'Self-Observation & Metacognitive Reflection',
    'Interactive Practice & Application'
  ];
  return titles[idx] || `Section ${idx + 1}: ${lessonTitle}`;
}

function getDefaultSectionContent(idx: number, lesson: Lesson): string {
  switch (idx) {
    case 0:
      return (
        lesson.summary ||
        'Many people believe communication is simply the act of vocalizing words or demonstrating an extensive vocabulary. In reality, speaking is merely an output, but communication is a shared connection. True communication only occurs when the meaning in the listener\'s mind matches the intention in your mind. The listener filters every phrase through their mood, biases, assumptions, and cognitive bandwidth.'
      );
    case 1:
      return 'When we equate "saying something" with "communicating it", friction is inevitable. In high-stakes interviews, anxious candidates over-explain and lose engagement. In personal relationships, unexamined phrasing creates defensiveness. In team environments, ambiguous instructions cost dozens of wasted hours. Learning to communicate intentionally transforms you from a nervous speaker into a grounded, magnetic communicator.';
    case 2:
      return 'Observe what happens when an individual is asked a direct status or opinion question under pressure. Notice how an unexamined response leads to stream-of-consciousness rambling, defensive effort narration, and lost executive presence.';
    case 3:
      return 'When placed under social pressure or evaluation, our nervous system perceives social vulnerability as physical danger. To protect our ego from appearing incompetent or unprepared, we instinctively engage in defensive narration: detailing every obstacle and effort instead of providing a direct, calm answer.';
    case 4:
      return (
        lesson.keyFramework
          ? `Master the ${lesson.keyFramework} framework:\n\n1. Conclusion First (State your bottom line immediately)\n2. Primary Rationale (Deliver the single most compelling reason)\n3. Tangible Evidence (Ground it with an example)\n4. Next Step / Action Close (Provide forward momentum)`
          : 'Whenever you communicate under pressure, apply structured thinking:\n\n1. Direct Answer / Status First (Do not bury the lead)\n2. Context & Core Constraint (Explain the primary driver without victim language)\n3. Concrete Timeline or Next Step (Reassure the listener with clarity)'
      );
    case 5:
      return 'Notice the dramatic difference when a speaker grounds their posture, eliminates defensive filler words, and delivers the answer directly. Even when the reality is challenging, calm delivery immediately commands trust and psychological safety.';
    case 6:
      return 'Think back to your last few conversations—in meetings, casual phone calls, or discussions at home. Did you answer direct questions with clarity, or did you justify your effort with unnecessary backstory? What anxiety triggered your urge to over-explain?';
    case 7:
      return (
        lesson.interactivePrompt?.prompt ||
        lesson.practicePrompt ||
        'Apply these principles directly in a simulated challenge: A colleague or counterpart asks you for an urgent update while you are facing tight constraints. Formulate a structured, calm response that delivers the conclusion first.'
      );
    default:
      return lesson.summary || 'Focus on clarity, brevity, and listener resonance.';
  }
}

function getDefaultSectionTakeaway(idx: number, type: string, lesson: Lesson): string {
  switch (type) {
    case 'understand':
      return 'Speaking is what you say; communication is what the other person hears, interprets, and retains.';
    case 'why_it_matters':
      return 'Your effectiveness in career, relationships, and leadership is directly bounded by your ability to transmit uncorrupted meaning.';
    case 'real_situation':
      return 'Notice when you speak to justify your effort rather than to inform and serve your listener.';
    case 'breakdown':
      return 'Silence is not empty; it is the physical space where poise, authority, and emotional maturity reside.';
    case 'framework':
      return 'Start with the answer, not the story of how you found it. Respect your listener\'s cognitive bandwidth.';
    case 'better_communication':
      return 'Directness delivered with warmth commands respect; vagueness delivered with anxiety invites dismissal.';
    case 'reflection':
      return 'Self-observation without judgment is the fastest pathway to lasting communication mastery.';
    case 'practice':
      return 'Communication is a neuromuscular motor skill. Deliberate simulated practice rewires your default fear reflexes.';
    default:
      return lesson.coreTakeaway || lesson.summary || 'Structure your thoughts with clarity and deliver with poise.';
  }
}

function getDefaultPsychologicalInsight(idx: number, type: string, lesson: Lesson): string {
  switch (type) {
    case 'understand':
      return 'Egocentric Speech: The human brain naturally assumes what is obvious in our own head is obvious to others. True mastery requires bridging this perceptual gap.';
    case 'why_it_matters':
      return 'Emotional Leakage: Unconscious speakers let their private anxieties dictate phrasing and pace, creating friction without realizing it.';
    case 'real_situation':
      return 'The Justification Reflex: Under evaluation, our instinct is to prove how hard we worked rather than answering the core question directly.';
    case 'breakdown':
      return 'Perceived Threat Response: Social evaluation triggers the amygdala. Without awareness, this causes verbal flooding or anxious hedging.';
    case 'framework':
      return 'Working Memory Preservation: Human working memory can hold only 3 to 4 chunks at once. Structured delivery eliminates cognitive overload.';
    case 'better_communication':
      return 'Limbic Resonance: Listeners subconsciously mirror your emotional composure and vocal tone before evaluating your logic.';
    case 'reflection':
      return 'Metacognitive Detachment: Stepping back to observe your speech patterns allows your brain to safely reprogram instinctive habits.';
    case 'practice':
      return 'Neuro-associative Conditioning: Speaking structured thoughts aloud transforms intellectual knowledge into reflexive conversational mastery.';
    default:
      return lesson.psychologicalFocus || 'Calm composure under social scrutiny turns potential conflict into authoritative connection.';
  }
}

function normalizeLessonSections(lesson: Lesson): NormalizedSection[] {
  const rawList: any[] =
    (Array.isArray(lesson.sections) && lesson.sections.length > 0 ? lesson.sections : null) ||
    (Array.isArray(lesson.content) && lesson.content.length > 0 ? (lesson.content as any[]) : null) ||
    (Array.isArray(lesson.breakdown) && lesson.breakdown.length > 0 ? (lesson.breakdown as any[]) : null) ||
    [];

  // If completely empty or missing, generate all 8 full core sections
  if (rawList.length === 0) {
    return Array.from({ length: 8 }, (_, idx) => {
      const type = getSectionTypeByIndex(idx);
      const title = getDefaultSectionTitle(idx, lesson.title);
      const content = getDefaultSectionContent(idx, lesson);
      const takeaway = getDefaultSectionTakeaway(idx, type, lesson);
      const psychologicalInsight = getDefaultPsychologicalInsight(idx, type, lesson);

      const dialogue =
        idx === 2
          ? [
              {
                speaker: 'Colleague / Manager',
                role: 'Team Counterpart',
                text: 'Do you have the numbers ready for today\'s client meeting?',
                tone: 'Direct, busy'
              },
              {
                speaker: 'Unconscious Delivery (Weak)',
                role: 'Speaker',
                text: 'Well, so basically yesterday I opened the sheets and there was a data mismatch from marketing, so I had to message Sarah, but she was in back-to-back reviews, so I re-ran the script, but I think most of it is alright now...',
                tone: 'Rambling, defensive',
                critique: 'Narrates internal struggle and effort instead of delivering the clear status and ETA.'
              }
            ]
          : idx === 5
          ? [
              {
                speaker: 'Conscious Delivery (Mastery)',
                role: 'Speaker',
                text: 'The numbers are 90% finalized and will be in your inbox by 2 PM. We resolved a minor data discrepancy with marketing this morning.',
                tone: 'Calm, structured, decisive',
                critique: 'Immediate answer first, concise context without victim language, and a firm commitment.'
              }
            ]
          : undefined;

      return {
        id: `fallback-sec-${idx + 1}`,
        type,
        title,
        content,
        takeaway,
        psychologicalInsight,
        dialogue
      };
    });
  }

  // Normalize existing sections and ensure every section has title, content, takeaway, and psychologicalInsight
  return rawList.map((sec: any, idx: number) => {
    const type = sec.type || getSectionTypeByIndex(idx);
    const title = sec.title || sec.heading || sec.name || getDefaultSectionTitle(idx, lesson.title);
    const content = sec.content || sec.body || sec.text || sec.description || getDefaultSectionContent(idx, lesson);
    const takeaway = sec.takeaway || sec.keyTakeaway || getDefaultSectionTakeaway(idx, type, lesson);
    const psychologicalInsight =
      sec.psychologicalInsight ||
      sec.insight ||
      getDefaultPsychologicalInsight(idx, type, lesson);

    return {
      id: sec.id || `sec-${idx + 1}`,
      type,
      title,
      content,
      takeaway,
      psychologicalInsight,
      dialogue: sec.dialogue
    };
  });
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  module,
  onBack,
  onGoToPractice,
  onNextLesson
}) => {
  const { isLessonCompleted, completeLesson } = useProgress();
  const [isMarking, setIsMarking] = useState(false);
  const isCompleted = isLessonCompleted(lesson.id);

  const handleComplete = async () => {
    if (isCompleted) return;
    setIsMarking(true);
    try {
      await completeLesson(lesson.id, module.id);
    } catch (err) {
      console.error('Failed to mark lesson completed:', err);
    } finally {
      setIsMarking(false);
    }
  };

  const fundamentalTruth =
    lesson.coreTakeaway ||
    lesson.fundamentalTruth ||
    lesson.sections?.[0]?.takeaway ||
    lesson.psychologicalFocus ||
    lesson.summary ||
    'Speaking is what you say; communication is what the other person hears and absorbs.';

  const sections = normalizeLessonSections(lesson);
  const targetLevelNumber = module.levelNumber || 1;

  const handleStartPractice = () => {
    const practicePrompt =
      lesson.interactivePrompt?.prompt ||
      lesson.practicePrompt ||
      sections.find((s) => s.type === 'practice')?.content ||
      lesson.title;
    onGoToPractice(practicePrompt, targetLevelNumber);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 pb-24 text-slate-900">
      {/* Top Breadcrumb Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 text-slate-600" />
          <span>Back to {module.title}</span>
        </button>

        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Lesson Completed</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
              <Clock className="h-3.5 w-3.5 text-slate-500" />
              <span>In Progress</span>
            </span>
          )}
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-3">
        {/* Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800">
            {module.levelName || module.level || `Level ${targetLevelNumber} - Foundations`}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800">
            <Clock className="h-3.5 w-3.5 text-slate-600" />
            <span>{lesson.estimatedMinutes || 8} min deep dive</span>
          </span>
          {lesson.keyFramework && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900">
              <span className="font-normal text-amber-800">Framework:</span>
              <span className="font-bold">{lesson.keyFramework}</span>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
          {lesson.title}
        </h1>

        <p className="text-base text-slate-700 leading-relaxed font-normal max-w-3xl">
          {lesson.summary}
        </p>
      </div>

      {/* THE FUNDAMENTAL TRUTH Callout */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-800 border border-amber-200">
            <Quote className="h-5 w-5" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                The Fundamental Truth
              </span>
              {lesson.keyFramework && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200">
                  {lesson.keyFramework}
                </span>
              )}
            </div>
            <p className="text-lg sm:text-xl font-serif italic text-slate-900 leading-snug">
              "{fundamentalTruth}"
            </p>
          </div>
        </div>

        {lesson.psychologicalFocus && (
          <div className="border-t border-slate-200 pt-3.5 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-900 font-semibold">
              Psychological Focus:
            </span>
            <span className="text-slate-700">
              {lesson.psychologicalFocus}
            </span>
          </div>
        )}
      </div>

      {/* All 8 Core Sections - Matching Curriculum List Item Card Style */}
      <div>
        {sections.map((section, idx) => {
          const isPracticeSec = section.type === 'practice' || idx === 7;
          return (
            <div
              key={section.id || idx}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 mb-4 space-y-4"
            >
              {/* Section Header with Minimal Muted Pill */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold text-slate-800 border border-slate-200">
                    <span>Section {idx + 1} of {sections.length}</span>
                    <span className="text-slate-400">·</span>
                    <span className="capitalize">{section.type.replace(/_/g, ' ')}</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  {section.title}
                </h2>
              </div>

              {/* Section Main Content */}
              {section.content && (
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed font-normal">
                  {section.content}
                </p>
              )}

              {/* Dialogue Showcase (If present) */}
              {section.dialogue && section.dialogue.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 block">
                    Dialogue in Context
                  </span>
                  <div className="grid gap-3">
                    {section.dialogue.map((d, dIdx) => {
                      const isWeak =
                        d.speaker.toLowerCase().includes('weak') ||
                        d.speaker.toLowerCase().includes('unconscious');
                      return (
                        <div
                          key={dIdx}
                          className={`rounded-xl p-4 border space-y-2 ${
                            isWeak
                              ? 'bg-rose-50 border-rose-200'
                              : 'bg-emerald-50 border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              {isWeak ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              )}
                              <span>{d.speaker}</span>
                              {d.role && (
                                <span className="text-xs font-normal text-slate-600">
                                  ({d.role})
                                </span>
                              )}
                            </span>
                            {d.tone && (
                              <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                                Tone: {d.tone}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-slate-800 font-medium italic leading-relaxed">
                            "{d.text}"
                          </p>

                          {d.critique && (
                            <div className="pt-2 border-t border-slate-200 text-xs text-slate-700">
                              <strong className={isWeak ? 'text-rose-800' : 'text-emerald-800'}>
                                {isWeak ? 'Critique: ' : 'Why It Works: '}
                              </strong>
                              <span>{d.critique}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Takeaway Box */}
              {section.takeaway && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Key Takeaway</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-800 font-medium">
                    {section.takeaway}
                  </p>
                </div>
              )}

              {/* Psychological Insight Box */}
              {section.psychologicalInsight && (
                <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-slate-800 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900">
                    <Brain className="w-3.5 h-3.5 text-slate-700" />
                    <span>Psychological Insight</span>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">
                    {section.psychologicalInsight}
                  </p>
                </div>
              )}

              {/* If practice section, provide immediate quick action button */}
              {isPracticeSec && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartPractice}
                    className="inline-flex items-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Start Practice for this Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Realistic Communication Comparison (if specified on lesson) */}
      {lesson.realisticExample && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span>Realistic Contrast in Action</span>
          </h2>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-800">
            <strong>Context:</strong> {lesson.realisticExample.context}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Weak / Unconscious */}
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                <AlertTriangle className="h-4 w-4 text-rose-600" />
                <span>Unconscious / Weak Delivery</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 italic leading-relaxed">
                "{lesson.realisticExample.weakResponse}"
              </p>
              <div className="border-t border-rose-200 pt-2.5 text-xs text-rose-800">
                <strong>Critique:</strong> {lesson.realisticExample.critique}
              </div>
            </div>

            {/* Strong / Mastered */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Mastered / Conscious Delivery</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                "{lesson.realisticExample.strongResponse}"
              </p>
              <div className="border-t border-emerald-200 pt-2.5 text-xs text-emerald-800">
                <strong>Why It Works:</strong> {lesson.realisticExample.breakdown}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prominent Direct Bottom CTA: 'Start Practice for this Lesson' */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
              <Target className="w-3.5 h-3.5 text-amber-700" />
              <span>Practice Application</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Ready to test this lesson in the Practice Tab?
            </h3>
            <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
              Step directly into the 3 sequential mandatory exercises tailored to this lesson. Speak or type your response, and receive instant diagnostic scoring and psychological feedback.
            </p>
          </div>

          <button
            id="start-practice-for-this-lesson-btn"
            type="button"
            onClick={handleStartPractice}
            className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-6 py-3.5 text-xs font-bold uppercase tracking-wider active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span>Start Practice for this Lesson</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion & Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6">
        <button
          onClick={onBack}
          className="text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
        >
          ← Back to Curriculum
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {!isCompleted ? (
            <button
              id="lesson-complete-btn"
              disabled={isMarking}
              onClick={handleComplete}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>{isMarking ? 'Saving Progress...' : 'Mark Lesson as Completed'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Lesson Finished
              </span>
              {onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

