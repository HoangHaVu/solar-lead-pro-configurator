import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  Sun, CheckCircle, UploadCloud, FileText,
  ChevronDown, ArrowLeft, Download, ArrowRight, Receipt,
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { CustomerDataSection } from '../components/sections/details/CustomerDataSection';
import { ConfigSummarySection } from '../components/sections/details/ConfigSummarySection';
import { AngebotPdfDocument } from '../components/AngebotPdfDocument';
import { RechnungPdfDocument } from '../components/RechnungPdfDocument';
import { useInstallerProject } from '../hooks/useInstallerProject';
import { NoteBox } from '../components/sections/notes/NoteBox';
import type { Project } from '../services/data';


const STATUS_LABELS: Record<Project['status'], string> = {
  angebot:     'Angebot erstellt',
  planung:     'In Planung',
  genehmigung: 'Genehmigung läuft',
  installation:'In Installation',
  inbetrieb:  'In Betrieb ✓',
};

const STATUS_COLORS: Record<Project['status'], string> = {
  angebot:     'bg-blue-50 text-blue-700 border-blue-100',
  planung:     'bg-indigo-50 text-indigo-700 border-indigo-100',
  genehmigung: 'bg-amber-50 text-amber-700 border-amber-100',
  installation:'bg-purple-50 text-purple-700 border-purple-100',
  inbetrieb:  'bg-green-50 text-green-700 border-green-100',
};

export const ProjectDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { project, isLoading, isSaving, advancePhase, changeStatus, saveNotes, isLastPhase } = useInstallerProject(id);

  const [notes, setNotes] = useState('');
  const [paymentPaid, setPaymentPaid] = useState([false, false, false]);

  useEffect(() => {
    if (project?.notes != null) setNotes(project.notes);
  }, [project?.notes]);

  const leadAsCustomer = project?.lead
    ? { full_name: `${project.lead.first_name} ${project.lead.last_name}`, phone: project.lead.phone, zip: project.lead.zip }
    : null;
  const customer = project?.customer ?? leadAsCustomer;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />
      <div className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col">

          {isLoading && (
            <div className="flex justify-center py-24">
              <Sun className="w-10 h-10 text-secondary animate-spin" />
            </div>
          )}

          {!isLoading && !project && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <p className="font-semibold">Noch kein Projekt vorhanden.</p>
            </div>
          )}

          {!isLoading && project && (
            <>
              <button
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Zurück zu Projekten
              </button>

              <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_COLORS[project.status]}`}>
                      {STATUS_LABELS[project.status]}
                    </span>
                    <span className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                      #{project.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>
                  <h1 className="text-3xl font-black text-primary">
                    {customer?.full_name ?? 'PV Anlage'}
                  </h1>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {/* Offer-Status — Projekte entstehen nur nach Angebotsannahme */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Angebot angenommen
                  </span>

                  <PDFDownloadLink
                    document={<AngebotPdfDocument project={project} />}
                    fileName={`angebot-${project.id.slice(0, 6)}.pdf`}
                    className="border border-slate-200 text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2"
                  >
                    {({ loading }) => (
                      <>
                        <Download className="w-4 h-4" />
                        {loading ? 'PDF wird erstellt…' : 'Angebot als PDF'}
                      </>
                    )}
                  </PDFDownloadLink>

                  {isLastPhase ? (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 font-bold text-sm px-5 py-2.5 rounded-xl border border-green-200">
                      <CheckCircle className="w-4 h-4" />
                      Anlage in Betrieb
                    </div>
                  ) : (
                    <button
                      onClick={advancePhase}
                      disabled={isSaving}
                      className="bg-secondary text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm disabled:opacity-60"
                    >
                      {isSaving ? <Sun className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      Phase abschließen
                    </button>
                  )}
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 flex flex-col gap-8">
                  {customer && (
                    <CustomerDataSection
                      customer={customer}
                      email={project.lead?.email ?? undefined}
                    />
                  )}
                  <ConfigSummarySection project={project} />
                </div>

                <div className="lg:col-span-7 flex flex-col gap-8">
                  {/* Status-Sektion */}
                  <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
                    <h2 className="text-lg font-bold text-primary mb-4">Projektstatus</h2>
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Status manuell setzen
                      </label>
                      <div className="relative">
                        <select
                          value={project.status}
                          onChange={(e) => changeStatus(e.target.value as Project['status'])}
                          className="w-full appearance-none bg-slate-50 border border-slate-200 text-primary font-bold text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10"
                        >
                          <option value="angebot">Angebot erstellt</option>
                          <option value="planung">In Planung</option>
                          <option value="genehmigung">Genehmigung läuft</option>
                          <option value="installation">In Installation</option>
                          <option value="inbetrieb">In Betrieb</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Oder nutze "Phase abschließen" oben für den nächsten Schritt.
                      </p>
                    </div>
                  </section>

                  {/* Dokumente */}
                  <section className="bg-white rounded-xl shadow-sm border-2 border-dashed border-slate-200 p-8 flex flex-col justify-center items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-primary mb-4">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-primary mb-1">Dokumente hochladen</h3>
                    <p className="text-xs text-slate-500 mb-4">Zählerfoto, Dachpläne, etc.</p>
                    <button className="bg-slate-100 text-primary font-bold text-xs px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                      Datei auswählen
                    </button>
                  </section>

                  {/* Notizen */}
                  <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
                    <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
                      <FileText className="w-5 h-5 text-slate-400" />
                      Interne Notizen
                    </h2>
                    <textarea
                      className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 resize-none"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Notizen zur Dachbeschaffenheit, Kundenwünschen oder Besonderheiten..."
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => saveNotes(notes)}
                        disabled={isSaving || notes === (project.notes ?? '')}
                        className="bg-primary text-white font-bold text-sm px-6 py-2 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-2"
                      >
                        {isSaving && <Sun className="w-4 h-4 animate-spin" />}
                        Notizen speichern
                      </button>
                    </div>
                  </section>

                  {/* Zahlungsstatus */}
                  {(project.investment ?? 0) > 0 && (
                    <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
                      <h2 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Zahlungsstatus
                      </h2>
                      <p className="text-xs text-slate-400 mb-4">3-Raten-Zahlungsplan — als bezahlt markieren</p>
                      <div className="space-y-2">
                        {(['Abschlags-Rechnung 1 — 30 % Anzahlung', 'Abschlags-Rechnung 2 — 60 % Montage', 'Schluss-Rechnung — 10 % Abnahme'] as const).map((label, i) => {
                          const amounts = [
                            Math.round((project.investment ?? 0) * 0.30),
                            Math.round((project.investment ?? 0) * 0.60),
                            (project.investment ?? 0) - Math.round((project.investment ?? 0) * 0.30) - Math.round((project.investment ?? 0) * 0.60),
                          ];
                          const paid = paymentPaid[i];
                          return (
                            <button
                              key={label}
                              onClick={() => setPaymentPaid(prev => prev.map((v, idx) => idx === i ? !v : v))}
                              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl border transition-all text-sm font-medium ${
                                paid
                                  ? 'bg-green-50 border-green-200 text-green-800'
                                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${paid ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                  {paid && <span className="text-white text-[10px] font-black">✓</span>}
                                </span>
                                {label}
                              </span>
                              <span className={`font-bold ${paid ? 'text-green-700' : 'text-primary'}`}>
                                {amounts[i].toLocaleString('de-DE')} €
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                        <span>{paymentPaid.filter(Boolean).length} / 3 Raten bezahlt</span>
                        <span className="font-bold text-primary">
                          {paymentPaid.reduce((sum, paid, i) => {
                            const amounts = [
                              Math.round((project.investment ?? 0) * 0.30),
                              Math.round((project.investment ?? 0) * 0.60),
                              (project.investment ?? 0) - Math.round((project.investment ?? 0) * 0.30) - Math.round((project.investment ?? 0) * 0.60),
                            ];
                            return sum + (paid ? amounts[i] : 0);
                          }, 0).toLocaleString('de-DE')} € erhalten
                        </span>
                      </div>
                    </section>
                  )}

                  {/* Rechnungs-Generator */}
                  <section className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-6">
                    <h2 className="text-lg font-bold text-primary mb-1 flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-amber-500" />
                      Rechnungen generieren
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">3-Raten-Zahlungsplan · 0 % MwSt. gem. § 12 Abs. 3 UStG</p>
                    <div className="space-y-2">
                      {([1, 2, 3] as const).map((type) => {
                        const labels = ['Abschlags-Rechnung 1 — 30 % Anzahlung', 'Abschlags-Rechnung 2 — 60 % Montage', 'Schluss-Rechnung — 10 % Abnahme'];
                        const amounts = [
                          Math.round((project.investment ?? 0) * 0.30),
                          Math.round((project.investment ?? 0) * 0.60),
                          (project.investment ?? 0) - Math.round((project.investment ?? 0) * 0.30) - Math.round((project.investment ?? 0) * 0.60),
                        ];
                        return (
                          <PDFDownloadLink
                            key={type}
                            document={<RechnungPdfDocument project={project} rechnungType={type} />}
                            fileName={`rechnung-${type}-${project.id.slice(0, 6)}.pdf`}
                            className="flex items-center justify-between w-full border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-primary font-medium text-sm px-4 py-3 rounded-xl transition-colors group"
                          >
                            {({ loading }) => (
                              <>
                                <span className="flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-amber-500" />
                                  {labels[type - 1]}
                                </span>
                                <span className="flex items-center gap-2 text-slate-400 group-hover:text-amber-600 transition-colors">
                                  <span className="font-bold text-primary">{amounts[type - 1].toLocaleString('de-DE')} €</span>
                                  <Download className="w-3.5 h-3.5" />
                                  {loading ? '…' : 'PDF'}
                                </span>
                              </>
                            )}
                          </PDFDownloadLink>
                        );
                      })}
                    </div>
                  </section>

                  {/* Interne Notizen */}
                  <NoteBox projectId={project.id} />
                </div>
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
