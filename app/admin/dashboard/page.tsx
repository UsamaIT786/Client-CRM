'use client';

import React from 'react';
import { useAppState } from '@/context/AppContext';
import {
  Users,
  Coins,
  Wrench,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  AlertTriangle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export default function AdminDashboard() {
  const { users, companies, complaints, auditLogs, orderCosts } = useAppState();

  // Metrics details
  const activeUsersCount = users.filter(u => u.status).length;
  const activeOrdersCount = orderCosts.filter(o => o.status !== 'Completed').length;
  
  // Calculate total revenue from companies
  const totalRevenue = companies.reduce((sum, c) => sum + c.monthlyRevenue, 0); // ~485000
  const activeComplaints = complaints.filter(c => c.status === 'Open');

  // Chart data
  const revenueTrendData = [
    { month: 'Jan', 'Heating Works': 120000, 'Screed Works': 140000, 'Electrical Works': 90000 },
    { month: 'Feb', 'Heating Works': 135000, 'Screed Works': 155000, 'Electrical Works': 95000 },
    { month: 'Mar', 'Heating Works': 130000, 'Screed Works': 165000, 'Electrical Works': 110000 },
    { month: 'Apr', 'Heating Works': 148000, 'Screed Works': 180000, 'Electrical Works': 120000 },
    { month: 'May', 'Heating Works': 154000, 'Screed Works': 198000, 'Electrical Works': 133000 },
  ];

  const pieData = companies.map(c => ({
    name: c.name.split(' ')[0] + ' Works',
    value: c.monthlyRevenue,
    color: c.themeColor === 'Orange' ? '#f97316' : c.themeColor === 'Blue' ? '#3b82f6' : '#10b981'
  }));

  const metrics = [
    {
      title: 'Total Customers',
      value: '247',
      change: '+12 this month',
      isPositive: true,
      icon: Users,
      color: 'bg-violet-50 text-violet-600 border-violet-100',
    },
    {
      title: 'Total Revenue',
      value: `€ ${(totalRevenue / 1000).toFixed(0)}K`,
      change: '+6.5% vs last month',
      isPositive: true,
      icon: Coins,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Active Orders',
      value: activeOrdersCount.toString(),
      change: '+1 scheduled today',
      isPositive: true,
      icon: Wrench,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    {
      title: 'System Users',
      value: users.length.toString(),
      change: `${activeUsersCount} active / 3 roles`,
      isPositive: true,
      icon: ShieldAlert,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-[#1a1b35] to-[#252850] p-6 rounded-2xl border border-[#2b2e5a] shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-violet-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">Welcome back, Admin 👋</h2>
          <p className="text-xs text-violet-300 mt-1 leading-relaxed">
            All system branches for Heating, Screed, and Electrical works are online and synchronized.
          </p>
        </div>
        <div className="flex items-center gap-2 relative z-10 self-start md:self-center bg-[#292b56] border border-[#3e4178] px-3.5 py-1.5 rounded-xl text-white">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider">Gateway Status: Live</span>
        </div>
      </div>

      {/* 4 Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{card.title}</span>
                <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${card.color}`}>
                  <CardIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-slate-900 leading-none">{card.value}</span>
                <div className="flex items-center gap-1 mt-1.5">
                  {card.isPositive ? (
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                  )}
                  <span className={`text-[10px] font-bold ${card.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {card.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Revenue Overview</h3>
              <p className="text-[11px] text-gray-400">Overlapping division revenue performance (€)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border font-bold">2026</span>
            </div>
          </div>

          <div className="h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHeating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorScreed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorElectrical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(value) => [`€ ${Number(value).toLocaleString()}`, '']} />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: 10 }} />
                <Area type="monotone" dataKey="Heating Works" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorHeating)" />
                <Area type="monotone" dataKey="Screed Works" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorScreed)" />
                <Area type="monotone" dataKey="Electrical Works" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorElectrical)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Share Pie Chart */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-sans">Revenue by Company</h3>
            <p className="text-[11px] text-gray-400">Current share ratios between divisions</p>
          </div>

          <div className="h-56 w-full flex items-center justify-center text-xs my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`€ ${Number(value).toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-4">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">
                  € {(item.value / 1000).toFixed(0)}K ({((item.value / totalRevenue) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Layout - Recent Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Warnings & System Alerts */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Active System Complaints
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-rose-50 text-rose-600 font-bold border border-rose-100">
              {activeComplaints.length} Needs Review
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-64 custom-scrollbar text-xs">
            {activeComplaints.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No active complaints found. System is clean.</div>
            ) : (
              activeComplaints.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.orderNo}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      item.severity === 'High'
                        ? 'bg-rose-50 text-rose-600 border border-rose-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {item.severity} Severity
                    </span>
                  </div>
                  <p className="text-slate-650 leading-tight font-medium">{item.reason}</p>
                  <p className="text-[10px] text-gray-400">Customer: {item.customer}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Audit Log Trail */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-violet-500" />
              Recent Operations Trail
            </h3>
            <span className="text-[10px] text-gray-400 font-bold">Auto-updated</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-slate-400 font-bold border-b border-slate-100 pb-2">
                  <th className="py-2 pr-2">Timestamp</th>
                  <th className="py-2 px-2">Actor</th>
                  <th className="py-2 px-2">Event Type</th>
                  <th className="py-2 pl-2">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-650 font-medium">
                {auditLogs.slice(0, 5).map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-2.5 pr-2 text-gray-400 font-mono">{log.time}</td>
                    <td className="py-2.5 px-2 font-bold text-slate-800">{log.user.split('@')[0]}</td>
                    <td className="py-2.5 px-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 pl-2 truncate max-w-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
