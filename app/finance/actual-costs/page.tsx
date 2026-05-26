'use client';

import React, { useState } from 'react';
import { useAppState, OrderCost } from '@/context/AppContext';
import {
  FileSpreadsheet,
  Upload
} from 'lucide-react';

export default function ActualCostsPage() {
  const {
    orderCosts,
    updateOrderStatus,
    addComplaint
  } = useAppState();

  // Modals state
  const [activeOrderNo, setActiveOrderNo] = useState<string | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // Update order form states
  const [updateStatus, setUpdateStatus] = useState<OrderCost['status']>('In Progress');
  const [updateNotes, setUpdateNotes] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  // Complaint form states
  const [complaintReason, setComplaintReason] = useState('');
  const [complaintSeverity, setComplaintSeverity] = useState<'High' | 'Medium' | 'Low'>('High');

  // Math aggregates for Post-Calculation Matrix
  const totalRevenue = orderCosts.reduce((sum, o) => sum + o.revenue, 0);
  const totalMaterial = orderCosts.reduce((sum, o) => sum + o.materialCost, 0);
  const totalCrew = orderCosts.reduce((sum, o) => sum + o.crewCost, 0);
  const totalOther = orderCosts.reduce((sum, o) => sum + o.otherCost, 0);
  const totalCost = totalMaterial + totalCrew + totalOther;
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // Cost variance calculations (Mock planned vs actual)
  const plannedCrewCost = totalCrew * 0.94; // Assuming actual crew cost has a 6% overrun
  const crewCostVariance = totalCrew - plannedCrewCost;

  const handleOpenUpdateModal = (order: OrderCost) => {
    setActiveOrderNo(order.orderNo);
    setUpdateStatus(order.status);
    setUpdateNotes(order.notes || '');
    setAttachedFiles([]);
    setShowUpdateModal(true);
  };

  const handleOpenComplaintModal = (order: OrderCost) => {
    setActiveOrderNo(order.orderNo);
    setComplaintReason('');
    setComplaintSeverity('High');
    setShowComplaintModal(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrderNo) {
      updateOrderStatus(activeOrderNo, updateStatus, updateNotes);
      setShowUpdateModal(false);
    }
  };

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeOrderNo && complaintReason) {
      const order = orderCosts.find((o) => o.orderNo === activeOrderNo);
      addComplaint(activeOrderNo, order?.customer || 'Unknown Customer', complaintReason, complaintSeverity);
      setShowComplaintModal(false);
    }
  };

  // Mock file attachment drag/drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fileNames = Array.from(e.dataTransfer.files).map(f => f.name);
      setAttachedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileNames = Array.from(e.target.files).map(f => f.name);
      setAttachedFiles(prev => [...prev, ...fileNames]);
    }
  };

  const getMarginBadgeStyle = (margin: number) => {
    if (margin > 30) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (margin > 15) return 'bg-amber-50 text-amber-700 border border-amber-200';
    return 'bg-rose-50 text-rose-700 border border-rose-200';
  };

  const getOrderStatusStyle = (status: OrderCost['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-250';
      case 'In Progress':
        return 'bg-blue-50 text-blue-600 border border-blue-250';
      case 'Started':
        return 'bg-indigo-50 text-indigo-600 border border-indigo-250';
      case 'Delayed':
        return 'bg-rose-50 text-rose-600 border border-rose-250 animate-pulse';
      default:
        return 'bg-slate-50 text-slate-600';
    }
  };

  const selectedOrderDetails = orderCosts.find(o => o.orderNo === activeOrderNo);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Post-Calculation & Actual Costs</h2>
        <p className="text-xs text-gray-400">Review project profit margins, material bills, and labour expense variances.</p>
      </div>

      {/* Aggregate Post-Calculation Matrix cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Project Revenue</span>
          <span className="text-2xl font-black text-slate-950 mt-2">€ {totalRevenue.toLocaleString()}</span>
          <span className="text-[10px] text-gray-400 mt-1 block">Accumulated gross value</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Net Profit Margin</span>
          <span className="text-2xl font-black text-emerald-600 mt-2">€ {totalProfit.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Total project overhead covered</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Labour Variance</span>
          <span className="text-2xl font-black text-rose-600 mt-2">+ € {crewCostVariance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          <span className="text-[10px] text-rose-500 font-bold mt-1 block">6.0% Over budget overrun</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Avg Profit Margin</span>
          <span className="text-2xl font-black text-slate-950 mt-2">{avgMargin.toFixed(1)} %</span>
          <span className="text-[10px] text-gray-400 mt-1 block">Target threshold: 30%</span>
        </div>
      </div>

      {/* Spreadsheet / Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-violet-500" />
            Order Post-Calculation Sheet
          </h3>
        </div>

        {/* Responsive wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Order No.</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Materials</th>
                <th className="py-3 px-4 text-right">Crew Costs</th>
                <th className="py-3 px-4 text-right">Other</th>
                <th className="py-3 px-4 text-right">Total Cost</th>
                <th className="py-3 px-4 text-right">Profit Margin</th>
                <th className="py-3 px-6 text-center">Interactivity Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
              {orderCosts.map((o) => {
                const totalItemCost = o.materialCost + o.crewCost + o.otherCost;
                const itemProfit = o.revenue - totalItemCost;
                const itemMargin = o.revenue > 0 ? (itemProfit / o.revenue) * 100 : 0;

                return (
                  <tr key={o.orderNo} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-slate-900">{o.orderNo}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">{o.customer}</td>
                    <td className="py-4 px-4 text-slate-600 font-semibold">{o.type} works</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getOrderStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">€ {o.revenue.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600">€ {o.materialCost.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600">€ {o.crewCost.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-mono text-slate-600">€ {o.otherCost.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right font-mono text-slate-900">€ {totalItemCost.toLocaleString()}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="font-bold font-mono text-slate-900">€ {itemProfit.toLocaleString()}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${getMarginBadgeStyle(itemMargin)}`}>
                          {itemMargin.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleOpenUpdateModal(o)}
                          className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-50 text-violet-600 rounded-lg shrink-0 transition-all"
                        >
                          Update State
                        </button>
                        <button
                          onClick={() => handleOpenComplaintModal(o)}
                          className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 hover:bg-slate-50 text-rose-600 rounded-lg shrink-0 transition-all"
                        >
                          Complaint
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Status Update Modal Overlay */}
      {showUpdateModal && activeOrderNo && selectedOrderDetails && (
        <div className="fixed inset-0 bg-[#0c0d19]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Update Order State</h3>
                <p className="text-[10px] text-gray-400">Order: {activeOrderNo} — {selectedOrderDetails.customer}</p>
              </div>
              <button onClick={() => setShowUpdateModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              {/* Radio state selectors */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">State Toggles</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['Started', 'In Progress', 'Completed', 'Delayed'] as OrderCost['status'][]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setUpdateStatus(status)}
                      className={`py-2.5 border rounded-xl font-bold uppercase text-[9px] tracking-wider transition-all duration-200 ${
                        updateStatus === status
                          ? 'border-violet-500 text-violet-500 bg-violet-50'
                          : 'border-slate-200 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Notes */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">State Notes / Issues</label>
                <textarea
                  required
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-medium h-20 resize-none"
                  placeholder="Detail any blockages, delays, or completions here..."
                />
              </div>

              {/* File Upload zone */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Attach Site Documentation</label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    dragActive ? 'border-violet-500 bg-violet-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                  onClick={() => document.getElementById('modalFileSelect')?.click()}
                >
                  <input
                    type="file"
                    id="modalFileSelect"
                    className="hidden"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <Upload className="w-6 h-6 text-gray-400 mb-1" />
                  <p className="text-[10px] text-slate-700 font-bold">Drag site reports here or click to upload</p>
                </div>
                
                {/* Upload filenames list */}
                {attachedFiles.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {attachedFiles.map((fn, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[9px] text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                        <span className="truncate">{fn}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
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

      {/* Create Complaint Modal Overlay */}
      {showComplaintModal && activeOrderNo && selectedOrderDetails && (
        <div className="fixed inset-0 bg-[#0c0d19]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">File Customer Complaint</h3>
                <p className="text-[10px] text-gray-400">Linked to: {activeOrderNo} — {selectedOrderDetails.customer}</p>
              </div>
              <button onClick={() => setShowComplaintModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleComplaintSubmit} className="space-y-4">
              {/* Reason */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Issue / Complaint Reason</label>
                <textarea
                  required
                  value={complaintReason}
                  onChange={(e) => setComplaintReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-medium h-24 resize-none"
                  placeholder="Detail client feedback or installation defects..."
                />
              </div>

              {/* Severity */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Severity Rating</label>
                <select
                  value={complaintSeverity}
                  onChange={(e) => setComplaintSeverity(e.target.value as 'High' | 'Medium' | 'Low')}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-bold cursor-pointer"
                >
                  <option value="High">🔴 High Severity (Immediate escalation)</option>
                  <option value="Medium">🟡 Medium Severity (Crew inspection needed)</option>
                  <option value="Low">🟢 Low Severity (Minor adjustments)</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowComplaintModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
