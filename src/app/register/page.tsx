'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Lock, Mail, Building2, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

 
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  if (!fullName.trim() || !businessName.trim() || !email.trim() || !password || !confirmPassword) {
    setError('Please fill in all required registration fields.');
    return;
  }

  if (password !== confirmPassword) {
    setError('Passwords do not match. Please verify and retry.');
    return;
  }

  if (password.length < 8) {
    setError('Password must contain at least 8 characters.');
    return;
  }

  setIsLoading(true);

  try {
    const supabase = getSupabaseBrowserClient();

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          full_name: fullName.trim(),
          business_name: businessName.trim(),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (!data.user) {
      setError('Registration could not be completed. Please try again.');
      return;
    }

    if (data.user.identities?.length === 0) {
      setError('An account with this email may already exist. Please sign in.');
      return;
    }

    router.push(`/verify-email?email=${encodeURIComponent(email.trim())}`);
  } catch {
    setError('Something went wrong. Please try again.');
  } finally {
    setIsLoading(false);
  }
};


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
          href="/login"
          className="text-xs font-mono text-charcoal-400 hover:text-charcoal underline underline-offset-4"
        >
          Already registered? Sign in →
        </Link>
      </div>

      {/* Main Registration Card */}
      <div className="max-w-lg w-full mx-auto my-8 bg-ivory border border-border-light shadow-xl p-8 sm:p-10 space-y-6">
        <div className="space-y-1.5 border-b border-border-light pb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-rust font-semibold">
            Enterprise Onboarding
          </span>
          <h1 className="font-serif text-3xl text-charcoal font-normal">
            Register Your MSME Unit
          </h1>
          <p className="text-xs text-charcoal-400 font-sans">
            Set up pre-order financial risk governance for your manufacturing business.
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
              Proprietor / Authorized Officer Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Senthil Nathan"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:outline-none focus:border-charcoal"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1.5">
              Registered Business / Firm Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Sri Textiles & Dyeing Works"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:outline-none focus:border-charcoal"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1.5">
              Official Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="senthil@sritextiles.in"
                className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:outline-none focus:border-charcoal"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:outline-none focus:border-charcoal"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-3 text-charcoal-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full pl-9 pr-3 py-2.5 bg-ivory-50 border border-border-light text-xs font-mono text-charcoal focus:outline-none focus:border-charcoal"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-charcoal hover:bg-charcoal-600 text-ivory text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <span>Preparing Enterprise Account...</span>
            ) : (
              <>
                <span>Create Business Account & Proceed</span>
                <ArrowRight className="w-4 h-4 text-amber" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-charcoal-400 pt-2 border-t border-border-light">
          Already registered?{' '}
          <Link href="/login" className="text-charcoal font-semibold hover:underline">
            Sign In to your workspace
          </Link>
        </div>
      </div>

      <div className="text-center text-[11px] font-mono text-charcoal-400 py-4">
        All financial inputs remain protected with encrypted Row-Level Security (RLS) policies.
      </div>
    </div>
  );
}
