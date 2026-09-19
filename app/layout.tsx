import type { Metadata } from 'next';
import { Inter, Barlow_Condensed } from 'next/font/google';
import './globals.css';

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

export const metadata: Metadata = {
  title: 'GetGym — SaaS de Retención para Gimnasios',
  description:
    'Detectá qué miembros están por irse antes de que dejen de pagar. El motor de retención que se paga solo.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className="bg-[#FAF8F5] text-[#181D27] min-h-screen flex flex-col antialiased selection:bg-[#F26522]/20 font-sans">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
