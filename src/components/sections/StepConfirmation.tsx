import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, LayoutDashboard, ArrowRight } from 'lucide-react';

interface StepConfirmationProps {
  data: any;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({ data }) => {
  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto px-6 pb-24 flex flex-col items-center">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 w-full max-w-4xl relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-secondary"></div>
        <div className="w-24 h-24 rounded-full bg-secondary/10 flex items-center justify-center mb-8 shadow-sm">
          <CheckCircle className="w-12 h-12 text-secondary fill-secondary/20" />
        </div>
        <h1 className="text-4xl font-black text-primary mb-4 italic">Vielen Dank für dein Vertrauen!</h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          Deine Anfrage wurde erfolgreich übermittelt. Wir haben alle Details zu deinem Solar-Projekt erhalten und unser Team macht sich direkt an die Arbeit.
        </p>

        <div className="w-full bg-slate-50 rounded-2xl p-8 border border-slate-200 text-left mb-10">
          <h2 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6">Deine Konfiguration im Überblick</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-700">Satteldach ({data.orientation === 'sued' ? 'Südausrichtung' : 'Diverse Ausrichtung'})</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-primary shadow-sm">
                <CheckCircle className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-slate-700">ca. {data.consumption.toLocaleString()} kWh Jahresverbrauch</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary text-white hover:bg-primary/90 transition-all duration-200 font-bold shadow-lg shadow-primary/20"
          >
            <LayoutDashboard className="w-5 h-5" />
            Zum Kunden-Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link 
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors duration-200 font-bold"
          >
            Startseite
          </Link>
        </div>
      </div>
    </div>
  );
};
