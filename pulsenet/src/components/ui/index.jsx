import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/* ── StatCard ── */
export function StatCard({ title, value, subtitle, icon: Icon, color = 'blue', trend }) {
  const colorMap = {
    blue: 'bg-pulse-50 dark:bg-pulse-900/20 text-pulse-600 dark:text-pulse-400',
    green: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400',
    teal: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400',
  };

  return (
    <div className="stat-card">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${colorMap[color]}`}>
          {Icon && <Icon size={20} />}
        </div>
        {trend && (
          <span className={`flex items-center gap-1 text-xs font-semibold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 dark:text-white font-display">{value ?? 0}</p>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title ?? "N/A"}</p>
        {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

/* ── Card ── */
export function Card({ children, className = '', title, action }) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="section-title">{title}</h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

/* ── Table ── */
export function Table({ headers, children, empty = 'No data found' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {headers?.filter(Boolean).map((h, i) => (
              <th key={i} className="table-header first:rounded-tl-xl last:rounded-tr-xl">
                {h ?? "N/A"}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children || (
            <tr>
              <td colSpan={headers.length} className="text-center py-10 text-sm text-slate-400 dark:text-slate-500">
                {empty}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/* ── Badge ── */
export function Badge({ children, variant = 'blue' }) {
  const variants = {
    blue: 'badge-blue',
    green: 'badge-green',
    red: 'badge-red',
    yellow: 'badge-yellow',
    gray: 'badge bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  };
  return <span className={variants[variant] || variants.gray}>{children}</span>;
}

/* ── FormField ── */
export function FormField({ label, children }) {
  return (
    <div>
      <label className="form-label">{label ?? "N/A"}</label>
      {children}
    </div>
  );
}

/* ── Input ── */
export function Input({ ...props }) {
  return <input className="form-input" {...props} />;
}

/* ── Select ── */
export function Select({ children, ...props }) {
  return (
    <select className="form-input" {...props}>
      {children}
    </select>
  );
}

/* ── Textarea ── */
export function Textarea({ ...props }) {
  return <textarea className="form-input resize-none" rows={3} {...props} />;
}

/* ── SectionHeader ── */
export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
