import React from 'react';
import { Sun, CheckCircle, Verified, Headset, Info, UploadCloud, ArrowRight } from 'lucide-react';

export const InstallerRegistrationPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-body-md text-on-surface antialiased">
      <main className="flex-grow flex items-center justify-center py-20 px-6">
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm border border-slate-200/50 overflow-hidden">
          {/* Information / Trust Column */}
          <div className="bg-primary text-white p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at top right, #fea619, transparent 70%)" }}></div>
            <div className="relative z-10">
              <div className="text-2xl font-black text-white mb-12 tracking-tighter flex items-center gap-2">
                <Sun className="text-secondary w-8 h-8 fill-secondary" />
                SolarKonfigurator
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">Als Partner-Betrieb registrieren</h1>
              <p className="text-lg text-slate-300 mb-12">Erweitere dein Netzwerk und erhalte qualifizierte Leads direkt in deiner Region.</p>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-secondary w-6 h-6 fill-secondary/20 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Qualifizierte Anfragen</h3>
                    <p className="text-sm text-slate-400">Wir prüfen jedes Projekt vorab auf Machbarkeit.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Verified className="text-secondary w-6 h-6 fill-secondary/20 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Exklusives Netzwerk</h3>
                    <p className="text-sm text-slate-400">Nur verifizierte Meisterbetriebe erhalten Zugang.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Headset className="text-secondary w-6 h-6 fill-secondary/20 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-white">Persönlicher Support</h3>
                    <p className="text-sm text-slate-400">Ein dedizierter Ansprechpartner für dein Unternehmen.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="relative z-10 mt-12 p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
              <Info className="text-secondary w-5 h-5" />
              <p className="text-xs text-slate-400">Die Verifizierung deines Kontos dauert ca. 24h, um höchste Qualitätsstandards zu sichern.</p>
            </div>
          </div>

          {/* Form Column */}
          <div className="p-8">
            <form className="space-y-6 flex flex-col h-full justify-center">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">Firmenname</label>
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Dein Unternehmen GmbH"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">Ansprechpartner</label>
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Max Mustermann"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">PLZ / Region</label>
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="12345 Berlin"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">E-Mail</label>
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="kontakt@unternehmen.de"
                  type="email"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">Passwort</label>
                <input
                  className="w-full bg-white border border-slate-200 text-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                  placeholder="Mindestens 8 Zeichen"
                  type="password"
                />
              </div>
              
              {/* File Drop Area */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">Meisterbetrieb-Nachweis Upload</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-200 border-dashed rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                  <div className="space-y-1 text-center">
                    <UploadCloud className="text-slate-400 w-10 h-10 mx-auto group-hover:text-primary transition-colors" />
                    <div className="flex text-sm text-slate-500 justify-center">
                      <span className="font-bold text-primary hover:underline">Datei auswählen</span>
                      <p className="pl-1">oder Drag & Drop</p>
                    </div>
                    <p className="text-xs text-slate-400">PDF, JPG, PNG bis zu 10MB</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  className="w-full bg-secondary text-primary font-bold py-3 px-6 rounded-lg hover:bg-secondary/90 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md"
                  type="button"
                >
                  Jetzt Registrieren
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              <p className="text-center text-xs text-slate-500 mt-4">
                Bereits Partner? <a className="text-primary font-bold hover:underline" href="/login">Hier einloggen</a>
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};
