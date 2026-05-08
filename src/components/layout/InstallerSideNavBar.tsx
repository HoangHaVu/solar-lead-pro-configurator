import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, LayoutGrid, Calendar, BarChart3, MessageSquare,
  LogOut, Plus, Settings, Crown, Users, SlidersHorizontal,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NewProjectModal } from '../sections/projects/NewProjectModal';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
  disabled?: boolean;
  badge?: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive, disabled, badge }) => (
  <Link
    to={disabled ? '#' : to}
    onClick={disabled ? (e) => e.preventDefault() : undefined}
    className={`flex items-center gap-3 py-3 px-4 transition-all duration-200 border-r-4 ${
      disabled
        ? 'text-slate-300 border-transparent cursor-not-allowed'
        : isActive
          ? 'text-secondary border-secondary bg-white font-bold'
          : 'text-slate-600 border-transparent hover:bg-slate-100 hover:text-primary'
    }`}
  >
    {icon}
    <span className="text-sm font-semibold flex-1">{label}</span>
    {badge && (
      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-500 uppercase tracking-wide">
        {badge}
      </span>
    )}
  </Link>
);

export const InstallerSideNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const isOwner = user?.role === 'owner';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : 'SK';

  return (
    <>
    {modalOpen && <NewProjectModal onClose={() => setModalOpen(false)} />}
    <nav className="fixed left-0 top-0 h-full hidden lg:flex flex-col z-50 pt-4 pb-8 bg-slate-50 border-r border-slate-200 w-64">

      {/* Firmen-Header */}
      <div className="px-6 mb-8 flex flex-col items-start gap-2">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${isOwner ? 'bg-amber-500' : 'bg-primary'}`}>
          {isOwner ? <Crown className="w-5 h-5" /> : initials}
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">{user?.fullName ?? 'SolarKonfigurator'}</h1>
          <p className={`text-xs font-bold ${isOwner ? 'text-amber-500' : 'text-secondary'}`}>
            {isOwner ? 'Inhaber-Account' : 'Premium Partner'}
          </p>
        </div>
      </div>

      {/* Aktions-Button */}
      <div className="px-4 mb-6">
        {isOwner ? (
          <Link
            to="/stats"
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </Link>
        ) : (
          <button
            onClick={() => setModalOpen(true)}
            className="w-full bg-secondary hover:bg-secondary/90 text-primary font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm text-sm"
          >
            <Plus className="w-4 h-4" />
            Neues Projekt
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col">
        {isOwner && (
          <NavItem
            to="/stats"
            icon={<BarChart3 className="w-5 h-5" />}
            label="Übersicht"
            isActive={location.pathname === '/stats'}
          />
        )}
        <NavItem
          to="/pipeline"
          icon={<LayoutDashboard className="w-5 h-5" />}
          label="Lead-Pipeline"
          isActive={location.pathname === '/pipeline' || location.pathname.startsWith('/lead-details')}
        />
        <NavItem
          to="/projects"
          icon={<LayoutGrid className="w-5 h-5" />}
          label="Projekte"
          isActive={location.pathname === '/projects' || location.pathname.startsWith('/project-details')}
        />
        <NavItem
          to="/messages"
          icon={<MessageSquare className="w-5 h-5" />}
          label="Nachrichten"
          isActive={location.pathname === '/messages'}
        />
        <NavItem
          to="/calendar"
          icon={<Calendar className="w-5 h-5" />}
          label="Kalender"
          isActive={location.pathname === '/calendar'}
        />
        {!isOwner && (
          <NavItem
            to="/stats"
            icon={<BarChart3 className="w-5 h-5" />}
            label="Statistiken"
            isActive={location.pathname === '/stats'}
          />
        )}
        {isOwner && (
          <NavItem
            to="/team"
            icon={<Users className="w-5 h-5" />}
            label="Team"
            isActive={location.pathname === '/team'}
            disabled
            badge="Phase 3"
          />
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col mt-auto">
        <NavItem
          to={isOwner ? '/owner-settings' : '/installer-settings'}
          icon={<Settings className="w-5 h-5" />}
          label="Einstellungen"
          isActive={location.pathname === '/installer-settings' || location.pathname === '/owner-settings'}
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-3 px-4 transition-all duration-200 border-r-4 border-transparent text-slate-600 hover:bg-slate-100 hover:text-primary w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Abmelden</span>
        </button>
      </div>
    </nav>
    </>
  );
};
