'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppState, UserRole } from '@/context/AppContext';
import {
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Shield,
  Briefcase,
  TrendingUp,
  HardHat,
  Users
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentRole,
    currentUser,
    setRole,
    logout,
    currentCompany,
    auditLogs,
    complaints,
    isMobileMenuOpen,
    setMobileMenuOpen
  } = useAppState();

  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return ['ProCRM', 'Welcome'];
    return parts.map(p => {
      // capitalize and clean up dashes
      const cleaned = p.replace(/-/g, ' ');
      return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    });
  };

  const breadcrumbs = getBreadcrumbs();

  // Roles configurations for switcher
  const rolesInfo: Record<UserRole, { label: string; icon: React.ElementType; color: string }> = {
    admin: { label: 'Super Administrator', icon: Shield, color: 'text-violet-500 bg-violet-500/10 border-violet-500/20' },
    manager: { label: 'Operations Manager', icon: Briefcase, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
    sales: { label: 'Sales Representative', icon: Users, color: 'text-teal-500 bg-teal-500/10 border-teal-500/20' },
    crew: { label: 'Crew Lead', icon: HardHat, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    finance: { label: 'Financial Accountant', icon: TrendingUp, color: 'text-rose-500 bg-rose-500/10 border-rose-500/20' },
  };

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    setRoleOpen(false);
    
    // Auto redirect to role-specific layouts if appropriate
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else if (role === 'manager') {
      router.push('/manager/scheduling');
    } else if (role === 'finance') {
      router.push('/finance/dashboard');
    }
  };

  // Get active audit logs/complaints notifications
  const recentLogs = auditLogs.slice(0, 5);
  const unreadCount = complaints.filter(c => c.status === 'Open').length + 1;

  const currentRoleDetails = rolesInfo[currentRole] || rolesInfo.admin;
  const RoleIcon = currentRoleDetails.icon;

  return (
    <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shadow-sm">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
        <button 
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-1.5 -ml-1.5 mr-1 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <span className="hidden sm:inline text-gray-400">ProCRM</span>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <span className="text-gray-300">/</span>
            <span className={idx === breadcrumbs.length - 1 ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-700'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Navigation Right Actions */}
      <div className="flex items-center gap-4">
        {/* Company Active pill */}
        <div className="hidden lg:flex flex-col text-right">
          <span className="text-[10px] text-gray-400 font-medium">Active Branch</span>
          <span className="text-xs font-bold text-slate-800">{currentCompany}</span>
        </div>

        {/* Role Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setRoleOpen(!roleOpen);
              setNotifOpen(false);
              setProfileOpen(false);
            }}
            className={`flex items-center gap-1.5 md:gap-2 px-2.5 md:px-3 py-1.5 rounded-full border text-[10px] md:text-xs font-semibold uppercase tracking-wider shadow-sm transition-all duration-200 ${currentRoleDetails.color}`}
          >
            <RoleIcon className="w-3.5 h-3.5 hidden sm:block" />
            <span>{currentRole}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {roleOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg py-1.5 text-xs text-gray-700 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider block border-b border-gray-100 pb-1.5 mb-1.5">
                Switch Role Context
              </span>
              {(Object.keys(rolesInfo) as UserRole[]).map((r) => {
                const info = rolesInfo[r];
                const ItemIcon = info.icon;
                const isSelected = currentRole === r;
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-slate-50 transition-colors text-left ${
                      isSelected ? 'font-bold text-violet-600 bg-violet-50/50' : 'text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ItemIcon className={`w-4 h-4 ${isSelected ? 'text-violet-500' : 'text-gray-400'}`} />
                      <span className="capitalize">{r} view</span>
                    </div>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Notifications Icon with Counter */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setRoleOpen(false);
              setProfileOpen(false);
            }}
            className="w-9 h-9 rounded-full border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-600 transition-colors relative shadow-sm"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl border border-gray-200 bg-white shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-xs">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                <span className="font-bold text-gray-900">Recent Alerts</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] bg-rose-50 text-rose-600 border border-rose-100 font-bold uppercase">
                  Live Logs
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {recentLogs.map((log, idx) => (
                  <div key={idx} className="px-4 py-3 hover:bg-slate-50 border-b border-gray-50 last:border-0 transition-colors">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <span>{log.user}</span>
                      <span>{log.time.split(' ')[1] || log.time}</span>
                    </div>
                    <p className="font-semibold text-gray-800">{log.action}</p>
                    <p className="text-gray-500 mt-0.5 leading-tight">{log.details}</p>
                  </div>
                ))}
              </div>
              <div className="p-2.5 bg-slate-50 border-t border-gray-100 text-center">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    router.push('/admin/dashboard'); // Redirect to central dashboard showing all logs
                  }}
                  className="text-violet-600 font-semibold hover:underline text-[11px]"
                >
                  View central log trail
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-px bg-gray-200" />

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setRoleOpen(false);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 hover:opacity-85 transition-opacity"
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-md text-sm border-2 border-white ring-1 ring-violet-500/20">
              {currentUser?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-bold text-gray-900 leading-none">{currentUser?.name || 'Admin User'}</span>
              <span className="text-[10px] text-gray-400 font-semibold mt-0.5 tracking-wide leading-none uppercase">
                {currentRole === 'admin' ? 'Super Administrator' : `${currentRole} Team`}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-200 bg-white shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-xs">
              <div className="px-4 py-2 border-b border-gray-100 mb-1 pb-2">
                <p className="font-bold text-gray-800">{currentUser?.name || 'Admin'}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{currentUser?.email || 'admin@procrm.de'}</p>
              </div>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  router.push('/admin/users'); // Go to users
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-slate-50 transition-colors text-left"
              >
                <User className="w-4 h-4 text-gray-450" />
                <span>My Profile</span>
              </button>
              <button
                onClick={() => {
                  setProfileOpen(false);
                  router.push('/admin/module-manager'); // Config
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-slate-50 transition-colors text-left"
              >
                <Settings className="w-4 h-4 text-gray-450" />
                <span>Settings & Config</span>
              </button>
              <div className="h-px bg-gray-100 my-1" />
              <button
                onClick={() => {
                  setProfileOpen(false);
                  logout();
                  router.push('/login');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 hover:bg-rose-50 transition-colors text-left font-semibold"
              >
                <LogOut className="w-4 h-4 text-rose-500" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
