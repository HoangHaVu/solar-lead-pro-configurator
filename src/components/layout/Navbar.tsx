import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, LogIn } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav aria-label="Main Navigation" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md font-sans font-medium text-sm tracking-tight fixed top-0 w-full z-50 border-b border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center h-16 px-6 max-w-[1200px] mx-auto">
        {/* Brand Logo */}
        <Link aria-label="SolarConfig Home" className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2" to="/">
          <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-primary shadow-sm">
            <Sun className="w-6 h-6 fill-primary" />
          </div>
          <span className="hidden sm:inline">SolarConfig</span>
        </Link>
        
        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-slate-600 hover:text-primary transition-colors flex items-center gap-2 font-bold px-3 py-2 rounded-lg hover:bg-slate-100">
            <LogIn className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
