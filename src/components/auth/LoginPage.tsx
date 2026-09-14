import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { ArrowLeft, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GoogleAuthButton } from './GoogleAuthButton';

interface LoginPageProps {
  onSuccess: () => void;
  onSwitchToSignup: (emailPrefill?: string) => void;
  onBackToLanding: () => void;
  initialEmail?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccess,
  onSwitchToSignup,
  onBackToLanding,
  initialEmail = ''
}) => {
  const { login, error: authError, clearError } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Clear any residual error on initial load/mount
  React.useEffect(() => {
    clearError();
    setFormError(null);
  }, []);

  // Sync initialEmail if it changes
  React.useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMessage, setForgotMessage] = useState<string | null>(null);
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleLoginSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setFormError(null);
    clearError();

    const cleanEmail = email.trim();
    const cleanPassword = password;

    if (!cleanEmail || !cleanPassword) {
      setFormError('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(cleanEmail, cleanPassword);
      onSuccess();
    } catch (err: any) {
      console.warn('[LoginPage] Login rejection:', err?.message || err);
      setFormError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setIsSendingReset(true);
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotMessage(res.message);
    } catch {
      setForgotMessage('Password reset instructions generated.');
    } finally {
      setIsSendingReset(false);
    }
  };

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
              Welcome back
            </h2>
            <p className="text-xs text-stone-500 font-normal">
              Access your communication training and progression
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-stone-200 sm:rounded-2xl sm:px-10">
          {formError && (
            <div
              id="login-error-banner"
              role="alert"
              className="mb-5 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-xs text-red-900 border border-red-300 ring-1 ring-red-400/20 shadow-xs"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div className="flex-1 space-y-1">
                <span className="font-bold block text-red-950 text-sm">Sign-in Issue</span>
                <p className="leading-relaxed font-medium text-red-900">{formError}</p>
              </div>
            </div>
          )}

          {!showForgotPassword ? (
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

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Email address
                </label>
                <div className="mt-1.5 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-stone-400" />
                  </div>
                  <input
                    id="login-email"
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
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotEmail(email);
                    }}
                    className="text-xs text-stone-600 hover:text-stone-900 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="mt-1.5 relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-stone-400" />
                  </div>
                  <input
                    id="login-password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full rounded-xl border border-stone-200 pl-10 pr-3 py-2.5 text-sm text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400"
                  />
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 text-xs font-semibold text-red-700 bg-red-50/80 p-2.5 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                id="login-submit-btn"
                disabled={isSubmitting}
                onClick={() => {
                  if (!isSubmitting) {
                    handleLoginSubmit();
                  }
                }}
                className="w-full rounded-xl bg-stone-900 py-3 text-sm font-bold text-white shadow-sm hover:bg-stone-800 transition-colors disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>
          ) : (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Reset Password</h3>
              <p className="text-xs text-stone-600">
                Enter your email address to receive password reset instructions.
              </p>

              {forgotMessage && (
                <div className="flex items-start gap-2 rounded-lg bg-emerald-50 p-3 text-xs text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{forgotMessage}</span>
                </div>
              )}

              <div>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="block w-full rounded-xl border border-stone-200 p-2.5 text-sm text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSendingReset}
                  className="flex-1 rounded-xl bg-stone-900 py-2.5 text-xs font-bold text-white hover:bg-stone-800 disabled:opacity-50"
                >
                  {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 border-t border-stone-100 pt-5 text-center">
            <p className="text-xs text-stone-600">
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => onSwitchToSignup(email.trim())}
                className="font-bold text-stone-900 hover:underline cursor-pointer"
              >
                Create your account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
