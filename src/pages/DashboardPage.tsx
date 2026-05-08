import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sun, FileText, CheckCircle, MessageSquare, ChevronRight, Calendar, Download, ExternalLink } from 'lucide-react';
import { SideNavBar } from '../components/layout/SideNavBar';
import { TopAppBar } from '../components/layout/TopAppBar';
import { ProjectStatusSection } from '../components/sections/dashboard/ProjectStatusSection';
import { ProjectSpecsSection } from '../components/sections/dashboard/ProjectSpecsSection';
import { ContactCard } from '../components/sections/dashboard/ContactCard';
import { useProject } from '../hooks/useProject';
import { fetchAppointmentsByCustomerId } from '../services/data';
import type { Appointment } from '../services/data';
import { useAuth } from '../contexts/AuthContext';

const MONTH_NAMES_DASH = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
const WEEKDAY_NAMES_DASH = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'];

const APT_TYPE_LABEL: Record<Appointment['type'], string> = {
  beratung: 'Beratung', installation: 'Installation', abnahme: 'Abnahme',
};
const APT_TYPE_COLOR: Record<Appointment['type'], string> = {
  beratung: 'bg-blue-50 border-blue-200 text-blue-700',
  installation: 'bg-orange-50 border-orange-200 text-orange-700',
  abnahme: 'bg-green-50 border-green-200 text-green-700',
};

function formatDateDash(iso: string): string {
  const d = new Date(iso);
  return `${WEEKDAY_NAMES_DASH[d.getDay()]}, ${d.getDate()}. ${MONTH_NAMES_DASH[d.getMonth()]} ${d.getFullYear()}`;
}
function formatTimeDash(iso: string): string {
  return new Date(iso).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}
function toCalDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}
function downloadICS(a: Appointment) {
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Solar Konfigurator//DE',
    'BEGIN:VEVENT',
    `UID:${a.id}@solar-konfigurator`,
    `DTSTAMP:${toCalDate(new Date().toISOString())}`,
    `DTSTART:${toCalDate(a.starts_at)}`,
    `DTEND:${toCalDate(a.ends_at)}`,
    `SUMMARY:${a.title}`,
    a.location ? `LOCATION:${a.location}` : '',
    a.notes ? `DESCRIPTION:${a.notes}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
  const blob = new Blob([lines], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const el = document.createElement('a');
  el.href = url; el.download = `termin.ics`; el.click();
  URL.revokeObjectURL(url);
}
function googleCalUrl(a: Appointment): string {
  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const params = [
    `text=${encodeURIComponent(a.title)}`,
    `dates=${toCalDate(a.starts_at)}/${toCalDate(a.ends_at)}`,
    a.location ? `location=${encodeURIComponent(a.location)}` : '',
    a.notes ? `details=${encodeURIComponent(a.notes)}` : '',
  ].filter(Boolean).join('&');
  return `${base}&${params}`;
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { project, isLoading } = useProject();
  const [offerAccepted, setOfferAccepted] = useState(false);
  const [changeStep, setChangeStep] = useState<'idle' | 'input' | 'sent'>('idle');
  const [changeText, setChangeText] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    if (user) {
      fetchAppointmentsByCustomerId(user.id).then(setAppointments).catch(() => {});
    }
  }, [user?.id]);

  const now = new Date().toISOString();
  const nextAppointment  = appointments.find(a => a.starts_at >= now);
  const lastAppointment  = nextAppointment ? null : [...appointments].reverse().find(a => a.starts_at < now);
  const displayAppointment = nextAppointment ?? lastAppointment ?? null;
  const isUpcoming = !!nextAppointment;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <SideNavBar />
      <div className="flex flex-col min-h-screen lg:pl-64">
        <TopAppBar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-primary mb-2">Projektübersicht</h1>
            <p className="text-lg text-slate-500">Verfolge den Fortschritt deiner Solaranlage in Echtzeit.</p>
          </div>

          {isLoading && (
            <div className="flex justify-center py-24">
              <Sun className="w-10 h-10 text-secondary animate-spin" />
            </div>
          )}

          {!isLoading && !project && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <p className="font-semibold">Noch kein Projekt vorhanden.</p>
              <p className="text-sm mt-1">Dein Installateur legt dein Projekt in Kürze an.</p>
            </div>
          )}

          {!isLoading && project && (
            <>
              {/* Angebot-Banner */}
              {project.status === 'angebot' && !offerAccepted && changeStep === 'idle' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-primary mb-1">Ihr Angebot liegt vor</h2>
                      <p className="text-sm text-slate-600 mb-4">
                        Ihr Installateur hat Ihnen ein unverbindliches Angebot zugesandt.
                        Prüfen Sie das Angebot und teilen Sie uns Ihre Entscheidung mit.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => setOfferAccepted(true)}
                          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Angebot annehmen
                        </button>
                        <button
                          onClick={() => setChangeStep('input')}
                          className="flex items-center justify-center gap-2 border border-amber-300 bg-white hover:bg-amber-50 text-amber-700 font-bold text-sm px-6 py-3 rounded-xl transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          Änderung anfragen
                        </button>
                        <button className="flex items-center justify-center gap-1 text-slate-500 hover:text-primary font-medium text-sm px-4 py-3 transition-colors">
                          <FileText className="w-4 h-4" />
                          Angebot öffnen
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Änderungswunsch-Eingabe */}
              {changeStep === 'input' && (
                <div className="bg-white border border-blue-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <h2 className="text-base font-bold text-primary">Was soll geändert werden?</h2>
                  </div>
                  <textarea
                    value={changeText}
                    onChange={e => setChangeText(e.target.value)}
                    placeholder="z.B. Bitte Speicher mit 10 kWh einplanen, anderer Wechselrichter gewünscht..."
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none mb-4"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => setChangeStep('idle')}
                      className="border border-slate-200 text-slate-500 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      Abbrechen
                    </button>
                    <button
                      onClick={() => setChangeStep('sent')}
                      disabled={!changeText.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors flex items-center gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      Änderung senden
                    </button>
                  </div>
                </div>
              )}

              {/* Annahme-Bestätigung */}
              {offerAccepted && (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-green-800 mb-0.5">Angebot angenommen!</h2>
                    <p className="text-sm text-green-700">Ihr Installateur wurde benachrichtigt und wird sich in Kürze bei Ihnen melden.</p>
                  </div>
                </div>
              )}

              {/* Änderungswunsch-Bestätigung */}
              {changeStep === 'sent' && (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-blue-800 mb-0.5">Änderungswunsch übermittelt</h2>
                      <p className="text-sm text-blue-700 mb-2">Ihr Installateur erhält Ihre Anfrage und wird das Angebot überarbeiten.</p>
                      {changeText && (
                        <div className="bg-white/60 rounded-lg px-3 py-2 text-xs text-slate-600 italic border border-blue-100">
                          „{changeText}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <ProjectStatusSection status={project.status} />

              {displayAppointment && (
                <div className={`rounded-2xl border shadow-sm p-6 mb-6 ${isUpcoming ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className={`w-4 h-4 ${isUpcoming ? 'text-secondary' : 'text-slate-400'}`} />
                    <h2 className="text-sm font-black text-primary uppercase tracking-wider">
                      {isUpcoming ? 'Ihr nächster Termin' : 'Letzter Termin'}
                    </h2>
                  </div>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border mb-3 ${APT_TYPE_COLOR[displayAppointment.type]}`}>
                    {APT_TYPE_LABEL[displayAppointment.type]}
                  </div>
                  <p className="text-base font-bold text-primary mb-3">{displayAppointment.title}</p>
                  <div className="space-y-1.5 text-sm text-slate-600 mb-4">
                    <p>📅 {formatDateDash(displayAppointment.starts_at)}</p>
                    <p>🕐 {formatTimeDash(displayAppointment.starts_at)} – {formatTimeDash(displayAppointment.ends_at)} Uhr</p>
                    {displayAppointment.location && <p>📍 {displayAppointment.location}</p>}
                  </div>
                  {isUpcoming && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => downloadICS(displayAppointment)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        .ics herunterladen
                      </button>
                      <a
                        href={googleCalUrl(displayAppointment)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold text-blue-700 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Google Calendar
                      </a>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <ProjectSpecsSection project={project} />
                <ContactCard installer={project.installer ?? null} />
              </div>
            </>
          )}
        </main>

        <footer className="w-full border-t border-slate-200 mt-20 py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-[1200px] mx-auto gap-4 text-xs text-slate-400 font-medium uppercase tracking-wider">
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
