import React from 'react';
import { Sun, ArrowLeft, Mail, Lock, ArrowRight, ShieldCheck, Info } from 'lucide-react';

export const CustomerRegistrationPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-body-md text-on-surface antialiased">
      {/* Minimal Header */}
      <header className="w-full h-20 px-6 flex items-center justify-between max-w-[1200px] mx-auto">
        <a className="flex items-center gap-2 group" href="/">
          <Sun className="text-secondary w-8 h-8 fill-secondary" />
          <span className="text-2xl font-black text-primary tracking-tighter">SolarKonfigurator</span>
        </a>
        <a className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm" href="/login">
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Login
        </a>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="w-full max-w-[520px]">
          {/* Contextual Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Kunden-Konto erstellen</h1>
            <p className="text-slate-500">Sichere deinen Konfigurationsstand und erhalte dein persönliches Angebot.</p>
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
            <form className="flex flex-col gap-4">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-500" htmlFor="vorname">Vorname</label>
                  <input
                    className="h-12 px-4 rounded-lg border border-slate-200 bg-white text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    id="vorname"
                    name="vorname"
                    type="text"
                    placeholder="Max"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-500" htmlFor="nachname">Nachname</label>
                  <input
                    className="h-12 px-4 rounded-lg border border-slate-200 bg-white text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    id="nachname"
                    name="nachname"
                    type="text"
                    placeholder="Mustermann"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-500" htmlFor="email">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    className="h-12 w-full pl-11 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
                    id="email"
                    name="email"
                    readOnly
                    type="email"
                    value="max.mustermann@beispiel.de"
                  />
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                  <Info className="w-4 h-4 text-secondary" />
                  Wir senden dir eine Bestätigungs-E-Mail
                </p>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-500" htmlFor="password">Passwort setzen</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    className="h-12 w-full pl-11 pr-4 rounded-lg border border-slate-200 bg-white text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    id="password"
                    name="password"
                    placeholder="Mindestens 8 Zeichen"
                    type="password"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <button
                className="h-14 mt-6 w-full bg-secondary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-md active:scale-95"
                type="submit"
              >
                Konto erstellen
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Trust Signal */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
              <ShieldCheck className="w-5 h-5 text-secondary fill-secondary/10" />
              <span className="text-xs">100% Datenschutz nach GDPR. Deine Daten sind sicher.</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
