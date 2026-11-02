'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import type { Section } from '@/types';

// The section the admin picked on the /admin hub (DS-1 or DS-2).
// It is remembered in the browser so a page refresh does not silently switch back to DS-1.
export const ADMIN_SECTION_KEY = 'ipsa_admin_section';

export function saveAdminSection(section: Section) {
  try {
    localStorage.setItem(ADMIN_SECTION_KEY, section);
  } catch {
    // private mode etc.: the choice still works until the page is refreshed
  }
}

export function useAdminSection(): Section {
  const { section, setSection } = useAuth();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADMIN_SECTION_KEY);
      if ((saved === 'DS-1' || saved === 'DS-2') && saved !== section) setSection(saved);
    } catch {
      // ignore
    }
    // Only on first load of the page
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return section;
}
