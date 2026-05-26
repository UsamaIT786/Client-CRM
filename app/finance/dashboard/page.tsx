'use client';

import React from 'react';
import { useAppState, Invoice } from '@/context/AppContext';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRightLeft
} from 'lucide-react';

export default function FinanceDashboard() {
  const { invoices, updateInvoiceStatus } = useAppState();

  // Dynamic calculations based on current invoices
  const totalGross = invoices.reduce((sum, inv) => sum + inv.grossAmount, 0);
  const totalNet = invoices.reduce((sum, inv) => sum + inv.netAmount, 0);
  const totalVat = invoices.reduce((sum, inv) => sum + inv.vatAmount, 0);

  const paidInvoices = invoices.filter((i) => i.status === 'PAID');
  const paidGross = paidInvoices.reduce((sum, inv) => sum + inv.grossAmount, 0);

  const pendingInvoices = invoices.filter((i) => i.status === 'SENT');
  const pendingGross = pendingInvoices.reduce((sum, inv) => sum + inv.grossAmount, 0);

  const overdueInvoices = invoices.filter((i) => i.status === 'OVERDUE');
  const overdueGross = overdueInvoices.reduce((sum, inv) => sum + inv.grossAmount, 0);

  const getStatusStyle = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'SENT':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'OVERDUE':
        return 'bg-rose-50 text-rose-700 border-rose-250 animate-pulse';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const cycleStatus = (invoiceNo: string, currentStatus: Invoice['status']) => {
    const sequence: Invoice['status'][] = ['SENT', 'PAID', 'OVERDUE'];
    const nextIdx = (sequence.indexOf(currentStatus) + 1) % sequence.length;
    updateInvoiceStatus(invoiceNo, sequence[nextIdx]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">Invoices & Settlements Ledger</h2>
        <p className="text-xs text-gray-400">Strict regional accounting system. VAT calculations set at 19% standard rate.</p>
      </div>

      {/* Aggregate KPI overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md hover:border-slate-350 transition-all duration-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Net Revenue Invoiced</span>
          <span className="text-2xl font-black text-slate-950">€ {totalNet.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <div className="text-[10px] text-gray-400 font-medium">Excluding VAT</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md hover:border-slate-350 transition-all duration-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total VAT (19%)</span>
          <span className="text-2xl font-black text-violet-600">€ {totalVat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <div className="text-[10px] text-violet-400 font-bold">Automatic Settlement</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 hover:shadow-md hover:border-slate-350 transition-all duration-200">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Gross Total Invoiced</span>
          <span className="text-2xl font-black text-slate-950">€ {totalGross.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <div className="text-[10px] text-gray-400 font-medium">Including VAT</div>
        </div>
      </div>

      {/* Status segments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50/50 p-4 border border-emerald-150 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest block">Settled (PAID)</span>
            <span className="text-lg font-black text-slate-800">€ {paidGross.toLocaleString()}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-100/80 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <CheckCircle className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-amber-50/50 p-4 border border-amber-150 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest block">Pending (SENT)</span>
            <span className="text-lg font-black text-slate-800">€ {pendingGross.toLocaleString()}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-100/80 text-amber-600 flex items-center justify-center border border-amber-200">
            <Clock className="w-4.5 h-4.5" />
          </div>
        </div>

        <div className="bg-rose-50/50 p-4 border border-rose-150 rounded-2xl flex items-center justify-between animate-pulse">
          <div className="space-y-0.5">
            <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-widest block">Overdue Claims</span>
            <span className="text-lg font-black text-slate-800">€ {overdueGross.toLocaleString()}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-rose-100/80 text-rose-600 flex items-center justify-center border border-rose-200">
            <AlertTriangle className="w-4.5 h-4.5" />
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Invoices List</h3>
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Click status pill to cycle states</span>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-6">Billing No.</th>
                <th className="py-3 px-4">Client Customer</th>
                <th className="py-3 px-4 text-right">Net Amount</th>
                <th className="py-3 px-4 text-right">VAT (19%)</th>
                <th className="py-3 px-4 text-right">Gross Total</th>
                <th className="py-3 px-4 text-center">Payment State</th>
                <th className="py-3 px-6 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
              {invoices.map((inv) => (
                <tr key={inv.invoiceNo} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{inv.invoiceNo}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">{inv.customer}</td>
                  <td className="py-4 px-4 text-right font-mono">
                    € {inv.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-violet-600">
                    € {inv.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-slate-900">
                    € {inv.grossAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => cycleStatus(inv.invoiceNo, inv.status)}
                        className={`px-3 py-1 rounded-full text-[9px] font-black border tracking-wider transition-all duration-200 active:scale-95 uppercase ${getStatusStyle(
                          inv.status
                        )}`}
                        title="Click to toggle"
                      >
                        {inv.status}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => cycleStatus(inv.invoiceNo, inv.status)}
                      className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 inline-flex items-center gap-1"
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      <span>Change State</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Invoicing module fully operational</span>
          <span>Regional Tax Compliance: Confirmed</span>
        </div>
      </div>
    </div>
  );
}
