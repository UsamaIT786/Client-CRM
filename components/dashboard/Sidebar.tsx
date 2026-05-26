'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppState } from '@/context/AppContext';
import {
  LayoutDashboard,
  Users,
  Building2,
  Grid,
  Calendar,
  BarChart3,
  TrendingUp,
  Settings,
  ShieldCheck,
  Database,
  FileSpreadsheet,
  Wrench,
  Layers,
  ShoppingBag
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  role?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const { currentRole, complaints, isMobileMenuOpen, setMobileMenuOpen } = useAppState();
  
  const activeComplaintsCount = complaints.filter(c => c.status === 'Open').length;

  const navItems: SidebarItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Companies', href: '/admin/companies', icon: Building2 },
    { name: 'Module Manager', href: '/admin/module-manager', icon: Grid },
    { name: 'Operations Matrix', href: '/manager/scheduling', icon: Calendar },
    { name: 'Capacity Planner', href: '/manager/capacity', icon: BarChart3 },
    { name: 'Financial Ledger', href: '/finance/dashboard', icon: FileSpreadsheet },
    { name: 'Actual Costings', href: '/finance/actual-costs', icon: TrendingUp },
  ];

  // Mock disabled items for standard CRM flow as requested:
  // Customers, Suppliers, Materials, Services, Settings, Audit Logs, Backup & Data
  const placeholderItems = [
    { name: 'Customers', icon: Users },
    { name: 'Suppliers', icon: ShoppingBag },
    { name: 'Materials', icon: Wrench },
    { name: 'Services', icon: Layers },
    { name: 'Settings', icon: Settings },
    { name: 'Audit Logs', icon: ShieldCheck },
    { name: 'Backup & Data', icon: Database },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <aside className={`w-64 bg-[#141527] text-gray-300 flex flex-col h-screen fixed left-0 top-0 border-r border-[#242646] shadow-xl z-30 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Branding */}
      <div className="h-16 flex items-center px-6 border-b border-[#242646] bg-[#1a1b35] gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-400 flex items-center justify-center font-bold text-white shadow-md shadow-violet-500/20">
          P
        </div>
        <div>
          <h1 className="font-bold text-white text-lg tracking-wide leading-none">ProCRM</h1>
          <span className="text-[10px] text-violet-400 font-semibold tracking-wider uppercase">Southern Germany</span>
        </div>
      </div>

      {/* Role Indicator Info */}
      <div className="p-4 mx-3 my-4 bg-[#1f203f]/50 border border-[#2b2d56] rounded-xl flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-400 font-medium">Logged Role</span>
          <span className="text-sm font-semibold text-white capitalize">{currentRole}</span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] bg-violet-500/20 text-violet-300 border border-violet-500/30 uppercase font-bold tracking-wider">
          Active
        </span>
      </div>

      {/* Primary Links */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1 py-2 custom-scrollbar">
        <span className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Core Operations</span>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600/30 to-indigo-600/10 text-white border-l-2 border-violet-500 pl-2.5'
                  : 'hover:bg-[#1c1d37] hover:text-white text-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-violet-400' : 'text-gray-400 group-hover:text-violet-400'}`} />
                <span>{item.name}</span>
              </div>
              {item.name === 'Operations Matrix' && activeComplaintsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                  {activeComplaintsCount}
                </span>
              )}
            </Link>
          );
        })}

        <div className="h-px bg-[#20213b] my-4" />

        <span className="px-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-2">Modules & Settings</span>
        {placeholderItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.name}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed group hover:bg-[#1a1b32]/10"
            >
              <Icon className="w-4 h-4 text-gray-600" />
              <span>{item.name}</span>
              <span className="ml-auto text-[9px] text-gray-600 border border-gray-700/50 px-1.5 py-0.2 rounded uppercase font-semibold">Locked</span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-[#242646] bg-[#101121] text-center text-xs text-gray-500">
        <p className="font-semibold text-gray-400">ProCRM v14.2.1</p>
        <p className="text-[10px] mt-0.5">© Southern Germany Works</p>
      </div>
      </aside>
    </>
  );
}
