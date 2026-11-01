'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { orbitStore } from '@/lib/store';
import { useNowMs } from '@/lib/useNowMs';
import { dayIndexOfKey, formatDateKey, toIst } from '@/lib/timetableLogic';

export default function AdminHolidaysPage() {
  const [, bump] = useState(0);
  const [date, setDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const nowMs = useNowMs();

  useEffect(() => orbitStore.subscribe(() => bump((n) => n + 1)), []);

  const holidays = orbitStore.getHolidays();
  const todayKey = nowMs ? toIst(nowMs).dateKey : '';

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!date) {
      setError('Pick a date first.');
      return;
    }
    if (dayIndexOfKey(date) === 0) {
      setError('Sundays are already holidays, so there is nothing to add.');
      return;
    }
    if (!orbitStore.addHoliday(date, reason)) {
      setError('That date is already marked as a holiday.');
      return;
    }
    setDate('');
    setReason('');
  };

  return (
    <DashboardLayout role="admin">
      <div className="mx-auto max-w-2xl space-y-6 animate-fadeIn">
        <div className="border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-400" aria-hidden="true" />
            <h1 className="text-2xl font-black text-white">Holidays</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400 md:text-sm">
            On these dates students see the holiday message instead of lectures, plus the next working day&apos;s
            timetable to prepare for. Sundays are always holidays and do not need to be added.
          </p>
        </div>

        <form onSubmit={handleAdd} className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[11rem_1fr]">
            <label className="block text-xs font-semibold text-slate-300">
              Date
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={todayKey || undefined}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
              />
            </label>
            <label className="block text-xs font-semibold text-slate-300">
              Reason shown to students
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Diwali, Founders Day, Exam duty..."
                maxLength={80}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-white"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="text-xs font-semibold text-rose-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add holiday
          </button>
        </form>

        {holidays.length === 0 ? (
          <p className="rounded-2xl border border-white/5 bg-slate-950/40 px-4 py-8 text-center text-sm text-slate-400">
            No holidays added yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {holidays.map((h) => {
              const past = todayKey !== '' && h.date < todayKey;
              return (
                <li
                  key={h.id}
                  className={`flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 ${
                    past ? 'opacity-50' : ''
                  }`}
                >
                  <div>
                    <p className="text-sm font-bold text-white">{formatDateKey(h.date)}</p>
                    <p className="text-xs text-slate-400">{h.reason || 'Holiday'}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => orbitStore.deleteHoliday(h.id)}
                    aria-label={`Remove holiday on ${formatDateKey(h.date)}`}
                    className="rounded-lg border border-rose-900/50 p-1.5 text-rose-400 hover:bg-rose-950/40"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
