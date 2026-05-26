'use client';

import React, { useState } from 'react';
import { useAppState, CalendarEvent } from '@/context/AppContext';
import {
  Clock,
  HardHat,
  Plus,
  MessageSquare,
  Mail
} from 'lucide-react';

export default function SchedulingPage() {
  const { events, addEvent, orderCosts } = useAppState();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderNo, setSelectedOrderNo] = useState(orderCosts[0]?.orderNo || 'ORD-052');
  const [crew, setCrew] = useState('Crew Alpha - Screed');
  const [day, setDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Mon');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('11:00');
  const [notes, setNotes] = useState('');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyEmail, setNotifyEmail] = useState(false);

  // Time grid layout data
  const hours = [
    '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];
  const days: ('Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri')[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const getEventPosition = (event: CalendarEvent) => {
    const parseTime = (t: string) => {
      const parts = t.split(':');
      return parseInt(parts[0]) + parseInt(parts[1] || '0') / 60;
    };
    const start = parseTime(event.startTime);
    const end = parseTime(event.endTime);
    
    const top = (start - 7) * 44; // 44px per hour slot
    const height = (end - start) * 44;
    
    return { top: `${top}px`, height: `${height}px` };
  };

  const getEventColorStyle = (type: string) => {
    switch (type) {
      case 'Screed':
        return 'bg-blue-500/10 text-blue-700 border-blue-300 hover:bg-blue-500/15';
      case 'Heating':
        return 'bg-orange-500/10 text-orange-700 border-orange-300 hover:bg-orange-500/15';
      case 'Electrical':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300 hover:bg-emerald-500/15';
      default:
        return 'bg-slate-500/10 text-slate-700 border-slate-300';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const matchedOrder = orderCosts.find(o => o.orderNo === selectedOrderNo);
    const orderTitle = `${selectedOrderNo}: ${matchedOrder?.customer.split(' ')[0]}... ${matchedOrder?.type}`;

    addEvent({
      title: orderTitle,
      crew,
      day,
      time: `${startTime} - ${endTime}`,
      startTime,
      endTime,
      type: matchedOrder?.type || 'Screed',
      notes,
      notifyWhatsApp,
      notifyEmail
    });

    // Reset Form
    setNotes('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Operations Scheduler Matrix</h2>
          <p className="text-xs text-gray-400">Coordinate worker dispatch schedules and client installation timings.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start md:self-center bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Appointment</span>
        </button>
      </div>

      {/* Timeline Grid Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 md:p-6 overflow-hidden">
        {/* Responsive wrapper */}
        <div className="overflow-x-auto">
          <div className="min-w-[700px] relative select-none">
            {/* Header row: Days */}
            <div className="grid grid-cols-6 border-b border-slate-100 pb-3 text-center">
              <div className="text-slate-400 text-xs font-bold py-1 text-left pl-2">Time</div>
              {days.map((d) => (
                <div key={d} className="text-slate-900 text-xs font-bold py-1 border-l border-slate-100 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>

            {/* Time Grid Layout */}
            <div className="relative flex" style={{ height: `${11 * 44}px` }}>
              {/* Left Hour labels */}
              <div className="w-1/6 flex flex-col justify-between h-full py-0">
                {hours.map((hour) => (
                  <div key={hour} className="text-[10px] text-gray-400 font-bold font-mono h-[44px] flex items-start pt-1">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Matrix Columns */}
              <div className="w-5/6 grid grid-cols-5 h-full relative">
                {/* Vertical Gridlines */}
                {days.map((d) => (
                  <div key={d} className="border-l border-slate-100 h-full relative">
                    {/* Horizontal lines */}
                    {Array.from({ length: 11 }).map((_, hIdx) => (
                      <div
                        key={hIdx}
                        className="absolute w-full border-b border-slate-100/60"
                        style={{ top: `${hIdx * 44}px`, height: '44px' }}
                      />
                    ))}

                    {/* Filter events for this day */}
                    {events
                      .filter((e) => e.day === d)
                      .map((event) => {
                        const { top, height } = getEventPosition(event);
                        return (
                          <div
                            key={event.id}
                            style={{ top, height }}
                            className={`absolute left-1.5 right-1.5 p-2 rounded-lg border text-[10px] leading-tight font-semibold flex flex-col justify-between shadow-sm cursor-pointer transition-all duration-200 z-10 hover:scale-[1.02] ${getEventColorStyle(
                              event.type
                            )}`}
                          >
                            <div>
                              <span className="font-extrabold text-slate-800 block truncate">{event.title}</span>
                              <span className="text-[9px] opacity-75 mt-0.5 flex items-center gap-1">
                                <Clock className="w-2.5 h-2.5" />
                                {event.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[8px] bg-white/60 border border-current px-1 py-0.2 rounded w-fit uppercase font-bold tracking-wide">
                              <HardHat className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{event.crew.split(' - ')[0]}</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-[#0c0d19]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Installation Appointment</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Linked order */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Linked Order</label>
                <select
                  value={selectedOrderNo}
                  onChange={(e) => setSelectedOrderNo(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-semibold cursor-pointer"
                >
                  {orderCosts.map((o) => (
                    <option key={o.orderNo} value={o.orderNo}>
                      {o.orderNo} - {o.customer} ({o.type} works)
                    </option>
                  ))}
                </select>
              </div>

              {/* Assign Crew */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Assign Crew Team</label>
                <select
                  value={crew}
                  onChange={(e) => setCrew(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-semibold cursor-pointer"
                >
                  <option value="Crew Alpha - Screed">Crew Alpha (Screed)</option>
                  <option value="Crew Beta - Heating">Crew Beta (Heating)</option>
                  <option value="Crew Gamma - Electric">Crew Gamma (Electrical)</option>
                </select>
              </div>

              {/* Date Day */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Day of Week</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {days.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDay(d)}
                      className={`py-2 border rounded-lg font-bold transition-all duration-200 ${
                        day === d
                          ? 'border-violet-500 text-violet-500 bg-violet-50'
                          : 'border-slate-200 text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hour Ranges */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Start Time</label>
                  <input
                    type="time"
                    min="07:00"
                    max="18:00"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">End Time</label>
                  <input
                    type="time"
                    min="07:00"
                    max="18:00"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-bold"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Installation Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-medium h-16 resize-none"
                  placeholder="Instructions for site technicians..."
                />
              </div>

              {/* Toggle notifications */}
              <div className="bg-slate-50 p-3 rounded-xl space-y-2 border border-slate-100">
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Send Dispatch Notifications</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-bold">
                    <input
                      type="checkbox"
                      checked={notifyWhatsApp}
                      onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                      className="rounded text-violet-600 focus:ring-violet-500"
                    />
                    <MessageSquare className="w-3.5 h-3.5 text-violet-500" />
                    <span>Crew WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-bold">
                    <input
                      type="checkbox"
                      checked={notifyEmail}
                      onChange={(e) => setNotifyEmail(e.target.checked)}
                      className="rounded text-violet-600 focus:ring-violet-500"
                    />
                    <Mail className="w-3.5 h-3.5 text-violet-500" />
                    <span>Client Email</span>
                  </label>
                </div>
              </div>

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
