import React, { useState } from 'react';
import { useRole, ROLE_META, ROLES } from '../../context/RoleContext';
import {
  LayoutDashboard, Users, FileText, Pill, FlaskConical, Settings,
  ClipboardList, Activity, BedDouble, CreditCard, Package,
  UserCog, Building2, DollarSign, Stethoscope,
  HeartPulse, AlertCircle, TestTube2
} from 'lucide-react';

const NAV_CONFIG = {
  patient: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my-reports', label: 'My Reports', icon: FileText },
    { id: 'medications', label: 'My Medications', icon: Pill },
    { id: 'admission', label: 'Admission Details', icon: BedDouble },
    { id: 'admission-form', label: 'Admission Form', icon: ClipboardList },
    { id: 'bills', label: 'Bills', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  nurse: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'vitals', label: 'Vitals Entry', icon: Activity },
    { id: 'medication-entry', label: 'Medication Entry', icon: Pill },
    { id: 'tasks', label: 'Tasks', icon: ClipboardList },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  doctor: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  pharmacy: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'inventory', label: 'Medicine Prices', icon: CreditCard },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  lab: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'test-requests', label: 'Test Requests', icon: TestTube2 },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'user-management', label: 'User Management', icon: UserCog },
    { id: 'patient-management', label: 'Patients', icon: Users },
    { id: 'room-management', label: 'Room Management', icon: Building2 },
    { id: 'charges', label: 'Charges', icon: DollarSign },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'reports', label: 'Reports / Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ],
};

export default function Sidebar() {
  const { role, activePage, setActivePage } = useRole();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const meta = {
    label: (role ?? "N/A").toUpperCase(),
    user: user?.fullname ?? "User",
    id: user?.id ?? "ID",
    color: ROLE_META[role]?.color ?? "bg-blue-500"
  };
  const navItems = NAV_CONFIG[role] || [];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-400 flex items-center justify-center shadow-glow">
            <HeartPulse size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">
            Pulse<span className="text-blue-500">Net</span>
          </span>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="px-3 py-3 border-b border-slate-100 dark:border-slate-800">

        <div className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">

          <div className={`w-2 h-2 rounded-full ${meta?.color ?? "bg-blue-500"}`} />

          <span className="flex-1 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
            {meta?.label ?? "User"}
          </span>

        </div>

      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        {navItems?.filter(Boolean).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`sidebar-link w-full ${activePage === id ? 'sidebar-link-active' : 'sidebar-link-inactive'}`}
          >
            <Icon size={17} />
            <span>{label ?? "N/A"}</span>
          </button>
        ))}
      </nav>

      {/* User info bottom */}
      <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${meta?.color ?? "bg-blue-500"} flex items-center justify-center text-white text-xs font-bold`}>
            {(meta?.user ?? "").split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{meta?.user ?? "N/A"}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">{meta?.id ?? "N/A"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
