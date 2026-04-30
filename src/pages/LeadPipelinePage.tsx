import React from 'react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { KanbanColumn } from '../components/sections/pipeline/KanbanColumn';
import { LeadCard } from '../components/sections/pipeline/LeadCard';
import { MapPin, Sun, Calendar, FilterX } from 'lucide-react';

export const LeadPipelinePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      <InstallerSideNavBar />
      
      <main className="lg:ml-64 pt-16 h-screen flex flex-col overflow-hidden">
        <InstallerTopAppBar />

        {/* Header & Filters */}
        <div className="px-8 py-6 bg-white border-b border-slate-200 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-1">Lead-Pipeline</h2>
              <p className="text-sm text-slate-500">Verwalte deine Projektanfragen und beschleunige den Vertriebsprozess.</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[150px]">
              <label className="text-xs font-bold text-slate-500" htmlFor="filter-plz">Postleitzahl</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-md pl-10 pr-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-colors"
                  id="filter-plz"
                  placeholder="z.B. 20457"
                  type="text"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[200px]">
              <label className="text-xs font-bold text-slate-500" htmlFor="filter-size">Min. Anlagengröße</label>
              <div className="relative">
                <Sun className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select className="w-full bg-white border border-slate-200 text-primary rounded-md pl-10 pr-8 py-2 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none transition-colors" id="filter-size">
                  <option value="">Alle Größen</option>
                  <option value="5">Ab 5 kWp</option>
                  <option value="10">Ab 10 kWp</option>
                  <option value="15">Ab 15 kWp</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-auto min-w-[180px]">
              <label className="text-xs font-bold text-slate-500" htmlFor="filter-date">Eingangsdatum ab</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-md pl-10 pr-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none transition-colors"
                  id="filter-date"
                  type="date"
                />
              </div>
            </div>
            <div className="w-full sm:w-auto sm:ml-auto">
              <button className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-100 text-primary font-bold py-2 px-6 rounded-md transition-colors flex items-center justify-center gap-2 text-sm">
                <FilterX className="w-4 h-4" />
                Filter zurücksetzen
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden p-8 flex flex-col bg-slate-100">
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start scrollbar-thin scrollbar-thumb-slate-300">
            <KanbanColumn title="Neu" count={3} color="bg-secondary">
              <LeadCard title="Familie Müller" location="22765 Hamburg" specs="8.5 kWp • Satteldach" price="16.500 €" date="Heute, 09:30" />
              <LeadCard title="Johannes Schmidt" location="20251 Hamburg" specs="12.0 kWp • Flachdach" price="22.800 €" date="Gestern, 14:15" />
            </KanbanColumn>
            
            <KanbanColumn title="Kontaktiert" count={1} color="bg-blue-400">
              <LeadCard title="Elena Wagner" location="21079 Hamburg" specs="6.8 kWp • Walmdach" price="14.200 €" date="12. Okt" />
            </KanbanColumn>
            
            <KanbanColumn title="Angebot versendet" count={2} color="bg-blue-600">
              <LeadCard title="Dr. Becker" location="22587 Hamburg" specs="15.4 kWp • Pultdach" price="28.500 €" date="Offen (3 Tage)" statusColor="orange-600" />
            </KanbanColumn>
            
            <KanbanColumn title="In Planung" count={0} color="bg-purple-500">
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center text-slate-400 h-32">
                <p className="text-sm">Keine Projekte in Planung</p>
              </div>
            </KanbanColumn>
            
            <KanbanColumn title="In Installation" count={1} color="bg-green-500">
              <LeadCard title="Gewerbepark Nord" location="22113 Oststeinbek" specs="29.9 kWp • Flachdach" price="45.000 €" date="Aktiv" statusColor="green-500" />
            </KanbanColumn>
            
            <KanbanColumn title="Abgeschlossen" color="bg-slate-400">
              <LeadCard title="Sabine Koch" location="22303 Hamburg" specs="9.8 kWp" price="9.800 €" date="Beendet" isClosed />
            </KanbanColumn>
          </div>
        </div>
      </main>
    </div>
  );
};
