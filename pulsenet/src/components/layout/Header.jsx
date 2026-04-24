import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useRole, ROLE_META } from '../../context/RoleContext';
import { Sun, Moon, Bell, Search, ChevronRight } from 'lucide-react';

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  'my-reports': 'My Reports',
  medications: 'My Medications',
  admission: 'Admission Details',
  'admission-form': 'Admission Form',
  bills: 'Bills',
  patients: 'Patients',
  vitals: 'Vitals Entry',
  'medication-entry': 'Medication Entry',
  tasks: 'Tasks',
  prescriptions: 'Prescriptions',
  inventory: 'Medicine Inventory',
  billing: 'Billing',
  'test-requests': 'Test Requests',
  reports: 'Reports',
  'user-management': 'User Management',
  'patient-management': 'Patient Management',
  'room-management': 'Room Management',
  charges: 'Charges',
  settings: 'Settings',
};
 
const handleLogout = () => {
  
  localStorage.removeItem("user");

   

  window.location.href = "/auth.html";
};

export default function Header() {
  const { dark, toggle } = useTheme();
  const { role, activePage } = useRole();
  const meta = ROLE_META[role];
  const [notifs] = useState(3);

  return (
    <header className="fixed top-0 left-[240px] right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 flex items-center px-6 gap-4 z-20">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1">
        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{meta?.label ?? "N/A"}</span>
        <ChevronRight size={12} className="text-slate-300 dark:text-slate-600" />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          {PAGE_LABELS[activePage] || activePage}
        </span>
      </div>

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search size={14} className="absolute left-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          className="pl-9 pr-4 py-2 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pulse-400 w-48 transition-all focus:w-64"
        />
      </div>

      {/* Notifications */}
      <button className="relative w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
        <Bell size={16} className="text-slate-500 dark:text-slate-400" />
        {notifs > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pulse-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        )}
      </button>

      <button
        onClick={handleLogout}
        className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600"
      >
        Logout
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
        title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {dark
          ? <Sun size={16} className="text-amber-400" />
          : <Moon size={16} className="text-slate-500" />
        }
      </button>
    </header>
  );
}
