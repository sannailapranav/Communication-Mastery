import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, LearningLevel, CommunicationGoal } from '../types';
import { api, getStoredToken, getStoredUser, setStoredToken, setStoredUser } from '../services/api';
import {
  initializeSupabase,
  getSupabase,
  getGoogleOAuthUrl,
  signInWithGoogle as sbSignInWithGoogle,
  signInWithEmailPassword as sbSignInWithEmailPassword,
  signUpWithEmailPassword as sbSignUpWithEmailPassword,
  signOutSupabase,
  isSupabaseConfigured as checkSupabaseConfigured,
  getFriendlyOAuthErrorMessage
} from '../services/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isSupabaseConfigured: boolean;
  popupBlockedUrl: string | null;
  clearPopupBlockedUrl: () => void;
  redirectToGoogleAuth: (targetUrl?: string) => void;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<{ requiresEmailConfirmation: boolean }>;
  loginWithGoogle: (customRedirectUri?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  completeOnboarding: (
    level: LearningLevel,
    goals: CommunicationGoal[],
    motherTongue?: string,
    learningLanguage?: string,
    preferredAILanguage?: string,
    scriptPreference?: import('../types').ScriptPreference,
    conversationalStyle?: import('../types').ConversationalStyle
  ) => Promise<void>;
  clearError: () => void;
  syncSessionToken: (token: string) => Promise<UserProfile>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => getStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [popupBlockedUrl, setPopupBlockedUrl] = useState<string | null>(null);

  const clearPopupBlockedUrl = () => setPopupBlockedUrl(null);

  const redirectToGoogleAuth = (targetUrl?: string) => {
    const dest = targetUrl || popupBlockedUrl;
    if (!dest) return;
    console.log('[AuthContext] redirectToGoogleAuth navigating to:', dest);

    try {
      // Check if we are inside an iframe and try top-level navigation
      if (typeof window !== 'undefined' && window.top && window.top !== window) {
        window.top.location.href = dest;
        return;
      }
    } catch (e) {
      console.warn('[AuthContext] Top-level navigation was restricted by iframe sandbox:', e);
    }

    // Inside an iframe where top navigation is restricted:
    // Calling window.location.href inside an iframe triggers Google's X-Frame-Options: DENY!
    // Instead, open directly in a new window/tab to escape the iframe trap:
    if (typeof window !== 'undefined' && window.top !== window) {
      console.log('[AuthContext] Opening in new window/tab to avoid iframe X-Frame-Options trap');
      const win = window.open(dest, '_blank', 'noopener,noreferrer');
      if (!win) {
        setPopupBlockedUrl(dest);
      }
      return;
    }

    window.location.href = dest;
  };

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      // 1. Check Supabase readiness
      const ready = await initializeSupabase();
      if (isMounted) {
        setIsConfigured(ready);
      }

      const supabase = getSupabase();

      // 2. If Supabase is available, subscribe to official auth state changes
      if (ready && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.access_token) {
            setStoredToken(session.access_token);
            try {
              const profileRes = await api.syncSupabaseUser(session.access_token);
              if (isMounted) {
                setUser(profileRes.user);
                setIsLoading(false);
              }
            } catch (syncErr) {
              console.warn('Initial Supabase user sync error:', syncErr);
              // Fallback to getMe
              const profile = await api.getMe().catch(() => null);
              if (isMounted) {
                setUser(profile);
                setIsLoading(false);
              }
            }
          } else {
            // Check existing stored token
            const stored = getStoredToken();
            if (stored) {
              try {
                const me = await api.getMe();
                if (isMounted) setUser(me);
              } catch {
                api.logout();
                if (isMounted) setUser(null);
              }
            } else {
              api.logout();
              if (isMounted) setUser(null);
            }
            if (isMounted) setIsLoading(false);
          }
        } catch (err) {
          console.error('Error reading Supabase session:', err);
          if (isMounted) setIsLoading(false);
        }

        // Listen to live Supabase auth events
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!isMounted) return;

            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
              if (session?.access_token) {
                setStoredToken(session.access_token);
                try {
                  const sync = await api.syncSupabaseUser(session.access_token);
                  if (isMounted) setUser(sync.user);
                } catch {
                  const me = await api.getMe().catch(() => null);
                  if (isMounted && me) setUser(me);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              api.logout();
              if (isMounted) setUser(null);
            }
          }
        );

        return () => {
          subscription.unsubscribe();
        };
      } else {
        // Fallback for non-Supabase or unconfigured local mode
        const token = getStoredToken();
        if (token) {
          try {
            const freshUser = await api.getMe();
            if (isMounted) setUser(freshUser);
          } catch {
            api.logout();
            if (isMounted) setUser(null);
          }
        } else {
          api.logout();
          if (isMounted) setUser(null);
        }
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen for OAuth message from popups if any
    const handleWindowMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (event.data?.user) {
          setUser(event.data.user);
        } else {
          try {
            const fresh = await api.getMe();
            setUser(fresh);
          } catch (e) {
            console.error('Failed to get user after OAuth popup:', e);
          }
        }
      }
    };
    window.addEventListener('message', handleWindowMessage);

    const handleSessionExpired = () => {
      if (isMounted) {
        setUser(null);
        setIsLoading(false);
      }
      api.logout();
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);

    return () => {
      isMounted = false;
      window.removeEventListener('message', handleWindowMessage);
      window.removeEventListener('auth:session-expired', handleSessionExpired);
    };
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);

    const supabase = getSupabase();
    if (supabase) {
      try {
        const { session, error: sbError } = await sbSignInWithEmailPassword(email, pass);
        if (sbError || !session) {
          throw new Error(sbError || 'Invalid email or password.');
        }
        setStoredToken(session.access_token);
        const syncResult = await api.syncSupabaseUser(session.access_token);
        setUser(syncResult.user);
        return;
      } catch (err: any) {
        const actualError = err?.message || 'Invalid email or password.';
        setError(actualError);
        throw new Error(actualError);
      }
    }

    // Fallback if Supabase not configured
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    }
  };

  const signup = async (email: string, pass: string, name: string): Promise<{ requiresEmailConfirmation: boolean }> => {
    setError(null);
    console.log('[AuthContext] signup invoked for email:', email);

    const supabase = getSupabase();
    if (supabase) {
      try {
        console.log('[AuthContext] Executing sbSignUpWithEmailPassword...');
        const { session, user: sbUser, error: sbError } = await sbSignUpWithEmailPassword(email, pass, name);
        if (sbError) {
          if (sbError.toLowerCase().includes('already registered')) {
            console.warn('[AuthContext] Registration notice: User is already registered with this email.');
          } else {
            console.error('[AuthContext] Supabase signup returned error:', sbError);
          }
          throw new Error(sbError);
        }
        if (session) {
          console.log('[AuthContext] Supabase session acquired. Syncing user with backend database...');
          setStoredToken(session.access_token);
          try {
            const syncResult = await api.syncSupabaseUser(session.access_token);
            setUser(syncResult.user);
          } catch (syncErr) {
            console.warn('[AuthContext] syncSupabaseUser warning, using local profile state:', syncErr);
            setUser({
              id: session.user.id,
              email: session.user.email || email,
              displayName: name || (session.user.email ? session.user.email.split('@')[0] : 'Learner'),
              learningLevel: 'Beginner',
              goals: ['Speak English confidently', 'Improve conversations'],
              motherTongue: 'Telugu',
              learningLanguage: 'English',
              preferredAILanguage: 'Telugu (Tenglish)',
              scriptPreference: 'romanized',
              conversationalStyle: 'natural',
              locale: 'en-US',
              currentModule: 'communication-mastery',
              isOnboarded: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
          return { requiresEmailConfirmation: false };
        } else if (sbUser) {
          console.log('[AuthContext] User created; email confirmation required.');
          return { requiresEmailConfirmation: true };
        }
        return { requiresEmailConfirmation: false };
      } catch (err: any) {
        const actualMessage = err?.message || 'Registration failed';
        if (actualMessage.toLowerCase().includes('already registered')) {
          console.warn('[AuthContext.signup] Handled registered user status:', actualMessage);
        } else {
          console.error('[AuthContext.signup] Caught error during Supabase signup:', err);
        }
        setError(actualMessage);
        throw new Error(actualMessage);
      }
    }

    // Fallback if Supabase not configured
    try {
      console.log('[AuthContext] Supabase not available, using fallback API register...');
      const res = await api.register(email, pass, name);
      setUser(res.user);
      return { requiresEmailConfirmation: false };
    } catch (err: any) {
      console.error('[AuthContext.signup] Caught error during fallback registration:', err);
      const actualMessage = err?.message || 'Registration failed';
      setError(actualMessage);
      throw new Error(actualMessage);
    }
  };

  const loginWithGoogle = async (customRedirectUri?: string): Promise<void> => {
    setError(null);
    setPopupBlockedUrl(null);

    // Calculate center coordinates for the popup window
    const width = 520;
    const height = 660;
    const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
    const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

    console.log('[AuthContext] loginWithGoogle started. Opening popup placeholder...');

    // Open popup window immediately during user gesture to prevent browser popup blockers
    let popupWindow: Window | null = null;
    try {
      popupWindow = window.open(
        'about:blank',
        'google_oauth_popup',
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );
    } catch (e) {
      console.warn('[AuthContext] Initial popup creation exception:', e);
    }

    if (popupWindow) {
      try {
        popupWindow.document.title = 'Connecting to Google...';
        while (popupWindow.document.body.firstChild) {
          popupWindow.document.body.removeChild(popupWindow.document.body.firstChild);
        }
        const container = popupWindow.document.createElement('div');
        container.setAttribute('style', "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafaf9; color: #1c1917; text-align: center; padding: 24px; box-sizing: border-box;");

        const spinner = popupWindow.document.createElement('div');
        spinner.setAttribute('style', 'width: 36px; height: 36px; border: 3px solid #e7e5e4; border-top-color: #1c1917; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;');

        const heading = popupWindow.document.createElement('div');
        heading.setAttribute('style', 'font-size: 16px; font-weight: 600; margin-bottom: 6px;');
        heading.textContent = 'Opening Google Sign-In';

        const desc = popupWindow.document.createElement('div');
        desc.setAttribute('style', 'font-size: 13px; color: #78716c; max-width: 320px; line-height: 1.4;');
        desc.textContent = 'Connecting to Google OAuth via Supabase. Please complete sign-in in this window.';

        const style = popupWindow.document.createElement('style');
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';

        container.appendChild(spinner);
        container.appendChild(heading);
        container.appendChild(desc);
        container.appendChild(style);
        popupWindow.document.body.appendChild(container);
      } catch {
        // Safe to ignore document write if sandbox restricts
      }
    }

    // Retrieve OAuth URL with skipBrowserRedirect: true to avoid redirecting the embedded preview
    const { url, error: urlError, rawError } = await getGoogleOAuthUrl(customRedirectUri);

    if (urlError || !url) {
      console.error('[AuthContext] Google OAuth initialization failed:', { error: urlError, raw: rawError });
      if (popupWindow && !popupWindow.closed) {
        try { popupWindow.close(); } catch {}
      }
      const msg = urlError || 'Failed to initiate Google sign-in';
      setError(msg);
      throw new Error(msg);
    }

    // Ensure fallback URL is stored so the UI can display direct button if needed
    setPopupBlockedUrl(url);

    // Direct the popup to Google OAuth URL (or provide explicit fallback if blocked)
    const wasPopupBlocked = !popupWindow || popupWindow.closed;
    if (!wasPopupBlocked) {
      console.log('[AuthContext] Directing popup window to Google OAuth URL:', url);
      try {
        popupWindow.location.href = url;
        popupWindow.focus();
      } catch (e) {
        console.warn('[AuthContext] Could not set popupWindow.location.href:', e);
      }
    } else {
      console.warn('[AuthContext] Initial popup was blocked. Attempting direct window.open...');
      let fallbackWin: Window | null = null;
      try {
        fallbackWin = window.open(url, '_blank');
      } catch (err) {
        console.warn('[AuthContext] Fallback window.open error:', err);
      }

      if (fallbackWin && !fallbackWin.closed) {
        popupWindow = fallbackWin;
      } else {
        const blockedMsg = 'Popup was blocked by your browser. Please click "Sign in in new window" below to continue.';
        console.warn('[AuthContext]', blockedMsg);
        setError(blockedMsg);
        throw new Error('POPUP_BLOCKED');
      }
    }

    // Clean up any stale callback event in localStorage before starting
    try {
      localStorage.removeItem('supabase_oauth_completed');
    } catch {}

    // Await completion via multi-channel listener (postMessage, BroadcastChannel, localStorage, or polling)
    return new Promise<void>((resolve, reject) => {
      let isCompleted = false;
      const startTime = Date.now();
      let pollInterval: any = null;
      let bc: BroadcastChannel | null = null;
      let authSub: any = null;

      const cleanup = () => {
        if (pollInterval) clearInterval(pollInterval);
        window.removeEventListener('message', handlePopupMessage);
        window.removeEventListener('storage', handleStorageEvent);
        if (bc) {
          try { bc.close(); } catch {}
        }
        if (authSub) {
          try { authSub.unsubscribe(); } catch {}
        }
      };

      const handleAuthSuccess = async (token?: string, profile?: UserProfile) => {
        if (isCompleted) return;
        isCompleted = true;
        cleanup();
        console.log('[AuthContext] Google OAuth sign-in successful!');

        try {
          if (popupWindow && !popupWindow.closed) {
            try { popupWindow.close(); } catch {}
          }
        } catch {}

        try {
          if (token) {
            setStoredToken(token);
          }
          if (profile) {
            setUser(profile);
          } else if (token) {
            const sync = await api.syncSupabaseUser(token);
            setUser(sync.user);
          } else {
            const supabase = getSupabase();
            if (supabase) {
              const { data: { session } } = await supabase.auth.getSession();
              if (session?.access_token) {
                setStoredToken(session.access_token);
                const sync = await api.syncSupabaseUser(session.access_token);
                setUser(sync.user);
              }
            }
          }
          clearError();
          setPopupBlockedUrl(null);
          try { localStorage.removeItem('supabase_oauth_completed'); } catch {}
          resolve();
        } catch (err: any) {
          console.error('[AuthContext] Profile synchronization error after OAuth:', err);
          const syncErr = err?.message || 'Sign in succeeded, but failed to sync profile data.';
          setError(syncErr);
          reject(new Error(syncErr));
        }
      };

      const handleAuthError = (errMsg: string) => {
        if (isCompleted) return;
        isCompleted = true;
        cleanup();
        console.error('[AuthContext] Google OAuth sign-in error:', errMsg);

        try {
          if (popupWindow && !popupWindow.closed) {
            try { popupWindow.close(); } catch {}
          }
        } catch {}

        setError(errMsg);
        reject(new Error(errMsg));
      };

      // 1. Listen for postMessage from popup callback
      const handlePopupMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
          handleAuthSuccess(event.data.token, event.data.user);
        } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
          handleAuthError(event.data.error || 'Authentication failed');
        }
      };
      window.addEventListener('message', handlePopupMessage);

      // 2. Listen for localStorage cross-window synchronization (handles COOP severing)
      const handleStorageEvent = (event: StorageEvent) => {
        if (event.key === 'supabase_oauth_completed' && event.newValue) {
          try {
            const parsed = JSON.parse(event.newValue);
            if (parsed.type === 'OAUTH_AUTH_SUCCESS') {
              handleAuthSuccess(parsed.token, parsed.user);
            } else if (parsed.type === 'OAUTH_AUTH_ERROR') {
              handleAuthError(parsed.error || 'Authentication failed');
            }
          } catch (e) {
            console.error('[AuthContext] Failed to parse storage event:', e);
          }
        }
      };
      window.addEventListener('storage', handleStorageEvent);

      // 3. Listen via BroadcastChannel across tabs/windows
      try {
        bc = new BroadcastChannel('supabase_oauth_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
            handleAuthSuccess(event.data.token, event.data.user);
          } else if (event.data?.type === 'OAUTH_AUTH_ERROR') {
            handleAuthError(event.data.error || 'Authentication failed');
          }
        };
      } catch {}

      // 4. Listen via Supabase onAuthStateChange
      const supabase = getSupabase();
      if (supabase) {
        try {
          const { data } = supabase.auth.onAuthStateChange((_event, currentSession) => {
            if (currentSession?.access_token && !isCompleted) {
              handleAuthSuccess(currentSession.access_token);
            }
          });
          authSub = data?.subscription;
        } catch {}
      }

      // 5. Periodic polling for session & popup status
      let popupClosedGraceCount = 0;
      pollInterval = setInterval(async () => {
        if (isCompleted) return;

        // Check if session was completed in localStorage
        try {
          const storedEvent = localStorage.getItem('supabase_oauth_completed');
          if (storedEvent) {
            const parsed = JSON.parse(storedEvent);
            if (parsed.type === 'OAUTH_AUTH_SUCCESS') {
              handleAuthSuccess(parsed.token, parsed.user);
              return;
            } else if (parsed.type === 'OAUTH_AUTH_ERROR') {
              handleAuthError(parsed.error);
              return;
            }
          }
        } catch {}

        // Check Supabase session directly
        if (supabase) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
              handleAuthSuccess(session.access_token);
              return;
            }
          } catch {}
        }

        // Grace period for popup closure:
        // Cross-origin redirects (e.g. to accounts.google.com) trigger transient popupWindow.closed: true in Chromium!
        // Never treat the popup as closed during the first 8 seconds.
        const elapsed = Date.now() - startTime;
        if (elapsed > 8000) {
          let isClosed = false;
          try {
            isClosed = Boolean(popupWindow && popupWindow.closed);
          } catch {
            // Cross-origin access exception: popup is active on external domain
            isClosed = false;
          }

          if (isClosed) {
            popupClosedGraceCount++;
            // Allow 2 polling ticks (2.4s) after closure detection to allow callback token storage to settle
            if (popupClosedGraceCount >= 2) {
              console.warn('[AuthContext] Google OAuth popup was closed by user after', elapsed, 'ms.');
              handleAuthError('Google sign-in popup was closed. Click "Sign in in new window" below to try again.');
            }
          } else {
            popupClosedGraceCount = 0;
          }
        }
      }, 1200);

      // Safety timeout after 10 minutes
      setTimeout(() => {
        if (!isCompleted) {
          console.warn('[AuthContext] Google OAuth sign-in timed out.');
          handleAuthError('Sign-in timed out. Please try again or use the direct sign-in button.');
        }
      }, 10 * 60 * 1000);
    });
  };

  const logout = async () => {
    try {
      await signOutSupabase();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    api.logout();
    setUser(null);
  };

  const syncSessionToken = async (token: string): Promise<UserProfile> => {
    setStoredToken(token);
    const syncRes = await api.syncSupabaseUser(token);
    setUser(syncRes.user);
    return syncRes.user;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updated = await api.updateProfile(updates);
      setUser(updated);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const completeOnboarding = async (
    level: LearningLevel,
    goals: CommunicationGoal[],
    motherTongue?: string,
    learningLanguage?: string,
    preferredAILanguage?: string,
    scriptPreference?: import('../types').ScriptPreference,
    conversationalStyle?: import('../types').ConversationalStyle
  ) => {
    await updateProfile({
      learningLevel: level,
      goals,
      motherTongue: motherTongue || 'Telugu',
      learningLanguage: learningLanguage || 'English',
      preferredAILanguage: preferredAILanguage || motherTongue || 'Telugu (Tenglish)',
      scriptPreference: scriptPreference || 'romanized',
      conversationalStyle: conversationalStyle || 'natural',
      isOnboarded: true
    });
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isSupabaseConfigured: isConfigured,
        popupBlockedUrl,
        clearPopupBlockedUrl,
        redirectToGoogleAuth,
        login,
        signup,
        loginWithGoogle,
        logout,
        updateProfile,
        completeOnboarding,
        clearError,
        syncSessionToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
