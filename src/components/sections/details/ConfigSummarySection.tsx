import React from 'react';
import { Sun, Zap, Home, Battery, Car } from 'lucide-react';

export const ConfigSummarySection: React.FC = () => {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
      <h2 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
        <Sun className="text-slate-400 w-5 h-5" />
        Konfigurations-Zusammenfassung
      </h2>

      <div className="bg-primary rounded-xl p-6 mb-8 text-white flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Geplante Anlagenleistung</div>
          <div className="text-4xl font-black text-secondary">10.4 <span className="text-xl font-bold text-white">kWp</span></div>
        </div>
        <Zap className="w-12 h-12 text-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Home className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Dachtyp</span>
          </div>
          <div className="text-sm font-bold text-primary">Satteldach</div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Ausrichtung</span>
          </div>
          <div className="text-sm font-bold text-primary">Süd (180°)</div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Battery className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Speicher</span>
          </div>
          <div className="text-sm font-bold text-primary">Ja (10 kWh)</div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-2 text-slate-500">
            <Car className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Wallbox</span>
          </div>
          <div className="text-sm font-bold text-primary">Nein</div>
        </div>
      </div>
    </section>
  );
};
