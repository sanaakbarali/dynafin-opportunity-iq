'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const errorParam = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      if (errorParam) {
        setErrorMessage(errorDescription || 'Email verification failed or expired. Please sign in or request a new link.');
        return;
      }

      const code = searchParams.get('code');
      const supabase = getSupabaseBrowserClient();

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setErrorMessage(error.message);
          return;
        }
      }

      // Check current active session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setErrorMessage('No active session could be established. Please sign in with your email and password.');
        return;
      }

      // Check if user already completed onboarding (has a business registered)
      const { data: businesses, error: bizError } = await supabase
        .from('businesses')
        .select('id')
        .eq('user_id', session.user.id)
        .limit(1);

      if (businesses && businesses.length > 0) {
        router.replace('/workspace');
      } else {
        router.replace('/onboarding');
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (errorMessage) {
    return (
      <div className="max-w-md w-full mx-auto my-16 bg-ivory border border-border-light shadow-xl p-8 space-y-4 text-center">
        <div className="w-12 h-12 bg-rust/20 text-rust mx-auto flex items-center justify-center">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-2xl text-charcoal">Verification Issue</h2>
        <p className="text-xs text-charcoal-400 font-sans leading-relaxed">{errorMessage}</p>
        <div className="pt-4 flex flex-col gap-2">
          <Link
            href="/login"
            className="w-full py-2.5 bg-charcoal text-ivory text-xs font-mono uppercase tracking-wider block text-center"
          >
            Go to Sign In →
          </Link>
          <Link
            href="/register"
            className="w-full py-2.5 bg-ivory-200 border border-border-light text-charcoal text-xs font-mono uppercase tracking-wider block text-center"
          >
            Create New Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 font-mono text-xs text-charcoal">
      <RefreshCw className="w-6 h-6 animate-spin text-amber" />
      <p>Confirming credentials & initializing MSME workspace...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen bg-ivory text-charcoal flex flex-col justify-between p-4 sm:p-8">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-3xl text-charcoal font-normal">DYNAFIN</span>
          <span className="font-mono text-[10px] text-rust uppercase tracking-widest border border-rust/30 px-1.5 py-0.5">
            Opportunity IQ
          </span>
        </Link>
      </div>

      <Suspense fallback={<div className="text-center font-mono text-xs py-20">Loading session...</div>}>
        <AuthCallbackHandler />
      </Suspense>

      <div className="text-center text-[11px] font-mono text-charcoal-400 py-4">
        DYNAFIN • Arthaton 2026
      </div>
    </div>
  );
}
