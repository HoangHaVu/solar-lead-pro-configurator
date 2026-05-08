import { useState, useEffect, useCallback } from 'react';
import { fetchNotesByLead, fetchNotesByProject, addNote, deleteNote } from '../services/notes';
import type { Note } from '../services/notes';

interface UseNotesOptions {
  leadId?: string;
  projectId?: string;
}

interface UseNotesReturn {
  notes: Note[];
  isLoading: boolean;
  error: string | null;
  addNote: (content: string) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

export function useNotes({ leadId, projectId }: UseNotesOptions): UseNotesReturn {
  const [notes, setNotes]       = useState<Note[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = leadId
        ? await fetchNotesByLead(leadId)
        : projectId
          ? await fetchNotesByProject(projectId)
          : [];
      setNotes(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [leadId, projectId]);

  useEffect(() => { void load(); }, [load]);

  const handleAdd = async (content: string) => {
    const note = await addNote(
      leadId ? { lead_id: leadId, content } : { project_id: projectId!, content }
    );
    setNotes(prev => [note, ...prev]);
  };

  const handleDelete = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    try { await deleteNote(id); }
    catch { void load(); }
  };

  return { notes, isLoading, error, addNote: handleAdd, deleteNote: handleDelete };
}
