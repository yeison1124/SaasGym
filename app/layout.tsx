import type { Metadata, Viewport } from 'next';
import { Inter, Barlow_Condensed } from 'next/font/google';
import './globals.css';
import { PWAProvider } from '@/components/pwa/PWAProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#F26522',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'GymPulse — SaaS de Retención para Gimnasios',
  description:
    'Detectá qué miembros están por irse antes de que dejen de pagar. El motor de retención que se paga solo.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GymPulse',
  },
  icons: {
    icon: '/icons/icon.svg',
    apple: '/icons/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GymPulse" />
      </head>
      <body className="bg-[#FAF8F5] text-[#181D27] min-h-screen flex flex-col antialiased selection:bg-[#F26522]/20 font-sans">
        <PWAProvider />
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}

