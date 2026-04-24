import React from 'react';
import { Card, FormField, Input, Select, SectionHeader } from '../../components/ui';
import { useTheme } from '../../context/ThemeContext';
import { useRole } from '../../context/RoleContext';
import { Sun, Moon } from 'lucide-react';

export default function SettingsPage() {
  const { dark, toggle } = useTheme();
  const { role, meta } = useRole();

  return (
    <div>
      <SectionHeader title="Settings" subtitle="Manage your account and preferences" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card title="Profile Settings">
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 mb-4">
              <div className={`w-14 h-14 rounded-2xl ${meta?.color ?? "bg-blue-500"} flex items-center justify-center text-white text-xl font-bold`}>
                {(meta?.user ?? "").split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{meta?.user ?? "N/A"}</p>
                <p className="text-sm text-slate-400">{meta?.label ?? "N/A"} · {meta?.id ?? "N/A"}</p>
              </div>
            </div>
            <FormField label="Full Name"><Input defaultValue={meta?.user ?? ""} /></FormField>
            <FormField label="Email"><Input type="email" defaultValue="user@pulsenet.in" /></FormField>
            <FormField label="Phone"><Input defaultValue="+91 98765 43210" /></FormField>
            <button className="btn-primary">Save Changes</button>
          </div>
        </Card>

        <div className="space-y-5">
          <Card title="Appearance">
            <div className="p-5">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Theme</p>
                  <p className="text-xs text-slate-400 mt-0.5">{dark ? 'Dark mode is on' : 'Light mode is on'}</p>
                </div>
                <button
                  onClick={toggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${dark ? 'bg-pulse-500' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${dark ? 'left-8' : 'left-1'} flex items-center justify-center`}>
                    {dark ? <Moon size={10} className="text-pulse-500" /> : <Sun size={10} className="text-amber-500" />}
                  </div>
                </button>
              </div>
            </div>
          </Card>

          <Card title="Notifications">
            <div className="p-5 space-y-3">
              {['New alerts', 'Task reminders', 'System updates', 'Reports ready']?.filter(Boolean).map((n, i) => (
                <div key={n} className="flex items-center justify-between py-2">
                  <span className="text-sm text-slate-700 dark:text-slate-300">{n ?? "N/A"}</span>
                  <button className={`relative w-10 h-5 rounded-full transition-colors ${i % 2 === 0 ? 'bg-pulse-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${i % 2 === 0 ? 'left-5' : 'left-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Security">
            <div className="p-5 space-y-4">
              <FormField label="Current Password"><Input type="password" placeholder="••••••••" /></FormField>
              <FormField label="New Password"><Input type="password" placeholder="••••••••" /></FormField>
              <button className="btn-secondary">Change Password</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
