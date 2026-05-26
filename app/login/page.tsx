'use client';

import React, { useState } from 'react';
import { useAppState, UserRole } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Briefcase,
  Users,
  HardHat,
  TrendingUp,
  Lock,
  Mail,
  Building,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function LoginPage() {
  const { login, companies } = useAppState();
  const router = useRouter();

  // Form states
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [selectedCompany, setSelectedCompany] = useState(companies[1]?.name || 'Screed Works Southern Germany');
  const [username, setUsername] = useState('admin@procrm.de');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);

  // Quick access role handler
  const handleQuickAccess = (role: UserRole) => {
    setSelectedRole(role);
    setShowError(false);
    
    // Auto populate credentials
    let email = 'admin@procrm.de';
    let companyName = 'Screed Works Southern Germany';
    
    if (role === 'manager') {
      email = 'manager@procrm.de';
      companyName = 'Heating Works Southern Germany';
    } else if (role === 'sales') {
      email = 'sales1@procrm.de';
      companyName = 'Electrical Works Southern Germany';
    } else if (role === 'crew') {
      email = 'worker1@procrm.de';
      companyName = 'Screed Works Southern Germany';
    } else if (role === 'finance') {
      email = 'finance@procrm.de';
      companyName = 'Screed Works Southern Germany';
    }

    setUsername(email);
    setPassword('password123');
    setSelectedCompany(companyName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setShowError(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate slight network lag for realistic premium feel
    setTimeout(() => {
      login(selectedRole, selectedCompany);
      setIsSubmitting(false);
      
      // Route based on role
      if (selectedRole === 'admin') {
        router.push('/admin/dashboard');
      } else if (selectedRole === 'manager') {
        router.push('/manager/scheduling');
      } else if (selectedRole === 'finance') {
        router.push('/finance/dashboard');
      } else {
        router.push('/admin/dashboard');
      }
    }, 600);
  };

  const roleTabs = [
    { id: 'admin', label: 'Admin', icon: Shield, desc: 'Full System Control' },
    { id: 'manager', label: 'Manager', icon: Briefcase, desc: 'Site Operations' },
    { id: 'sales', label: 'Sales', icon: Users, desc: 'Quotes & Clients' },
    { id: 'crew', label: 'Crew', icon: HardHat, desc: 'On-Site Tasks' },
    { id: 'finance', label: 'Finance', icon: TrendingUp, desc: 'Settlements & Margin' },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0c0d1b] via-[#12132a] to-[#07070f] overflow-hidden px-4">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Main card panel */}
      <div className="w-full max-w-xl bg-[#14152b]/80 border border-[#2b2d5a] backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 relative z-10 transition-all duration-300">
        
        {/* Top Branding Section */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-bold text-2xl shadow-lg shadow-violet-500/20 mb-3 border border-violet-400/30">
            P
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-wide">ProCRM Business Suite</h2>
          <p className="text-xs text-violet-400/90 font-medium uppercase mt-1 tracking-widest">Southern Germany Works</p>
          <p className="text-[10px] text-gray-500 mt-0.5">Regional Enterprise Resource & Management System</p>
        </div>

        {/* Quick Access tabs */}
        <div className="mb-6">
          <label className="text-[10px] font-bold text-violet-400 uppercase tracking-widest block mb-2 text-center">
            Quick Access by Role Context
          </label>
          <div className="grid grid-cols-5 gap-1.5 p-1 bg-[#0a0a14]/60 rounded-xl border border-[#232442]">
            {roleTabs.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = selectedRole === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleQuickAccess(tab.id as UserRole)}
                  className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-b from-violet-600 to-violet-700 text-white shadow-md shadow-violet-600/10 border border-violet-500/30 scale-105'
                      : 'text-gray-450 hover:bg-[#1a1b36] hover:text-gray-200'
                  }`}
                >
                  <TabIcon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-bold tracking-wide uppercase">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {showError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-[11px] font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              Please provide a valid username and password credentials.
            </div>
          )}

          {/* Branch Company Select */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Select Company Entity
            </label>
            <div className="relative">
              <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <select
                value={selectedCompany}
                onChange={(e) => setSelectedCompany(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#0a0b18]/80 border border-[#26274a] text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-medium appearance-none cursor-pointer"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#121326] text-gray-200">
                    {c.name} ({c.themeColor} Works)
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0b18]/80 border border-[#26274a] text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-medium"
                  placeholder="name@procrm.de"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0b18]/80 border border-[#26274a] text-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {/* Native/Custom Role Selector */}
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
              Access Role Level
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['admin', 'manager', 'sales', 'crew', 'finance'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`py-2 border rounded-lg uppercase text-[9px] font-bold tracking-wider transition-all duration-200 ${
                    selectedRole === role
                      ? 'border-violet-500 text-violet-400 bg-violet-500/10'
                      : 'border-[#26274a] text-gray-500 hover:text-gray-300 hover:border-gray-600 bg-transparent'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-violet-600/10 hover:shadow-violet-600/20 active:scale-[0.99] flex items-center justify-center gap-2 mt-6 text-sm"
          >
            {isSubmitting ? (
              <>
                <div className="w-4.5 h-4.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                <span>Authorizing Credentials...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        {/* Security badge and details */}
        <div className="mt-6 pt-4 border-t border-[#26274a] flex items-center justify-between text-[10px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secured with RBAC Policy v1.4</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer hover:text-gray-300 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Desk</span>
          </div>
        </div>
      </div>
    </div>
  );
}
