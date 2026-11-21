'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/settings?reset=password`,
      });

      if (resetError) {
        setError(resetError.message);
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('An unexpected error occurred while requesting password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-3xl text-charcoal font-normal">DYNAFIN</span>
          <span className="font-mono text-[10px] text-rust uppercase tracking-widest border border-rust/30 px-1.5 py-0.5">
            Opportunity IQ
          </span>
        </Link>
        <Link
          href="/login"
          className="text-xs font-mono text-charcoal-400 hover:text-charcoal underline underline-offset-4"
        >
          ← Return to Sign In
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-12 bg-ivory border border-border-light shadow-xl p-8 sm:p-10 space-y-6">
        <div className="space-y-1.5 border-b border-border-light pb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
            Account Recovery
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal">
            Reset Your Password
          </h1>
          <p className="text-xs text-charcoal-400 font-sans">
            Enter your registered official email to receive password recovery instructions.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rust/10 border border-rust/40 text-xs text-rust-dark flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-4 bg-sage/20 border border-sage-dark text-xs text-charcoal space-y-2">
            <CheckCircle2 className="w-5 h-5 text-sage-dark" />
            <div className="font-semibold font-mono">Password Reset Instructions Sent</div>
            <p className="text-[11px] text-charcoal-400 leading-relaxed">
              If an enterprise account exists for <span className="font-mono font-semibold text-charcoal">{email}</span>, a secure recovery email has been dispatched with instructions to update your password.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="text-xs font-mono font-semibold text-charcoal hover:underline"
              >
                Return to Login →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@yourbusiness.in"
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:outline-none focus:border-charcoal"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? 'Dispatching Reset Link...' : 'Send Password Reset Link'}
            </button>
          </form>
        )}
      </div>

      <div className="text-center text-[11px] font-mono text-charcoal-400 py-4">
        DYNAFIN • Arthaton 2026
      </div>
    </div>
  );
}
