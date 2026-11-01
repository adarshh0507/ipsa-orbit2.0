'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

type Provider = 'google' | 'facebook';

function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" className="w-5 h-5" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.6 5.9c4.4-4.1 7-10.1 7-17.6z" />
      <path fill="#FBBC05" d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"
      />
    </svg>
  );
}

interface SignInPanelProps {
  onOtherOptions: () => void;
  heading?: string;
}

export function SignInPanel({ onOtherOptions, heading = 'Sign in to IPSA ORBIT' }: SignInPanelProps) {
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const [pending, setPending] = useState<Provider | null>(null);
  const [error, setError] = useState('');

  const start = async (provider: Provider) => {
    setError('');

    if (!isSupabaseConfigured) {
      setError('Sign-in is not connected yet. Add the Supabase URL and anon key to your environment variables.');
      return;
    }

    setPending(provider);
    try {
      await (provider === 'google' ? loginWithGoogle() : loginWithFacebook());
    } catch (err) {
      const name = provider === 'google' ? 'Google' : 'Facebook';
      setError(err instanceof Error ? `${name} sign-in failed: ${err.message}` : `${name} sign-in failed. Try again.`);
      setPending(null);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-[#223260] bg-[#0E1A3D]/80 p-6">
      <h2 className="font-display text-xl font-semibold text-[#E8EEFF]">{heading}</h2>
      <p className="mt-1 text-sm text-[#8A98C0]">Use the account you already have. A college email is not required.</p>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={() => start('google')}
          disabled={pending !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6] disabled:opacity-60"
        >
          <GoogleMark />
          <span>{pending === 'google' ? 'Opening Google…' : 'Continue with Google'}</span>
        </button>

        <button
          type="button"
          onClick={() => start('facebook')}
          disabled={pending !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#166fe0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6] disabled:opacity-60"
        >
          <FacebookMark />
          <span>{pending === 'facebook' ? 'Opening Facebook…' : 'Continue with Facebook'}</span>
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-[#FFB454]">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onOtherOptions}
        className="mt-5 text-sm text-[#5CE1E6] underline underline-offset-4 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5CE1E6]"
      >
        Sign in with email or as an admin
      </button>
    </div>
  );
}
