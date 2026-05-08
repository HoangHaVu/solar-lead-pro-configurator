import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { LandingPage } from './pages/LandingPage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { LoginPage } from './pages/LoginPage';
import { CustomerRegistrationPage } from './pages/CustomerRegistrationPage';
import { InstallerRegistrationPage } from './pages/InstallerRegistrationPage';
import { DashboardPage } from './pages/DashboardPage';
import { ROIPage } from './pages/ROIPage';
import { DocumentsPage } from './pages/DocumentsPage';
import { SupportChatPage } from './pages/SupportChatPage';
import { LeadPipelinePage } from './pages/LeadPipelinePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { BusinessStatsPage } from './pages/BusinessStatsPage';
import { CalendarPage } from './pages/CalendarPage';
import { InstallerSettingsPage } from './pages/InstallerSettingsPage';
import { LeadDetailsPage } from './pages/LeadDetailsPage';
import { MessagesPage } from './pages/MessagesPage';
import { OwnerSettingsPage } from './pages/OwnerSettingsPage';
import { DatenschutzPage } from './pages/DatenschutzPage';
import { ImpressumPage } from './pages/ImpressumPage';
import { InstallerLandingPage } from './pages/InstallerLandingPage';
import { BetaSignupPage } from './pages/BetaSignupPage';
import { InstallerProfilePage } from './pages/InstallerProfilePage';

import { PublicLayout } from './components/layout/PublicLayout';

const LandingRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <PublicLayout>
      <LandingPage onStartConfig={(zip) => navigate(`/configurator?zip=${zip}`)} />
    </PublicLayout>
  );
};

const ConfiguratorRoute: React.FC = () => {
  const [searchParams] = useSearchParams();
  return (
    <PublicLayout>
      <ConfiguratorPage initialZip={searchParams.get('zip') ?? ''} />
    </PublicLayout>
  );
};

const App: React.FC = () => {
  return (
    <HelmetProvider>
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public */}
          <Route path="/" element={<InstallerLandingPage />} />
          <Route path="/demo" element={<LandingRoute />} />
          <Route path="/configurator" element={<ConfiguratorRoute />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<CustomerRegistrationPage />} />
          <Route path="/beta" element={<BetaSignupPage />} />
          <Route path="/installer/:id" element={<InstallerProfilePage />} />
          <Route path="/register-installer" element={<InstallerRegistrationPage />} />

          {/* Kunden-Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute role="customer"><DashboardPage /></ProtectedRoute>} />
          <Route path="/roi" element={<ProtectedRoute role="customer"><ROIPage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute role="customer"><DocumentsPage /></ProtectedRoute>} />
          <Route path="/support" element={<ProtectedRoute role="customer"><SupportChatPage /></ProtectedRoute>} />

          {/* Installateur-Management */}
          <Route path="/pipeline" element={<ProtectedRoute role="installer"><LeadPipelinePage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute role="installer"><ProjectsPage /></ProtectedRoute>} />
          <Route path="/lead-details/:id" element={<ProtectedRoute role="installer"><LeadDetailsPage /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute role="installer"><MessagesPage /></ProtectedRoute>} />
          <Route path="/project-details/:id" element={<ProtectedRoute role="installer"><ProjectDetailsPage /></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute role="installer"><BusinessStatsPage /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute role="installer"><CalendarPage /></ProtectedRoute>} />
          <Route path="/installer-settings" element={<ProtectedRoute role="installer"><InstallerSettingsPage /></ProtectedRoute>} />
          <Route path="/owner-settings" element={<ProtectedRoute role="installer"><OwnerSettingsPage /></ProtectedRoute>} />

          <Route path="/datenschutz" element={<DatenschutzPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
