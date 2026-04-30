import React from 'react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { CalendarGrid } from '../components/sections/calendar/CalendarGrid';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

export const CalendarPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />
      
      <div className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-6">
              <h1 className="text-3xl font-black text-primary">Oktober 2023</h1>
              <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-primary hover:bg-slate-50 transition-colors shadow-sm">
                Heute
              </button>
              <div className="flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
                <button className="px-6 py-1.5 rounded-lg text-xs font-bold bg-primary text-white shadow-sm">Monat</button>
                <button className="px-6 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-primary transition-colors">Woche</button>
                <button className="px-6 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-primary transition-colors">Tag</button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
              <Filter className="w-3 h-3" />
              Filter:
            </div>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Beratung
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold hover:bg-orange-100 transition-colors">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span>
              Installation
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold hover:bg-green-100 transition-colors">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Abnahme
            </button>
          </div>

          <CalendarGrid />
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
