import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

function initials(name: string | undefined): string {
  if (!name) return 'KD';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

export const TopAppBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white dark:bg-primary border-b border-slate-200 dark:border-slate-800 shadow-sm z-40 sticky top-0">
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-primary dark:text-white lg:hidden">SolarKonfigurator</span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-secondary font-black text-sm border-2 border-white shadow-sm"
            title={user?.fullName ?? user?.email}
          >
            {initials(user?.fullName)}
          </div>
        </div>
      </div>
    </header>
  );
};
