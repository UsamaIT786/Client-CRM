'use client';

import React, { useState, useRef } from 'react';
import { useAppState } from '@/context/AppContext';
import {
  Flame,
  Layers,
  Zap,
  Building,
  Edit,
  Sliders,
  UploadCloud,
  FileText,
  Trash2
} from 'lucide-react';

export default function CompaniesPage() {
  const { companies, updateCompany, logoFiles, setLogoFiles } = useAppState();

  // Modal / Editing state
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [editVat, setEditVat] = useState('');
  const [editCustomers, setEditCustomers] = useState(0);
  const [editOrders, setEditOrders] = useState(0);
  const [editRevenue, setEditRevenue] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleEditClick = (company: typeof companies[0]) => {
    setEditingCompanyId(company.id);
    setEditVat(company.vat);
    setEditCustomers(company.customers);
    setEditOrders(company.activeOrders);
    setEditRevenue(company.monthlyRevenue);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCompanyId !== null) {
      updateCompany(editingCompanyId, editVat, editCustomers, editOrders, editRevenue);
      setEditingCompanyId(null);
    }
  };

  // Mock File upload handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const filesArray = Array.from(e.dataTransfer.files).map(f => f.name);
      setLogoFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const filesArray = Array.from(e.target.files).map(f => f.name);
      setLogoFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeLogo = (index: number) => {
    setLogoFiles(prev => prev.filter((_, idx) => idx !== index));
  };

  const getCompanyStyles = (color: string) => {
    switch (color) {
      case 'Orange':
        return {
          border: 'border-orange-200 hover:border-orange-300',
          bg: 'bg-gradient-to-br from-orange-50/60 to-white',
          text: 'text-orange-700',
          accentBg: 'bg-orange-100',
          badge: 'bg-orange-500',
          icon: Flame,
          gradient: 'from-orange-500 to-amber-500'
        };
      case 'Blue':
        return {
          border: 'border-blue-200 hover:border-blue-300',
          bg: 'bg-gradient-to-br from-blue-50/60 to-white',
          text: 'text-blue-700',
          accentBg: 'bg-blue-100',
          badge: 'bg-blue-500',
          icon: Layers,
          gradient: 'from-blue-500 to-indigo-500'
        };
      case 'Green':
        return {
          border: 'border-emerald-200 hover:border-emerald-300',
          bg: 'bg-gradient-to-br from-emerald-50/60 to-white',
          text: 'text-emerald-700',
          accentBg: 'bg-emerald-100',
          badge: 'bg-emerald-500',
          icon: Zap,
          gradient: 'from-emerald-500 to-teal-500'
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-white',
          text: 'text-gray-700',
          accentBg: 'bg-gray-100',
          badge: 'bg-gray-500',
          icon: Building,
          gradient: 'from-gray-500 to-slate-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Company Management</h2>
        <p className="text-xs text-gray-400">View and update branch operations configurations for Southern Germany divisions.</p>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {companies.map((c) => {
          const styles = getCompanyStyles(c.themeColor);
          const Icon = styles.icon;
          return (
            <div
              key={c.id}
              className={`bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-sm transition-all duration-200 hover:shadow-md ${styles.border} ${styles.bg}`}
            >
              <div>
                {/* Logo and Name header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${styles.gradient} shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${styles.badge}`}>
                    ACTIVE
                  </span>
                </div>

                {/* Company Name */}
                <h3 className="text-sm font-extrabold text-slate-900 tracking-wide">{c.name}</h3>
                <span className="text-[10px] text-gray-400 font-mono font-bold block mt-1">VAT: {c.vat}</span>

                {/* Stats block */}
                <div className="grid grid-cols-3 gap-2.5 mt-5 border-t border-slate-100 pt-4 text-xs">
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-medium block">Customers</span>
                    <span className="text-base font-black text-slate-800">{c.customers}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-medium block">Orders</span>
                    <span className="text-base font-black text-slate-800">{c.activeOrders}</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] text-slate-400 font-medium block">Revenue</span>
                    <span className="text-sm font-black text-slate-850">€ {(c.monthlyRevenue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>

              {/* Actions footer */}
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-50 text-[11px] font-bold">
                <button
                  onClick={() => handleEditClick(c)}
                  className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-700"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => alert(`Settings page for ${c.name} is configured inside the Module Manager.`)}
                  className="flex-1 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1.5 text-slate-700"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Settings</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editing Dialog Modal overlay */}
      {editingCompanyId !== null && (
        <div className="fixed inset-0 bg-[#0c0d19]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Edit Company Stats</h3>
              <button onClick={() => setEditingCompanyId(null)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">VAT Registration Code</label>
                <input
                  type="text"
                  required
                  value={editVat}
                  onChange={(e) => setEditVat(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-850 font-bold font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Customer Count</label>
                  <input
                    type="number"
                    required
                    value={editCustomers}
                    onChange={(e) => setEditCustomers(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-850 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Active Orders</label>
                  <input
                    type="number"
                    required
                    value={editOrders}
                    onChange={(e) => setEditOrders(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-850 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Monthly Revenue (€)</label>
                <input
                  type="number"
                  required
                  value={editRevenue}
                  onChange={(e) => setEditRevenue(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-850 font-bold"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingCompanyId(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shared Logo Settings card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Shared Logo Settings</h3>
          <p className="text-[11px] text-gray-400">Upload branch logo icons to display across customer offers, reports, and invoices.</p>
        </div>

        {/* Dropzone design */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-violet-500 bg-violet-50/40'
              : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            className="hidden"
            accept="image/*"
          />
          <UploadCloud className="w-10 h-10 text-gray-400 mb-3" />
          <p className="text-xs font-bold text-slate-700">Drag logo images here or click to browse</p>
          <p className="text-[10px] text-gray-400 mt-1">Supports PNG, SVG, or JPEG (Max size: 5MB)</p>
        </div>

        {/* Uploaded files preview list */}
        {logoFiles.length > 0 && (
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploaded Assets ({logoFiles.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {logoFiles.map((filename, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold">
                  <div className="flex items-center gap-2 text-slate-700 truncate pr-2">
                    <FileText className="w-4 h-4 text-violet-500 shrink-0" />
                    <span className="truncate">{filename}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLogo(idx);
                    }}
                    className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
