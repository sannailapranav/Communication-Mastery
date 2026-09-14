import { createClient, SupabaseClient, Session, User } from '@supabase/supabase-js';

// Verified project Supabase credentials for Communication Mastery
export const SUPABASE_URL = (
  import.meta.env.VITE_SUPABASE_URL ||
  'https://egligjsxmuzqbmoquiep.supabase.co'
).trim();

export const SUPABASE_ANON_KEY = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnbGlnanN4bXV6cWJtb3F1aWVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkyMTQzNjksImV4cCI6MjEwNDc5MDM2OX0._pptN6Nkl_GgHMyALpOuKyog0fqcG_m5FmKRpplYBW4'
).trim();

export const DEFAULT_SUPABASE_URL = SUPABASE_URL;
export const DEFAULT_SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;

let clientInstance: SupabaseClient | null = null;
let isConfiguredState: boolean = false;
let configPromise: Promise<boolean> | null = null;

// Read from import.meta.env or fall back directly to project credentials
const staticUrl = SUPABASE_URL;
const staticAnonKey = SUPABASE_ANON_KEY;

try {
  clientInstance = createClient(staticUrl, staticAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    }
  });
  isConfiguredState = true;
  console.log('[Supabase Client] Successfully initialized with project URL (implicit flow):', staticUrl);
} catch (err) {
  console.error('[Supabase Client] Failed to initialize static Supabase client:', err);
}

/**
 * Ensures Supabase is initialized. Returns true immediately if already initialized,
 * or fetches dynamic configuration from /api/auth/config if necessary.
 */
export async function initializeSupabase(): Promise<boolean> {
  if (clientInstance && isConfiguredState) {
    return true;
  }

  if (configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    try {
      const res = await fetch('/api/auth/config');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const url = (data.supabaseUrl || DEFAULT_SUPABASE_URL).trim();
      const key = (data.supabaseAnonKey || DEFAULT_SUPABASE_ANON_KEY).trim();

      if (url && key) {
        clientInstance = createClient(url, key, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'implicit'
          }
        });
        isConfiguredState = true;
        console.log('[Supabase Client] Initialized from /api/auth/config (implicit flow):', url);
        return true;
      }
      isConfiguredState = false;
      return false;
    } catch (err) {
      console.warn('[Supabase Client] Falling back to default project credentials after fetch error:', err);
      try {
        clientInstance = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
            flowType: 'implicit'
          }
        });
        isConfiguredState = true;
        return true;
      } catch (fallbackErr) {
        console.error('[Supabase Client] Default fallback initialization failed:', fallbackErr);
        isConfiguredState = false;
        return false;
      }
    } finally {
      configPromise = null;
    }
  })();

  return configPromise;
}

export function getSupabase(): SupabaseClient | null {
  return clientInstance;
}

export function isSupabaseConfigured(): boolean {
  return isConfiguredState && clientInstance !== null;
}

/**
 * Maps Supabase and Google OAuth error codes to clear user messages without masking raw diagnostic info.
 */
export function getFriendlyOAuthErrorMessage(rawError: string | null | undefined): string {
  if (!rawError) return 'An unexpected error occurred during sign-in. Please try again.';
  const lower = rawError.toLowerCase();

  if (lower.includes('access_denied') || lower.includes('user denied')) {
    return 'Google sign-in was cancelled or access was denied by user.';
  }
  if (lower.includes('expired') || lower.includes('session_expired')) {
    return 'Your sign-in session has expired. Please try again.';
  }
  if (lower.includes('missing') || lower.includes('invalid state') || lower.includes('state mismatch')) {
    return "Could not verify the sign-in response (state mismatch). Please try again.";
  }
  if (lower.includes('network') || lower.includes('failed to fetch')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  // Return the actual raw error message so specific Supabase or Google errors are clear
  return rawError;
}

/**
 * Obtains the Supabase Google OAuth authorization URL without redirecting the current window.
 * Configured with skipBrowserRedirect: true so the URL can be opened in a separate popup window or tab,
 * completely avoiding Google's X-Frame-Options: DENY / CSP restrictions inside iframes.
 */
export async function getGoogleOAuthUrl(customRedirectUri?: string): Promise<{ url?: string; error?: string; rawError?: any }> {
  const isReady = await initializeSupabase();
  if (!isReady || !clientInstance) {
    const msg = 'Supabase configuration is required. Please check that SUPABASE_URL and SUPABASE_ANON_KEY are set.';
    console.error('[Supabase OAuth] Initialization error:', msg);
    return { error: msg };
  }

  try {
    const origin = typeof window !== 'undefined' ? window.location.origin.replace(/\/$/, '') : '';
    const redirectUrl = customRedirectUri || `${origin}/auth/callback`;

    console.log('[Supabase OAuth] Executing client.auth.signInWithOAuth({ provider: "google" })');
    console.log('[Supabase OAuth] Redirect URI configured as:', redirectUrl);

    const { data, error } = await clientInstance.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        scopes: 'openid email profile',
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account'
        },
        skipBrowserRedirect: true
      }
    });

    console.log('[Supabase OAuth] signInWithOAuth raw result:', { data, error });

    if (error) {
      console.error('[Supabase OAuth] signInWithOAuth returned error:', {
        message: error.message,
        name: error.name,
        status: (error as any).status,
        raw: error
      });
      return { error: error.message, rawError: error };
    }

    if (!data?.url) {
      const errNoUrl = 'Supabase did not return an authorization URL for Google OAuth.';
      console.error('[Supabase OAuth]', errNoUrl, { data });
      return { error: errNoUrl };
    }

    console.log('[Supabase OAuth] Successfully generated OAuth URL:', data.url);
    return { url: data.url };
  } catch (err: any) {
    console.error('[Supabase OAuth] Unexpected exception in getGoogleOAuthUrl:', err);
    return { error: err?.message || 'Failed to initiate Google OAuth URL', rawError: err };
  }
}

/**
 * Initiates Google OAuth using Supabase Auth in a popup window or new tab.
 * Ensures the embedded preview window is never redirected directly to Google's sign-in page.
 */
export async function signInWithGoogle(customRedirectUri?: string): Promise<{ error?: string }> {
  const width = 520;
  const height = 660;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2));

  let popup: Window | null = null;
  try {
    popup = window.open(
      'about:blank',
      'google_oauth_popup',
      `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
    );
  } catch (e) {
    console.warn('Initial popup creation failed:', e);
  }

  if (popup) {
    try {
      popup.document.title = 'Connecting to Google...';
      while (popup.document.body.firstChild) {
        popup.document.body.removeChild(popup.document.body.firstChild);
      }
      const container = popup.document.createElement('div');
      container.setAttribute('style', "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #fafaf9; color: #1c1917; text-align: center; padding: 24px; box-sizing: border-box;");

      const spinner = popup.document.createElement('div');
      spinner.setAttribute('style', 'width: 36px; height: 36px; border: 3px solid #e7e5e4; border-top-color: #1c1917; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;');

      const heading = popup.document.createElement('div');
      heading.setAttribute('style', 'font-size: 16px; font-weight: 600; margin-bottom: 6px;');
      heading.textContent = 'Opening Google Sign-In';

      const desc = popup.document.createElement('div');
      desc.setAttribute('style', 'font-size: 13px; color: #78716c; max-width: 320px; line-height: 1.4;');
      desc.textContent = 'Connecting securely to Google OAuth. Please complete authentication in this window.';

      const style = popup.document.createElement('style');
      style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';

      container.appendChild(spinner);
      container.appendChild(heading);
      container.appendChild(desc);
      container.appendChild(style);
      popup.document.body.appendChild(container);
    } catch {
      // Ignore cross-origin context issues
    }
  }

  const { url, error } = await getGoogleOAuthUrl(customRedirectUri);

  if (error || !url) {
    if (popup && !popup.closed) {
      try { popup.close(); } catch {}
    }
    return { error: error || 'Failed to initiate Google sign-in' };
  }

  if (popup && !popup.closed) {
    popup.location.href = url;
    popup.focus();
  } else {
    const fallbackWindow = window.open(url, '_blank');
    if (!fallbackWindow) {
      return {
        error: 'Popup was blocked by your browser. Please allow popups for this site and try again.'
      };
    }
  }

  return {};
}

/**
 * Signs in with email and password via Supabase Auth.
 */
export async function signInWithEmailPassword(email: string, pass: string): Promise<{ session: Session | null; user: User | null; error?: string }> {
  const isReady = await initializeSupabase();
  if (!isReady || !clientInstance) {
    return { session: null, user: null, error: 'Supabase is not configured.' };
  }

  const { data, error } = await clientInstance.auth.signInWithPassword({
    email,
    password: pass
  });

  if (error) {
    return { session: null, user: null, error: error.message };
  }

  return { session: data.session, user: data.user };
}

/**
 * Signs up with email and password via Supabase Auth.
 */
export async function signUpWithEmailPassword(
  email: string,
  pass: string,
  displayName: string
): Promise<{ session: Session | null; user: User | null; error?: string }> {
  try {
    const isReady = await initializeSupabase();
    if (!isReady || !clientInstance) {
      const configErr = 'Supabase client could not be initialized.';
      console.error('[Supabase auth.signUp] Initialization error:', configErr);
      return { session: null, user: null, error: configErr };
    }

    const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

    console.log('[Supabase auth.signUp] Initiating signUp for:', email, 'redirectUrl:', callbackUrl);

    const { data, error } = await clientInstance.auth.signUp({
      email,
      password: pass,
      options: {
        emailRedirectTo: callbackUrl,
        data: {
          full_name: displayName,
          name: displayName,
          display_name: displayName
        }
      }
    });

    if (error) {
      if (error.message?.toLowerCase().includes('already registered')) {
        console.warn('[Supabase auth.signUp] Notice: user already registered for email:', email);
      } else {
        console.error('[Supabase auth.signUp] Error response from Supabase:', error);
      }
      return { session: null, user: null, error: error.message };
    }

    console.log('[Supabase auth.signUp] Success response:', {
      userId: data.user?.id,
      email: data.user?.email,
      hasSession: Boolean(data.session)
    });

    return { session: data.session, user: data.user };
  } catch (err: any) {
    console.error('[Supabase auth.signUp] Unexpected exception:', err);
    return { session: null, user: null, error: err?.message || 'Supabase signUp failed' };
  }
}

/**
 * Resends a signup confirmation email via Supabase Auth.
 */
export async function resendConfirmationEmail(email: string): Promise<{ error?: string }> {
  const isReady = await initializeSupabase();
  if (!isReady || !clientInstance) {
    return { error: 'Supabase is not configured.' };
  }

  const callbackUrl = typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined;

  const { error } = await clientInstance.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: callbackUrl
    }
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}

/**
 * Signs out from Supabase Auth.
 */
export async function signOutSupabase(): Promise<void> {
  if (clientInstance) {
    try {
      await clientInstance.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
  }
}

/**
 * Sends a password reset email via Supabase Auth.
 */
export async function resetPasswordForEmail(email: string): Promise<{ error?: string }> {
  const isReady = await initializeSupabase();
  if (!isReady || !clientInstance) {
    return { error: 'Supabase is not configured.' };
  }

  const { error } = await clientInstance.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/callback?type=recovery`
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}
