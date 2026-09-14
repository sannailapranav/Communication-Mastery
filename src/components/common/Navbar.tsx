import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProgress } from '../../context/ProgressContext';
import { useJourney } from '../../context/JourneyContext';
import {
  Compass,
  BookOpen,
  Target,
  BarChart3,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Flame,
  Layers
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const { user, logout } = useAuth();
  const { stats } = useProgress();
  const { journeyState } = useJourney();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'journey', label: 'Mastery Journey', icon: Compass },
    { id: 'home', label: 'Dashboard', icon: BarChart3 },
    { id: 'practice', label: 'Practice Arena', icon: Target },
    { id: 'frameworks', label: 'Frameworks', icon: Sparkles },
    { id: 'progress', label: 'Progress & Stats', icon: Layers }
  ];

  const currentLevelNum = journeyState?.currentLevel || 1;
  const currentStage = journeyState?.stages.find(s => s.stageNumber === (journeyState ? Math.ceil(currentLevelNum / 9) : 1));

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-stone-50/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <div
          id="nav-brand-logo"
          onClick={() => handleNavClick(user ? 'home' : 'landing')}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-900 text-stone-50 shadow-sm">
            <span className="text-base font-bold tracking-tight">CM</span>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-stone-900">
              Communication Mastery
            </span>
            <span className="hidden text-xs text-stone-500 sm:inline-block sm:ml-2 font-normal">
              Frameworks & Psychology
            </span>
          </div>
        </div>

        {/* Desktop Navigation for Authenticated User */}
        {user ? (
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-stone-900 text-white'
                      : 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        ) : (
          <div className="hidden md:flex items-center space-x-4">
            <button
              id="nav-btn-signin"
              onClick={() => onNavigate('login')}
              className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
            >
              Sign In
            </button>
            <button
              id="nav-btn-signup"
              onClick={() => onNavigate('signup')}
              className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-stone-800 transition-colors"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* Right Section: Streak & User Profile */}
        {user ? (
          <div className="hidden md:flex items-center space-x-3">
            {journeyState && (
              <button
                onClick={() => handleNavClick('journey')}
                className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-amber-800 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                title="Your current Mastery Level"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>Level {currentLevelNum}</span>
              </button>
            )}

            {stats && stats.streakDays > 0 && (
              <div
                title="Active streak"
                className="flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200"
              >
                <Flame className="h-3.5 w-3.5 text-amber-600" />
                <span>{stats.streakDays}d Streak</span>
              </div>
            )}

            <button
              id="nav-btn-profile"
              onClick={() => onNavigate('profile')}
              className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                currentTab === 'profile'
                  ? 'bg-stone-200 text-stone-900'
                  : 'text-stone-700 hover:bg-stone-200/60'
              }`}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-300 text-stone-700 text-xs font-semibold">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">{user.displayName}</span>
            </button>

            <button
              id="nav-btn-logout"
              onClick={logout}
              title="Sign Out"
              className="rounded-lg p-2 text-stone-500 hover:bg-stone-200/60 hover:text-stone-800 transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            id="nav-btn-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-stone-600 hover:bg-stone-200 hover:text-stone-900"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-b border-stone-200 bg-stone-50 px-4 pt-2 pb-5 md:hidden space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-3 border-b border-stone-200 pb-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-stone-300 font-semibold text-stone-800">
                  {user.displayName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-900">{user.displayName}</p>
                  <p className="text-xs text-stone-500">{user.email}</p>
                </div>
              </div>

              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <button
                onClick={() => handleNavClick('profile')}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-200"
              >
                <User className="h-4 w-4" />
                <span>Profile & Settings</span>
              </button>

              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <button
                onClick={() => handleNavClick('login')}
                className="w-full rounded-lg border border-stone-300 py-2.5 text-center text-sm font-semibold text-stone-800 hover:bg-stone-100"
              >
                Sign In
              </button>
              <button
                onClick={() => handleNavClick('signup')}
                className="w-full rounded-lg bg-stone-900 py-2.5 text-center text-sm font-semibold text-white hover:bg-stone-800"
              >
                Start Learning
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
