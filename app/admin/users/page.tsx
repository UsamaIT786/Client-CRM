'use client';

import React, { useState } from 'react';
import { useAppState } from '@/context/AppContext';
import {
  Search,
  Filter,
  UserPlus
} from 'lucide-react';

export default function UserManagement() {
  const { users, toggleUserStatus, addUser, companies } = useAppState();

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [selectedRoleTab, setSelectedRoleTab] = useState('All');

  // Add User Form States
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Sales Staff');
  const [newUserCompany, setNewUserCompany] = useState(companies[0]?.name || 'Heating Works Southern Germany');

  // Role segment counters
  const adminCount = users.filter(u => u.role === 'Admin').length;
  const managerCount = users.filter(u => u.role === 'Manager').length;
  const salesCount = users.filter(u => u.role === 'Sales Staff').length;
  const crewCount = users.filter(u => u.role === 'Crew/Worker').length;
  const accountantCount = users.filter(u => u.role === 'Accountant').length;

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;
    
    addUser(newUserName, newUserEmail, newUserRole, newUserCompany);
    
    // Reset
    setNewUserName('');
    setNewUserEmail('');
    setShowAddForm(false);
  };

  // Filtered Users computation
  const filteredUsers = users.filter((u) => {
    // Search query check
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.company.toLowerCase().includes(searchQuery.toLowerCase());

    // Dropdown role filter check
    const matchesDropdownRole = roleFilter === 'All' || u.role === roleFilter;

    // Segment tab filter check
    const matchesTabRole =
      selectedRoleTab === 'All' ||
      (selectedRoleTab === 'Admin' && u.role === 'Admin') ||
      (selectedRoleTab === 'Manager' && u.role === 'Manager') ||
      (selectedRoleTab === 'Sales Staff' && u.role === 'Sales Staff') ||
      (selectedRoleTab === 'Crew/Worker' && u.role === 'Crew/Worker') ||
      (selectedRoleTab === 'Accountant' && u.role === 'Accountant');

    return matchesSearch && matchesDropdownRole && matchesTabRole;
  });

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-violet-50 text-violet-700 border-violet-100';
      case 'Manager':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Sales Staff':
        return 'bg-teal-50 text-teal-700 border-teal-100';
      case 'Crew/Worker':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Accountant':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">User Management</h2>
          <p className="text-xs text-gray-400">Configure administrative access credentials and system worker privileges.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="self-start md:self-center bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-[0.98]"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add System User</span>
        </button>
      </div>

      {/* Role Segmentation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {[
          { id: 'All', label: 'All Roles', count: users.length },
          { id: 'Admin', label: 'Admin', count: adminCount },
          { id: 'Manager', label: 'Manager', count: managerCount },
          { id: 'Sales Staff', label: 'Sales Staff', count: salesCount },
          { id: 'Crew/Worker', label: 'Crew/Worker', count: crewCount },
          { id: 'Accountant', label: 'Accountant', count: accountantCount },
        ].map((tab) => {
          const isActive = selectedRoleTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedRoleTab(tab.id)}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-tr from-violet-600 to-indigo-600 border-violet-500 text-white shadow-md scale-102'
                  : 'bg-white border-slate-200 text-slate-650 hover:border-slate-300'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-violet-100' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              <span className="text-xl font-black mt-2 leading-none">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="w-full sm:max-w-xs relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-250 text-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
          />
        </div>

        {/* Dropdown filters */}
        <div className="w-full sm:w-auto flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-400 font-semibold">Filter Role:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-250 text-xs text-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 font-semibold cursor-pointer"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Sales Staff">Sales Staff</option>
            <option value="Crew/Worker">Crew/Worker</option>
            <option value="Accountant">Accountant</option>
          </select>
        </div>
      </div>

      {/* Add User Modal Overlay */}
      {showAddForm && (
        <div className="fixed inset-0 bg-[#0c0d19]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-250 w-full max-w-md rounded-2xl shadow-2xl p-6 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New System User</h3>
              <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
            </div>
            
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-medium"
                  placeholder="e.g. Johannes Schmidt"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-800 font-medium"
                  placeholder="e.g. j.schmidt@procrm.de"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">System Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales Staff">Sales Staff</option>
                    <option value="Crew/Worker">Crew/Worker</option>
                    <option value="Accountant">Accountant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Company Branch</label>
                  <select
                    value={newUserCompany}
                    onChange={(e) => setNewUserCompany(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-250 rounded-xl focus:ring-2 focus:ring-violet-500 focus:outline-none text-slate-700 font-medium cursor-pointer"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.name}>{c.name.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-650 hover:bg-slate-50 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl shadow-md"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">All System Users</h3>
        </div>
        
        {/* Table responsive wrapper */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-6"># User ID</th>
                <th className="py-3 px-4">Name & Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Company Branch</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-400 font-semibold">
                    No users matching search filters found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono text-gray-400 font-bold">USR-0{user.id}</td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs">{user.name}</span>
                        <span className="text-[10px] text-gray-400">{user.email}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadgeStyle(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-semibold">{user.company}</td>
                    <td className="py-4 px-4">
                      <div className="flex justify-center items-center">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="focus:outline-none transition-transform active:scale-95 text-slate-500 hover:text-slate-800"
                          title="Toggle User Status"
                        >
                          {user.status ? (
                            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 border border-emerald-250 px-2 py-0.5 rounded-full font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 bg-rose-50 text-rose-600 border border-rose-250 px-2 py-0.5 rounded-full font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <span>Inactive</span>
                            </div>
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-400 font-mono text-[11px]">{user.lastLogin}</td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => toggleUserStatus(user.id)}
                          className="px-2.5 py-1 text-[10px] border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-semibold"
                        >
                          Toggle
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-gray-400">
          <span>Showing {filteredUsers.length} of {users.length} system credentials</span>
          <span>Regional Security Level: High</span>
        </div>
      </div>
    </div>
  );
}
