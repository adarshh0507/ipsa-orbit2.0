'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/auth/AuthModal';
import { OrbitDiagram } from '@/components/landing/OrbitDiagram';
import { DayOrbit } from '@/components/landing/DayOrbit';
import { SignInModal } from '@/components/landing/SignInModal';
import { supabase } from '@/lib/supabase';
import { about, alsoInside, features, founders } from '@/lib/siteContent';

export default function LandingPage() {
  const router = useRouter();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);

  // After Google or Facebook sends the person back here, take them to the student dashboard.
  useEffect(() => {
    const returningFromProvider =
      window.location.hash.includes('access_token') ||
      new URLSearchParams(window.location.search).has('code');
    if (!returningFromProvider) return;

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace('/student');
    });
    return () => data.subscription.unsubscribe();
  }, [router]);

  const openSignIn = useCallback(() => setSignInOpen(true), []);
  const closeSignIn = useCallback(() => setSignInOpen(false), []);
  const openOtherOptions = useCallback(() => {
    setSignInOpen(false);
    setAuthModalOpen(true);
  }, []);

  return (
    <div className="font-sans min-h-screen bg-page text-ink">
      {/* Header */}
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Logo size="md" showTagline={false} />
          <nav aria-label="Page sections" className="hidden items-center gap-8 text-sm text-muted md:flex">
            <a href="#app" className="hover:text-white">What it does</a>
            <a href="#about" className="hover:text-white">About</a>
            <a href="#founders" className="hover:text-white">Founders</a>
          </nav>
          <button
            type="button"
            onClick={openSignIn}
            className="rounded-lg border border-accent/60 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent hover:text-on-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Sign in
          </button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:px-8 lg:py-24">
          <div>
            <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Your whole class, in one place.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              IPSA ORBIT is a web app for first-year B.Tech Data Science students at IPS Academy Indore. Notes, the
              weekly timetable, assignments, faculty details and official notices all live here, so nobody has to dig
              through WhatsApp groups.
            </p>
            <div className="mt-12">
              <DayOrbit />
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <OrbitDiagram />
          </div>
        </section>

        {/* What it does */}
        <section id="app" className="scroll-mt-8 border-t border-line/70 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              What the app does
            </h2>
            <p className="mt-4 max-w-xl text-muted">
              Everything a student checks every day, in one app that works on a phone or a laptop.
            </p>

            <div className="mt-16 space-y-24">
              {features.map((feature, i) => (
                <div key={feature.title} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                  <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                    <h3 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{feature.title}</h3>
                    <p className="mt-4 max-w-lg leading-relaxed text-muted">{feature.body}</p>
                    <ul className="mt-6 space-y-3">
                      {feature.points.map((point) => (
                        <li key={point} className="flex gap-3 text-ink">
                          <span aria-hidden="true" className="mt-2.5 h-px w-4 shrink-0 bg-accent-2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                    <div className="overflow-hidden rounded-xl border border-line bg-panel-alt shadow-2xl shadow-black/40">
                      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3" aria-hidden="true">
                        <span className="h-2.5 w-2.5 rounded-full bg-line" />
                        <span className="h-2.5 w-2.5 rounded-full bg-line" />
                        <span className="h-2.5 w-2.5 rounded-full bg-line" />
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={feature.image} alt={feature.imageAlt} className="block h-auto w-full" loading="lazy" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-24 grid gap-8 border-t border-line/70 pt-10 sm:grid-cols-3">
              {alsoInside.map((item) => (
                <div key={item.title}>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="scroll-mt-8 border-t border-line/70 bg-panel-alt py-20">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{about.heading}</h2>
            <div>
              {about.paragraphs.map((p) => (
                <p key={p} className="mb-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                  {p}
                </p>
              ))}
              <dl className="mt-8 divide-y divide-line border-y border-line">
                {about.facts.map((fact) => (
                  <div key={fact.label} className="flex justify-between gap-6 py-3 text-sm">
                    <dt className="text-muted">{fact.label}</dt>
                    <dd className="text-right font-medium">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Founders */}
        <section id="founders" className="scroll-mt-8 border-t border-line/70 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-center text-3xl font-bold tracking-tight sm:text-4xl">Meet the founders</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-muted">The two people building IPSA ORBIT.</p>

            <div className="mt-12 flex flex-wrap justify-center gap-10 sm:gap-14">
              {founders.map((founder) => (
                <figure key={founder.name} className="w-full max-w-[260px]">
                  <div className="overflow-hidden rounded-2xl border border-line bg-panel">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={founder.image}
                      alt={founder.imageAlt}
                      className="block aspect-[4/5] w-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <figcaption className="mt-5 text-center">
                    <p className="font-display text-2xl font-semibold">{founder.name}</p>
                    <p className="text-sm font-medium text-accent-2">{founder.role}</p>
                    <p className="mx-auto mt-3 max-w-xs leading-relaxed text-muted">{founder.bio}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* Closing sign-in */}
        <section className="border-t border-line/70 bg-panel-alt py-20">
          <div className="mx-auto flex max-w-7xl flex-col items-start gap-10 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="max-w-lg">
              <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">Open your section’s orbit</h2>
              <p className="mt-4 text-muted">
                Sign in with Google or Facebook and see your timetable, notes and notices right away.
              </p>
            </div>
            <button
              type="button"
              onClick={openSignIn}
              className="rounded-xl bg-accent px-8 py-3.5 text-sm font-bold text-on-accent hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Sign in
            </button>
          </div>
        </section>
      </main>

      <Footer />

      <SignInModal open={signInOpen} onClose={closeSignIn} onOtherOptions={openOtherOptions} />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} initialTab="student_login" />
    </div>
  );
}
