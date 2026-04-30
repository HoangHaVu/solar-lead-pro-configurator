import React from 'react';
import { SideNavBar } from '../components/layout/SideNavBar';
import { TopAppBar } from '../components/layout/TopAppBar';
import { StatTile } from '../components/sections/roi/StatTile';
import { AutarkyDonut } from '../components/sections/roi/AutarkyDonut';
import { AmortizationChart } from '../components/sections/roi/AmortizationChart';
import { Sun, Calendar, Leaf } from 'lucide-react';

export const ROIPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SideNavBar />
      
      <div className="flex flex-col min-h-screen lg:pl-64">
        <TopAppBar />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Meine Anlage / ROI-Live</h1>
            <p className="text-lg text-slate-500">Echtzeit-Statistiken und wirtschaftliche Auswertung deiner Photovoltaikanlage.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatTile 
              icon={<Sun className="w-6 h-6" />} 
              label="Heutiger Ertrag" 
              value="24.8" 
              unit="kWh" 
              trend="+12%" 
            />
            <StatTile 
              icon={<Calendar className="w-6 h-6" />} 
              label="Monatsertrag (Okt)" 
              value="452" 
              unit="kWh" 
            />
            <AutarkyDonut percentage={78} />
            <StatTile 
              icon={<Leaf className="w-6 h-6" />} 
              label="CO₂-Ersparnis" 
              value="1.2" 
              unit="Tonnen" 
              variant="dark"
            />
          </div>

          <AmortizationChart />
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <p>© 2024 Solar Configurator. 100% DSGVO-konform.</p>
          </div>
          <ul className="flex flex-wrap items-center gap-6">
            <li><a className="hover:text-primary transition-colors" href="#">Impressum</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Datenschutz</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Kontakt</a></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
