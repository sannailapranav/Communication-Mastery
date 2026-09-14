import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getGoogleOAuthUrl } from '../../services/supabase';
import { ExternalLink, AlertTriangle, ArrowRight, X, ShieldAlert } from 'lucide-react';

interface GoogleAuthButtonProps {
  onStart?: () => void;
  onError?: (msg: string) => void;
  disabled?: boolean;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onStart,
  onError,
  disabled = false
}) => {
  const {
    loginWithGoogle,
    popupBlockedUrl,
    redirectToGoogleAuth,
    clearPopupBlockedUrl,
    clearError
  } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [directOAuthUrl, setDirectOAuthUrl] = useState<string | null>(null);

  // Active fallback target URL
  const activeFallbackUrl = popupBlockedUrl || directOAuthUrl;

  const currentRedirectTo = typeof window !== 'undefined'
    ? `${window.location.origin.replace(/\/$/, '')}/auth/callback`
    : '/auth/callback';

  // Pre-fetch or update direct OAuth URL if error occurs
  const ensureFallbackUrl = async (): Promise<string | null> => {
    if (activeFallbackUrl) return activeFallbackUrl;
    try {
      const { url, error } = await getGoogleOAuthUrl();
      if (url) {
        setDirectOAuthUrl(url);
        return url;
      }
      if (error) {
        console.error('[GoogleAuthButton] Failed to get fallback OAuth URL:', error);
      }
    } catch (e) {
      console.error('[GoogleAuthButton] Exception fetching fallback OAuth URL:', e);
    }
    return null;
  };

  const handleClick = async () => {
    setIsLoading(true);
    setOauthError(null);
    clearError();
    clearPopupBlockedUrl();
    onStart?.();

    console.log('[GoogleAuthButton] Initiating Google sign-in. Configured redirectTo:', currentRedirectTo);

    try {
      await loginWithGoogle();
      console.log('[GoogleAuthButton] loginWithGoogle completed successfully.');
    } catch (err: any) {
      const rawErrorMessage = err?.message || 'Google sign-in was cancelled or encountered an error.';
      console.error('[GoogleAuthButton] Google sign-in failed or was cancelled:', {
        message: rawErrorMessage,
        errorObject: err,
        stack: err?.stack,
        configuredRedirectTo: currentRedirectTo
      });

      // Retrieve fallback URL immediately so user has zero delay in seeing fallback options
      await ensureFallbackUrl();

      setOauthError(rawErrorMessage);
      onError?.(rawErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearError = () => {
    setOauthError(null);
    clearError();
    clearPopupBlockedUrl();
  };

  return (
    <div className="w-full space-y-2.5">
      <button
        type="button"
        id="continue-with-google-btn"
        onClick={handleClick}
        disabled={disabled || isLoading}
        className="w-full flex items-center justify-center gap-3 rounded-xl border border-stone-200 bg-white py-2.5 px-4 text-sm font-semibold text-stone-700 shadow-xs hover:bg-stone-50 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-1 transition-all disabled:opacity-50 cursor-pointer"
      >
        {isLoading ? (
          <div className="h-4 w-4 border-2 border-stone-600 border-t-transparent rounded-full animate-spin" />
        ) : (
          <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>{isLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
      </button>

      {/* Detailed Diagnostic & Fallback Card */}
      {(oauthError || activeFallbackUrl) && (
        <div
          id="google-auth-fallback-card"
          className="p-3.5 rounded-xl bg-amber-50/95 border border-amber-200/90 text-stone-800 text-left space-y-2.5 transition-all shadow-xs"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
              <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Google Sign-In Diagnostics & Fallback</span>
            </div>
            <button
              type="button"
              onClick={handleClearError}
              className="text-amber-700 hover:text-amber-950 p-0.5 rounded cursor-pointer"
              title="Dismiss notice"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Exact error message output */}
          {oauthError && (
            <div className="rounded-lg bg-amber-100/80 p-2 text-xs font-mono text-amber-900 break-all leading-tight border border-amber-200">
              <span className="font-semibold text-amber-950">Error: </span>
              {oauthError}
            </div>
          )}

          <p className="text-xs text-amber-900 leading-relaxed">
            In preview iframe sandboxes, browser cross-origin policies (COOP) or popup blockers may close or disconnect the Google sign-in window. Use one of the direct methods below:
          </p>

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {activeFallbackUrl && (
              <a
                id="open-direct-google-auth-btn"
                href={activeFallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setOauthError(null);
                  clearError();
                }}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition-colors text-xs cursor-pointer shadow-xs"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span>Sign in in new window</span>
              </a>
            )}

            <button
              type="button"
              id="redirect-direct-btn"
              onClick={() => {
                setOauthError(null);
                clearError();
                redirectToGoogleAuth(activeFallbackUrl || undefined);
              }}
              className="inline-flex items-center justify-center gap-1 px-3 py-2 bg-white border border-stone-300 text-stone-700 font-semibold rounded-lg hover:bg-stone-50 transition-colors text-xs cursor-pointer"
            >
              <ArrowRight className="h-3.5 w-3.5" />
              <span>Direct redirect</span>
            </button>
          </div>

          <div className="pt-1 text-[11px] text-stone-500 flex items-center justify-between">
            <span className="truncate">Redirect URI: <code className="bg-stone-100 px-1 py-0.5 rounded text-[10px] text-stone-700">{currentRedirectTo}</code></span>
          </div>
        </div>
      )}
    </div>
  );
};
