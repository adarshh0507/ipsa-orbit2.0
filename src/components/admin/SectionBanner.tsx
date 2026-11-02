'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, GraduationCap } from 'lucide-react';
import type { Section } from '@/types';

// Small bar at the top of each admin page: shows which section is being managed
// and gives a way back to the hub to switch between DS-1 and DS-2.
export function SectionBanner({ section }: { section: Section }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-line bg-panel px-4 py-2.5">
      <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
        <GraduationCap className="h-4 w-4 text-accent" aria-hidden="true" />
        Managing <span className="rounded-full bg-accent/15 px-2.5 py-0.5 font-bold text-accent">{section}</span>
        <span className="font-normal text-muted">(also shows items meant for both sections)</span>
      </span>
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline">
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        Change section
      </Link>
    </div>
  );
}
