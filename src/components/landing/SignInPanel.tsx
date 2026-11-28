'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import type { Section } from '@/types';

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
      <path fill="currentColor" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

interface SignInPanelProps {
  onOtherOptions: () => void;
  heading?: string;
}

export function SignInPanel({ onOtherOptions, heading = 'Sign in to IPSA ORBIT' }: SignInPanelProps) {
  const { loginWithGoogle, loginWithFacebook, signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [section, setSection] = useState<Section>('DS-1');
  const [pending, setPending] = useState<Provider | 'email' | null>(null);
  const [error, setError] = useState('');

  const submitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setPending('email');
    try {
      await signInWithEmail(email, password, section);
      window.location.assign('/student');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email sign-in failed. Check your email and password.');
      setPending(null);
    }
  };

  const start = async (provider: Provider) => {
    setError('');
    if (!isSupabaseConfigured) {
      setError('Supabase is not configured for this deployment. Add the Supabase URL and anon key to the Vercel environment variables, then redeploy.');
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
    <div className="w-full max-w-md rounded-2xl border border-line bg-panel/80 p-6">
      <h2 className="font-display text-xl font-semibold text-ink">{heading}</h2>
      <p className="mt-1 text-sm text-muted">Sign in with your registered email and password, or continue with Google.</p>

      <form onSubmit={submitEmail} className="mt-5 space-y-3">
        <div>
          <label htmlFor="orbit-signin-email" className="mb-1 block text-sm font-medium text-ink">Email address</label>
          <input
            id="orbit-signin-email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-line bg-panel px-3 py-3 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="orbit-signin-password" className="mb-1 block text-sm font-medium text-ink">Password</label>
          <input
            id="orbit-signin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Your password"
            className="w-full rounded-xl border border-line bg-panel px-3 py-3 text-sm text-ink outline-none focus:border-accent"
          />
        </div>
        <div>
          <span className="mb-1 block text-sm font-medium text-ink">Your section</span>
          <div className="grid grid-cols-2 gap-2">
            {(['DS-1', 'DS-2'] as Section[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                aria-pressed={section === item}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${section === item ? 'border-accent bg-accent/10 text-accent' : 'border-line text-muted hover:border-accent'}`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={pending !== null}
          className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-on-accent transition hover:opacity-90 disabled:opacity-60"
        >
          {pending === 'email' ? 'Signing in…' : 'Sign in with email'}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-muted">OR</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => start('google')}
          disabled={pending !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-60"
        >
          <GoogleMark />
          <span>{pending === 'google' ? 'Opening Google…' : 'Continue with Google'}</span>
        </button>
        <button
          type="button"
          onClick={() => start('facebook')}
          disabled={pending !== null}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#166fe0] disabled:opacity-60"
        >
          <FacebookMark />
          <span>{pending === 'facebook' ? 'Opening Facebook…' : 'Continue with Facebook'}</span>
        </button>
      </div>

      {error && <p role="alert" className="mt-3 text-sm text-accent-2">{error}</p>}
      {!isSupabaseConfigured && (
        <p role="status" className="mt-3 text-xs text-accent-2">
          Supabase is not configured on this deployment. Email and social sign-in need the Vercel Supabase environment variables.
        </p>
      )}

      <button
        type="button"
        onClick={onOtherOptions}
        className="mt-5 text-sm text-accent underline underline-offset-4 hover:text-white"
      >
        New student? Register here · Admin options
      </button>
    </div>
  );
}
