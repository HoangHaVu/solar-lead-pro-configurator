import React from 'react';
import { Check, Wrench, FileText, Sun, Zap } from 'lucide-react';

const STATUS_ORDER = ['angebot', 'planung', 'genehmigung', 'installation', 'inbetrieb'] as const;
type ProjectStatus = typeof STATUS_ORDER[number];

const STEPS = [
  { label: 'Angebot',       icon: (size: string) => <Check className={size} /> },
  { label: 'Planung',       icon: (size: string) => <Wrench className={size} /> },
  { label: 'Genehmigung',   icon: (size: string) => <FileText className={size} /> },
  { label: 'Installation',  icon: (size: string) => <Sun className={size} /> },
  { label: 'Inbetriebnahme',icon: (size: string) => <Zap className={size} /> },
];

interface Props {
  status: ProjectStatus;
}

export const ProjectStatusSection: React.FC<Props> = ({ status }) => {
  const currentIndex = STATUS_ORDER.indexOf(status);
  const progressPercent = (currentIndex / (STEPS.length - 1)) * 100;

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8 mb-6">
      <h3 className="text-xl font-bold text-primary mb-6">Aktueller Projektstatus</h3>
      <div className="relative w-full overflow-x-auto pb-4">
        <div className="min-w-[600px] flex items-center justify-between relative z-10 px-4">
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
          <div
            className="absolute top-1/2 left-8 h-1 bg-secondary -translate-y-1/2 z-0 rounded-full transition-all duration-500"
            style={{ width: `calc(${progressPercent}% - 4rem)` }}
          ></div>

          {STEPS.map((step, i) => {
            const stepStatus = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
            return (
              <div key={step.label} className="relative z-10 flex flex-col items-center group">
                <div className={`flex items-center justify-center border-4 border-white shadow-sm mb-3 rounded-full transition-all ${
                  stepStatus === 'done'
                    ? 'w-10 h-10 bg-primary text-white'
                    : stepStatus === 'active'
                    ? 'w-12 h-12 bg-secondary text-primary shadow-md ring-4 ring-secondary/20'
                    : 'w-10 h-10 bg-slate-100 text-slate-400'
                }`}>
                  {step.icon(stepStatus === 'active' ? 'w-6 h-6' : 'w-5 h-5')}
                </div>
                <span className={`text-sm ${stepStatus === 'active' ? 'text-primary font-bold' : 'text-slate-500'}`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
