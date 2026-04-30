import React from 'react';
import { SideNavBar } from '../components/layout/SideNavBar';
import { TopAppBar } from '../components/layout/TopAppBar';
import { DocumentRow } from '../components/sections/documents/DocumentRow';
import { Info } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SideNavBar />
      
      <div className="flex flex-col min-h-screen lg:pl-64">
        <TopAppBar />
        
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Dokumente</h1>
            <p className="text-lg text-slate-500">Alle relevanten Unterlagen zu Deinem Projekt im Überblick.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 overflow-hidden">
            {/* Header (Desktop) */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="col-span-6 lg:col-span-7">Dokumentenname</div>
              <div className="col-span-4 lg:col-span-3">Status</div>
              <div className="col-span-2 text-right">Aktion</div>
            </div>

            <div className="flex flex-col">
              <DocumentRow 
                title="Angebot" 
                meta="PDF • 2.4 MB • 12. Okt 2023" 
                status="signed" 
                statusText="Unterschrieben" 
                type="pdf" 
                isDownloadable={true} 
              />
              <DocumentRow 
                title="Netzanmeldung" 
                meta="Wird derzeit bearbeitet vom Netzbetreiber" 
                status="pending" 
                statusText="Ausstehend" 
                type="bolt" 
                isDownloadable={false} 
              />
              <DocumentRow 
                title="Abnahmeprotokoll" 
                meta="Erfolgt nach Abschluss der Installation" 
                status="pending" 
                statusText="Ausstehend" 
                type="verified" 
                isDownloadable={false} 
              />
              <DocumentRow 
                title="Garantieurkunden" 
                meta="ZIP • 14.5 MB • Module & Wechselrichter" 
                status="received" 
                statusText="Erhalten" 
                type="premium" 
                isDownloadable={true} 
              />
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
            <Info className="text-blue-600 w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Fehlt ein Dokument?</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Einige Dokumente wie das Abnahmeprotokoll werden erst nach bestimmten Meilensteinen in der Installation generiert. Bei Fragen wende Dich gerne an den Support-Chat.
              </p>
            </div>
          </div>
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
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
