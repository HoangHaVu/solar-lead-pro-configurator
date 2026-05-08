import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sun, ArrowRight, CheckCircle, LayoutDashboard, LayoutGrid,
  FileText, BarChart3, Zap, Users, ChevronDown, ChevronUp,
  Star, Trophy, Clock, Shield,
} from 'lucide-react';

/* ─── Nav ──────────────────────────────────────────────────── */
const Nav: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
    <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2 font-black text-primary text-lg">
        <Sun className="w-6 h-6 text-secondary" />
        SolarKonfigurator
        <span className="ml-2 text-[10px] font-bold bg-secondary/20 text-secondary px-2 py-0.5 rounded-full uppercase tracking-widest">
          für Installateure
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/demo"
          className="bg-secondary text-primary font-bold text-sm px-5 py-2 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          Konfigurator testen
        </Link>
      </div>
    </div>
  </header>
);

/* ─── Pricing ───────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Starter',
    monthlyPrice: 149,
    users: 3,
    description: 'Perfekt für den Einstieg',
    highlight: false,
    features: [
      'Bis zu 20 Leads/Monat',
      'Lead-Pipeline Kanban',
      'Lead-Detailansicht',
      'E-Mail-Benachrichtigungen',
      'DSGVO-konform',
    ],
    cta: 'Starter wählen',
  },
  {
    name: 'Pro',
    monthlyPrice: 299,
    users: 10,
    description: 'Für wachsende Betriebe',
    highlight: true,
    features: [
      'Unbegrenzte Leads',
      'Alles aus Starter',
      'Projektverwaltung Kanban',
      'PDF-Angebotserstellung',
      'Interne Notizen & Dokumente',
      'Kalenderansicht',
    ],
    cta: 'Pro wählen',
  },
  {
    name: 'Enterprise',
    monthlyPrice: 599,
    users: 25,
    description: 'Für größere Installationsbetriebe',
    highlight: false,
    features: [
      'Alles aus Pro',
      'Statistik-Dashboard',
      'Teamverwaltung',
      'Prioritäts-Support',
      'Onboarding-Call',
    ],
    cta: 'Enterprise wählen',
  },
];

/* ─── Features ──────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <LayoutDashboard className="w-6 h-6 text-secondary" />,
    title: 'Lead-Pipeline',
    description: 'Alle Leads im Kanban-Board von Neu bis Abschluss. Drag & Drop, Filter nach PLZ, Anlagengröße und Datum.',
  },
  {
    icon: <LayoutGrid className="w-6 h-6 text-secondary" />,
    title: 'Projektverwaltung',
    description: 'Laufende Projekte als Kanban: Planung → Genehmigung → Installation → Abgeschlossen.',
  },
  {
    icon: <FileText className="w-6 h-6 text-secondary" />,
    title: 'PDF-Angebote',
    description: 'Mit einem Klick professionelle Angebots-PDFs mit ROI-Berechnung, kWp und Amortisationszeit.',
  },
  {
    icon: <Zap className="w-6 h-6 text-secondary" />,
    title: 'Lead-Scoring',
    description: 'Automatischer Score (0–100) basierend auf Dachfläche, PLZ-Einstrahlung, Investitionsvolumen und Kaufbereitschaft.',
  },
  {
    icon: <BarChart3 className="w-6 h-6 text-secondary" />,
    title: 'Statistiken',
    description: 'Conversion-Rates, Umsatzpotenzial und regionale Auswertungen auf einen Blick.',
  },
  {
    icon: <Users className="w-6 h-6 text-secondary" />,
    title: 'Konfigurator für Kunden',
    description: 'Deine Kunden konfigurieren ihre Anlage selbst — du erhältst den Lead automatisch mit allen Daten.',
  },
];

/* ─── FAQ ───────────────────────────────────────────────────── */
const FAQS = [
  {
    q: 'Wie kommen Leads zu mir?',
    a: 'Deine Kunden nutzen den eingebetteten Konfigurator (auf deiner Website oder über unsere Plattform). Nach der Konfiguration landen ihre Daten automatisch in deiner Pipeline — inklusive Dachfläche, PLZ, kWp-Schätzung und Investitionssumme.',
  },
  {
    q: 'Kann ich das kostenlos testen?',
    a: 'Ja. Alle Pläne sind in den ersten 30 Tagen kostenlos und ohne Kreditkarte testbar. Kein verstecktes Abo.',
  },
  {
    q: 'Ist die Software DSGVO-konform?',
    a: 'Ja. Alle Daten werden auf EU-Servern gespeichert (Supabase Frankfurt). Wir geben keine Daten an Dritte weiter.',
  },
  {
    q: 'Kann ich jederzeit kündigen?',
    a: 'Ja, monatlich kündbar ohne Mindestlaufzeit. Deine Daten werden nach Kündigung 30 Tage aufbewahrt.',
  },
  {
    q: 'Was passiert wenn ich mehr als 20 Leads/Monat habe?',
    a: 'Im Starter-Plan werden neue Leads ab Limit 21 pausiert und du erhältst eine Upgrade-Benachrichtigung. Kein Datenverlust.',
  },
];

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 py-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between text-left gap-4"
      >
        <span className="font-bold text-primary text-sm">{q}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
      </button>
      {open && <p className="mt-3 text-sm text-slate-500 leading-relaxed">{a}</p>}
    </div>
  );
};

/* ─── Page ──────────────────────────────────────────────────── */
export const InstallerLandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans">
      <Nav />

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="pt-32 pb-24 px-6 bg-gradient-to-br from-primary via-primary to-slate-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, #F59E0B 0%, transparent 50%)' }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-secondary mb-6">
            <Star className="w-3.5 h-3.5" />
            Beta — Jetzt kostenlos einsteigen
          </div>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 tracking-tight">
            Mehr Aufträge.<br />
            <span className="text-secondary">Weniger Chaos.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Das CRM für Solarinstallateure — von der Lead-Pipeline bis zur Projektabnahme.
            Kunden konfigurieren ihre Anlage selbst, du bekommst vollständige Datensätze.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/beta')}
              className="flex items-center gap-2 bg-secondary text-primary font-black text-base px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
            >
              Kostenlos 30 Tage testen
              <ArrowRight className="w-5 h-5" />
            </button>
            <Link
              to="/demo"
              className="flex items-center gap-2 border border-white/30 text-white font-bold text-base px-8 py-4 rounded-2xl hover:bg-white/10 transition-colors"
            >
              Konfigurator Demo
            </Link>
          </div>
          <p className="text-white/40 text-xs mt-5">Keine Kreditkarte · Kein Risiko · Jederzeit kündbar</p>
        </div>
      </section>

      {/* ── Social Proof Bar ────────────────────────────────── */}
      <section className="bg-slate-50 border-y border-slate-200 py-8 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: '3+', label: 'Beta-Installateure' },
            { value: '< 5 Min', label: 'Setup-Zeit' },
            { value: '100%', label: 'DSGVO-konform' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-black text-primary">{stat.value}</p>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-primary text-center mb-4">
            Kennst du das?
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto">
            Viele Installateure verlieren täglich wertvolle Leads durch unstrukturierte Prozesse.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📋', title: 'Leads in Excel verwalten', text: 'Keine Übersicht wer wann kontaktiert wurde. Leads gehen unter.' },
              { icon: '⏰', title: 'Angebote dauern Stunden', text: 'Manuelles Rechnen, PDFs basteln — statt mit Kunden zu sprechen.' },
              { icon: '📁', title: 'Projekte ohne System', text: 'Welche Anlage ist in welcher Phase? WhatsApp-Chaos statt klarer Prozesse.' },
            ].map(p => (
              <div key={p.title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="font-bold text-primary mb-2 text-sm">{p.title}</h3>
                <p className="text-sm text-slate-500">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-primary mb-3">Alles was du brauchst</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Kein aufgeblähtes ERP. Nur die Features die Installateure wirklich nutzen.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="font-bold text-primary mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-primary text-center mb-14">So einfach geht's</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector-Linien zwischen den Schritten (nur md+) */}
            <div className="hidden md:block absolute top-7 h-0.5 bg-slate-200"
              style={{ left: 'calc(16.67% + 1.75rem)', width: 'calc(33.33% - 3.5rem)' }} />
            <div className="hidden md:block absolute top-7 h-0.5 bg-slate-200"
              style={{ left: 'calc(50% + 1.75rem)', width: 'calc(33.33% - 3.5rem)' }} />
            {[
              { step: '1', icon: <Users className="w-6 h-6 text-secondary" />, title: 'Kunde konfiguriert', text: 'Dein Kunde gibt PLZ, Dachfläche, Verbrauch und Wünsche ein. Dauert 5 Minuten.' },
              { step: '2', icon: <Trophy className="w-6 h-6 text-secondary" />, title: 'Lead landet bei dir', text: 'Vollständiger Datensatz: kWp, Investition, Score, Kontaktdaten — direkt in deiner Pipeline.' },
              { step: '3', icon: <Clock className="w-6 h-6 text-secondary" />, title: 'Auftrag abwickeln', text: 'Von Planung bis Inbetriebnahme — alle Projektphasen im Kanban-Board.' },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-secondary font-black text-xl mb-4 shadow-sm">
                  {s.step}
                </div>
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-3">
                  {s.icon}
                </div>
                <h3 className="font-bold text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-slate-50" id="preise">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-primary mb-3">Transparente Preise</h2>
            <p className="text-slate-500">30 Tage kostenlos testen — danach monatlich kündbar.</p>
          </div>

          {/* Monatlich / Jährlich Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-bold transition-colors ${!isYearly ? 'text-primary' : 'text-slate-400'}`}>
              Monatlich
            </span>
            <button
              onClick={() => setIsYearly(v => !v)}
              className={`relative w-12 h-6 rounded-full overflow-hidden transition-colors duration-200 ${isYearly ? 'bg-secondary' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isYearly ? 'translate-x-[26px]' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold flex items-center gap-2 transition-colors ${isYearly ? 'text-primary' : 'text-slate-400'}`}>
              Jährlich
              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                5% Rabatt
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => {
              const displayPrice = isYearly ? Math.round(plan.monthlyPrice * 0.95) : plan.monthlyPrice;
              return (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 flex flex-col border-2 transition-shadow ${
                  plan.highlight
                    ? 'bg-primary border-primary text-white shadow-xl scale-[1.02]'
                    : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                }`}
              >
                {plan.highlight && (
                  <div className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-3">
                    ⭐ Empfohlen
                  </div>
                )}
                <h3 className={`text-xl font-black mb-1 ${plan.highlight ? 'text-white' : 'text-primary'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs mb-4 ${plan.highlight ? 'text-white/60' : 'text-slate-400'}`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-4xl font-black ${plan.highlight ? 'text-secondary' : 'text-primary'}`}>
                    {displayPrice} €
                  </span>
                  <span className={`text-sm ${plan.highlight ? 'text-white/60' : 'text-slate-400'}`}>/Monat</span>
                </div>
                {isYearly && (
                  <p className={`text-xs mb-3 ${plan.highlight ? 'text-white/50' : 'text-slate-400'}`}>
                    {displayPrice * 12} € / Jahr abgerechnet
                  </p>
                )}
                <p className={`text-sm font-bold mb-5 ${isYearly ? 'mt-0' : 'mt-3'} ${plan.highlight ? 'text-secondary' : 'text-primary'}`}>
                  inkl. {plan.users} Nutzer
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${plan.highlight ? 'text-secondary' : 'text-green-500'}`} />
                      <span className={plan.highlight ? 'text-white/80' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/beta')}
                  className={`w-full font-bold py-3 rounded-xl transition-opacity hover:opacity-90 ${
                    plan.highlight
                      ? 'bg-secondary text-primary'
                      : 'bg-primary text-white'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            Alle Preise zzgl. MwSt. · Keine versteckten Kosten · Jederzeit kündbar
          </p>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-black text-primary text-center mb-12">Häufige Fragen</h2>
          {FAQS.map(faq => <FaqItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="py-20 px-6 bg-primary text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-secondary" />
            <span className="text-sm font-bold text-white/60 uppercase tracking-widest">DSGVO-konform · EU-Server</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Bereit für mehr Aufträge?
          </h2>
          <p className="text-white/60 mb-8">
            30 Tage kostenlos. Keine Kreditkarte. Jederzeit kündbar.
          </p>
          <button
            onClick={() => navigate('/beta')}
            className="flex items-center gap-2 bg-secondary text-primary font-black text-base px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg mx-auto"
          >
            Jetzt kostenlos starten
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-2 font-bold text-primary">
            <Sun className="w-4 h-4 text-secondary" />
            SolarKonfigurator
          </div>
          <p>© 2026 SolarKonfigurator. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6">
            <Link to="/datenschutz" className="hover:text-primary transition-colors">Datenschutz</Link>
            <Link to="/impressum" className="hover:text-primary transition-colors">Impressum</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Anmelden</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
