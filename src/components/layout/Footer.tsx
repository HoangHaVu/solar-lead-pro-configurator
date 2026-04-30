import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 font-sans text-sm text-slate-500 dark:text-slate-400 w-full pt-20 pb-10 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div aria-label="SolarConfig" className="text-lg font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
            <span aria-hidden="true" className="material-symbols-outlined fill text-secondary-container" data-icon="solar_power">solar_power</span>
            SolarConfig
          </div>
          <p>© 2024 SolarConfig. Dein Partner für nachhaltige Energie.</p>
        </div>
        <ul className="flex flex-wrap justify-center gap-6">
          <li><a className="text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 underline underline-offset-4 opacity-100 transition-opacity" href="#">Datenschutz</a></li>
          <li><a className="text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 underline underline-offset-4 opacity-100 transition-opacity" href="#">Impressum</a></li>
          <li><a className="text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 underline underline-offset-4 opacity-100 transition-opacity" href="#">AGB</a></li>
          <li><a className="text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 underline underline-offset-4 opacity-100 transition-opacity" href="#">Kontakt</a></li>
        </ul>
      </div>
    </footer>
  );
};
