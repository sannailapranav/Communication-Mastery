import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { resendConfirmationEmail } from '../../services/supabase';
import { ArrowLeft, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';

interface SignupPageProps {
  onSuccess: () => void;
  onSwitchToLogin: (emailPrefill?: string) => void;
  onBackToLanding: () => void;
  initialEmail?: string;
}

export const SignupPage: React.FC<SignupPageProps> = ({
  onSuccess,
  onSwitchToLogin,
  onBackToLanding,
  initialEmail = ''
}) => {
  const { signup, login, error: authError, clearError } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  // Clear any residual error on initial load/mount
  React.useEffect(() => {
    clearError();
    setFormError(null);
  }, []);

  React.useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('[Signup] Form submit triggered for email:', email);
    setFormError(null);
    clearError();

    const cleanName = displayName.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanName || !cleanEmail || !cleanPassword) {
      const msg = 'Please fill in all fields (Full Name, Email, and Password).';
      console.warn('[Signup] Validation warning:', msg);
      setFormError(msg);
      return;
    }

    if (cleanPassword.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      console.warn('[Signup] Validation warning:', msg);
      setFormError(msg);
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('[Signup] Submitting to Supabase Auth:', { email: cleanEmail, displayName: cleanName });
      const result = await signup(cleanEmail, cleanPassword, cleanName);
      console.log('[Signup] Supabase signup succeeded with result:', result);
      if (result?.requiresEmailConfirmation) {
        setSentEmail(cleanEmail);
        setIsVerificationSent(true);
        return;
      }
      onSuccess();
    } catch (err: any) {
      const actualMessage = err?.message || 'Registration failed. Please check your connection and credentials.';
      if (actualMessage.toLowerCase().includes('already registered') || actualMessage.toLowerCase().includes('already exists')) {
        console.warn('[Signup] User account already registered:', cleanEmail);
      } else {
        console.error('[Signup] Caught error during signup execution:', err);
      }
      setFormError(actualMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <button
            onClick={onSwitchToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to sign in</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-stone-50 shadow-sm">
              <span className="text-base font-bold">CM</span>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-stone-900">
                Verify your email
              </h2>
              <p className="text-xs text-stone-500 font-normal">
                Communication Mastery Account Verification
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-sm border border-stone-200 sm:rounded-2xl sm:px-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-900 mb-5 border border-stone-200">
              <Mail className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-stone-900 mb-1.5">
              Account Confirmation Required
            </h3>

            <div className="my-3 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-mono text-stone-700 break-all">
              {sentEmail}
            </div>

            <p className="text-sm font-medium text-stone-700 leading-relaxed mb-6">
              A confirmation link has been sent to your email. Please click it to verify your account.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                id="verification-open-signin-btn"
                onClick={onSwitchToLogin}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 py-2.5 px-4 text-sm font-bold text-white shadow-xs hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <span>Go to Sign In</span>
              </button>

              <button
                type="button"
                id="verification-resend-link-btn"
                onClick={async () => {
                  try {
                    setIsResending(true);
                    setResendStatus(null);
                    await resendConfirmationEmail(sentEmail);
                    setResendStatus('A new confirmation link has been sent to your email.');
                  } catch (err: any) {
                    setResendStatus(err.message || 'Failed to resend confirmation email.');
                  } finally {
                    setIsResending(false);
                  }
                }}
                disabled={isResending}
                className="w-full text-xs font-semibold text-stone-600 hover:text-stone-900 py-2 transition-colors cursor-pointer"
              >
                {isResending ? 'Sending...' : "Didn't receive the email? Resend verification link"}
              </button>

              {resendStatus && (
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                  {resendStatus}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isAlreadyRegistered =
    Boolean(formError) &&
    (formError!.toLowerCase().includes('already registered') ||
     formError!.toLowerCase().includes('already exists'));

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={onBackToLanding}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to overview</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-900 text-stone-50 shadow-sm">
            <span className="text-base font-bold">CM</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-stone-900">
              Create your account
            </h2>
            <p className="text-xs text-stone-500 font-normal">
              Begin your structured communication mastery journey
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-stone-200 sm:rounded-2xl sm:px-10">
          {isAlreadyRegistered ? (
            <div
              id="signup-already-registered-banner"
              role="alert"
              className="mb-5 rounded-2xl bg-amber-50/90 p-4 text-xs border border-amber-300 ring-1 ring-amber-400/20 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
                <div className="flex-1 space-y-1.5">
                  <span className="font-bold block text-amber-950 text-sm">Account Already Exists</span>
                  <p className="leading-relaxed text-amber-900 font-medium">
                    An account with <span className="font-bold underline">{email || 'this email'}</span> is already registered.
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      id="quick-signin-btn"
                      onClick={async () => {
                        if (password && password.length >= 6) {
                          setIsSubmitting(true);
                          try {
                            await login(email.trim(), password);
                            onSuccess();
                          } catch {
                            onSwitchToLogin(email.trim());
                          } finally {
                            setIsSubmitting(false);
                          }
                        } else {
                          onSwitchToLogin(email.trim());
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-stone-900 px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-stone-800 transition-colors cursor-pointer"
                    >
                      <span>{password && password.length >= 6 ? 'Sign In Now' : 'Sign In With This Email'}</span>
                      <span aria-hidden="true">&rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSwitchToLogin(email.trim())}
                      className="inline-flex items-center rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 border border-stone-300 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      Go to Sign In Page
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : formError ? (
            <div
              id="signup-error-banner"
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-xs text-red-900 border border-red-300 ring-1 ring-red-400/20 shadow-xs"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <span className="font-bold block text-red-950 text-sm">Registration Issue</span>
                <p className="leading-relaxed font-medium text-red-900">{formError}</p>
              </div>
            </div>
          ) : null}

          <div className="space-y-4">
            {/* Google OAuth Button */}
            <GoogleAuthButton
              onStart={() => {
                setFormError(null);
                clearError();
              }}
              onError={(err) => setFormError(err)}
              disabled={isSubmitting}
            />

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-stone-400 font-medium">or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Full Name
              </label>
              <div className="mt-1.5 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="block w-full rounded-xl border border-stone-200 pl-10 pr-3 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Email address
              </label>
              <div className="mt-1.5 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Mail className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border border-stone-200 pl-10 pr-3 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Password
              </label>
              <div className="mt-1.5 relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-4 w-4 text-stone-400" />
                </div>
                <input
                  id="signup-password"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="block w-full rounded-xl border border-stone-200 pl-10 pr-3 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400"
                />
              </div>
            </div>

            {formError && (
              <div
                className={`flex items-center justify-between gap-2 text-xs font-semibold p-2.5 rounded-lg border ${
                  isAlreadyRegistered
                    ? 'text-amber-900 bg-amber-50/90 border-amber-200'
                    : 'text-red-700 bg-red-50/80 border-red-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className={`h-4 w-4 shrink-0 ${isAlreadyRegistered ? 'text-amber-600' : 'text-red-600'}`} />
                  <span>{isAlreadyRegistered ? 'Account exists with this email address.' : formError}</span>
                </div>
                {isAlreadyRegistered && (
                  <button
                    type="button"
                    onClick={() => onSwitchToLogin(email.trim())}
                    className="text-xs font-bold text-amber-950 underline hover:text-stone-900 cursor-pointer shrink-0"
                  >
                    Sign in &rarr;
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              id="signup-submit-btn"
              disabled={isSubmitting}
              onClick={() => {
                if (!isSubmitting) {
                  handleSubmit();
                }
              }}
              className="w-full rounded-xl bg-stone-900 py-3 text-sm font-bold text-white shadow-sm hover:bg-stone-800 transition-colors disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Connecting to Supabase...</span>
                </>
              ) : isAlreadyRegistered ? (
                'Sign In With This Email'
              ) : (
                'Create Account & Continue'
              )}
            </button>
          </form>
        </div>

          <div className="mt-6 border-t border-stone-100 pt-5 text-center">
            <p className="text-xs text-stone-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onSwitchToLogin(email.trim())}
                className="font-bold text-stone-900 hover:underline cursor-pointer"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
