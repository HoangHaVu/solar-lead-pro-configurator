import React from 'react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { CustomerDataSection } from '../components/sections/details/CustomerDataSection';
import { ConfigSummarySection } from '../components/sections/details/ConfigSummarySection';
import { Edit, CheckCircle, UploadCloud, FileText, Send, MessageSquare, ChevronDown } from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />
      
      <div className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col">
          <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100">
                  In Planung
                </span>
                <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                  Projekt-ID: PRJ-2023-089
                </span>
              </div>
              <h1 className="text-3xl font-black text-primary">Max Mustermann PV Anlage</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="border border-slate-200 text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Bearbeiten
              </button>
              <button className="bg-secondary text-primary font-bold text-sm px-6 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                <CheckCircle className="w-4 h-4" />
                Planung abschließen
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 flex flex-col gap-8">
              <CustomerDataSection />
              <ConfigSummarySection />
            </div>

            <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
                  <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2">
                    Projektstatus
                  </h2>
                  <div className="relative">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Aktueller Status</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-slate-50 border border-slate-200 text-primary font-bold text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all">
                        <option value="lead">Lead generiert</option>
                        <option selected value="planung">In Planung</option>
                        <option value="angebot">Angebot versendet</option>
                        <option value="bestaetigt">Auftrag bestätigt</option>
                        <option value="montage">In Montage</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-xl shadow-sm border-2 border-dashed border-slate-200 p-8 flex flex-col justify-center items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary mb-4">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-primary mb-1">Dokumente hochladen</h3>
                  <p className="text-xs text-slate-500 mb-6">Zählerfoto, Dachpläne, etc.</p>
                  <button className="bg-slate-100 text-primary font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                    Datei auswählen
                  </button>
                </section>
              </div>

              <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
                <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  Interne Notizen
                </h2>
                <textarea 
                  className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 resize-none transition-all"
                  placeholder="Notizen zur Dachbeschaffenheit, Kundenwünschen oder Besonderheiten..."
                ></textarea>
                <div className="flex justify-end mt-4">
                  <button className="bg-primary text-white font-bold text-sm px-6 py-2 rounded-xl hover:opacity-90 transition-opacity">Speichern</button>
                </div>
              </section>

              <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8 flex-1 flex flex-col">
                <h2 className="text-lg font-bold text-primary mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <MessageSquare className="w-5 h-5 text-slate-400" />
                  Kommunikation
                </h2>
                <div className="flex-1 overflow-y-auto space-y-6 mb-8 min-h-[300px]">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      MM
                    </div>
                    <div className="flex-1 bg-slate-50 rounded-2xl rounded-tl-none p-4 border border-slate-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-primary">Max Mustermann</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gestern, 14:30</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Guten Tag, können wir den Speicher auch nachträglich noch vergrößern, falls wir uns in 2 Jahren ein E-Auto anschaffen?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 flex-row-reverse">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                      <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBt_MrlsvFgooP9rCJXkIcE656Gb4z9BtiWR_GLWovwyfZGs4imVbVx7MFLfF3UZjqwb3ekU22fpC5ReyDH6TqQSO28F2VVfZIlJU2dsyMw1ntu-dokMjr0E8P9WnepkulYCfZr3WoN_TW7el1Hr1Wzps_YNSWEp0dJ7-6GMK0c3zWIYoAcq4YChjVe8THHW01S1KK_Unyk8_vGeF9qq3WAMOGuZIp8WVSXY_LMyjdr-6B2nPHmlVr3ZcXI6xC65UhihWthXDnGB00" alt="Du" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 bg-primary text-white rounded-2xl rounded-tr-none p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-secondary">Du</span>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Gestern, 15:45</span>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">
                        Hallo Herr Mustermann, ja, das ist bei dem von uns geplanten System problemlos möglich. Wir planen den Wechselrichter so, dass er entsprechende Reserven hat.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative mt-auto">
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 text-primary font-medium text-sm rounded-full pl-6 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                    placeholder="Nachricht an den Kunden..."
                    type="text"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                    <Send className="w-5 h-5 fill-primary" />
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>

        <footer className="w-full border-t border-slate-200 mt-20 py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <div>
            <p>© 2024 Solar Configurator. 100% DSGVO-konform.</p>
          </div>
          <ul className="flex flex-wrap items-center gap-6">
            <li><a className="hover:text-primary transition-colors" href="#">Impressum</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Datenschutz</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Kontakt</a></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
