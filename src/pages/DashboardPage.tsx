import React from 'react';
import { SideNavBar } from '../components/layout/SideNavBar';
import { TopAppBar } from '../components/layout/TopAppBar';
import { ProjectStatusSection } from '../components/sections/dashboard/ProjectStatusSection';
import { ProjectSpecsSection } from '../components/sections/dashboard/ProjectSpecsSection';
import { ContactCard } from '../components/sections/dashboard/ContactCard';

export const DashboardPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SideNavBar />
      
      <div className="flex flex-col min-h-screen lg:pl-64">
        <TopAppBar />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Projektübersicht</h1>
            <p className="text-lg text-slate-500">Verfolge den Fortschritt deiner Solaranlage in Echtzeit.</p>
          </div>

          <ProjectStatusSection />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ProjectSpecsSection />
            <ContactCard />
          </div>
        </main>

        <footer className="w-full border-t border-slate-200 mt-20 py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <div>
            <p>© 2024 Solar Configurator. 100% DSGVO-konform.</p>
          </div>
          <ul className="flex flex-wrap items-center gap-6">
            <li><a className="text-secondary underline hover:text-secondary/80" href="#">Impressum</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Datenschutz</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Kontakt</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Zertifizierungen</a></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
