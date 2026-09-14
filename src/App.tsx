import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProgressProvider } from './context/ProgressContext';
import { JourneyProvider } from './context/JourneyContext';
import { GameHUD } from './components/common/GameHUD';
import { GameProfileModal } from './components/profile/GameProfileModal';
import { Navbar } from './components/common/Navbar';
import { AchievementToast } from './components/common/AchievementToast';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { OnboardingFlow } from './components/auth/OnboardingFlow';
import { AuthCallback } from './components/auth/AuthCallback';
import { NormalAIExperience } from './components/normal_ai/NormalAIExperience';
import { HomeDashboard } from './components/home/HomeDashboard';
import { JourneyMap } from './components/journey/JourneyMap';
import { MasteryLessonPlayer } from './components/journey/MasteryLessonPlayer';
import { CurriculumOverview } from './components/learn/CurriculumOverview';
import { FrameworksLibrary } from './components/frameworks/FrameworksLibrary';
import { PracticeArena } from './components/practice/PracticeArena';
import { ProgressView } from './components/progress/ProgressView';
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';

function parseUrlRoute(): { tab: string; levelId: number | null } {
  if (typeof window === 'undefined') return { tab: 'journey', levelId: null };

  const pathname = window.location.pathname;
  const searchParams = new URLSearchParams(window.location.search);

  // 1. Check for /practice/:levelId, /journey/:levelId, /level/:levelId
  const levelMatch = pathname.match(/^\/(?:practice|journey|level)\/(\d+)/i) || searchParams.get('level') || searchParams.get('practice');
  if (levelMatch) {
    const rawId = typeof levelMatch === 'string' ? levelMatch : levelMatch[1];
    const parsedId = parseInt(rawId, 10);
    if (!isNaN(parsedId) && parsedId >= 1 && parsedId <= 75) {
      return { tab: 'journey', levelId: parsedId };
    }
  }

  // 2. Check for explicit tab names in pathname
  const tabMatch = pathname.match(/^\/([a-zA-Z0-9_-]+)/i);
  if (tabMatch) {
    const matchedTab = tabMatch[1].toLowerCase();
    const validTabs = [
      'journey',
      'home',
      'learn',
      'frameworks',
      'practice',
      'progress',
      'profile',
      'normal-ai',
      'login',
      'signup',
      'landing'
    ];
    if (validTabs.includes(matchedTab)) {
      return { tab: matchedTab, levelId: null };
    }
  }

  return { tab: 'journey', levelId: null };
}

function AppContent() {
  const { user, isLoading } = useAuth();
  const initialRoute = React.useMemo(() => parseUrlRoute(), []);
  const [currentTab, setCurrentTab] = useState<string>(initialRoute.tab);
  const [activeJourneyLevel, setActiveJourneyLevel] = useState<number | null>(initialRoute.levelId);
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>(undefined);
  const [practicePrefill, setPracticePrefill] = useState<{ prompt?: string; framework?: string; levelNumber?: number }>({});
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [authEmailPrefill, setAuthEmailPrefill] = useState<string>('');

  // Router-safe URL navigation and history update
  const navigateTo = React.useCallback((tab: string, levelId: number | null = null, replace: boolean = false) => {
    setCurrentTab(tab);
    setActiveJourneyLevel(levelId);

    if (typeof window !== 'undefined') {
      let targetPath = '/';
      if (tab === 'journey') {
        targetPath = levelId ? `/practice/${levelId}` : '/journey';
      } else if (tab === 'home') {
        targetPath = '/home';
      } else {
        targetPath = `/${tab}`;
      }

      if (replace) {
        window.history.replaceState({ tab, levelId }, document.title, targetPath);
      } else {
        window.history.pushState({ tab, levelId }, document.title, targetPath);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Listen for browser back / forward button changes
  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.tab === 'string') {
        setCurrentTab(e.state.tab);
        setActiveJourneyLevel(e.state.levelId ?? null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const route = parseUrlRoute();
      setCurrentTab(route.tab);
      setActiveJourneyLevel(route.levelId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check if we are handling an OAuth callback from Supabase/Google
  const isCallbackUrl =
    window.location.pathname.includes('/auth/callback') ||
    window.location.search.includes('code=') ||
    window.location.hash.includes('access_token=') ||
    (window.location.search.includes('error=') && !window.location.pathname.includes('/api'));

  // Redirect authenticated user away from public/auth screens
  React.useEffect(() => {
    if (user && (currentTab === 'login' || currentTab === 'signup' || currentTab === 'landing')) {
      const route = parseUrlRoute();
      if (route.tab !== 'login' && route.tab !== 'signup' && route.tab !== 'landing') {
        setCurrentTab(route.tab);
        setActiveJourneyLevel(route.levelId);
      } else {
        navigateTo('journey', null, true);
      }
    }
  }, [user, currentTab, navigateTo]);

  if (isCallbackUrl) {
    return (
      <AuthCallback
        onSuccess={(isNewUser) => {
          if (isNewUser) {
            setCurrentTab('journey');
          } else {
            setCurrentTab('journey');
          }
        }}
        onError={(err) => {
          console.warn('OAuth callback error:', err);
          setCurrentTab('login');
        }}
        onBackToLogin={() => {
          window.history.replaceState({}, document.title, '/');
          setCurrentTab('login');
        }}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center text-zinc-800">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white font-display font-bold text-base shadow-sm">
            CM
          </div>
          <span className="text-xs font-mono font-medium tracking-wider text-zinc-500 uppercase">
            Loading Communication Mastery...
          </span>
        </div>
      </div>
    );
  }

  // Not logged in view
  if (!user) {
    if (currentTab === 'login') {
      return (
        <LoginPage
          initialEmail={authEmailPrefill}
          onSuccess={() => setCurrentTab('journey')}
          onSwitchToSignup={(email) => {
            if (email) setAuthEmailPrefill(email);
            setCurrentTab('signup');
          }}
          onBackToLanding={() => setCurrentTab('landing')}
        />
      );
    }
    if (currentTab === 'signup') {
      return (
        <SignupPage
          initialEmail={authEmailPrefill}
          onSuccess={() => setCurrentTab('journey')}
          onSwitchToLogin={(email) => {
            if (email) setAuthEmailPrefill(email);
            setCurrentTab('login');
          }}
          onBackToLanding={() => setCurrentTab('landing')}
        />
      );
    }
    if (currentTab === 'frameworks') {
      return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-zinc-900">
          <Navbar currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} />
          <main className="flex-1">
            <FrameworksLibrary
              onPracticeFramework={(_fw, prompt) => {
                setPracticePrefill({ prompt });
                setCurrentTab('login');
              }}
            />
          </main>
        </div>
      );
    }

    // Default public landing page
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-zinc-900">
        <Navbar currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)} />
        <main className="flex-1">
          <LandingPage
            onStartLearning={() => setCurrentTab('signup')}
            onSignIn={() => setCurrentTab('login')}
            onExploreFrameworks={() => setCurrentTab('frameworks')}
          />
        </main>
      </div>
    );
  }

  // Logged in but hasn't completed purposeful onboarding
  if (!user.isOnboarded) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setCurrentTab('journey');
        }}
      />
    );
  }

  // Normal AI Screen when requested via tab
  if (currentTab === 'normal-ai') {
    return (
      <NormalAIExperience
        onOpenCommunicationMastery={() => {
          navigateTo('journey', null);
        }}
      />
    );
  }

  // Main Learning & Curriculum Workspace
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col text-zinc-900 selection:bg-zinc-200">
      {/* Game HUD */}
      <GameHUD
        currentView={currentTab}
        onNavigate={(tab) => {
          navigateTo(tab, null);
        }}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      <main className="flex-1 pb-24 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-4 sm:pt-6">
        {currentTab === 'journey' && (
          activeJourneyLevel ? (
            <MasteryLessonPlayer
              key={`mastery-level-${activeJourneyLevel}`}
              levelNumber={activeJourneyLevel}
              onBackToMap={() => navigateTo('journey', null)}
              onAdvanceToNextLevel={(next) => navigateTo('journey', next)}
            />
          ) : (
            <JourneyMap
              onSelectLevel={(lvl) => navigateTo('journey', lvl)}
            />
          )
        )}

        {currentTab === 'home' && (
          <HomeDashboard
            onNavigate={(tab, lessonId) => {
              navigateTo(tab, lessonId ? Number(lessonId) : null);
            }}
          />
        )}

        {currentTab === 'learn' && (
          <CurriculumOverview
            initialLessonId={targetLessonId}
            onGoToPractice={(exercisePrompt, levelNumber) => {
              const targetLvl = levelNumber || 1;
              if (exercisePrompt) {
                setPracticePrefill({ prompt: exercisePrompt, levelNumber: targetLvl });
              } else {
                setPracticePrefill({ levelNumber: targetLvl });
              }
              navigateTo('practice', targetLvl);
            }}
          />
        )}

        {currentTab === 'frameworks' && (
          <FrameworksLibrary
            onPracticeFramework={(frameworkName, promptText) => {
              setPracticePrefill({ framework: frameworkName, prompt: promptText });
              navigateTo('practice', null);
            }}
          />
        )}

        {currentTab === 'practice' && (
          practicePrefill.levelNumber ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono font-bold text-[11px] border border-amber-500/20">
                    Level {practicePrefill.levelNumber}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">Practice Tab:</span>
                  <span>3 Mandatory Sequential Exercises for this Lesson</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPracticePrefill({});
                    navigateTo('practice', null);
                  }}
                  className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 underline cursor-pointer"
                >
                  ← Return to Freeform Practice Scenarios
                </button>
              </div>

              <MasteryLessonPlayer
                key={`practice-mandatory-${practicePrefill.levelNumber}`}
                levelNumber={practicePrefill.levelNumber}
                onBackToMap={() => {
                  setPracticePrefill({});
                  navigateTo('practice', null);
                }}
                onAdvanceToNextLevel={(next) => {
                  setPracticePrefill((prev) => ({ ...prev, levelNumber: next }));
                  navigateTo('practice', next);
                }}
              />
            </div>
          ) : (
            <PracticeArena
              initialPrompt={practicePrefill.prompt}
              initialFramework={practicePrefill.framework}
              onLaunchMandatoryExercises={(lvl) => {
                setPracticePrefill({ levelNumber: lvl || 1 });
                navigateTo('practice', lvl || 1);
              }}
            />
          )
        )}

        {currentTab === 'progress' && <ProgressView />}

        {currentTab === 'profile' && <ProfileSettingsView />}
      </main>

      {/* Game Profile & Achievements Modal */}
      <GameProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSelectLevel={(lvl) => {
          setIsProfileModalOpen(false);
          navigateTo('journey', lvl);
        }}
      />

      <AchievementToast />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProgressProvider>
        <JourneyProvider>
          <AppContent />
        </JourneyProvider>
      </ProgressProvider>
    </AuthProvider>
  );
}
