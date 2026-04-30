import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';

export const InstallerTopAppBar: React.FC = () => {
  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between px-6 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center">
        {/* Space for SideNav on Desktop */}
        <div className="w-64 hidden md:block"></div>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-lg ml-4 transition-all">
          <Search className="w-5 h-5 text-secondary" />
          <span className="text-sm font-medium text-slate-500">Suchen...</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-secondary cursor-pointer hover:bg-slate-50 p-2 rounded-full box-content" />
        <Settings className="w-5 h-5 text-secondary cursor-pointer hover:bg-slate-50 p-2 rounded-full box-content" />
        <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
          <img
            alt="Installateur Profilbild"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSCGmDHiURPzxxnB6xk1TYIA1IqcJsu_BgFukWlGoxrsm6UF_GkXd7wX7P38OVwbfo5xRIGNaRiWFQdjBEXALYCkDkzPFQAkoveLSXy0y1eeX6QotaugGuSrgV1tX8nmlflZ41hye0cl0XjEaiRCHKMX7gcMfptRY7QtW6K1Twdhyj4N3dicTX9shHkMB-ONHR9JPvxu1IAMD7qM-A-sFuNtTPf8l_GIglOKemzxWrvWg1yhnVsRAQk6W-vF1H_wtfJ4K0BlDTKD4"
          />
        </div>
      </div>
    </header>
  );
};
