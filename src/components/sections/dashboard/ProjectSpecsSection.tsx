import React from 'react';
import { Calendar, Sun, BatteryCharging, Clock } from 'lucide-react';

export const ProjectSpecsSection: React.FC = () => {
  return (
    <div className="lg:col-span-2 flex flex-col gap-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8 flex-1">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
            <Clock className="text-secondary w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-primary mb-2">Phase: Planung aktiv</h4>
            <p className="text-slate-600 leading-relaxed">
              Unsere Ingenieure prüfen derzeit die statischen Gegebenheiten deines Daches und erstellen die finalen String-Pläne für die Solarmodule. Wir melden uns in Kürze mit dem finalen Belegungsplan zur Freigabe.
            </p>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="text-primary w-6 h-6" />
            <div>
              <p className="text-sm text-slate-500">Geschätzter Abschluss der Planung</p>
              <p className="text-lg text-primary font-bold">15. November 2024</p>
            </div>
          </div>
          <button className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors w-full sm:w-auto">
            Details ansehen
          </button>
        </div>
      </div>

      {/* Quick Specs Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <Sun className="text-primary w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Anlagengröße</p>
            <p className="text-lg text-primary font-bold">12.4 kWp</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <BatteryCharging className="text-primary w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Speicher</p>
            <p className="text-lg text-primary font-bold">10.0 kWh</p>
          </div>
        </div>
      </div>
    </div>
  );
};
