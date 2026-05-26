import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';
import AppLayoutShell from '@/components/dashboard/AppLayoutShell';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'ProCRM - Southern Germany Works',
  description: 'Enterprise ERP and CRM Dashboard System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased bg-[#f8fafc] text-slate-800 h-full`}>
        <AppContextProvider>
          <AppLayoutShell>{children}</AppLayoutShell>
        </AppContextProvider>
      </body>
    </html>
  );
}
