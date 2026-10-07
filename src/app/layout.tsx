import type { Metadata, Viewport } from 'next';
import { Barlow_Condensed, DM_Sans, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { OfflineIndicator } from '@/components/layout/OfflineIndicator';

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-thai',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cut 90 Planner - แผนลดไขมัน 90 วัน',
  description: 'โปรแกรมวางแผนและบันทึกการลดไขมันแบบวิทยาศาสตร์ 90 วัน',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cut 90',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${barlowCondensed.variable} ${dmSans.variable} ${notoSansThai.variable}`}
    >
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className="bg-slate-50 dark:bg-[#0b1319] text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-brand-500 selection:text-white">
        <OfflineIndicator />
        {children}
      </body>
    </html>
  );
}
