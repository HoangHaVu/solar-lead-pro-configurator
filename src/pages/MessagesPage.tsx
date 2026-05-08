import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sun, Users, FolderOpen, Loader, StickyNote } from 'lucide-react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { fetchAllNotes } from '../services/notes';
import type { NoteWithContext } from '../services/notes';

type Filter = 'alle' | 'leads' | 'projekte';

function formatDate(iso: string): string {
  const diff  = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)   return 'Gerade eben';
  if (mins  < 60)  return `vor ${mins} Min.`;
  if (hours < 24)  return `vor ${hours} Std.`;
  if (days  < 7)   return `vor ${days} Tagen`;
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const NoteCard: React.FC<{ note: NoteWithContext }> = ({ note }) => {
  const isLead = note.lead_id != null;

  const label = isLead && note.lead
    ? `${note.lead.first_name} ${note.lead.last_name}`
    : note.project
      ? `Projekt · ${note.project.kwp ?? '?'} kWp${note.project.zip ? ` · ${note.project.zip}` : ''}`
      : 'Unbekannt';

  const href = isLead
    ? `/lead-details/${note.lead_id}`
    : `/project-details/${note.project_id}`;

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${
          isLead ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-500'
        }`}>
          {isLead ? <Users className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
              isLead
                ? 'bg-amber-50 text-amber-600'
                : 'bg-indigo-50 text-indigo-600'
            }`}>
              {isLead ? 'Lead' : 'Projekt'}
            </span>
            <Link
              to={href}
              className="text-xs font-bold text-primary hover:text-secondary transition-colors truncate"
            >
              {label} →
            </Link>
          </div>
          <p className="text-sm text-slate-700 whitespace-pre-wrap break-words leading-relaxed">
            {note.content}
          </p>
          <p className="text-[11px] text-slate-400 mt-2">{formatDate(note.created_at)}</p>
        </div>
      </div>
    </div>
  );
};

export const MessagesPage: React.FC = () => {
  const [notes, setNotes]       = useState<NoteWithContext[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filter, setFilter]     = useState<Filter>('alle');

  useEffect(() => {
    setLoading(true);
    fetchAllNotes()
      .then(setNotes)
      .catch(e => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n => {
    if (filter === 'leads')    return n.lead_id    != null;
    if (filter === 'projekte') return n.project_id != null;
    return true;
  });

  const leadCount    = notes.filter(n => n.lead_id    != null).length;
  const projectCount = notes.filter(n => n.project_id != null).length;

  const TAB: { key: Filter; label: string; count: number }[] = [
    { key: 'alle',     label: 'Alle',     count: notes.length },
    { key: 'leads',    label: 'Leads',    count: leadCount },
    { key: 'projekte', label: 'Projekte', count: projectCount },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <InstallerSideNavBar />

      <div className="flex-1 lg:pl-64 flex flex-col">
        <InstallerTopAppBar />

        <main className="flex-1 px-6 lg:px-10 py-8 mt-16 max-w-[900px] mx-auto w-full">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-black text-primary flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-secondary" />
              Nachrichten & Notizen
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Alle internen Notizen zu Leads und Projekten — chronologisch sortiert.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit mb-6">
            {TAB.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  filter === t.key
                    ? 'bg-primary text-white'
                    : 'text-slate-500 hover:text-primary'
                }`}
              >
                {t.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  filter === t.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <Loader className="w-6 h-6 animate-spin mr-3" />
              <span>Lade Notizen…</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
              Fehler: {error}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
              <StickyNote className="w-12 h-12 text-slate-200" />
              <div className="text-center">
                <p className="font-bold text-slate-500">Noch keine Notizen</p>
                <p className="text-sm mt-1">
                  Öffne einen Lead oder ein Projekt und schreibe deine erste Notiz.
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <Link
                  to="/pipeline"
                  className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Users className="w-4 h-4" />
                  Zu den Leads
                </Link>
                <Link
                  to="/projects"
                  className="flex items-center gap-2 border border-slate-200 text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-white transition-colors"
                >
                  <FolderOpen className="w-4 h-4" />
                  Zu den Projekten
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-8 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <p className="flex items-center gap-2">
            <Sun className="w-3.5 h-3.5 text-secondary" />
            © 2026 SolarKonfigurator. 100% DSGVO-konform.
          </p>
          <ul className="flex gap-6">
            <li><Link className="hover:text-primary transition-colors" to="/impressum">Impressum</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/datenschutz">Datenschutz</Link></li>
          </ul>
        </footer>
      </div>
    </div>
  );
};
