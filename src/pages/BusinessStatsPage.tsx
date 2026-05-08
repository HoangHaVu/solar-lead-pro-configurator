import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart3, Euro, Sun, Leaf, Download, ChevronDown, TrendingUp, Clock, MousePointerClick } from 'lucide-react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { StatsKpiCard } from '../components/sections/stats/StatsKpiCard';
import { LeadDevelopmentChart } from '../components/sections/stats/LeadDevelopmentChart';
import { useLeads } from '../hooks/useLeads';
import { fetchWizardDropoffStats, type WizardStepStat } from '../services/data';

export const BusinessStatsPage: React.FC = () => {
  const { leads, isLoading } = useLeads();
  const [dropoffStats, setDropoffStats] = useState<WizardStepStat[]>([]);

  useEffect(() => {
    fetchWizardDropoffStats().then(setDropoffStats).catch(() => {});
  }, []);

  const totalLeads   = leads.length;
  const closedLeads  = leads.filter((l) => l.status === 'abgeschlossen').length;
  const convRate     = totalLeads > 0 ? ((closedLeads / totalLeads) * 100).toFixed(1) : '0';
  const avgInvestment = totalLeads > 0
    ? Math.round(leads.reduce((s, l) => s + (l.investment ?? 0), 0) / totalLeads) / 1000
    : 0;
  const totalKwp     = leads.reduce((s, l) => s + (l.kwp ?? 0), 0);

  // Funnel-Daten
  const countNeu         = leads.filter(l => l.status === 'neu').length;
  const countKontaktiert = leads.filter(l => l.status === 'kontaktiert').length;
  const countAngebot     = leads.filter(l => l.status === 'angebot').length;
  const countGewonnen    = leads.filter(l => l.status === 'gewonnen').length;
  const funnelMax        = Math.max(totalLeads, 1);

  // Reaktionszeit (leads < 24h die noch 'neu' sind)
  const now = new Date();
  const thisMonthLeads = leads.filter((l) => {
    const d = new Date(l.created_at);
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />
      <div className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="text-3xl font-black text-primary">Statistik-Dashboard</h1>
              <p className="text-lg text-slate-500 mt-1 font-medium">Leistungsübersicht und KPIs für alle Leads.</p>
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 text-primary font-bold text-sm rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/10 shadow-sm">
                  <option>Alle Leads</option>
                  <option>Dieser Monat</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <button className="bg-white border border-slate-200 text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 shadow-sm transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-24">
              <Sun className="w-10 h-10 text-secondary animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="lg:col-span-2">
                  <StatsKpiCard
                    title="Leads diesen Monat"
                    value={String(thisMonthLeads)}
                    icon={Users}
                    trend={`${totalLeads} gesamt`}
                    trendUp={true}
                  />
                </div>
                <StatsKpiCard
                  title="Conversion-Rate"
                  value={`${convRate}%`}
                  icon={BarChart3}
                  isPrimary={true}
                  progress={parseFloat(convRate)}
                  progressLabel="Lead zu Abschluss"
                />
                <StatsKpiCard
                  title="Ø Auftragswert"
                  value={`${avgInvestment.toFixed(1)}k €`}
                  icon={Euro}
                  trend={`${closedLeads} Abschlüsse`}
                  trendUp={closedLeads > 0}
                />
              </div>

              {/* Conversion-Funnel */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <h2 className="text-lg font-bold text-primary">Conversion-Funnel</h2>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{totalLeads} Leads gesamt</span>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Leads eingegangen', count: totalLeads,        color: 'bg-slate-700',   pct: 100 },
                    { label: 'Kontaktiert',        count: countKontaktiert + countAngebot + countGewonnen, color: 'bg-blue-500',    pct: Math.round(((countKontaktiert + countAngebot + countGewonnen) / funnelMax) * 100) },
                    { label: 'Angebot versendet',  count: countAngebot + countGewonnen,                   color: 'bg-indigo-500',  pct: Math.round(((countAngebot + countGewonnen) / funnelMax) * 100) },
                    { label: 'Auftrag gewonnen',   count: countGewonnen,    color: 'bg-green-500',   pct: Math.round((countGewonnen / funnelMax) * 100) },
                  ].map(({ label, count, color, pct }) => (
                    <div key={label} className="flex items-center gap-4">
                      <span className="text-sm text-slate-500 font-medium w-44 shrink-0">{label}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-6 overflow-hidden">
                        <div
                          className={`${color} h-full rounded-full flex items-center justify-end pr-3 transition-all duration-700`}
                          style={{ width: `${Math.max(pct, 4)}%` }}
                        >
                          <span className="text-white text-xs font-bold">{pct}%</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary w-8 text-right shrink-0">{count}</span>
                    </div>
                  ))}
                </div>
                {countNeu > 0 && (
                  <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-lg px-4 py-2.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <p className="text-xs font-medium text-amber-700">
                      <span className="font-bold">{countNeu} Lead{countNeu > 1 ? 's' : ''}</span> noch nicht kontaktiert — schnelle Reaktion erhöht Abschlussrate um bis zu 3×
                    </p>
                  </div>
                )}
              </div>

              {/* Wizard Drop-off Funnel */}
              {dropoffStats.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <MousePointerClick className="w-5 h-5 text-secondary" />
                      <h2 className="text-lg font-bold text-primary">Konfigurator Drop-off</h2>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {dropoffStats[0]?.sessions ?? 0} Sitzungen gesamt
                    </span>
                  </div>
                  <div className="space-y-3">
                    {dropoffStats.map((s) => {
                      const pct = dropoffStats[0]?.sessions > 0
                        ? Math.round((s.sessions / dropoffStats[0].sessions) * 100)
                        : 0;
                      const barColor =
                        s.dropoffPct >= 50 ? 'bg-red-500' :
                        s.dropoffPct >= 25 ? 'bg-amber-500' :
                        'bg-emerald-500';
                      return (
                        <div key={s.step} className="flex items-center gap-4">
                          <span className="text-xs font-bold text-slate-400 w-4 shrink-0">{s.step}</span>
                          <span className="text-sm text-slate-500 font-medium w-36 shrink-0 truncate">{s.label}</span>
                          <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
                            <div
                              className={`${barColor} h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700`}
                              style={{ width: `${Math.max(pct, 4)}%` }}
                            >
                              <span className="text-white text-[11px] font-bold">{pct}%</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-primary w-10 text-right shrink-0">{s.sessions}</span>
                          {s.dropoff > 0 && (
                            <span className="text-xs text-red-500 font-semibold w-20 text-right shrink-0">
                              −{s.dropoff} ({s.dropoffPct}%)
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-400 mt-4">
                    Zeigt wie viele Nutzer jeden Schritt betreten haben. Rot = hoher Absprung, grün = gute Weiterführung.
                  </p>
                </div>
              )}

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
                        <h3 className="text-2xl font-black text-primary">
                          {totalKwp >= 1000 ? `${(totalKwp / 1000).toFixed(1)} MWp` : `${totalKwp.toFixed(1)} kWp`}
                        </h3>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-bold">
                      <p className="uppercase tracking-widest mb-3">Aus {totalLeads} Leads</p>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((closedLeads / Math.max(totalLeads, 1)) * 100, 100)}%` }}></div>
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
                        <h3 className="text-2xl font-black text-primary">
                          {((totalKwp * 950) / 1000).toFixed(0)} t
                        </h3>
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-6">Kumulierte Einsparung</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <p>© 2026 SolarKonfigurator. 100% DSGVO-konform.</p>
          <ul className="flex flex-wrap items-center gap-6">
            <li><Link className="hover:text-primary transition-colors" to="/impressum">Impressum</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/datenschutz">Datenschutz</Link></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
