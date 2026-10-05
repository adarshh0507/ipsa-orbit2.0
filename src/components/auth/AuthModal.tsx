'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Section } from '@/types';
import { Logo } from '@/components/brand/Logo';
import { 
  X, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Lock, 
  Mail, 
  User, 
  KeyRound, 
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'student_login' | 'student_register' | 'admin_login';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'student_login'
}) => {
  const { loginAsStudent, loginAsAdmin, registerStudent, loginWithGoogle } = useAuth();
  const [tab, setTab] = useState<'student_login' | 'student_register' | 'admin_login'>(initialTab);

  // Student Login State
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPassword, setStudentPassword] = useState('');
  const [loginSection, setLoginSection] = useState<Section>('DS-1');

  // Student Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regSection, setRegSection] = useState<Section>('DS-1');
  const [regEnrollment, setRegEnrollment] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('admin@orbit.ipsacademy.ac.in');
  const [adminKey, setAdminKey] = useState('admin123456');

  // Error messages
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentEmail || !studentPassword) {
      setError('Please provide student email and password');
      return;
    }
    const nameGuess = studentEmail.split('@')[0].replace('.', ' ');
    const formattedName = nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1);
    loginAsStudent(loginSection, formattedName, studentEmail);
    onClose();
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await loginWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start Google login. Please try again.');
    }
  };

  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      setError('Please fill in all mandatory fields');
      return;
    }
    registerStudent({
      name: regName,
      email: regEmail,
      section: regSection,
      enrollmentNo: regEnrollment
    });
    onClose();
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminKey !== 'admin123456' && adminKey !== 'orbit@2026') {
      setError('Invalid admin credentials. Default demo passkey is admin123456');
      return;
    }
    loginAsAdmin(adminEmail);
    onClose();
  };

  const handleQuickDemo = (role: 'ds1' | 'ds2' | 'admin') => {
    if (role === 'ds1') {
      loginAsStudent('DS-1', 'Aarav Sharma', 'aarav.sharma@orbit.ipsacademy.ac.in');
    } else if (role === 'ds2') {
      loginAsStudent('DS-2', 'Priya Patel', 'priya.patel@orbit.ipsacademy.ac.in');
    } else {
      loginAsAdmin();
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      {/* Container */}
      <div className="relative w-full max-w-xl rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl shadow-cyan-950/40 overflow-hidden flex flex-col">
        {/* Glow ambient header */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-violet-500" />
        
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 flex items-center justify-between">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher Bar */}
        <div className="px-6 py-2.5 bg-slate-900/60 border-b border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Instant Demo Access:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickDemo('ds1')}
              className="px-2.5 py-1 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-900/50 transition-colors"
            >
              Student DS-1
            </button>
            <button
              onClick={() => handleQuickDemo('ds2')}
              className="px-2.5 py-1 rounded bg-violet-950/80 text-violet-300 border border-violet-500/30 hover:bg-violet-900/50 transition-colors"
            >
              Student DS-2
            </button>
            <button
              onClick={() => handleQuickDemo('admin')}
              className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-500/30 hover:bg-amber-900/50 transition-colors"
            >
              Admin Portal
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => { setTab('student_login'); setError(null); }}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              tab === 'student_login'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Student Login
          </button>
          <button
            onClick={() => { setTab('student_register'); setError(null); }}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              tab === 'student_register'
                ? 'text-cyan-400 border-b-2 border-cyan-400 bg-cyan-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Student Register
          </button>
          <button
            onClick={() => { setTab('admin_login'); setError(null); }}
            className={`flex-1 py-3 text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              tab === 'admin_login'
                ? 'text-amber-400 border-b-2 border-amber-400 bg-amber-500/5'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Gateway
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: STUDENT LOGIN */}
          {tab === 'student_login' && (
            <form onSubmit={handleStudentLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Assigned Section
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setLoginSection('DS-1')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      loginSection === 'DS-1'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    Section DS-1
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginSection('DS-2')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      loginSection === 'DS-2'
                        ? 'border-violet-400 bg-violet-500/20 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.25)]'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-violet-400" />
                    Section DS-2
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  College Email ID
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.target.value)}
                    placeholder="student.name@orbit.ipsacademy.ac.in"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={studentPassword}
                    onChange={(e) => setStudentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>Enter Orbit Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 py-1">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-[11px] text-slate-500 font-medium">OR</span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span className="font-bold text-base">G</span>
                Continue with Google
              </button>

              <p className="text-center text-[11px] text-slate-500">
                Use any Google account — college email is not required.
              </p>
            </form>
          )}

          {/* TAB 2: STUDENT REGISTRATION */}
          {tab === 'student_register' && (
            <form onSubmit={handleStudentRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Enrollment No / Roll No
                  </label>
                  <input
                    type="text"
                    value={regEnrollment}
                    onChange={(e) => setRegEnrollment(e.target.value)}
                    placeholder="0808DS251001"
                    className="w-full px-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  First Year Section *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRegSection('DS-1')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      regSection === 'DS-1'
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    B.Tech DS-1
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegSection('DS-2')}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      regSection === 'DS-2'
                        ? 'border-violet-400 bg-violet-500/20 text-violet-300'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}
                  >
                    B.Tech DS-2
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  College / Approved Student Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="yourname@orbit.ipsacademy.ac.in"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Choose Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <span>Complete Registration & Join Orbit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 3: ADMIN ACCESS PORTAL */}
          {tab === 'admin_login' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                <span>
                  Admin gateway is strictly reserved for IPS Academy department coordinators and authorized faculty. Self-registration is disabled for security.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department Admin Account
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@orbit.ipsacademy.ac.in"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Admin Passkey
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="admin123456"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900/80 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">Default test passkey: <code className="text-amber-300">admin123456</code></p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-semibold text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all mt-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Authorize & Open Admin Control Center</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
