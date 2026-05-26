'use client';

import React from 'react';
import { useAppState } from '@/context/AppContext';
import {
  Cpu,
  CheckCircle
} from 'lucide-react';

export default function ModuleManagerPage() {
  const { modules, toggleModule } = useAppState();

  // Group modules by category
  const categories = [
    { name: 'Core Modules', desc: 'Required system modules running core CRM operations.' },
    { name: 'Operations Modules', desc: 'Scheduling, dispatch, and resource planning modules.' },
    { name: 'Finance Modules', desc: 'Invoicing, cost ledgers, and billing calculators.' },
    { name: 'Integration Modules', desc: 'External messaging gateways, ERP systems, and API exports.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Module Manager Switchboard</h2>
          <p className="text-xs text-gray-400">Toggle system features and integrations instantly. Updates reflect live on all branches.</p>
        </div>
        <div className="bg-[#f1f5f9] border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start md:self-center">
          <Cpu className="w-4 h-4 text-violet-500" />
          <span>Active Modules: {modules.filter(m => m.active).length} / {modules.length}</span>
        </div>
      </div>

      {/* Main Switchboard Canvas */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryModules = modules.filter(m => m.category.includes(category.name.split(' ')[0]));
          if (categoryModules.length === 0) return null;

          return (
            <div key={category.name} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {/* Category Header */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-sm font-extrabold text-slate-900 tracking-wide">{category.name}</h3>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{category.desc}</p>
              </div>

              {/* Rows List */}
              <div className="divide-y divide-slate-100 px-6">
                {categoryModules.map((module) => (
                  <div key={module.id} className="py-4.5 flex items-center justify-between gap-6 hover:bg-slate-50/20 transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs">{module.title}</span>
                        {module.active ? (
                          <span className="flex items-center gap-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[8px] font-black uppercase tracking-wider px-1 py-0.2 rounded-md">
                            Online
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 bg-slate-50 text-slate-400 border border-slate-200 text-[8px] font-black uppercase tracking-wider px-1 py-0.2 rounded-md">
                            Offline
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-450 leading-relaxed max-w-2xl font-medium">{module.description}</p>
                    </div>

                    {/* Animated Toggle Switch */}
                    <button
                      onClick={() => toggleModule(module.id)}
                      className={`w-11 h-6 rounded-full transition-colors duration-250 ease-in-out relative flex items-center shrink-0 border focus:outline-none focus:ring-2 focus:ring-violet-500/25 ${
                        module.active
                          ? 'bg-violet-600 border-violet-500'
                          : 'bg-slate-200 border-slate-300'
                      }`}
                    >
                      <span
                        className={`w-4.5 h-4.5 rounded-full bg-white shadow-md border border-slate-200/50 transition-transform duration-250 ease-in-out absolute ${
                          module.active ? 'translate-x-5.5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Switchboard Policy Footer */}
      <div className="bg-[#f8fafc] border border-slate-200 p-4.5 rounded-2xl flex items-start gap-3 text-xs font-semibold text-slate-650">
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="text-slate-800 font-bold">Automatic Configuration Synchronization</p>
          <p className="text-[11px] text-gray-400 font-medium leading-normal">
            Toggling core settings automatically triggers serverless state pushes and records logs to the central system audit logger.
          </p>
        </div>
      </div>
    </div>
  );
}
