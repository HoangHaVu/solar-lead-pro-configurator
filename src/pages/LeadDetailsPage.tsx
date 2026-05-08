import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Sun, Mail, Phone, MapPin, Zap, Euro, Calendar,
  Flame, Snowflake, ChevronDown, Clock, CreditCard, Home,
  Compass, BatteryCharging, Car, Thermometer, TrendingUp,
  Video, BarChart2, FileText, Send, CheckCircle, Eye, XCircle, Receipt,
  Tag, Percent, Loader2, ArrowRight, AlertCircle,
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { useInstallerLead } from '../hooks/useInstallerLead';
import { useDiscountCodes } from '../hooks/useDiscountCodes';
import { getScoreResult } from '../utils/leadScore';
import { NoteBox } from '../components/sections/notes/NoteBox';
import { AngebotPdfDocument } from '../components/AngebotPdfDocument';
import { RechnungPdfDocument } from '../components/RechnungPdfDocument';
import type { Lead, Project } from '../services/data';

const TIER_ICON = { heiss: Flame, warm: Zap, kalt: Snowflake };

type OfferStatus = Lead['offer_status'];

const OFFER_CONFIG: Record<OfferStatus, { label: string; icon: React.ElementType; classes: string }> = {
  created:  { label: 'Noch nicht versendet', icon: FileText,     classes: 'bg-slate-100 text-slate-500 border-slate-200' },
  sent:     { label: 'Angebot versendet',    icon: Send,         classes: 'bg-blue-50 text-blue-600 border-blue-200' },
  viewed:   { label: 'Angebot angesehen',    icon: Eye,          classes: 'bg-purple-50 text-purple-600 border-purple-200' },
  accepted: { label: 'Angebot angenommen ✓', icon: CheckCircle,  classes: 'bg-green-50 text-green-700 border-green-200' },
  rejected: { label: 'Angebot abgelehnt',    icon: XCircle,      classes: 'bg-red-50 text-red-600 border-red-200' },
};

const STATUS_OPTIONS: { value: Lead['status']; label: string }[] = [
  { value: 'neu',           label: 'Neu' },
  { value: 'kontaktiert',   label: 'Kontaktiert' },
  { value: 'angebot',       label: 'Angebot versendet' },
  { value: 'abschluss',     label: 'Abschluss' },
  { value: 'gewonnen',      label: 'Gewonnen' },
  { value: 'verloren',      label: 'Verloren' },
  { value: 'planung',       label: 'In Planung (Legacy)' },
  { value: 'installation',  label: 'In Installation (Legacy)' },
  { value: 'abgeschlossen', label: 'Abgeschlossen (Legacy)' },
];

const STATUS_COLOR: Record<Lead['status'], string> = {
  neu:           'bg-yellow-50 text-yellow-700 border-yellow-100',
  kontaktiert:   'bg-blue-50 text-blue-700 border-blue-100',
  angebot:       'bg-indigo-50 text-indigo-700 border-indigo-100',
  abschluss:     'bg-amber-50 text-amber-700 border-amber-100',
  gewonnen:      'bg-green-50 text-green-700 border-green-100',
  verloren:      'bg-red-50 text-red-400 border-red-100',
  planung:       'bg-purple-50 text-purple-700 border-purple-100',
  installation:  'bg-green-50 text-green-700 border-green-100',
  abgeschlossen: 'bg-slate-50 text-slate-500 border-slate-200',
};

const HORIZON_LABEL: Record<string, string> = {
  sofort:    'So bald wie möglich',
  '3monate': 'In 3 Monaten',
  '12monate':'In 12 Monaten',
};

const ORIENTATION_LABEL: Record<string, string> = {
  sued:    'Süd',
  ostwest: 'Ost / West',
  nord:    'Nord',
};

const CONSTRUCTION_LABEL: Record<string, string> = {
  pre1980:    'Vor 1980',
  '1980-2000':'1980 – 2000',
  '2000-2010':'2000 – 2010',
  after2010:  'Nach 2010',
};

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  accent?: string;
}
const InfoRow: React.FC<InfoRowProps> = ({ icon, label, value, accent }) => (
  <div className="flex items-center gap-3">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${accent ?? 'bg-slate-50'}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-primary">{value}</p>
    </div>
  </div>
);

interface StatCardProps { label: string; value: string; sub?: string; icon: React.ReactNode; accent?: string }
const StatCard: React.FC<StatCardProps> = ({ label, value, sub, icon, accent }) => (
  <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-1">
    <div className={`flex items-center gap-1.5 mb-1 ${accent ?? 'text-slate-400'}`}>
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
    </div>
    <p className="text-xl font-black text-primary">{value}</p>
    {sub && <p className="text-[10px] text-slate-400 font-medium">{sub}</p>}
  </div>
);

export const LeadDetailsPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lead, isLoading, changeStatus, changeOfferStatus, applyCode, requestCustomDiscount, clearLeadDiscount } = useInstallerLead(id);
  const { codes: discountCodes } = useDiscountCodes(undefined);

  const [showSendModal, setShowSendModal] = useState(false);
  const [sendEmail, setSendEmail] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Rabatt-State
  const [selectedCode, setSelectedCode] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestPercentage, setRequestPercentage] = useState('');
  const [requestNote, setRequestNote] = useState('');
  const [isApplyingCode, setIsApplyingCode] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [codeError, setCodeError] = useState<string | null>(null);

  const scoreResult = lead?.score != null ? getScoreResult(lead.score) : null;
  const TierIcon = scoreResult ? TIER_ICON[scoreResult.tier] : null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });

  async function handleApplyCode() {
    const found = discountCodes.find((c) => c.id === selectedCode);
    if (!found || !lead) return;
    setIsApplyingCode(true);
    setCodeError(null);
    try {
      await applyCode(found.code, found.percentage, found.created_by);
      setSelectedCode('');
    } catch (err) {
      setCodeError(err instanceof Error ? err.message : 'Code konnte nicht angewendet werden');
    } finally {
      setIsApplyingCode(false);
    }
  }

  async function handleRequestDiscount() {
    const pct = parseFloat(requestPercentage);
    if (!pct || pct <= 0) return;
    setIsRequesting(true);
    await requestCustomDiscount(pct, requestNote);
    setIsRequesting(false);
    setShowRequestForm(false);
    setRequestPercentage('');
    setRequestNote('');
  }

  // Lead als Projekt-Shape für PDF-Generatoren (nutzt Rabattpreis wenn vorhanden)
  const leadAsProject = lead ? ({
    id: lead.id,
    status: 'angebot',
    zip: lead.zip,
    kwp: lead.kwp,
    investment: lead.final_price ?? lead.investment,
    annual_savings: lead.annual_savings,
    amortization: lead.amortization,
    autarky: lead.autarky,
    notes: null,
    customer_id: null,
    installer_id: null,
    lead_id: null,
    created_at: lead.created_at,
    customer: { id: '', full_name: `${lead.first_name} ${lead.last_name}`, phone: lead.phone, zip: lead.zip },
    installer: null,
    lead: null,
  } as unknown as Project) : null;

  async function handleSendOffer() {
    if (!sendEmail.trim()) return;
    setIsSending(true);
    await changeOfferStatus('sent', { offer_sent_at: new Date().toISOString() });
    // Wenn Lead noch nicht auf 'angebot' ist, automatisch aktualisieren
    if (lead?.status === 'kontaktiert' || lead?.status === 'neu') {
      await changeStatus('angebot');
    }
    setIsSending(false);
    setShowSendModal(false);
    setSendEmail('');
  }

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

          {!isLoading && !lead && (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400">
              <p className="font-semibold">Lead nicht gefunden.</p>
            </div>
          )}

          {/* Angebot-Senden-Modal */}
          {showSendModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                    <Send className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="text-base font-bold text-primary">Angebot versenden</h2>
                </div>
                <p className="text-sm text-slate-500 mb-4">
                  Das Angebot wird als PDF an die angegebene E-Mail-Adresse gesendet.
                  Der Kunde erhält außerdem einen Link zu seinem persönlichen Dashboard.
                </p>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={sendEmail}
                  onChange={(e) => setSendEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 mb-4"
                  placeholder="kunde@beispiel.de"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowSendModal(false); setSendEmail(''); }}
                    className="flex-1 border border-slate-200 text-slate-500 font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={handleSendOffer}
                    disabled={!sendEmail.trim() || isSending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? 'Wird gesendet…' : 'Jetzt senden'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {!isLoading && lead && (
            <>
              <button
                onClick={() => navigate('/pipeline')}
                className="flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-primary transition-colors mb-6 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Zurück zur Pipeline
              </button>

              {/* Header */}
              <header className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${STATUS_COLOR[lead.status]}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {STATUS_OPTIONS.find(o => o.value === lead.status)?.label}
                    </span>
                    {scoreResult && TierIcon && (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${scoreResult.bgColor} ${scoreResult.color}`}>
                        <TierIcon className="w-3.5 h-3.5" />
                        {scoreResult.label} {scoreResult.score}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black text-primary">
                    {lead.first_name} {lead.last_name}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">
                    Lead #{lead.id.slice(0, 8).toUpperCase()} · Eingegangen {formatDate(lead.created_at)}
                  </p>
                </div>

                <div className="relative shrink-0">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Status ändern</label>
                  <div className="relative">
                    <select
                      value={lead.status}
                      onChange={(e) => changeStatus(e.target.value as Lead['status'])}
                      className="appearance-none bg-white border border-slate-200 text-primary font-bold text-sm rounded-xl pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-primary/10 w-52 shadow-sm"
                    >
                      {STATUS_OPTIONS.map(o => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Linke Spalte */}
                <div className="lg:col-span-5 flex flex-col gap-6">

                  {/* Kontakt */}
                  <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Kontaktdaten</h2>
                    <div className="space-y-3">
                      <InfoRow
                        icon={<Mail className="w-4 h-4 text-slate-400" />}
                        label="E-Mail"
                        value={<a href={`mailto:${lead.email}`} className="hover:text-secondary transition-colors">{lead.email}</a>}
                      />
                      {lead.phone && (
                        <InfoRow
                          icon={<Phone className="w-4 h-4 text-slate-400" />}
                          label="Telefon"
                          value={<a href={`tel:${lead.phone}`} className="hover:text-secondary transition-colors">{lead.phone}</a>}
                        />
                      )}
                      {lead.zip && (
                        <InfoRow
                          icon={<MapPin className="w-4 h-4 text-slate-400" />}
                          label="Postleitzahl"
                          value={lead.zip}
                        />
                      )}
                      {lead.wants_zoom_call && (
                        <InfoRow
                          icon={<Video className="w-4 h-4 text-blue-500" />}
                          label="Wunsch"
                          value="Zoom-Beratungsgespräch gewünscht"
                          accent="bg-blue-50"
                        />
                      )}
                    </div>
                  </section>

                  {/* Dachkonfiguration */}
                  <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Dachkonfiguration</h2>
                    <div className="space-y-3">
                      {lead.roof_area != null && (
                        <InfoRow
                          icon={<Home className="w-4 h-4 text-indigo-500" />}
                          label="Dachfläche"
                          value={`${lead.roof_area} m²`}
                          accent="bg-indigo-50"
                        />
                      )}
                      {lead.roof_orientation && (
                        <InfoRow
                          icon={<Compass className="w-4 h-4 text-amber-500" />}
                          label="Ausrichtung"
                          value={ORIENTATION_LABEL[lead.roof_orientation] ?? lead.roof_orientation}
                          accent="bg-amber-50"
                        />
                      )}
                      {lead.construction_year && (
                        <InfoRow
                          icon={<Calendar className="w-4 h-4 text-slate-400" />}
                          label="Baujahr"
                          value={CONSTRUCTION_LABEL[lead.construction_year] ?? lead.construction_year}
                        />
                      )}
                    </div>
                  </section>

                  {/* Energiebedarf */}
                  <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Energiebedarf & Ausstattung</h2>
                    <div className="space-y-3">
                      {lead.consumption != null && (
                        <InfoRow
                          icon={<Zap className="w-4 h-4 text-yellow-500" />}
                          label="Jahresverbrauch"
                          value={`${lead.consumption.toLocaleString('de-DE')} kWh/Jahr`}
                          accent="bg-yellow-50"
                        />
                      )}
                      {lead.electricity_price != null && (
                        <InfoRow
                          icon={<Euro className="w-4 h-4 text-slate-400" />}
                          label="Strompreis"
                          value={`${(lead.electricity_price * 100).toFixed(0)} Ct/kWh`}
                        />
                      )}
                      <div className="flex gap-2 flex-wrap pt-1">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${lead.has_battery ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-400 line-through'}`}>
                          <BatteryCharging className="w-3.5 h-3.5" />
                          Stromspeicher
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${lead.has_e_car ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-400 line-through'}`}>
                          <Car className="w-3.5 h-3.5" />
                          Elektroauto
                        </span>
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${lead.has_heat_pump ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-400 line-through'}`}>
                          <Thermometer className="w-3.5 h-3.5" />
                          Wärmepumpe
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Planung & Finanzierung */}
                  <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Planung & Finanzierung</h2>
                    <div className="space-y-3">
                      {lead.planning_horizon && (
                        <InfoRow
                          icon={<Clock className="w-4 h-4 text-amber-500" />}
                          label="Planungshorizont"
                          value={HORIZON_LABEL[lead.planning_horizon]}
                          accent="bg-amber-50"
                        />
                      )}
                      <InfoRow
                        icon={<CreditCard className={`w-4 h-4 ${lead.needs_financing ? 'text-blue-500' : 'text-slate-400'}`} />}
                        label="Finanzierung"
                        value={lead.needs_financing ? 'KfW-Finanzierung gewünscht' : 'Eigenkapital'}
                        accent={lead.needs_financing ? 'bg-blue-50' : 'bg-slate-50'}
                      />
                    </div>
                  </section>
                </div>

                {/* Rechte Spalte */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                  {/* Anlagenkennzahlen */}
                  <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Anlagenkonfiguration</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <StatCard
                        label="Anlagengröße"
                        value={lead.kwp != null ? `${lead.kwp} kWp` : '—'}
                        icon={<Zap className="w-3.5 h-3.5" />}
                        accent="text-yellow-500"
                      />
                      <StatCard
                        label="Investition"
                        value={lead.investment != null ? `${lead.investment.toLocaleString('de-DE')} €` : '—'}
                        icon={<Euro className="w-3.5 h-3.5" />}
                        accent="text-slate-400"
                      />
                      <StatCard
                        label="Ersparnis/Jahr"
                        value={lead.annual_savings != null ? `${lead.annual_savings.toLocaleString('de-DE')} €` : '—'}
                        icon={<TrendingUp className="w-3.5 h-3.5" />}
                        accent="text-green-500"
                      />
                      <StatCard
                        label="Amortisation"
                        value={lead.amortization != null ? `${lead.amortization} Jahre` : '—'}
                        icon={<Calendar className="w-3.5 h-3.5" />}
                        accent="text-indigo-400"
                      />
                      <StatCard
                        label="Autarkie"
                        value={lead.autarky != null ? `${lead.autarky} %` : '—'}
                        sub="Eigenverbrauchsanteil"
                        icon={<BatteryCharging className="w-3.5 h-3.5" />}
                        accent="text-teal-500"
                      />
                      <StatCard
                        label="Gewinn 20 J."
                        value={lead.profit_20_years != null ? `${lead.profit_20_years.toLocaleString('de-DE')} €` : '—'}
                        sub="nach Investitionsabzug"
                        icon={<BarChart2 className="w-3.5 h-3.5" />}
                        accent="text-emerald-500"
                      />
                    </div>
                  </section>

                  {/* Lead-Score */}
                  {scoreResult && (
                    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Lead-Score</h2>
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${scoreResult.bgColor} border ${scoreResult.color.replace('text-', 'border-').split(' ')[0]}`}>
                          {TierIcon && <TierIcon className={`w-6 h-6 mb-0.5 ${scoreResult.color}`} />}
                          <span className={`text-lg font-black ${scoreResult.color}`}>{scoreResult.score}</span>
                        </div>
                        <div>
                          <p className={`text-base font-black ${scoreResult.color}`}>{scoreResult.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5 max-w-xs">
                            Score aus kWp, Investition, PLZ-Einstrahlung, Eigentumsform, Speicher & Planungshorizont.
                          </p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                scoreResult.tier === 'heiss' ? 'bg-red-400' :
                                scoreResult.tier === 'warm'  ? 'bg-amber-400' : 'bg-blue-300'
                              }`}
                              style={{ width: `${scoreResult.score}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 text-right">{scoreResult.score}/100</p>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Schnellaktionen */}
                  <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Schnellaktionen</h2>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-2 bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <Mail className="w-4 h-4" />
                        E-Mail senden
                      </a>
                      {lead.phone && (
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-2 border border-slate-200 text-primary font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          Anrufen
                        </a>
                      )}
                      {lead.wants_zoom_call && (
                        <span className="flex items-center gap-2 border border-blue-200 bg-blue-50 text-blue-700 font-bold text-sm px-5 py-2.5 rounded-xl">
                          <Video className="w-4 h-4" />
                          Zoom-Call gewünscht
                        </span>
                      )}
                    </div>
                  </section>

                  {/* Preis & Rabatt */}
                  {lead.investment != null && (
                    <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-5">Preis & Rabatt</h2>

                      {/* Preisanzeige */}
                      <div className="flex items-center gap-4 mb-5">
                        {lead.discount_status !== 'none' && lead.final_price != null && lead.discount_percentage != null ? (
                          <>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Originalpreis</p>
                              <p className="text-lg font-black text-slate-300 line-through">{lead.investment.toLocaleString('de-DE')} €</p>
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                            <div>
                              <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Endpreis (−{lead.discount_percentage}%)</p>
                              <p className="text-2xl font-black text-green-700">{lead.final_price.toLocaleString('de-DE')} €</p>
                            </div>
                          </>
                        ) : (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standardpreis</p>
                            <p className="text-2xl font-black text-primary">{lead.investment.toLocaleString('de-DE')} €</p>
                          </div>
                        )}
                      </div>

                      {/* Status-Badges */}
                      {lead.discount_status === 'code_applied' && (
                        <div className="flex items-center gap-2 mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                          <Tag className="w-4 h-4 text-green-600 shrink-0" />
                          <span className="text-sm font-bold text-green-700 flex-1">Code „{lead.discount_code}" angewendet</span>
                          <button onClick={clearLeadDiscount} className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">Entfernen</button>
                        </div>
                      )}
                      {lead.discount_status === 'requested' && (
                        <div className="flex items-center gap-2 mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                          <span className="text-sm font-bold text-amber-700 flex-1">Anfrage läuft — wartet auf Inhaber-Freigabe</span>
                          <button onClick={clearLeadDiscount} className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium">Zurückziehen</button>
                        </div>
                      )}
                      {lead.discount_status === 'approved' && (
                        <div className="flex items-center gap-2 mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                          <span className="text-sm font-bold text-green-700">Rabatt genehmigt ✓</span>
                        </div>
                      )}
                      {lead.discount_status === 'rejected' && (
                        <div className="flex items-center gap-2 mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                          <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="text-sm font-bold text-red-600 flex-1">Anfrage abgelehnt</span>
                          <button onClick={clearLeadDiscount} className="text-xs text-slate-400 hover:text-primary transition-colors font-medium">Neu anfragen</button>
                        </div>
                      )}

                      {/* Aktionen — nur wenn kein laufender oder genehmigter Rabatt */}
                      {(lead.discount_status === 'none' || lead.discount_status === 'rejected') && (
                        <div className="space-y-3">
                          {discountCodes.length > 0 && (() => {
                            const previewCode = discountCodes.find(c => c.id === selectedCode) ?? null;
                            const previewFinal = previewCode && lead.investment != null
                              ? Math.round(lead.investment * (1 - previewCode.percentage / 100))
                              : null;
                            const previewSaving = previewFinal != null && lead.investment != null
                              ? lead.investment - previewFinal
                              : null;
                            return (
                              <div className="space-y-2">
                                <div className="flex gap-2">
                                  <div className="relative flex-1">
                                    <select
                                      value={selectedCode}
                                      onChange={(e) => { setSelectedCode(e.target.value); setCodeError(null); }}
                                      className="w-full appearance-none border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-primary font-medium focus:outline-none focus:ring-2 focus:ring-secondary/30 bg-white"
                                    >
                                      <option value="">Rabatt-Code wählen…</option>
                                      {discountCodes.map((c) => {
                                        const hints: string[] = [];
                                        if (c.min_investment != null) hints.push(`ab ${c.min_investment.toLocaleString('de-DE')} €`);
                                        if (c.max_uses != null) hints.push(`noch ${Math.max(0, c.max_uses - c.uses_count)}×`);
                                        if (c.valid_until) hints.push(`bis ${new Date(c.valid_until).toLocaleDateString('de-DE')}`);
                                        const suffix = hints.length ? ` (${hints.join(', ')})` : '';
                                        const lbl = c.label ? ` — ${c.label}` : '';
                                        return <option key={c.id} value={c.id}>{c.code}{lbl} · {c.percentage}%{suffix}</option>;
                                      })}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                  </div>
                                  <button
                                    onClick={handleApplyCode}
                                    disabled={!selectedCode || isApplyingCode}
                                    className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-primary font-bold text-sm px-4 py-2.5 rounded-xl disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap"
                                  >
                                    {isApplyingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
                                    Anwenden
                                  </button>
                                </div>

                                {/* Preis-Vorschau */}
                                {previewFinal != null && previewSaving != null && lead.investment != null && (
                                  <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                    <div>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ohne Rabatt</p>
                                      <p className="text-base font-bold text-slate-400 line-through">{lead.investment.toLocaleString('de-DE')} €</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
                                    <div>
                                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Mit Code (−{previewCode!.percentage}%)</p>
                                      <p className="text-xl font-black text-green-700">{previewFinal.toLocaleString('de-DE')} €</p>
                                    </div>
                                    <div className="ml-auto text-right shrink-0">
                                      <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Ersparnis</p>
                                      <p className="text-sm font-bold text-green-600">−{previewSaving.toLocaleString('de-DE')} €</p>
                                    </div>
                                  </div>
                                )}

                                {/* Regel-Fehler bei Anwenden */}
                                {codeError && (
                                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {codeError}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {!showRequestForm ? (
                            <button
                              onClick={() => setShowRequestForm(true)}
                              className="flex items-center gap-2 border border-dashed border-slate-300 text-slate-500 hover:border-amber-400 hover:text-amber-600 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors w-full justify-center"
                            >
                              <Percent className="w-4 h-4" />
                              Höheren Rabatt beim Inhaber anfragen
                            </button>
                          ) : (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
                              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Rabatt-Anfrage</p>
                              <div className="flex gap-3">
                                <div className="relative w-28 shrink-0">
                                  <input
                                    type="number"
                                    value={requestPercentage}
                                    onChange={(e) => setRequestPercentage(e.target.value)}
                                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 pr-8 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-amber-300/50 bg-white"
                                    placeholder="0"
                                    min="1"
                                    max="50"
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">%</span>
                                </div>
                                <input
                                  type="text"
                                  value={requestNote}
                                  onChange={(e) => setRequestNote(e.target.value)}
                                  className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 bg-white"
                                  placeholder="Begründung (optional)"
                                />
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleRequestDiscount}
                                  disabled={!requestPercentage || isRequesting}
                                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
                                >
                                  {isRequesting && <Loader2 className="w-4 h-4 animate-spin" />}
                                  {isRequesting ? 'Wird gesendet…' : 'Anfrage senden'}
                                </button>
                                <button
                                  onClick={() => { setShowRequestForm(false); setRequestPercentage(''); setRequestNote(''); }}
                                  className="border border-slate-200 text-slate-500 font-bold text-sm px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors"
                                >
                                  Abbrechen
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </section>
                  )}

                  {/* Angebots-Management */}
                  {leadAsProject && (() => {
                    const cfg = OFFER_CONFIG[lead.offer_status];
                    const OfferIcon = cfg.icon;
                    return (
                      <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Angebots-Management</h2>

                        {/* Status-Badge */}
                        <div className={`inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full border mb-5 ${cfg.classes}`}>
                          <OfferIcon className="w-3.5 h-3.5" />
                          {cfg.label}
                          {lead.offer_sent_at && (
                            <span className="font-normal opacity-70">· {formatDate(lead.offer_sent_at)}</span>
                          )}
                        </div>

                        {/* Aktionen je nach Status */}
                        <div className="flex flex-wrap gap-2">
                          {/* Angebot PDF immer verfügbar */}
                          <PDFDownloadLink
                            document={<AngebotPdfDocument project={leadAsProject} installerName="Muster Solar GmbH" />}
                            fileName={`Angebot_${lead.first_name}_${lead.last_name}.pdf`}
                          >
                            {({ loading }) => (
                              <button
                                type="button"
                                className="flex items-center gap-2 bg-slate-50 border border-slate-200 text-primary font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                              >
                                <FileText className="w-4 h-4" />
                                {loading ? 'Generiere…' : 'Angebot als PDF'}
                              </button>
                            )}
                          </PDFDownloadLink>

                          {/* Angebot senden (nur wenn noch nicht versendet) */}
                          {lead.offer_status === 'created' && (
                            <button
                              onClick={() => { setSendEmail(lead.email); setShowSendModal(true); }}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                            >
                              <Send className="w-4 h-4" />
                              Angebot senden
                            </button>
                          )}

                          {/* Als angesehen markieren (wenn versendet) */}
                          {lead.offer_status === 'sent' && (
                            <button
                              onClick={() => changeOfferStatus('viewed', { offer_viewed_at: new Date().toISOString() })}
                              className="flex items-center gap-2 border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              Als angesehen markieren
                            </button>
                          )}

                          {/* Angenommen markieren (wenn versendet oder angesehen) */}
                          {(lead.offer_status === 'sent' || lead.offer_status === 'viewed') && (
                            <button
                              onClick={async () => {
                                await changeOfferStatus('accepted');
                                if (lead.status !== 'gewonnen') await changeStatus('gewonnen');
                              }}
                              className="flex items-center gap-2 border border-green-200 bg-green-50 hover:bg-green-100 text-green-700 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Angenommen
                            </button>
                          )}

                          {/* Erneut senden (wenn abgelehnt) */}
                          {lead.offer_status === 'rejected' && (
                            <button
                              onClick={() => changeOfferStatus('created')}
                              className="flex items-center gap-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm px-4 py-2.5 rounded-xl transition-colors"
                            >
                              <Send className="w-4 h-4" />
                              Neues Angebot erstellen
                            </button>
                          )}
                        </div>

                        {/* Rechnungs-Generator (nur wenn angenommen) */}
                        {lead.offer_status === 'accepted' && (
                          <div className="mt-5 pt-5 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                              <Receipt className="w-3.5 h-3.5" />
                              Abschlagsrechnungen generieren
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {([1, 2, 3] as const).map((type) => (
                                <PDFDownloadLink
                                  key={type}
                                  document={<RechnungPdfDocument project={leadAsProject} rechnungType={type} />}
                                  fileName={`Rechnung_${type}_${lead.first_name}_${lead.last_name}.pdf`}
                                >
                                  {({ loading }) => (
                                    <button
                                      type="button"
                                      className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 text-primary font-bold text-xs px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                                    >
                                      <Receipt className="w-3.5 h-3.5" />
                                      {loading ? '…' : type === 3 ? 'Schlussrechnung (10%)' : `Rechnung ${type}/${type === 1 ? '30' : '60'}%`}
                                    </button>
                                  )}
                                </PDFDownloadLink>
                              ))}
                            </div>
                          </div>
                        )}
                      </section>
                    );
                  })()}

                  {/* Interne Notizen */}
                  <NoteBox leadId={lead.id} />
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
