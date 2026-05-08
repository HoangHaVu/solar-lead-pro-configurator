import React from 'react';
import { Link } from 'react-router-dom';
import { Sun, Info } from 'lucide-react';
import { SideNavBar } from '../components/layout/SideNavBar';
import { TopAppBar } from '../components/layout/TopAppBar';
import { DocumentRow } from '../components/sections/documents/DocumentRow';
import { useDocuments } from '../hooks/useDocuments';

export const DocumentsPage: React.FC = () => {
  const { documents, isLoading } = useDocuments();

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
            <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="col-span-6 lg:col-span-7">Dokumentenname</div>
              <div className="col-span-4 lg:col-span-3">Status</div>
              <div className="col-span-2 text-right">Aktion</div>
            </div>

            {isLoading && (
              <div className="flex justify-center py-16">
                <Sun className="w-8 h-8 text-secondary animate-spin" />
              </div>
            )}

            {!isLoading && documents.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <p className="font-semibold">Noch keine Dokumente vorhanden.</p>
              </div>
            )}

            <div className="flex flex-col">
              {documents.map((doc) => (
                <DocumentRow
                  key={doc.id}
                  title={doc.title}
                  meta={doc.meta ?? ''}
                  status={doc.status}
                  statusText={doc.status_text}
                  type={doc.type}
                  isDownloadable={doc.is_downloadable}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-6 flex items-start gap-4">
            <Info className="text-blue-600 w-6 h-6 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-blue-900 mb-1">Fehlt ein Dokument?</h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Einige Dokumente wie das Abnahmeprotokoll werden erst nach bestimmten Meilensteinen generiert. Bei Fragen wende Dich gerne an den Support-Chat.
              </p>
            </div>
          </div>
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <p>© 2026 SolarKonfigurator. 100% DSGVO-konform.</p>
          <ul className="flex flex-wrap items-center gap-6">
            <li><Link className="hover:text-primary transition-colors" to="/impressum">Impressum</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/datenschutz">Datenschutz</Link></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
