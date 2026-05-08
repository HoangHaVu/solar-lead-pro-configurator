import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BarChart3, FolderClosed, MessageSquare, LogOut, Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive }) => (
  <li>
    <Link
      to={to}
      className={`mx-2 my-1 px-4 py-3 flex items-center gap-3 rounded-lg transition-all active:scale-95 ${
        isActive
          ? 'bg-secondary text-primary font-bold shadow-lg shadow-secondary/20'
          : 'text-slate-300 hover:text-white hover:bg-white/10'
      }`}
    >
      {icon}
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  </li>
);

export const SideNavBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-primary fixed left-0 top-0 h-full w-64 border-r border-white/10 shadow-2xl hidden lg:flex flex-col py-6 z-50">
      <div className="px-6 mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
            <Sun className="text-white w-6 h-6 fill-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg leading-tight">Dein Projekt</h2>
            <p className="text-slate-400 text-xs">Status: In Installation</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          <NavItem to="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" isActive={location.pathname === '/dashboard'} />
          <NavItem to="/roi" icon={<BarChart3 className="w-5 h-5" />} label="Ertrag & ROI" isActive={location.pathname === '/roi'} />
          <NavItem to="/documents" icon={<FolderClosed className="w-5 h-5" />} label="Dokumente" isActive={location.pathname === '/documents'} />
          <NavItem to="/support" icon={<MessageSquare className="w-5 h-5" />} label="Support-Chat" isActive={location.pathname === '/support'} />
        </ul>
      </div>

      <div className="mt-auto pt-4 border-t border-white/10 px-2">
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={handleLogout}
              className="mx-2 my-1 px-4 py-3 flex items-center gap-3 rounded-lg transition-all w-full text-slate-300 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
