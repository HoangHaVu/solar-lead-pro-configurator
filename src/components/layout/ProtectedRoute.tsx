import React from 'react';
import { Navigate } from 'react-router-dom';
import { Sun } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  role: 'customer' | 'installer';
  children: React.ReactNode;
}

function getHomeRoute(role: string | undefined): string {
  if (role === 'owner')     return '/stats';
  if (role === 'installer') return '/pipeline';
  return '/dashboard';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ role, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Sun className="w-10 h-10 text-secondary animate-spin" />
          <p className="text-sm text-outline font-medium">Wird geladen…</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // owner hat vollen Zugriff auf alle installer-Routen
  const isAllowed =
    user?.role === role ||
    (user?.role === 'owner' && role === 'installer');

  if (!isAllowed) {
    return <Navigate to={getHomeRoute(user?.role)} replace />;
  }

  return <>{children}</>;
};
