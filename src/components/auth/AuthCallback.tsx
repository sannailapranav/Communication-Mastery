import React, { useEffect, useState } from 'react';
import { initializeSupabase, getSupabase, getFriendlyOAuthErrorMessage } from '../../services/supabase';
import { api, setStoredToken, setStoredUser, getLocalProgressSnapshot } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { AlertCircle, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface AuthCallbackProps {
  onSuccess: (isNewUser: boolean) => void;
  onError: (errorMessage: string) => void;
  onBackToLogin: () => void;
}

export const AuthCallback: React.FC<AuthCallbackProps> = ({
  onSuccess,
  onError,
  onBackToLogin
}) => {
  const { syncSessionToken, clearError } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let isCancelled = false;

    async function handleCallback() {
      // 1. Check for error parameters in query string or URL hash
      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

      const errorParam = searchParams.get('error') || hashParams.get('error');
      const errorDescription =
        searchParams.get('error_description') || hashParams.get('error_description') || errorParam;

      if (errorParam || errorDescription) {
        const rawErrStr = errorDescription || errorParam;
        console.error('[AuthCallback] OAuth provider returned error in URL:', {
          errorParam,
          errorDescription,
          search: window.location.search,
          hash: window.location.hash
        });
        const friendly = getFriendlyOAuthErrorMessage(rawErrStr);

        // Broadcast failure across all channels
        if (window.opener && window.opener !== window) {
          try {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: friendly, raw: rawErrStr }, '*');
          } catch {}
        }
        try {
          const bc = new BroadcastChannel('supabase_oauth_channel');
          bc.postMessage({ type: 'OAUTH_AUTH_ERROR', error: friendly });
          bc.close();
        } catch {}
        try {
          localStorage.setItem('supabase_oauth_completed', JSON.stringify({
            type: 'OAUTH_AUTH_ERROR',
            error: friendly,
            timestamp: Date.now()
          }));
        } catch {}

        if (window.opener && window.opener !== window) {
          setTimeout(() => { try { window.close(); } catch {} }, 600);
          return;
        }

        if (!isCancelled) {
          setStatus('error');
          setErrorMessage(friendly);
          onError(friendly);
        }
        return;
      }

      // 2. Initialize Supabase client
      const isReady = await initializeSupabase();
      const supabase = getSupabase();

      if (!isReady || !supabase) {
        const err = 'Supabase authentication is not configured.';
        if (!isCancelled) {
          setStatus('error');
          setErrorMessage(err);
          onError(err);
        }
        return;
      }

      try {
        let session = null;

        // 3. Process email confirmation token_hash if present
        const tokenHash = searchParams.get('token_hash') || hashParams.get('token_hash');
        const otpType = (searchParams.get('type') || hashParams.get('type') || 'signup') as any;

        if (tokenHash) {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType
          });
          if (error) {
            console.error('Verify OTP token error:', error);
            throw error;
          }
          session = data?.session;
        }

        // 4. Handle tokens returned via hash fragments (#access_token=...) directly via supabase.auth.setSession()
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token') || '';

        if (accessToken && !session) {
          console.log('[AuthCallback] Found access_token in URL hash fragment. Setting session directly via supabase.auth.setSession...');
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.warn('[AuthCallback] supabase.auth.setSession returned warning:', error.message);
            // Fallback: fetch user profile with the access_token directly
            try {
              const { data: userData, error: userError } = await supabase.auth.getUser(accessToken);
              if (!userError && userData?.user) {
                session = {
                  access_token: accessToken,
                  refresh_token: refreshToken,
                  user: userData.user
                } as any;
              }
            } catch (userFetchErr) {
              console.warn('[AuthCallback] Failed to fetch user with accessToken:', userFetchErr);
            }
          } else if (data?.session) {
            console.log('[AuthCallback] supabase.auth.setSession established session successfully.');
            session = data.session;
          }
        }

        // 5. Fallback: Process authorization code if present
        const code = searchParams.get('code') || hashParams.get('code');
        if (code && !session) {
          try {
            console.log('[AuthCallback] Found authorization code, attempting exchange...');
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              console.warn('[AuthCallback] Code exchange failed (expected in iframe if code verifier was severed):', error.message);
            } else if (data?.session) {
              session = data.session;
            }
          } catch (codeErr: any) {
            console.warn('[AuthCallback] exchangeCodeForSession exception:', codeErr?.message || codeErr);
          }
        }

        // 6. If no session from explicit tokens, check existing or wait for internal URL detection
        if (!session) {
          const { data, error } = await supabase.auth.getSession();
          if (!error && data?.session) {
            session = data.session;
          }
        }

        if (!session) {
          session = await new Promise((resolve) => {
            const timeout = setTimeout(() => {
              sub?.unsubscribe();
              resolve(null);
            }, 3500);

            const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
              (_event, currentSession) => {
                if (currentSession) {
                  clearTimeout(timeout);
                  sub.unsubscribe();
                  resolve(currentSession);
                }
              }
            );
          });
        }

        if (!session || !session.access_token) {
          throw new Error('No active session was established. Please sign in again.');
        }

        // 7. Sync user profile with our backend using the authenticated Supabase token
        console.log('[AuthCallback] Session verified. Synchronizing profile token with backend...');
        setStoredToken(session.access_token);
        const userProfile = await syncSessionToken(session.access_token);
        setStoredUser(userProfile);
        clearError();
        console.log('[AuthCallback] Profile synchronized successfully:', userProfile.email);

        const journeySnapshot = getLocalProgressSnapshot();

        // 8. Multi-channel broadcast to main application
        // Channel A: postMessage to window.opener
        if (window.opener && window.opener !== window) {
          try {
            window.opener.postMessage(
              {
                type: 'OAUTH_AUTH_SUCCESS',
                user: userProfile,
                journeyState: journeySnapshot,
                token: session.access_token
              },
              '*'
            );
          } catch (e) {
            console.warn('[AuthCallback] window.opener.postMessage failed:', e);
          }
        }

        // Channel B: BroadcastChannel
        try {
          const bc = new BroadcastChannel('supabase_oauth_channel');
          bc.postMessage({
            type: 'OAUTH_AUTH_SUCCESS',
            user: userProfile,
            journeyState: journeySnapshot,
            token: session.access_token
          });
          bc.close();
        } catch {}

        // Channel C: localStorage cross-window synchronization
        try {
          localStorage.setItem('supabase_oauth_completed', JSON.stringify({
            type: 'OAUTH_AUTH_SUCCESS',
            user: userProfile,
            journeyState: journeySnapshot,
            token: session.access_token,
            timestamp: Date.now()
          }));
        } catch {}

        // If in a popup window, close cleanly
        if (window.opener && window.opener !== window) {
          setTimeout(() => {
            try { window.close(); } catch {}
          }, 500);
          return;
        }

        // 9. Clean URL history so user is not stuck on /auth/callback
        if (window.history?.replaceState) {
          const cleanUrl = window.location.pathname.replace(/\/auth\/callback\/?/, '/') || '/';
          window.history.replaceState({}, document.title, cleanUrl);
        }

        if (!isCancelled) {
          setStatus('success');
          // Navigate to dashboard
          onSuccess(!userProfile.isOnboarded);
        }
      } catch (err: any) {
        console.error('[AuthCallback] Processing exception:', err);
        const rawMsg = err?.message || 'Authentication failed';
        const friendly = getFriendlyOAuthErrorMessage(rawMsg);

        // Broadcast failure across all channels
        if (window.opener && window.opener !== window) {
          try {
            window.opener.postMessage({ type: 'OAUTH_AUTH_ERROR', error: friendly, raw: err }, '*');
          } catch {}
        }
        try {
          const bc = new BroadcastChannel('supabase_oauth_channel');
          bc.postMessage({ type: 'OAUTH_AUTH_ERROR', error: friendly });
          bc.close();
        } catch {}
        try {
          localStorage.setItem('supabase_oauth_completed', JSON.stringify({
            type: 'OAUTH_AUTH_ERROR',
            error: friendly,
            timestamp: Date.now()
          }));
        } catch {}

        if (window.opener && window.opener !== window) {
          setTimeout(() => {
            try { window.close(); } catch {}
          }, 800);
          return;
        }

        if (!isCancelled) {
          setStatus('error');
          setErrorMessage(friendly);
          onError(friendly);
        }
      }
    }

    handleCallback();

    return () => {
      isCancelled = true;
    };
  }, [onSuccess, onError, syncSessionToken]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-stone-200 shadow-sm text-center">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-stone-900 text-stone-50 shadow-sm mb-5">
          <span className="text-base font-bold">CM</span>
        </div>

        {status === 'processing' && (
          <div className="space-y-3">
            <div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-stone-900">Completing sign-in...</h2>
            <p className="text-xs text-stone-500">
              Verifying your Google credentials and restoring your learning profile.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-stone-900">Signed In Successfully</h2>
            <p className="text-xs text-stone-500">Redirecting to your workspace...</p>
            {typeof window !== 'undefined' && window.opener && window.opener !== window && (
              <button
                type="button"
                onClick={() => window.close()}
                className="mt-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                Close Window
              </button>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-600 mx-auto">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">Unable to Sign In</h2>
              <p className="text-xs text-stone-600 mt-1.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearError();
                onBackToLogin();
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-2.5 px-4 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors mt-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Sign In</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
