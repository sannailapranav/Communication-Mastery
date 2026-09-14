import React, { useState } from 'react';
import { CURRICULUM_MODULES } from '../../data/curriculum';
import { Lesson, LearningModule } from '../../types';
import { useProgress } from '../../context/ProgressContext';
import { LessonView } from './LessonView';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface CurriculumOverviewProps {
  initialLessonId?: string;
  onGoToPractice: (exercisePrompt?: string, levelNumber?: number) => void;
}

export const CurriculumOverview: React.FC<CurriculumOverviewProps> = ({
  initialLessonId,
  onGoToPractice
}) => {
  const { isLessonCompleted } = useProgress();

  // Find initial lesson if specified
  const getInitialLesson = () => {
    if (!initialLessonId) return null;
    for (const mod of CURRICULUM_MODULES) {
      const found = mod.lessons.find(l => l.id === initialLessonId);
      if (found) return { lesson: found, module: mod };
    }
    return null;
  };

  const [activeSelection, setActiveSelection] = useState<{
    lesson: Lesson;
    module: LearningModule;
  } | null>(getInitialLesson);

  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>('ALL');

  if (activeSelection) {
    // Find next lesson in the curriculum
    let nextItem: { lesson: Lesson; module: LearningModule } | null = null;
    let foundCurrent = false;

    for (const mod of CURRICULUM_MODULES) {
      for (const les of mod.lessons) {
        if (foundCurrent) {
          nextItem = { lesson: les, module: mod };
          break;
        }
        if (les.id === activeSelection.lesson.id) {
          foundCurrent = true;
        }
      }
      if (nextItem) break;
    }

    return (
      <LessonView
        lesson={activeSelection.lesson}
        module={activeSelection.module}
        onBack={() => setActiveSelection(null)}
        onGoToPractice={onGoToPractice}
        onNextLesson={nextItem ? () => {
          setActiveSelection(nextItem);
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } : undefined}
      />
    );
  }

  const filteredModules =
    selectedLevelFilter === 'ALL'
      ? CURRICULUM_MODULES
      : CURRICULUM_MODULES.filter(m => m.level === selectedLevelFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-md bg-stone-200 px-2.5 py-0.5 text-xs font-semibold text-stone-800">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Full Curriculum Progression</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              Structured Communication Curriculum
            </h1>
            <p className="mt-1 text-sm text-stone-600 max-w-2xl">
              Master each level sequentially. Deep psychological theory paired with realistic breakdowns and immediate practical drills.
            </p>
          </div>

          {/* Level Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {['ALL', 'Level 1 — Foundations', 'Level 2 — Conversation Mastery', 'Level 3 — Frameworks', 'Level 4 — Advanced'].map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedLevelFilter(lvl)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  selectedLevelFilter === lvl
                    ? 'bg-stone-900 text-white'
                    : 'border border-stone-200 bg-white text-stone-700 hover:bg-stone-100'
                }`}
              >
                {lvl === 'ALL' ? 'All Modules' : lvl.split(' — ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {filteredModules.map((module) => {
          const completedCount = module.lessons.filter(l => isLessonCompleted(l.id)).length;
          const totalCount = module.lessons.length;
          const isModuleComplete = completedCount === totalCount && totalCount > 0;

          return (
            <div
              key={module.id}
              className="rounded-2xl border border-stone-200 bg-white shadow-sm overflow-hidden"
            >
              {/* Module Header Bar */}
              <div className="border-b border-stone-100 bg-stone-50/80 px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-stone-900 px-2 py-0.5 text-xs font-bold text-white">
                      {module.level}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {completedCount} of {totalCount} completed
                    </span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold text-stone-900">
                    {module.title}
                  </h2>
                  <p className="mt-0.5 text-xs text-stone-600">{module.description}</p>
                </div>

                {isModuleComplete && (
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200 shrink-0">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Module Mastered</span>
                  </div>
                )}
              </div>

              {/* Lesson Items */}
              <div className="divide-y divide-stone-100">
                {module.lessons.map((lesson, idx) => {
                  const completed = isLessonCompleted(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      id={`lesson-card-${lesson.id}`}
                      onClick={() => setActiveSelection({ lesson, module })}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 hover:bg-stone-50/90 cursor-pointer transition-colors gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                            completed
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-stone-100 text-stone-700 border border-stone-200'
                          }`}
                        >
                          {completed ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : `${idx + 1}`}
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-stone-900 group-hover:text-stone-950 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-stone-600 line-clamp-2 max-w-3xl">
                            {lesson.summary}
                          </p>
                          <div className="mt-2 flex items-center gap-3 text-xs text-stone-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {lesson.estimatedMinutes || 7} mins
                            </span>
                            <span>•</span>
                            <span>{lesson.sections.length} core sections</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                        {completed ? (
                          <span className="text-xs font-semibold text-emerald-700">Review</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white group-hover:bg-stone-800">
                            <span>Start</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
