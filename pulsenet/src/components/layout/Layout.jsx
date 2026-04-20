import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header.jsx';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-950 font-sans">
      <Sidebar />
      <Header />
      <main className="ml-[240px] pt-16 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
