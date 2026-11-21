'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Lock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === 'verification_failed'
      ? 'Verification link was invalid or has expired. Please sign in or request a new link.'
      : null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please provide both your registered email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseBrowserClient();

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      // Check if user has an enterprise business profile
      if (data.user) {
        const { data: businesses } = await supabase
          .from('businesses')
          .select('id')
          .eq('user_id', data.user.id)
          .limit(1);

        if (!businesses || businesses.length === 0) {
          router.push('/onboarding');
          return;
        }
      }

      router.push('/workspace');
    } catch {
      setError('Unable to authenticate credentials. Please verify your internet connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto my-12 bg-ivory border border-border-light shadow-xl p-8 sm:p-10 space-y-6">
      <div className="space-y-1.5 border-b border-border-light pb-4">
        <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
          MSME Access Portal
        </span>
        <h1 className="font-serif text-3xl text-charcoal font-normal">
          Sign In to Opportunity IQ
        </h1>
        <p className="text-xs text-charcoal-400 font-sans">
          Access pre-order risk evaluations, cash-flow projections, and scenario models.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-rust/10 border border-rust/40 text-xs text-rust-dark flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

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

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[11px] font-mono text-rust hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:outline-none focus:border-charcoal"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 mt-2"
        >
          {isLoading ? (
            <span>Authenticating Credentials...</span>
          ) : (
            <>
              <span>Sign In to Decision Workspace</span>
              <ArrowRight className="w-4 h-4 text-amber" />
            </>
          )}
        </button>
      </form>

      {/* Demo Business Bypass Box */}
      <div className="pt-4 border-t border-border-light space-y-3">
        <div className="text-[11px] font-mono uppercase tracking-widest text-charcoal-300">
          Instant Demo Access
        </div>
        <Link
          href="/workspace"
          className="w-full py-2.5 bg-ivory-200 hover:bg-ivory-300 border border-border-light text-charcoal text-xs font-mono text-center block transition-colors"
        >
          Explore Preloaded MSME Workspace (No Login Required) →
        </Link>
      </div>

      <div className="text-center text-xs text-charcoal-400 pt-2">
        New enterprise?{' '}
        <Link href="/register" className="text-charcoal font-semibold hover:underline">
          Register your business
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal font-sans flex flex-col justify-between p-4 sm:p-8">
      {/* Brand Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-3xl text-charcoal font-normal">DYNAFIN</span>
          <span className="font-mono text-[10px] text-rust uppercase tracking-widest border border-rust/30 px-1.5 py-0.5">
            Opportunity IQ
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-mono text-charcoal-400 hover:text-charcoal underline underline-offset-4"
        >
          ← Return to overview
        </Link>
      </div>

      <Suspense fallback={<div className="text-center font-mono text-xs py-20">Loading portal...</div>}>
        <LoginForm />
      </Suspense>

      {/* Footer Info */}
      <div className="text-center text-[11px] font-mono text-charcoal-400 py-4">
        Secure Business Access • DYNAFIN Opportunity IQ
      </div>
    </div>
  );
}
