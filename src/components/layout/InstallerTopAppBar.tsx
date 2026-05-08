import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

function initials(name: string | undefined): string {
  if (!name) return 'IN';
  return name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

export const InstallerTopAppBar: React.FC = () => {
  const { user } = useAuth();
  const name = user?.fullName ?? user?.email ?? '';
  const isOwner = user?.role === 'owner';
  const settingsPath = isOwner ? '/owner-settings' : '/installer-settings';

  return (
    <>
      <div className="h-16 shrink-0" aria-hidden="true" />
      <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center">
          <div className="w-64 hidden md:block" />
          <div className="flex items-center gap-2 cursor-default p-2 rounded-lg ml-4">
            <Search className="w-4 h-4 text-slate-300" />
            <span className="text-sm font-medium text-slate-300">Suchen…</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={settingsPath}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-primary transition-colors"
            title="Einstellungen"
          >
            <Settings className="w-5 h-5" />
          </Link>

          <Link
            to={settingsPath}
            className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-secondary font-black text-sm border-2 border-white shadow-sm hover:opacity-90 transition-opacity"
            title={name}
          >
            {initials(user?.fullName)}
          </Link>
        </div>
      </header>
    </>
  );
};
