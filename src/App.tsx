import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { BusinessStatsPage } from './pages/BusinessStatsPage';
import { CalendarPage } from './pages/CalendarPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage onStartConfig={(zip) => window.location.href = `/configurator?zip=${zip}`} />} />
        <Route path="/configurator" element={<ConfiguratorPage initialZip={new URLSearchParams(window.location.search).get('zip') || ''} />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<CustomerRegistrationPage />} />
        <Route path="/register-installer" element={<InstallerRegistrationPage />} />

        {/* Customer Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/roi" element={<ROIPage />} />
        <Route path="/documents" element={<DocumentsPage />} />
        <Route path="/support" element={<SupportChatPage />} />

        {/* Installer Dashboard Routes */}
        <Route path="/pipeline" element={<LeadPipelinePage />} />
        <Route path="/project-details" element={<ProjectDetailsPage />} />
        <Route path="/stats" element={<BusinessStatsPage />} />
        <Route path="/calendar" element={<CalendarPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
