import React from 'react';
import { Link } from 'react-router-dom';
import { Sun } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 w-full mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
        <Link className="flex items-center gap-2 font-bold text-primary" to="/">
          <Sun className="w-4 h-4 text-secondary" />
          SolarKonfigurator
        </Link>
        <p>© 2026 SolarKonfigurator. Alle Rechte vorbehalten.</p>
        <div className="flex gap-6">
          <Link to="/impressum" className="hover:text-primary transition-colors">Impressum</Link>
          <Link to="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
};
