
'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleResend = async () => {
    if (!email) {
      setError('Email address is missing. Please return to registration.');
      return;
    }

    setError(null);
    setMessage(null);
    setIsResending(true);

    try {
      const supabase = getSupabaseBrowserClient();

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setIsSent(true);
        setMessage('A new confirmation email has been sent. Please check your inbox.');
      }
    } catch {
      setError('Unable to resend the email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-ivory border border-border-light shadow-xl p-8 sm:p-10 space-y-6">
      <div className="space-y-1.5 border-b border-border-light pb-4 text-center">
        <div className="w-12 h-12 bg-charcoal text-amber mx-auto flex items-center justify-center mb-3">
          <Mail className="w-6 h-6" />
        </div>

        <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
          Security Verification
        </span>

        <h1 className="font-serif text-3xl text-charcoal font-normal">
          Verify Business Email
        </h1>

        <p className="text-xs text-charcoal-400 leading-relaxed">
          We have requested an email confirmation link for:
        </p>

        <p className="font-mono font-semibold text-sm text-charcoal break-all">
          {email || 'Your registered email address'}
        </p>
      </div>

      <div className="p-4 bg-sage/20 border border-sage-dark text-xs text-charcoal space-y-2 text-center">
        <CheckCircle2 className="w-6 h-6 text-sage-dark mx-auto" />
        <div className="font-semibold font-mono">Check Your Inbox</div>
        <p className="text-charcoal-400 text-[11px] leading-relaxed">
          Open the confirmation email from Supabase and click the verification link to confirm your business email.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rust/10 border border-rust/40 text-xs text-rust-dark flex items-start gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {message && (
        <div className="p-3 bg-sage/20 border border-sage-dark text-xs text-charcoal">
          {message}
        </div>
      )}

      <button
        type="button"
        onClick={handleResend}
        disabled={isResending || isSent}
        className="w-full py-3.5 bg-charcoal hover:bg-charcoal-600 disabled:opacity-50 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
      >
        {isResending ? (
          'Sending Confirmation Email...'
        ) : isSent ? (
          'Confirmation Email Sent'
        ) : (
          <>
            <RefreshCw className="w-4 h-4 text-amber" />
            Resend Confirmation Email
          </>
        )}
      </button>

      <div className="text-center text-xs text-charcoal-400 pt-2 border-t border-border-light">
        Already confirmed your email?{' '}
        <Link href="/login" className="text-charcoal font-semibold hover:underline">
          Sign in
        </Link>
      </div>

      <p className="text-[11px] font-mono text-charcoal-400 text-center">
        If the email is missing, check your spam folder.
      </p>
    </div>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="max-w-md w-full mx-auto my-12 p-8 text-center font-mono text-xs text-charcoal-400">
      Loading verification details...
    </div>
  );
}

export default function VerifyEmailPage() {
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
          Return to Sign In
        </Link>
      </div>

      <Suspense fallback={<VerifyEmailFallback />}>
        <VerifyEmailForm />
      </Suspense>

      <div className="text-center text-[11px] font-mono text-charcoal-400 py-4">
        DYNAFIN • Arthaton 2026
      </div>
    </div>
  );
}
