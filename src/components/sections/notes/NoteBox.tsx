import React, { useState } from 'react';
import { MessageSquare, Send, Trash2, Loader } from 'lucide-react';
import { useNotes } from '../../../hooks/useNotes';

interface NoteBoxProps {
  leadId?: string;
  projectId?: string;
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'Gerade eben';
  if (mins < 60)  return `vor ${mins} Min.`;
  if (hours < 24) return `vor ${hours} Std.`;
  if (days < 7)   return `vor ${days} Tagen`;
  return new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
}

export const NoteBox: React.FC<NoteBoxProps> = ({ leadId, projectId }) => {
  const { notes, isLoading, addNote, deleteNote } = useNotes({ leadId, projectId });
  const [text, setText]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [deletingId, setDeleting] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSaving(true);
    try {
      await addNote(text.trim());
      setText('');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    await deleteNote(id);
    setDeleting(null);
  };

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Interne Notizen
      </h2>

      {/* Eingabe */}
      <form onSubmit={handleSubmit} className="mb-5">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Notiz hinzufügen — z.B. angerufen, Termin vereinbart, kein Interesse an Speicher…"
          rows={3}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-primary placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary resize-none transition-colors"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={saving || !text.trim()}
            className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Speichern
          </button>
        </div>
      </form>

      {/* Liste */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8 text-slate-400">
          <Loader className="w-5 h-5 animate-spin mr-2" />
          <span className="text-sm">Lade Notizen…</span>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          Noch keine Notizen. Füge deine erste Notiz hinzu.
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map(note => (
            <li key={note.id} className="group flex gap-3 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-primary whitespace-pre-wrap break-words">{note.content}</p>
                <p className="text-[11px] text-slate-400 mt-1">{formatRelative(note.created_at)}</p>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                disabled={deletingId === note.id}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-slate-300 hover:text-red-400 mt-0.5 disabled:opacity-40"
                title="Notiz löschen"
              >
                {deletingId === note.id
                  ? <Loader className="w-4 h-4 animate-spin" />
                  : <Trash2 className="w-4 h-4" />
                }
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
