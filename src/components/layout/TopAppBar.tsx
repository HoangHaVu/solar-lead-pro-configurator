import React from 'react';
import { Bell, Settings } from 'lucide-react';

export const TopAppBar: React.FC = () => {
  return (
    <header className="bg-white dark:bg-primary border-b border-slate-200 dark:border-slate-800 shadow-sm z-40 sticky top-0">
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-[1200px] mx-auto">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-primary dark:text-white lg:hidden">SolarManager</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors p-2 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors p-2 rounded-full">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 ml-2">
            <img
              alt="Benutzerprofil"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3A0nstqSAP3LQxfO19pzxyyScvZDmVM3i-0tbFuWObcaa6CIKYZ61AcS-wC8SnHwvP9Fu5PXG1Snrz5D9UX_ae0dx6pY-9dgBEG7j6kmnBBRl9qOUCCzamF8EdfJrDDy9q7rp4p4pYtrrYl27EkQOuF8DxCV2_duNxHoEyhd9UskM248CMTQrgyvoqtg-edAXL-xlEWrRVwB0JJd2N_OPxEiz-fsSNJpziCoOiXutcXAGb8xnTBkPYMAZauy8fLLw-sSlAKjirVg"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
