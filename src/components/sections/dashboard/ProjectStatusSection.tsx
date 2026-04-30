import React from 'react';
import { Check, Engineering, FileText, Sun, Zap } from 'lucide-react';

export const ProjectStatusSection: React.FC = () => {
  const steps = [
    { id: 1, label: 'Angebot', icon: <Check className="w-5 h-5" />, status: 'done' },
    { id: 2, label: 'Planung', icon: <Engineering className="w-6 h-6" />, status: 'active' },
    { id: 3, label: 'Genehmigung', icon: <FileText className="w-5 h-5" />, status: 'pending' },
    { id: 4, label: 'Installation', icon: <Sun className="w-5 h-5" />, status: 'pending' },
    { id: 5, label: 'Inbetriebnahme', icon: <Zap className="w-5 h-5" />, status: 'pending' },
  ];

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8 mb-6">
      <h3 className="text-xl font-bold text-primary mb-6">Aktueller Projektstatus</h3>
      <div className="relative w-full overflow-x-auto pb-4">
        <div className="min-w-[600px] flex items-center justify-between relative z-10 px-4">
          {/* Background Line */}
          <div className="absolute top-1/2 left-8 right-8 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full"></div>
          {/* Active Progress Line */}
          <div className="absolute top-1/2 left-8 w-1/4 h-1 bg-secondary -translate-y-1/2 z-0 rounded-full"></div>

          {steps.map((step) => (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div
                className={`flex items-center justify-center border-4 border-white shadow-sm mb-3 rounded-full transition-all ${
                  step.status === 'done'
                    ? 'w-10 h-10 bg-primary text-white'
                    : step.status === 'active'
                    ? 'w-12 h-12 bg-secondary text-primary shadow-md ring-4 ring-secondary/20'
                    : 'w-10 h-10 bg-slate-100 text-slate-400'
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-sm ${
                  step.status === 'active' ? 'text-primary font-bold' : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
