'use client';

import React from 'react';
import { useAppState } from '@/context/AppContext';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';
import {
  TrendingUp,
  Percent,
  HardHat,
  AlertCircle,
  Activity
} from 'lucide-react';

export default function CapacityPlanningPage() {
  const { events } = useAppState();

  // Calculate dynamic capacity load based on events scheduled
  // Let's count how many events are scheduled for each day to make it reactive!
  const getDayCount = (day: string) => events.filter(e => e.day === day).length;

  const weeklyLoadData = [
    { day: 'Mon', Current: 15000 + getDayCount('Mon') * 10000, Planned: 35000 },
    { day: 'Tue', Current: 18000 + getDayCount('Tue') * 10000, Planned: 40000 },
    { day: 'Wed', Current: 22000 + getDayCount('Wed') * 10000, Planned: 30000 },
    { day: 'Thu', Current: 25000 + getDayCount('Thu') * 10000, Planned: 45000 },
    { day: 'Fri', Current: 12000 + getDayCount('Fri') * 10000, Planned: 25000 },
  ];

  // Calculate dynamic utilization of crews based on event counts
  const getCrewEventCount = (crewSub: string) => events.filter(e => e.crew.includes(crewSub)).length;
  
  // Base utilization + 10% per event scheduled, capped at 100%
  const alphaUtil = Math.min(60 + getCrewEventCount('Alpha') * 15, 100);
  const betaUtil = Math.min(50 + getCrewEventCount('Beta') * 15, 100);
  const gammaUtil = Math.min(40 + getCrewEventCount('Gamma') * 15, 100);

  const utilizationData = [
    { name: 'Crew Alpha (Screed)', percentage: alphaUtil, color: '#3b82f6' },
    { name: 'Crew Beta (Heating)', percentage: betaUtil, color: '#f97316' },
    { name: 'Crew Gamma (Electric)', percentage: gammaUtil, color: '#10b981' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Capacity Planning & Load Analysis</h2>
        <p className="text-xs text-gray-400">Track and compare weekly installation costs against planned capacity limits.</p>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Double-Axis Composed Chart (Planned vs Current load) */}
        <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              Weekly Order Volume (€) - Current vs. Planned
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Reactive to operations scheduling items</p>
          </div>

          <div className="h-64 w-full text-xs my-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={weeklyLoadData} margin={{ top: 10, right: -10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" label={{ value: 'Value (€)', angle: -90, position: 'insideLeft', offset: 10 }} />
                <Tooltip formatter={(value) => [`€ ${Number(value).toLocaleString()}`, '']} />
                <Legend iconType="rect" />
                <Bar dataKey="Current" fill="#8b5cf6" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Line type="monotone" dataKey="Planned" stroke="#ef4444" strokeWidth={2.5} activeDot={{ r: 6 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crew Utilization percentage tracking */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-slate-650" />
              Crew Utilization by Team
            </h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Calculated based on active calendar hours</p>
          </div>

          {/* Vertical progress bars */}
          <div className="space-y-6 my-6 flex-1 flex flex-col justify-center text-xs">
            {utilizationData.map((crew, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-700">{crew.name}</span>
                  <span className="text-slate-900 font-bold">{crew.percentage}%</span>
                </div>
                {/* Progress bar container */}
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${crew.percentage}%`,
                      backgroundColor: crew.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-150 pt-4 flex items-center gap-2 text-[10px] font-bold text-gray-500 leading-tight">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Crews exceeding 90% allocation might trigger scheduling conflicts.</span>
          </div>
        </div>
      </div>

      {/* Extra KPI cards for Capacity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center border border-violet-100 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Scheduled Slots</span>
            <span className="text-base font-black text-slate-900">{events.length} Appointments</span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
            <Percent className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Avg Utilization</span>
            <span className="text-base font-black text-slate-900">
              {((alphaUtil + betaUtil + gammaUtil) / 3).toFixed(0)}% Capacity Load
            </span>
          </div>
        </div>

        <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Weekly Revenue Load</span>
            <span className="text-base font-black text-slate-900">
              € {weeklyLoadData.reduce((sum, item) => sum + item.Current, 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
