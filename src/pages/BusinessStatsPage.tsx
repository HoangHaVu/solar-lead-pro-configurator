import React from 'react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { StatsKpiCard } from '../components/sections/stats/StatsKpiCard';
import { LeadDevelopmentChart } from '../components/sections/stats/LeadDevelopmentChart';
import { Users, BarChart3, Euro, Sun, Leaf, Download, ChevronDown } from 'lucide-react';

export const BusinessStatsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />
      
      <div className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-primary">Statistik-Dashboard</h1>
              <p className="text-lg text-slate-500 mt-1 font-medium">Leistungsübersicht und KPIs für den aktuellen Monat.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 text-primary font-bold text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm">
                  <option>Dieser Monat</option>
                  <option>Letzter Monat</option>
                  <option>Q3 2023</option>
                  <option>Jahr 2023</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button className="bg-white border border-slate-200 text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="lg:col-span-2">
              <StatsKpiCard 
                title="Monatliche Leads" 
                value="142" 
                icon={Users} 
                trend="+12%" 
                trendUp={true} 
              />
            </div>
            <StatsKpiCard 
              title="Conversion-Rate" 
              value="28.5%" 
              icon={BarChart3} 
              isPrimary={true}
              progress={28.5}
              progressLabel="Lead zu Auftrag"
            />
            <StatsKpiCard 
              title="Ø Auftragswert" 
              value="24.5k €" 
              icon={Euro} 
              trend="+4%" 
              trendUp={true} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              <LeadDevelopmentChart />
            </div>
            <div className="flex flex-col gap-8">
              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/50 flex flex-col justify-center hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-slate-50 rounded-2xl text-primary">
                    <Sun className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Installierte Leistung</p>
                    <h3 className="text-2xl font-black text-primary">1.2 MWp</h3>
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-bold">
                  <p className="uppercase tracking-widest mb-3">Jahresziel: 2.0 MWp (60%)</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all duration-1000" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-200/50 flex flex-col justify-center hover:border-primary/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CO2-Impact</p>
                    <h3 className="text-2xl font-black text-primary">450 t</h3>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-6">Kumulierte Einsparung</p>
              </div>
            </div>
          </div>
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <div>
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
