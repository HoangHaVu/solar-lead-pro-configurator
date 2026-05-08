import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, MapPin, Calendar, FilterX, Trophy, X } from 'lucide-react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { KanbanColumn } from '../components/sections/pipeline/KanbanColumn';
import { LeadCard } from '../components/sections/pipeline/LeadCard';
import { useLeads } from '../hooks/useLeads';
import type { Lead } from '../services/data';

// Nur aktive Sales-Phasen — "gewonnen" und "verloren" sind terminal
const ACTIVE_COLUMNS: { key: Lead['status']; label: string; color: string }[] = [
  { key: 'neu',        label: 'Neu',               color: 'bg-secondary'  },
  { key: 'kontaktiert',label: 'Kontaktiert',        color: 'bg-blue-400'   },
  { key: 'angebot',    label: 'Angebot versendet',  color: 'bg-indigo-500' },
  { key: 'abschluss',  label: 'Abschluss',          color: 'bg-amber-500'  },
];

const ACTIVE_STATUSES = new Set(ACTIVE_COLUMNS.map(c => c.key));

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
  if (diffDays === 0) return `Heute, ${d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffDays === 1) return 'Gestern';
  if (diffDays < 7)  return `Vor ${diffDays} Tagen`;
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
}

export const LeadPipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { leads, isLoading, moveCard, markWon, markLost } = useLeads();

  const [filterZip, setFilterZip]       = useState('');
  const [filterMinKwp, setFilterMinKwp] = useState('');
  const [filterDate, setFilterDate]     = useState('');

  const hasActiveFilter = filterZip || filterMinKwp || filterDate;

  function resetFilters() {
    setFilterZip('');
    setFilterMinKwp('');
    setFilterDate('');
  }

  // Nur aktive Leads zeigen
  const allActiveLeads = leads.filter(l => ACTIVE_STATUSES.has(l.status));

  const activeLeads = allActiveLeads.filter(l => {
    if (filterZip && !l.zip?.startsWith(filterZip.trim())) return false;
    if (filterMinKwp && (l.kwp == null || l.kwp < Number(filterMinKwp))) return false;
    if (filterDate && l.created_at < filterDate) return false;
    return true;
  });

  // Terminale Leads für Stats-Bar
  const wonCount  = leads.filter(l => l.status === 'gewonnen').length;
  const lostCount = leads.filter(l => l.status === 'verloren').length;

  const byStatus = ACTIVE_COLUMNS.reduce<Record<string, Lead[]>>((acc, col) => {
    acc[col.key] = activeLeads.filter(l => l.status === col.key);
    return acc;
  }, {});

  async function handleWon(lead: Lead) {
    const projectId = await markWon(lead);
    if (projectId) navigate(`/project-details/${projectId}`);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
      <InstallerSideNavBar />

      <main className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />

        {/* Header */}
        <div className="px-4 md:px-8 py-5 bg-white border-b border-slate-200 shrink-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-primary mb-0.5">Lead-Pipeline</h2>
              <p className="text-sm text-slate-500">
                {activeLeads.length} aktive Lead{activeLeads.length !== 1 ? 's' : ''} im Trichter
              </p>
            </div>

            {/* Won/Lost Stats */}
            <div className="flex items-center gap-3 shrink-0">
              {wonCount > 0 && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2">
                  <Trophy className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-bold text-green-700">{wonCount} gewonnen</span>
                </div>
              )}
              {lostCount > 0 && (
                <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-4 py-2">
                  <X className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-500">{lostCount} verloren</span>
                </div>
              )}
            </div>
          </div>

          {/* Filter-Zeile */}
          <div className="flex flex-wrap gap-3 items-end bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex flex-col gap-1 w-full sm:w-40">
              <label className="text-xs font-bold text-slate-500" htmlFor="filter-plz">Postleitzahl</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-md pl-10 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
                  id="filter-plz"
                  placeholder="z.B. 20457"
                  type="text"
                  value={filterZip}
                  onChange={e => setFilterZip(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-48">
              <label className="text-xs font-bold text-slate-500" htmlFor="filter-size">Min. Anlagengröße</label>
              <div className="relative">
                <Sun className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <select
                  className="w-full bg-white border border-slate-200 text-primary rounded-md pl-10 pr-8 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none"
                  id="filter-size"
                  value={filterMinKwp}
                  onChange={e => setFilterMinKwp(e.target.value)}
                >
                  <option value="">Alle Größen</option>
                  <option value="5">Ab 5 kWp</option>
                  <option value="10">Ab 10 kWp</option>
                  <option value="15">Ab 15 kWp</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-full sm:w-44">
              <label className="text-xs font-bold text-slate-500" htmlFor="filter-date">Eingangsdatum ab</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-md pl-10 pr-3 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
                  id="filter-date"
                  type="date"
                  value={filterDate}
                  onChange={e => setFilterDate(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-3">
              {hasActiveFilter && (
                <span className="text-xs font-bold text-secondary">
                  {activeLeads.length} von {allActiveLeads.length} Leads
                </span>
              )}
              <button
                onClick={resetFilters}
                disabled={!hasActiveFilter}
                className="w-full sm:w-auto bg-white border border-slate-200 hover:bg-slate-100 text-primary font-bold py-2 px-6 rounded-md transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FilterX className="w-4 h-4" />
                Filter zurücksetzen
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col bg-slate-100">
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Sun className="w-10 h-10 text-secondary animate-spin" />
            </div>
          ) : (
            <div className="flex-1 flex gap-5 overflow-x-auto pb-4 items-start scrollbar-thin scrollbar-thumb-slate-300">
              {ACTIVE_COLUMNS.map((col) => {
                const colLeads = byStatus[col.key] ?? [];
                const isAbschluss = col.key === 'abschluss';

                return (
                  <KanbanColumn
                    key={col.key}
                    columnKey={col.key}
                    onCardDrop={(id, status) => moveCard(id, status as Parameters<typeof moveCard>[1])}
                    title={col.label}
                    count={colLeads.length}
                    color={col.color}
                  >
                    {colLeads.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-slate-400 text-sm h-32 gap-1">
                        {isAbschluss ? (
                          <>
                            <Trophy className="w-5 h-5 text-amber-300" />
                            <span>Leads hierher ziehen</span>
                          </>
                        ) : (
                          <span>Hierher ziehen</span>
                        )}
                      </div>
                    ) : (
                      colLeads.map((lead) => (
                        <LeadCard
                          key={lead.id}
                          id={lead.id}
                          title={`${lead.first_name} ${lead.last_name}`}
                          location={lead.zip ?? '—'}
                          specs={lead.kwp ? `${lead.kwp} kWp` : '—'}
                          price={lead.investment ? `${lead.investment.toLocaleString('de-DE')} €` : '—'}
                          date={formatDate(lead.created_at)}
                          kwp={lead.kwp}
                          investment={lead.investment}
                          zip={lead.zip}
                          score={lead.score}
                          showClosingActions={isAbschluss}
                          onWon={() => handleWon(lead)}
                          onLost={() => markLost(lead.id)}
                        />
                      ))
                    )}
                  </KanbanColumn>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
