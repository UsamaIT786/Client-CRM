'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/context/AppContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AppLayoutShell({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppState();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If user is not authenticated and they are trying to access dashboard pages, redirect to login
    if (!isAuthenticated && pathname !== '/login') {
      router.push('/login');
    }
    // If authenticated and user lands on root or login, redirect to dashboard
    if (isAuthenticated && (pathname === '/login' || pathname === '/')) {
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  // If root path or login path, render without layout framework
  if (pathname === '/login' || pathname === '/') {
    return <div className="min-h-screen bg-[#111224] text-white selection:bg-violet-500/30">{children}</div>;
  }

  // While redirecting unauthenticated users, show a dark slate loader screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111224] flex flex-col items-center justify-center text-white gap-4">
        <div className="w-12 h-12 rounded-xl border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
        <p className="text-sm font-semibold text-violet-400/80 tracking-wide uppercase">Securing Workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex selection:bg-violet-500/20">
      {/* Docked Left Sidebar */}
      <Sidebar />
      
      {/* Content wrapper with width offset matching the sidebar width */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen w-full">
        {/* Top Sticky Header */}
        <Navbar />
        
        {/* Scrollable page main canvas */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
