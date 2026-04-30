import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LayoutGrid, Calendar, BarChart3, HelpCircle, LogOut, Plus, Search } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 py-3 px-4 transition-all duration-200 border-r-4 ${
      isActive
        ? 'text-secondary border-secondary bg-white dark:bg-slate-900 font-bold'
        : 'text-slate-600 dark:text-slate-400 border-transparent hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-primary dark:hover:text-white'
    }`}
  >
    {icon}
    <span className="text-sm font-semibold">{label}</span>
  </Link>
);

export const InstallerSideNavBar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed left-0 top-0 h-full flex flex-col z-50 pt-4 pb-8 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 w-64">
      <div className="px-6 mb-8 flex flex-col items-start gap-2">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">
          PM
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">PV Montage Nord</h1>
          <p className="text-sm font-semibold text-secondary">Premium Partner</p>
        </div>
      </div>

      <div className="px-4 mb-6">
        <button className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          Neues Projekt
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <NavItem to="/pipeline" icon={<LayoutDashboard className="w-5 h-5" />} label="Lead-Pipeline" isActive={location.pathname === '/pipeline'} />
        <NavItem to="/project-details" icon={<LayoutGrid className="w-5 h-5" />} label="Projektdetails" isActive={location.pathname === '/project-details'} />
        <NavItem to="/calendar" icon={<Calendar className="w-5 h-5" />} label="Kalender" isActive={location.pathname === '/calendar'} />
        <NavItem to="/stats" icon={<BarChart3 className="w-5 h-5" />} label="Statistiken" isActive={location.pathname === '/stats'} />
      </div>

      <div className="flex flex-col mt-auto">
        <NavItem to="#" icon={<HelpCircle className="w-5 h-5" />} label="Hilfe" />
        <NavItem to="/login" icon={<LogOut className="w-5 h-5" />} label="Abmelden" />
      </div>
    </nav>
  );
};
