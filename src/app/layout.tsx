import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'IPSA ORBIT — Your Campus. Your Universe.',
  description:
    'A centralized academic platform for First-Year B.Tech Data Science students (DS-1 & DS-2) at IPS Academy Indore. Access notes, smart timetables, assignments, announcements, faculty information, and ORBIT AI retrieval.',
  keywords: [
    'IPSA ORBIT',
    'IPS Academy Indore',
    'B.Tech Data Science',
    'Academic Portal',
    'Engineering Notes',
    'Smart Timetable',
    'ORBIT AI'
  ],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#030712] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
