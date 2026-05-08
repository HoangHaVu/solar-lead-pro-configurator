import React from 'react';
import { Sun, Zap } from 'lucide-react';
import type { Project } from '../../../services/data';

interface Props {
  project: Project;
}

export const ConfigSummarySection: React.FC<Props> = ({ project }) => {
  const fmt = (n: number | null, suffix: string) =>
    n != null ? `${n} ${suffix}` : '—';

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
        <Sun className="text-slate-400 w-5 h-5" />
        Konfigurations-Zusammenfassung
      </h2>

      <div className="bg-primary rounded-xl p-6 mb-8 text-white flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Geplante Anlagenleistung</div>
          <div className="text-4xl font-black text-secondary">
            {project.kwp ?? '—'} <span className="text-xl font-bold text-white">kWp</span>
          </div>
        </div>
        <Zap className="w-12 h-12 text-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Investition</div>
          <div className="text-sm font-bold text-primary">
            {project.investment != null ? `${project.investment.toLocaleString('de-DE')} €` : '—'}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Jährl. Ersparnis</div>
          <div className="text-sm font-bold text-primary">
            {project.annual_savings != null ? `${project.annual_savings.toLocaleString('de-DE')} €` : '—'}
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amortisation</div>
          <div className="text-sm font-bold text-primary">{fmt(project.amortization, 'Jahre')}</div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Autarkiegrad</div>
          <div className="text-sm font-bold text-primary">{fmt(project.autarky, '%')}</div>
        </div>
      </div>

      {project.notes && (
        <div className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Notizen</div>
          <div className="text-sm text-primary">{project.notes}</div>
        </div>
      )}
    </section>
  );
};
