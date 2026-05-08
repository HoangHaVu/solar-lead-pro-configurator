import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Calendar, Leaf } from 'lucide-react';
import { SideNavBar } from '../components/layout/SideNavBar';
import { TopAppBar } from '../components/layout/TopAppBar';
import { StatTile } from '../components/sections/roi/StatTile';
import { AutarkyDonut } from '../components/sections/roi/AutarkyDonut';
import { AmortizationChart } from '../components/sections/roi/AmortizationChart';
import { useProject } from '../hooks/useProject';

export const ROIPage: React.FC = () => {
  const { project, isLoading } = useProject();

  const yearsElapsed = project
    ? new Date().getFullYear() - new Date(project.created_at).getFullYear()
    : 0;
  const currentSavings = project?.annual_savings
    ? Math.min(yearsElapsed * project.annual_savings, project.investment ?? Infinity)
    : 0;
  const co2Tons = project?.annual_savings
    ? ((yearsElapsed * (project.kwp ?? 0) * 950) / 1000).toFixed(1)
    : '—';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SideNavBar />
      <div className="flex flex-col min-h-screen lg:pl-64">
        <TopAppBar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Meine Anlage / ROI-Live</h1>
            <p className="text-lg text-slate-500">Wirtschaftliche Auswertung deiner Photovoltaikanlage.</p>
          </div>

          {isLoading && (
            <div className="flex justify-center py-24">
              <Sun className="w-10 h-10 text-secondary animate-spin" />
            </div>
          )}

          {!isLoading && !project && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <p className="font-semibold">Noch kein Projekt vorhanden.</p>
            </div>
          )}

          {!isLoading && project && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatTile
                  icon={<Sun className="w-6 h-6" />}
                  label="Anlagengröße"
                  value={String(project.kwp ?? '—')}
                  unit="kWp"
                />
                <StatTile
                  icon={<Calendar className="w-6 h-6" />}
                  label="Jährl. Ersparnis"
                  value={project.annual_savings ? project.annual_savings.toLocaleString('de-DE') : '—'}
                  unit="€ / Jahr"
                />
                <AutarkyDonut percentage={project.autarky ?? 0} />
                <StatTile
                  icon={<Leaf className="w-6 h-6" />}
                  label="CO₂-Ersparnis"
                  value={co2Tons}
                  unit="Tonnen"
                  variant="dark"
                />
              </div>

              <AmortizationChart
                investment={project.investment ?? 0}
                annualSavings={project.annual_savings ?? 0}
                amortization={project.amortization ?? 10}
                createdAt={project.created_at}
              />
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
