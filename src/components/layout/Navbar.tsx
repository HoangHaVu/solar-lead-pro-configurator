import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, ArrowRight, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav aria-label="Main Navigation" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md font-sans font-medium text-sm tracking-tight fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center h-16 px-6 max-w-[1200px] mx-auto">
        <Link aria-label="SolarConfig Home" className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2" to="/">
          <Sun className="text-secondary w-6 h-6 fill-secondary" />
          SolarConfig
        </Link>
        
        <ul className="hidden md:flex items-center gap-8 h-full">
          <li className="h-full flex items-center">
            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-amber-400 transition-colors active:scale-95 duration-150 py-5" href="#vorteile">Vorteile</a>
          </li>
          <li className="h-full flex items-center">
            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-amber-400 transition-colors active:scale-95 duration-150 py-5" href="#ablauf">Ablauf</a>
          </li>
          <li className="h-full flex items-center">
            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-amber-400 transition-colors active:scale-95 duration-150 py-5" href="#ersparnis">Ersparnis</a>
          </li>
        </ul>

        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 font-bold">
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <a className="bg-secondary text-primary font-bold px-6 py-2 rounded-xl hover:opacity-90 transition-all active:scale-95 duration-150 shadow-sm flex items-center gap-2" href="#configurator">
            Jetzt anfragen
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </nav>
  );
};
