import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, Sun, X, Clock, MapPin, FileText, Calendar, Plus, Loader2, RotateCcw, Trash2, User2 } from 'lucide-react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { CalendarGrid } from '../components/sections/calendar/CalendarGrid';
import { useAppointments } from '../hooks/useAppointments';
import { useAuth } from '../contexts/AuthContext';
import { fetchInstallerLeads, fetchCustomerIdForLead, fetchTeamAppointments, fetchInstallerProfiles } from '../services/data';
import type { Appointment, Lead } from '../services/data';
import type { PersonColor } from '../components/sections/calendar/CalendarEvent';

const MONTH_NAMES   = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const WEEKDAY_NAMES = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

const TYPE_CONFIG: Record<Appointment['type'], { label: string; bg: string; border: string; text: string; dot: string }> = {
  beratung:     { label: 'Beratung',     bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   dot: 'bg-blue-500'   },
  installation: { label: 'Installation', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', dot: 'bg-orange-500' },
  abnahme:      { label: 'Abnahme',      bg: 'bg-green-50',  border: 'border-green-200',  text: 'text-green-700',  dot: 'bg-green-500'  },
};

const PERSON_PALETTE: PersonColor[] = [
  { bg: 'bg-violet-50', border: 'border-violet-300', text: 'text-violet-700', dot: 'bg-violet-500' },
  { bg: 'bg-cyan-50',   border: 'border-cyan-300',   text: 'text-cyan-700',   dot: 'bg-cyan-500'   },
  { bg: 'bg-rose-50',   border: 'border-rose-300',   text: 'text-rose-700',   dot: 'bg-rose-500'   },
  { bg: 'bg-amber-50',  border: 'border-amber-300',  text: 'text-amber-700',  dot: 'bg-amber-500'  },
  { bg: 'bg-teal-50',   border: 'border-teal-300',   text: 'text-teal-700',   dot: 'bg-teal-500'   },
  { bg: 'bg-fuchsia-50',border: 'border-fuchsia-300',text: 'text-fuchsia-700',dot: 'bg-fuchsia-500' },
  { bg: 'bg-lime-50',   border: 'border-lime-300',   text: 'text-lime-700',   dot: 'bg-lime-500'   },
  { bg: 'bg-sky-50',    border: 'border-sky-300',    text: 'text-sky-700',    dot: 'bg-sky-500'    },
];

function formatFullDate(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAY_NAMES[d.getDay()]}, ${d.getDate()}. ${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDuration(start: string, end: string): string {
  const diffMin = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  if (diffMin < 60) return `${diffMin} Min.`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return m === 0 ? `${h} Std.` : `${h} Std. ${m} Min.`;
}

const EMPTY_CREATE = {
  title: '', type: 'beratung' as Appointment['type'],
  date: '', startTime: '09:00', endTime: '10:00', location: '', notes: '',
  customerMode: 'internal' as 'lead' | 'manual' | 'internal',
  leadId: '', customerName: '', customerPhone: '', customerEmail: '',
};

export const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const { appointments, isLoading, create, update, remove } = useAppointments();
  const isOwner = user?.role === 'owner';
  const [leads, setLeads] = useState<Lead[]>([]);
  const [teamProfiles, setTeamProfiles] = useState<{ id: string; full_name: string }[]>([]);
  const [teamAppointments, setTeamAppointments] = useState<Appointment[]>([]);
  const [activePersonIds, setActivePersonIds] = useState<Set<string>>(new Set());
  const [showPersonPicker, setShowPersonPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showPersonPicker) return;
    function onMouseDown(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPersonPicker(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [showPersonPicker]);

  useEffect(() => {
    if (user) fetchInstallerLeads(user.id).then(setLeads).catch(() => {});
  }, [user?.id]);

  useEffect(() => {
    if (isOwner && user?.id) {
      setActivePersonIds(new Set([user.id]));
      fetchTeamAppointments().then(setTeamAppointments).catch(() => {});
      fetchInstallerProfiles().then(setTeamProfiles).catch(() => {});
    }
  }, [isOwner, user?.id]);

  const personColorMap = useMemo<Record<string, PersonColor>>(() => {
    const map: Record<string, PersonColor> = {};
    teamProfiles.forEach((p, i) => { map[p.id] = PERSON_PALETTE[i % PERSON_PALETTE.length]; });
    return map;
  }, [teamProfiles]);

  const displayedAppointments = isOwner
    ? teamAppointments.filter(a => activePersonIds.size === 0 || activePersonIds.has(a.installer_id))
    : appointments;

  function addPerson(id: string) {
    setActivePersonIds(prev => new Set([...prev, id]));
    setShowPersonPicker(false);
  }

  function removePerson(id: string) {
    setActivePersonIds(prev => { const n = new Set(prev); n.delete(id); return n; });
  }

  const [selected,      setSelected]      = useState<Appointment | null>(null);
  const [modalMode,     setModalMode]     = useState<'view' | 'reschedule' | 'confirmCancel'>('view');
  const [showCreate,    setShowCreate]    = useState(false);
  const [isSaving,      setIsSaving]      = useState(false);
  const [rescheduleForm, setRescheduleForm] = useState({ date: '', startTime: '', endTime: '', notes: '' });
  const [createForm,    setCreateForm]    = useState(EMPTY_CREATE);

  const [currentDate, setCurrentDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday   = () => { const d = new Date(); setCurrentDate(new Date(d.getFullYear(), d.getMonth(), 1)); };
  const title = `${MONTH_NAMES[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  function handleSelectAppointment(a: Appointment) {
    setSelected(a);
    setModalMode('view');
  }

  function closeDetail() {
    setSelected(null);
    setModalMode('view');
  }

  function openReschedule() {
    if (!selected) return;
    const d = new Date(selected.starts_at);
    const e = new Date(selected.ends_at);
    setRescheduleForm({
      date:      d.toISOString().slice(0, 10),
      startTime: d.toTimeString().slice(0, 5),
      endTime:   e.toTimeString().slice(0, 5),
      notes:     selected.notes ?? '',
    });
    setModalMode('reschedule');
  }

  async function handleReschedule(ev: React.FormEvent) {
    ev.preventDefault();
    if (!selected) return;
    setIsSaving(true);
    await update(selected.id, {
      starts_at: `${rescheduleForm.date}T${rescheduleForm.startTime}:00`,
      ends_at:   `${rescheduleForm.date}T${rescheduleForm.endTime}:00`,
      notes:     rescheduleForm.notes || null,
    });
    setIsSaving(false);
    closeDetail();
  }

  async function handleCancel() {
    if (!selected) return;
    setIsSaving(true);
    await remove(selected.id);
    setIsSaving(false);
    closeDetail();
  }

  async function handleCreate(ev: React.FormEvent) {
    ev.preventDefault();
    setIsSaving(true);
    const pickedLead = createForm.customerMode === 'lead'
      ? leads.find(l => l.id === createForm.leadId) ?? null
      : null;
    const linkedCustomerId = pickedLead
      ? await fetchCustomerIdForLead(pickedLead.id).catch(() => null)
      : null;
    await create({
      title:     createForm.title,
      type:      createForm.type,
      starts_at: `${createForm.date}T${createForm.startTime}:00`,
      ends_at:   `${createForm.date}T${createForm.endTime}:00`,
      location:  createForm.location || null,
      notes:     createForm.notes || null,
      lead_id:        createForm.customerMode === 'lead' ? createForm.leadId || null : null,
      customer_id:    linkedCustomerId,
      customer_name:  createForm.customerMode === 'lead'
                        ? (pickedLead ? `${pickedLead.first_name} ${pickedLead.last_name}` : null)
                        : createForm.customerMode === 'manual' ? createForm.customerName || null : null,
      customer_phone: createForm.customerMode === 'lead'
                        ? pickedLead?.phone ?? null
                        : createForm.customerMode === 'manual' ? createForm.customerPhone || null : null,
      customer_email: createForm.customerMode === 'lead'
                        ? pickedLead?.email ?? null
                        : createForm.customerMode === 'manual' ? createForm.customerEmail || null : null,
    });
    setIsSaving(false);
    setShowCreate(false);
    setCreateForm(EMPTY_CREATE);
  }

  const inputCls = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-primary placeholder-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary';

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />
      <div className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col">

          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-6">
              <h1 className="text-xl md:text-3xl font-black text-primary">{title}</h1>
              <div className="flex items-center bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                <button onClick={prevMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={nextMonth} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-primary transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={goToday} className="px-5 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-primary hover:bg-slate-50 transition-colors shadow-sm">
                Heute
              </button>
              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Neuer Termin
              </button>
            </div>
          </div>

          {/* Legende / Team-Filter */}
          {isOwner ? (
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Team:</span>

              {/* Active person chips */}
              {[...activePersonIds].map(id => {
                const p = teamProfiles.find(tp => tp.id === id);
                if (!p) return null;
                const color = personColorMap[id];
                return (
                  <span key={id} className={`flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full border text-xs font-bold ${color.bg} ${color.border} ${color.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${color.dot}`} />
                    {p.full_name}
                    <button onClick={() => removePerson(id)} className="ml-0.5 hover:opacity-70 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {/* "+" picker button + dropdown */}
              <div className="relative" ref={pickerRef}>
                <button
                  onClick={() => setShowPersonPicker(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-dashed border-slate-300 text-xs font-bold text-slate-400 hover:border-secondary hover:text-secondary transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Person
                </button>
                {showPersonPicker && (
                  <div className="absolute top-full left-0 mt-1.5 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 min-w-[180px]">
                    {teamProfiles.filter(p => !activePersonIds.has(p.id)).length > 0
                      ? teamProfiles.filter(p => !activePersonIds.has(p.id)).map(p => {
                          const color = personColorMap[p.id];
                          return (
                            <button
                              key={p.id}
                              onClick={() => addPerson(p.id)}
                              className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-sm font-semibold text-primary transition-colors text-left"
                            >
                              <span className={`w-2 h-2 rounded-full shrink-0 ${color?.dot ?? 'bg-slate-300'}`} />
                              {p.full_name}
                            </button>
                          );
                        })
                      : <p className="px-4 py-2.5 text-xs text-slate-400 italic">Alle hinzugefügt</p>
                    }
                  </div>
                )}
              </div>

              {/* Alle zurücksetzen */}
              {activePersonIds.size > 0 && (
                <button
                  onClick={() => setActivePersonIds(new Set())}
                  className="text-xs text-slate-400 hover:text-primary transition-colors underline underline-offset-2"
                >
                  Alle
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
                <Filter className="w-3 h-3" />Legende:
              </div>
              {(['beratung','installation','abnahme'] as Appointment['type'][]).map(t => (
                <div key={t} className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${TYPE_CONFIG[t].bg} border ${TYPE_CONFIG[t].border} ${TYPE_CONFIG[t].text} text-xs font-bold`}>
                  <span className={`w-2 h-2 rounded-full ${TYPE_CONFIG[t].dot}`} />
                  {TYPE_CONFIG[t].label}
                </div>
              ))}
            </div>
          )}

          {/* Grid */}
          {isLoading ? (
            <div className="flex justify-center py-24">
              <Sun className="w-10 h-10 text-secondary animate-spin" />
            </div>
          ) : (
            <CalendarGrid
              appointments={displayedAppointments}
              currentDate={currentDate}
              onSelect={handleSelectAppointment}
              personColorMap={isOwner ? personColorMap : undefined}
            />
          )}
        </main>

        <footer className="w-full border-t border-slate-200 mt-auto py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
          <p>© 2026 SolarKonfigurator. 100% DSGVO-konform.</p>
          <ul className="flex flex-wrap items-center gap-6">
            <li><Link className="hover:text-primary transition-colors" to="/impressum">Impressum</Link></li>
            <li><Link className="hover:text-primary transition-colors" to="/datenschutz">Datenschutz</Link></li>
          </ul>
        </footer>

        {/* ─── Detail Modal ─── */}
        {selected && (() => {
          const cfg = TYPE_CONFIG[selected.type];
          const installerName = isOwner
            ? teamProfiles.find(p => p.id === selected.installer_id)?.full_name ?? null
            : null;
          return (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={closeDetail}>
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>

                {/* Modal-Header */}
                <div className={`${cfg.bg} ${cfg.border} border-b px-6 py-5 flex items-start justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full shrink-0 mt-0.5 ${cfg.dot}`} />
                    <div>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${cfg.text}`}>{cfg.label}</p>
                      <h2 className="text-lg font-black text-primary leading-tight">{selected.title}</h2>
                    </div>
                  </div>
                  <button onClick={closeDetail} className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-black/10 text-slate-400 hover:text-primary transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* ── Ansicht ── */}
                {modalMode === 'view' && (
                  <>
                    <div className="px-6 py-5 space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <p className="text-sm font-semibold text-primary">{formatFullDate(selected.starts_at)}</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-primary">{formatTime(selected.starts_at)} – {formatTime(selected.ends_at)} Uhr</p>
                          <p className="text-xs text-slate-400 mt-0.5">{formatDuration(selected.starts_at, selected.ends_at)}</p>
                        </div>
                      </div>
                      {selected.location && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-primary">{selected.location}</p>
                        </div>
                      )}
                      {selected.notes && (
                        <div className="flex items-start gap-3">
                          <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                          <p className="text-sm text-slate-600 leading-relaxed">{selected.notes}</p>
                        </div>
                      )}
                      <div className="flex items-start gap-3 pt-3 border-t border-slate-100">
                        <User2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        {selected.customer_name ? (
                          <div>
                            <p className="text-sm font-semibold text-primary">{selected.customer_name}</p>
                            {(selected.customer_phone || selected.customer_email) && (
                              <p className="text-xs text-slate-400 mt-0.5">
                                {[selected.customer_phone, selected.customer_email].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic mt-0.5">Interner Termin — kein Kunde zugeordnet</p>
                        )}
                      </div>
                      {installerName && (
                        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                          {(() => {
                            const c = personColorMap[selected.installer_id];
                            return c ? (
                              <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                            ) : (
                              <span className="w-2 h-2 rounded-full shrink-0 bg-slate-300" />
                            );
                          })()}
                          <p className="text-xs font-semibold text-slate-500">{installerName}</p>
                        </div>
                      )}
                    </div>
                    <div className="px-6 pb-5 flex gap-2">
                      <button
                        onClick={openReschedule}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Verschieben
                      </button>
                      <button
                        onClick={() => setModalMode('confirmCancel')}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Absagen
                      </button>
                    </div>
                  </>
                )}

                {/* ── Verschieben-Formular ── */}
                {modalMode === 'reschedule' && (
                  <form onSubmit={handleReschedule}>
                    <div className="px-6 py-5 space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neuer Termin-Zeitpunkt</p>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Datum *</label>
                        <input required type="date" value={rescheduleForm.date}
                          onChange={e => setRescheduleForm(f => ({ ...f, date: e.target.value }))}
                          className={inputCls} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Von *</label>
                          <input required type="time" value={rescheduleForm.startTime}
                            onChange={e => setRescheduleForm(f => ({ ...f, startTime: e.target.value }))}
                            className={inputCls} />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-600">Bis *</label>
                          <input required type="time" value={rescheduleForm.endTime}
                            onChange={e => setRescheduleForm(f => ({ ...f, endTime: e.target.value }))}
                            className={inputCls} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-600">Hinweis</label>
                        <textarea rows={2} value={rescheduleForm.notes}
                          onChange={e => setRescheduleForm(f => ({ ...f, notes: e.target.value }))}
                          placeholder="z.B. Kunde hat ursprünglichen Termin abgesagt"
                          className={`${inputCls} resize-none`} />
                      </div>
                    </div>
                    <div className="px-6 pb-5 flex gap-2">
                      <button type="submit" disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                        {isSaving ? 'Wird gespeichert…' : 'Termin verschieben'}
                      </button>
                      <button type="button" onClick={() => setModalMode('view')}
                        className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                        Zurück
                      </button>
                    </div>
                  </form>
                )}

                {/* ── Absagen-Bestätigung ── */}
                {modalMode === 'confirmCancel' && (
                  <>
                    <div className="px-6 py-5">
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4 space-y-1">
                        <p className="text-sm font-bold text-red-700">Termin wirklich absagen?</p>
                        <p className="text-sm text-red-600">
                          „{selected.title}" am {formatFullDate(selected.starts_at)} wird gelöscht und kann nicht wiederhergestellt werden.
                        </p>
                      </div>
                    </div>
                    <div className="px-6 pb-5 flex gap-2">
                      <button onClick={handleCancel} disabled={isSaving}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-60 transition-colors">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        {isSaving ? 'Wird abgesagt…' : 'Ja, Termin absagen'}
                      </button>
                      <button onClick={() => setModalMode('view')}
                        className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                        Zurück
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })()}

        {/* ─── Neuen Termin anlegen Modal ─── */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => { setShowCreate(false); setCreateForm(EMPTY_CREATE); }}>
            <form className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              onClick={e => e.stopPropagation()} onSubmit={handleCreate}>

              <div className="border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-black text-primary">Neuer Termin</h2>
                </div>
                <button type="button" onClick={() => { setShowCreate(false); setCreateForm(EMPTY_CREATE); }}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 space-y-4 max-h-[62vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Titel *</label>
                  <input required type="text" value={createForm.title}
                    onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="z.B. Erstgespräch Familie Müller"
                    className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Typ *</label>
                  <select value={createForm.type}
                    onChange={e => setCreateForm(f => ({ ...f, type: e.target.value as Appointment['type'] }))}
                    className={inputCls}>
                    <option value="beratung">Beratung</option>
                    <option value="installation">Installation</option>
                    <option value="abnahme">Abnahme</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Datum *</label>
                  <input required type="date" value={createForm.date}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={e => setCreateForm(f => ({ ...f, date: e.target.value }))}
                    className={inputCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Von *</label>
                    <input required type="time" value={createForm.startTime}
                      onChange={e => setCreateForm(f => ({ ...f, startTime: e.target.value }))}
                      className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Bis *</label>
                    <input required type="time" value={createForm.endTime}
                      onChange={e => setCreateForm(f => ({ ...f, endTime: e.target.value }))}
                      className={inputCls} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Ort</label>
                  <input type="text" value={createForm.location}
                    onChange={e => setCreateForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="z.B. Musterstraße 12, 80333 München"
                    className={inputCls} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Notizen</label>
                  <textarea rows={2} value={createForm.notes}
                    onChange={e => setCreateForm(f => ({ ...f, notes: e.target.value }))}
                    placeholder="Interne Hinweise zum Termin…"
                    className={`${inputCls} resize-none`} />
                </div>

                {/* ── Kundenzuordnung ── */}
                <div className="space-y-3 pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kundenzuordnung</p>
                  <div className="flex gap-2">
                    {(['lead', 'manual', 'internal'] as const).map(mode => {
                      const labels = { lead: 'Aus Leads', manual: 'Manuell', internal: 'Intern' };
                      return (
                        <button key={mode} type="button"
                          onClick={() => setCreateForm(f => ({ ...f, customerMode: mode }))}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors ${
                            createForm.customerMode === mode
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}>
                          {labels[mode]}
                        </button>
                      );
                    })}
                  </div>

                  {createForm.customerMode === 'lead' && (
                    <select value={createForm.leadId}
                      onChange={e => setCreateForm(f => ({ ...f, leadId: e.target.value }))}
                      className={inputCls}>
                      <option value="">— Kunden auswählen —</option>
                      {leads.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.first_name} {l.last_name}{l.phone ? ` · ${l.phone}` : ''}
                        </option>
                      ))}
                    </select>
                  )}

                  {createForm.customerMode === 'manual' && (
                    <div className="space-y-3">
                      <input type="text" value={createForm.customerName}
                        onChange={e => setCreateForm(f => ({ ...f, customerName: e.target.value }))}
                        placeholder="Name des Kunden"
                        className={inputCls} />
                      <div className="grid grid-cols-2 gap-3">
                        <input type="tel" value={createForm.customerPhone}
                          onChange={e => setCreateForm(f => ({ ...f, customerPhone: e.target.value }))}
                          placeholder="Telefon"
                          className={inputCls} />
                        <input type="email" value={createForm.customerEmail}
                          onChange={e => setCreateForm(f => ({ ...f, customerEmail: e.target.value }))}
                          placeholder="E-Mail"
                          className={inputCls} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 pb-5 flex gap-2">
                <button type="submit" disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 disabled:opacity-60 transition-colors">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  {isSaving ? 'Wird angelegt…' : 'Termin anlegen'}
                </button>
                <button type="button" onClick={() => { setShowCreate(false); setCreateForm(EMPTY_CREATE); }}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                  Abbrechen
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
