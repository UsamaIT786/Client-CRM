'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'manager' | 'sales' | 'crew' | 'finance';

export interface SystemUser {
  id: number;
  name: string;
  email: string;
  role: string;
  company: string;
  status: boolean;
  lastLogin: string;
}

export interface Company {
  id: number;
  name: string;
  themeColor: 'Orange' | 'Blue' | 'Green';
  vat: string;
  customers: number;
  activeOrders: number;
  monthlyRevenue: number;
}

export interface ModuleState {
  id: string;
  title: string;
  description: string;
  category: 'Core Modules' | 'Operations Modules' | 'Finance Modules' | 'Sales Modules' | 'Integration Modules';
  active: boolean;
}

export interface CalendarEvent {
  id: number;
  title: string;
  crew: string;
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  time: string; // "07:00" to "18:00" mapping
  startTime: string; // e.g., "08:00"
  endTime: string; // e.g., "11:00"
  type: 'Screed' | 'Heating' | 'Electrical';
  notes?: string;
  notifyWhatsApp?: boolean;
  notifyEmail?: boolean;
}

export interface OrderCost {
  orderNo: string;
  customer: string;
  type: 'Screed' | 'Heating' | 'Electrical';
  revenue: number;
  materialCost: number;
  crewCost: number;
  otherCost: number;
  status: 'Started' | 'In Progress' | 'Completed' | 'Delayed';
  notes?: string;
}

export interface Invoice {
  invoiceNo: string;
  customer: string;
  netAmount: number;
  vatAmount: number; // 19%
  grossAmount: number;
  status: 'PAID' | 'SENT' | 'OVERDUE';
}

export interface Complaint {
  id: number;
  orderNo: string;
  customer: string;
  reason: string;
  severity: 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Resolved';
}

export interface AuditLog {
  time: string;
  user: string;
  action: string;
  details: string;
}

interface AppContextType {
  // Auth state
  isAuthenticated: boolean;
  currentRole: UserRole;
  currentUser: { name: string; email: string } | null;
  currentCompany: string;
  login: (role: UserRole, company: string) => void;
  logout: () => void;
  setRole: (role: UserRole) => void;

  // Users state
  users: SystemUser[];
  toggleUserStatus: (userId: number) => void;
  addUser: (name: string, email: string, role: string, company: string) => void;

  // Companies state
  companies: Company[];
  updateCompany: (id: number, vat: string, customers: number, activeOrders: number, monthlyRevenue: number) => void;
  logoFiles: string[];
  setLogoFiles: React.Dispatch<React.SetStateAction<string[]>>;

  // Modules state
  modules: ModuleState[];
  toggleModule: (id: string) => void;

  // Scheduler state
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;

  // Costings & orders state
  orderCosts: OrderCost[];
  updateOrderStatus: (orderNo: string, status: OrderCost['status'], notes: string) => void;
  updateOrderCostDetails: (orderNo: string, revenue: number, material: number, crew: number, other: number) => void;

  // Invoices state
  invoices: Invoice[];
  updateInvoiceStatus: (invoiceNo: string, status: Invoice['status']) => void;

  // Complaints state
  complaints: Complaint[];
  addComplaint: (orderNo: string, customer: string, reason: string, severity: 'High' | 'Medium' | 'Low') => void;
  resolveComplaint: (id: number) => void;

  // Audit state
  // Mobile Menu
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('admin');
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [currentCompany, setCurrentCompany] = useState<string>('Screed Works Southern Germany');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Audit log initialization
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { time: '2026-05-27 08:30:15', user: 'admin@procrm.de', action: 'User login', details: 'Super Admin logged in from Munich IP' },
    { time: '2026-05-27 08:42:10', user: 'admin@procrm.de', action: 'Config update', details: 'Core module database configured' },
  ]);

  const addAuditLog = (action: string, details: string) => {
    const now = new Date();
    const formattedTime = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
    setAuditLogs((prev) => [
      {
        time: formattedTime,
        user: currentUser?.email || 'System',
        action,
        details,
      },
      ...prev,
    ]);
  };

  const login = (role: UserRole, company: string) => {
    setIsAuthenticated(true);
    setCurrentRole(role);
    setCurrentCompany(company);
    
    let name = 'Admin User';
    let email = 'admin@procrm.de';
    if (role === 'manager') { name = 'Manager User'; email = 'manager@procrm.de'; }
    else if (role === 'sales') { name = 'Sales Representative'; email = 'sales@procrm.de'; }
    else if (role === 'crew') { name = 'Crew Lead'; email = 'crew@procrm.de'; }
    else if (role === 'finance') { name = 'Financial Accountant'; email = 'finance@procrm.de'; }
    
    setCurrentUser({ name, email });
    // Add audit log manually to prevent infinite render if using helper directly inside set state
    const now = new Date();
    const formattedTime = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
    setAuditLogs((prev) => [
      { time: formattedTime, user: email, action: 'User login', details: `Logged in as ${role} for ${company}` },
      ...prev,
    ]);
  };

  const logout = () => {
    const oldEmail = currentUser?.email || 'user';
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentRole('admin');
    const now = new Date();
    const formattedTime = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 8)}`;
    setAuditLogs((prev) => [
      { time: formattedTime, user: oldEmail, action: 'User logout', details: 'User logged out' },
      ...prev,
    ]);
  };

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    addAuditLog('Role switch', `Context role switched to ${role}`);
  };

  // Users state
  const [users, setUsers] = useState<SystemUser[]>([
    { id: 1, name: 'Admin User', email: 'admin@procrm.de', role: 'Admin', company: 'Screed Works Southern Germany', status: true, lastLogin: '2026-05-27 08:30' },
    { id: 2, name: 'Manager User', email: 'manager@procrm.de', role: 'Manager', company: 'Heating Works Southern Germany', status: true, lastLogin: '2026-05-27 08:15' },
    { id: 3, name: 'Sales Staff 1', email: 'sales1@procrm.de', role: 'Sales Staff', company: 'Electrical Works Southern Germany', status: true, lastLogin: '2026-05-26 17:40' },
    { id: 4, name: 'Sales Staff 2', email: 'sales2@procrm.de', role: 'Sales Staff', company: 'Heating Works Southern Germany', status: false, lastLogin: '2026-05-20 11:20' },
    { id: 5, name: 'Crew Worker 1', email: 'worker1@procrm.de', role: 'Crew/Worker', company: 'Screed Works Southern Germany', status: true, lastLogin: '2026-05-27 07:00' },
    { id: 6, name: 'Crew Worker 2', email: 'worker2@procrm.de', role: 'Crew/Worker', company: 'Electrical Works Southern Germany', status: true, lastLogin: '2026-05-27 07:05' },
    { id: 7, name: 'Accountant 1', email: 'finance@procrm.de', role: 'Accountant', company: 'Screed Works Southern Germany', status: true, lastLogin: '2026-05-26 09:00' },
  ]);

  const toggleUserStatus = (userId: number) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = !u.status;
          addAuditLog('User state toggle', `User ${u.email} status changed to ${nextStatus ? 'Active' : 'Inactive'}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const addUser = (name: string, email: string, role: string, company: string) => {
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser: SystemUser = {
      id: newId,
      name,
      email,
      role,
      company,
      status: true,
      lastLogin: 'Never logged in',
    };
    setUsers((prev) => [...prev, newUser]);
    addAuditLog('User created', `Added user ${email} as ${role} for ${company}`);
  };

  // Companies state
  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: 'Heating Works Southern Germany', themeColor: 'Orange', vat: 'DE 123456789', customers: 84, activeOrders: 21, monthlyRevenue: 154000 },
    { id: 2, name: 'Screed Works Southern Germany', themeColor: 'Blue', vat: 'DE 987654321', customers: 92, activeOrders: 24, monthlyRevenue: 198000 },
    { id: 3, name: 'Electrical Works Southern Germany', themeColor: 'Green', vat: 'DE 456789123', customers: 71, activeOrders: 18, monthlyRevenue: 133000 },
  ]);

  const updateCompany = (id: number, vat: string, customers: number, activeOrders: number, monthlyRevenue: number) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          addAuditLog('Company profile updated', `Updated VAT details & stats for ${c.name}`);
          return { ...c, vat, customers, activeOrders, monthlyRevenue };
        }
        return c;
      })
    );
  };

  const [logoFiles, setLogoFiles] = useState<string[]>([]);

  // Modules state
  const [modules, setModules] = useState<ModuleState[]>([
    { id: 'offers', title: 'Offers & Quotes', description: 'Create and manage professional offers with real-time material price estimation.', category: 'Core Modules', active: true },
    { id: 'orders', title: 'Order Management', description: 'Assign work orders, track status, and coordinate site installations.', category: 'Core Modules', active: true },
    { id: 'invoicing', title: 'Invoice Module', description: 'Generate progress invoices, calculations, and final tax-ready billing structures.', category: 'Finance Modules', active: true },
    { id: 'crew', title: 'Crew Management', description: 'Schedule worker roles, manage crew credentials, and log admissions.', category: 'Operations Modules', active: true },
    { id: 'materials', title: 'Material Ordering', description: 'Place requests directly with suppliers and manage site inventories.', category: 'Operations Modules', active: true },
    { id: 'warehouse', title: 'Warehouse & Logistics', description: 'Manage stocks, barcodes, and vehicle supply inventory tracking.', category: 'Operations Modules', active: false },
    { id: 'whatsapp', title: 'WhatsApp Communications', description: 'Send automated scheduling confirmations and status pings to crews.', category: 'Integration Modules', active: false },
    { id: 'sap', title: 'SAP Gateway Integrations', description: 'Export accounting structures directly to regional corporate ERP.', category: 'Integration Modules', active: false },
  ]);

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const nextState = !m.active;
          addAuditLog('Module toggle', `${m.title} turned ${nextState ? 'ON' : 'OFF'}`);
          return { ...m, active: nextState };
        }
        return m;
      })
    );
  };

  // Scheduler state
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: 1, title: 'ORD-052: Baumater... Screed', crew: 'Crew Alpha - Screed', day: 'Mon', startTime: '08:00', endTime: '11:00', time: '08:00 - 11:00', type: 'Screed', notes: 'Apply sound insulation underlay first.' },
    { id: 2, title: 'ORD-059: Wohnbau AG... Heating', crew: 'Crew Beta - Heating', day: 'Wed', startTime: '10:00', endTime: '14:00', time: '10:00 - 14:00', type: 'Heating', notes: 'Install floor manifolds on the ground floor.' },
    { id: 3, title: 'ORD-061: Sparkasse... Electrical', crew: 'Crew Gamma - Electric', day: 'Thu', startTime: '13:00', endTime: '17:00', time: '13:00 - 17:00', type: 'Electrical', notes: 'Check high voltage terminals.' },
    { id: 4, title: 'ORD-065: Schmidt GmbH... Screed', crew: 'Crew Alpha - Screed', day: 'Fri', startTime: '09:00', endTime: '13:00', time: '09:00 - 13:00', type: 'Screed', notes: 'Ensure fast curing additive is added.' },
  ]);

  const addEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const nextId = events.length > 0 ? Math.max(...events.map((e) => e.id)) + 1 : 1;
    const newEvent: CalendarEvent = {
      ...eventData,
      id: nextId,
      time: `${eventData.startTime} - ${eventData.endTime}`,
    };
    setEvents((prev) => [...prev, newEvent]);
    addAuditLog('Event scheduled', `Scheduled ${eventData.type} order '${eventData.title}' for ${eventData.day} (${eventData.startTime}-${eventData.endTime})`);
    
    // Automatically trigger capacity impact
    const isHeating = eventData.type === 'Heating';
    const isScreed = eventData.type === 'Screed';
    const isElectrical = eventData.type === 'Electrical';
    
    // Increment active orders for respective company
    setCompanies((prev) =>
      prev.map((c) => {
        if (isHeating && c.name.includes('Heating')) {
          return { ...c, activeOrders: c.activeOrders + 1 };
        }
        if (isScreed && c.name.includes('Screed')) {
          return { ...c, activeOrders: c.activeOrders + 1 };
        }
        if (isElectrical && c.name.includes('Electrical')) {
          return { ...c, activeOrders: c.activeOrders + 1 };
        }
        return c;
      })
    );
  };

  // Costings & orders state
  const [orderCosts, setOrderCosts] = useState<OrderCost[]>([
    { orderNo: 'ORD-052', customer: 'Baumaterial GmbH', type: 'Screed', revenue: 24500, materialCost: 8200, crewCost: 6400, otherCost: 1500, status: 'In Progress', notes: 'Standard work. Fast drying concrete applied.' },
    { orderNo: 'ORD-059', customer: 'Wohnbau AG', type: 'Heating', revenue: 38200, materialCost: 15400, crewCost: 9800, otherCost: 2200, status: 'Started', notes: 'Hydronic floor heating installation.' },
    { orderNo: 'ORD-061', customer: 'Sparkasse Filiale', type: 'Electrical', revenue: 18500, materialCost: 5100, crewCost: 6200, otherCost: 1200, status: 'Completed', notes: 'Renovation project electrical cabling.' },
    { orderNo: 'ORD-065', customer: 'Schmidt GmbH', type: 'Screed', revenue: 12900, materialCost: 4100, crewCost: 3800, otherCost: 800, status: 'Delayed', notes: 'Subfloor not dry, waiting for screed layout.' },
    { orderNo: 'ORD-072', customer: 'Müller Private', type: 'Heating', revenue: 8500, materialCost: 3100, crewCost: 2400, otherCost: 500, status: 'Completed', notes: 'Pump unit replacement and flushing.' },
  ]);

  const updateOrderStatus = (orderNo: string, status: OrderCost['status'], notes: string) => {
    setOrderCosts((prev) =>
      prev.map((o) => {
        if (o.orderNo === orderNo) {
          addAuditLog('Order status updated', `Order ${orderNo} status changed to ${status}`);
          return { ...o, status, notes };
        }
        return o;
      })
    );
  };

  const updateOrderCostDetails = (orderNo: string, revenue: number, material: number, crew: number, other: number) => {
    setOrderCosts((prev) =>
      prev.map((o) => {
        if (o.orderNo === orderNo) {
          addAuditLog('Order costing modified', `Cost items edited for ${orderNo}: Rev €${revenue}`);
          return { ...o, revenue, materialCost: material, crewCost: crew, otherCost: other };
        }
        return o;
      })
    );
  };

  // Invoices state
  const [invoices, setInvoices] = useState<Invoice[]>([
    { invoiceNo: 'RE-2026-001', customer: 'Baumaterial GmbH', netAmount: 20588.24, vatAmount: 3911.76, grossAmount: 24500, status: 'PAID' },
    { invoiceNo: 'RE-2026-002', customer: 'Wohnbau AG', netAmount: 32100.84, vatAmount: 6099.16, grossAmount: 38200, status: 'SENT' },
    { invoiceNo: 'RE-2026-003', customer: 'Sparkasse Filiale', netAmount: 15546.22, vatAmount: 2953.78, grossAmount: 18500, status: 'OVERDUE' },
    { invoiceNo: 'RE-2026-004', customer: 'Schmidt GmbH', netAmount: 10840.34, vatAmount: 2059.66, grossAmount: 12900, status: 'PAID' },
  ]);

  const updateInvoiceStatus = (invoiceNo: string, status: Invoice['status']) => {
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.invoiceNo === invoiceNo) {
          addAuditLog('Invoice payment updated', `${invoiceNo} set to ${status}`);
          return { ...inv, status };
        }
        return inv;
      })
    );
  };

  // Complaints state
  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: 1, orderNo: 'ORD-052', customer: 'Baumaterial GmbH', reason: 'Screed thickness uneven in Room B', severity: 'High', status: 'Open' },
    { id: 2, orderNo: 'ORD-059', customer: 'Wohnbau AG', reason: 'Heating manifold leaking valve', severity: 'Medium', status: 'Resolved' },
  ]);

  const addComplaint = (orderNo: string, customer: string, reason: string, severity: 'High' | 'Medium' | 'Low') => {
    const nextId = complaints.length > 0 ? Math.max(...complaints.map((c) => c.id)) + 1 : 1;
    const newComplaint: Complaint = {
      id: nextId,
      orderNo,
      customer,
      reason,
      severity,
      status: 'Open',
    };
    setComplaints((prev) => [newComplaint, ...prev]);
    addAuditLog('Complaint lodged', `Filed ${severity} severity complaint on ${orderNo} - ${customer}`);
  };

  const resolveComplaint = (id: number) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          addAuditLog('Complaint resolved', `Complaint #${id} on order ${c.orderNo} set to Resolved`);
          return { ...c, status: 'Resolved' };
        }
        return c;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentRole,
        currentUser,
        currentCompany,
        login,
        logout,
        setRole,
        users,
        toggleUserStatus,
        addUser,
        companies,
        updateCompany,
        logoFiles,
        setLogoFiles,
        modules,
        toggleModule,
        events,
        addEvent,
        orderCosts,
        updateOrderStatus,
        updateOrderCostDetails,
        invoices,
        updateInvoiceStatus,
        complaints,
        addComplaint,
        resolveComplaint,
        auditLogs,
        addAuditLog,
        isMobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppContextProvider');
  }
  return context;
};
