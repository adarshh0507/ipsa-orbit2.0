import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, THEME_INIT_SCRIPT } from '@/context/ThemeContext';
import { PwaRegister } from '@/components/pwa/PwaRegister';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
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
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'IPSA ORBIT',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0908',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-page text-ink selection:bg-accent/30">
        <ThemeProvider>
          <PwaRegister />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
