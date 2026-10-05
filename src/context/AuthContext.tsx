'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, Section } from '@/types';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  section: Section;
  isLoading: boolean;
  loginAsStudent: (section: Section, name?: string, email?: string) => void;
  loginAsAdmin: (email?: string) => void;
  loginWithGoogle: () => Promise<void>;
  registerStudent: (data: { name: string; email: string; section: Section; enrollmentNo?: string }) => void;
  logout: () => void;
  setSection: (section: Section) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const DEFAULT_DS1_STUDENT: UserProfile = {
  id: 'usr-student-ds1-01',
  email: 'aarav.sharma@orbit.ipsacademy.ac.in',
  full_name: 'Aarav Sharma',
  role: 'student',
  section: 'DS-1',
  enrollment_no: '0808DS251001',
  avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  created_at: '2026-08-01T00:00:00Z'
};

const DEFAULT_DS2_STUDENT: UserProfile = {
  id: 'usr-student-ds2-02',
  email: 'priya.patel@orbit.ipsacademy.ac.in',
  full_name: 'Priya Patel',
  role: 'student',
  section: 'DS-2',
  enrollment_no: '0808DS252042',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  created_at: '2026-08-01T00:00:00Z'
};

const DEFAULT_ADMIN: UserProfile = {
  id: 'usr-admin-01',
  email: 'admin@orbit.ipsacademy.ac.in',
  full_name: 'Prof. Rajesh Verma',
  role: 'admin',
  section: 'DS-1', // Default focus
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  created_at: '2026-07-01T00:00:00Z'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [section, setSectionState] = useState<Section>('DS-1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const applySupabaseUser = (authUser: any) => {
      if (!authUser) return false;

      const metadata = authUser.user_metadata || {};
      const fullName =
        metadata.full_name ||
        metadata.name ||
        authUser.email?.split('@')[0] ||
        'Google Student';

      const googleUser: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        full_name: fullName,
        role: 'student',
        section: 'DS-1',
        enrollment_no: '',
        avatar_url:
          metadata.avatar_url ||
          metadata.picture ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
        created_at: authUser.created_at || new Date().toISOString()
      };

      if (mounted) {
        setUser(googleUser);
        setSectionState('DS-1');
        localStorage.setItem('ipsa_orbit_active_user', JSON.stringify(googleUser));
      }

      return true;
    };

    // Restore a real Supabase session first; fall back to the existing demo session.
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      if (data.session?.user) {
        applySupabaseUser(data.session.user);
        setIsLoading(false);
        return;
      }

      try {
        // Check local storage for persistent user
    try {
      const savedUser = localStorage.getItem('ipsa_orbit_active_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser) as UserProfile;
        setUser(parsed);
        setSectionState(parsed.section || 'DS-1');
      } else {
        // Default to a guest student DS-1 for instant preview
        setUser(DEFAULT_DS1_STUDENT);
        setSectionState('DS-1');
      }
      } catch {
        setUser(DEFAULT_DS1_STUDENT);
      } finally {
        setIsLoading(false);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;

      if (session?.user) {
        applySupabaseUser(session.user);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginAsStudent = (sec: Section, name = 'Aarav Sharma', email?: string) => {
    const studentUser: UserProfile = {
      id: `std-${Date.now()}`,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@orbit.ipsacademy.ac.in`,
      full_name: name,
      role: 'student',
      section: sec,
      enrollment_no: `0808DS25${sec === 'DS-1' ? '1' : '2'}${Math.floor(100 + Math.random() * 900)}`,
      avatar_url: sec === 'DS-1' ? DEFAULT_DS1_STUDENT.avatar_url : DEFAULT_DS2_STUDENT.avatar_url,
      created_at: new Date().toISOString()
    };
    setUser(studentUser);
    setSectionState(sec);
    localStorage.setItem('ipsa_orbit_active_user', JSON.stringify(studentUser));
  };

  const loginAsAdmin = (email = 'admin@orbit.ipsacademy.ac.in') => {
    const adminUser: UserProfile = {
      ...DEFAULT_ADMIN,
      email
    };
    setUser(adminUser);
    localStorage.setItem('ipsa_orbit_active_user', JSON.stringify(adminUser));
  };

  const registerStudent = (data: { name: string; email: string; section: Section; enrollmentNo?: string }) => {
    const studentUser: UserProfile = {
      id: `std-${Date.now()}`,
      email: data.email,
      full_name: data.name,
      role: 'student',
      section: data.section,
      enrollment_no: data.enrollmentNo || `0808DS25${data.section === 'DS-1' ? '1' : '2'}${Math.floor(100 + Math.random() * 900)}`,
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(data.name)}`,
      created_at: new Date().toISOString()
    };
    setUser(studentUser);
    setSectionState(data.section);
    localStorage.setItem('ipsa_orbit_active_user', JSON.stringify(studentUser));
  };

  const loginWithGoogle = async () => {
    const redirectTo =
      typeof window !== 'undefined'
        ? window.location.origin
        : 'https://ipsa-orbit2-0.vercel.app';

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo
      }
    });

    if (error) {
      throw error;
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('ipsa_orbit_active_user');
  };

  const setSection = (newSection: Section) => {
    setSectionState(newSection);
    if (user) {
      const updated = { ...user, section: newSection };
      setUser(updated);
      localStorage.setItem('ipsa_orbit_active_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        section,
        isLoading,
        loginAsStudent,
        loginAsAdmin,
        loginWithGoogle,
        registerStudent,
        logout,
        setSection,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
