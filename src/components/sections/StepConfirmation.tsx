import React from 'react';
import { Link } from 'react-router-dom';
import type { ConfigData } from '../../hooks/useConfigurator';

const ORIENTATION_LABEL: Record<string, string> = {
  sued: 'Südausrichtung',
  ostwest: 'Ost/West-Ausrichtung',
  nord: 'Nordausrichtung',
};

const HORIZON_LABEL: Record<string, string> = {
  sofort:   'So bald wie möglich',
  '3monate': 'In ca. 3 Monaten',
  '12monate': 'In ca. 12 Monaten',
};

interface TimelineStep {
  icon: string;
  label: string;
  sub: string;
  time: string;
  state: 'done' | 'active' | 'pending';
}

const STEPS: TimelineStep[] = [
  {
    icon: 'check_circle',
    label: 'Anfrage eingegangen',
    sub: 'Deine Konfiguration wurde erfolgreich übermittelt. Du erhältst in Kürze eine Bestätigungs-E-Mail.',
    time: 'Jetzt',
    state: 'done',
  },
  {
    icon: 'call',
    label: 'Erstgespräch & Dach-Check',
    sub: 'Ein zertifizierter Fachbetrieb meldet sich innerhalb von 24–48 Stunden, um einen Vor-Ort-Termin zu vereinbaren.',
    time: '24–48 Stunden',
    state: 'active',
  },
  {
    icon: 'description',
    label: 'Persönliches Angebot',
    sub: 'Nach dem Dach-Check erhältst du ein verbindliches, individuelles Angebot inkl. Finanzierungsoptionen.',
    time: '3–5 Werktage',
    state: 'pending',
  },
  {
    icon: 'solar_power',
    label: 'Montage & Inbetriebnahme',
    sub: 'Installation durch zertifizierte Monteure inkl. Netzanmeldung, Zählerprüfung und vollständiger Abnahme.',
    time: 'Nach Vereinbarung',
    state: 'pending',
  },
];

interface StepConfirmationProps {
  data: ConfigData;
}

export const StepConfirmation: React.FC<StepConfirmationProps> = ({ data }) => {
  const horizonLabel = data.planningHorizon ? HORIZON_LABEL[data.planningHorizon] : null;

  return (
    <div className="flex-grow w-full max-w-[1200px] mx-auto pb-24 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-8">

        {/* Erfolgs-Header */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-ambient border border-outline-variant p-8 md:p-10 relative overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-secondary-container rounded-t-3xl" />

          <div className="relative w-24 h-24 mb-6">
            <div className="absolute inset-0 rounded-full bg-secondary-fixed/20 animate-ping opacity-30" />
            <div className="relative w-24 h-24 rounded-full bg-secondary-fixed/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-secondary-container fill">check_circle</span>
            </div>
          </div>

          <h1 className="font-headline-xl text-headline-xl text-primary-container mb-3">
            Anfrage erfolgreich eingegangen!
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
            Unser Netzwerk aus zertifizierten Fachbetrieben wurde benachrichtigt. Du wirst in
            <strong className="text-primary-container"> 24–48 Stunden</strong> kontaktiert.
          </p>

          {horizonLabel && (
            <div className="mt-4 inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-sm font-semibold text-amber-800">
              <span className="material-symbols-outlined text-[16px] text-amber-600 fill">schedule</span>
              Geplanter Umsetzungszeitraum: {horizonLabel}
            </div>
          )}
        </div>

        {/* Timeline */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-ambient border border-outline-variant p-8 md:p-10">
          <h2 className="font-label-md text-label-md text-outline uppercase tracking-widest mb-8">
            Dein Weg zur Solaranlage
          </h2>

          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => (
              <div key={step.label} className="flex gap-5 relative">
                {/* Connector-Linie */}
                {i < STEPS.length - 1 && (
                  <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                    step.state === 'done' ? 'bg-secondary-container' : 'bg-surface-variant'
                  }`} />
                )}

                {/* Icon-Kreis */}
                <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  step.state === 'done'
                    ? 'bg-secondary-container border-secondary-container'
                    : step.state === 'active'
                    ? 'bg-white border-secondary-container shadow-[0_0_0_4px_rgba(245,158,11,0.15)]'
                    : 'bg-surface-container border-surface-variant'
                }`}>
                  <span className={`material-symbols-outlined text-[18px] ${
                    step.state === 'done'
                      ? 'text-white fill'
                      : step.state === 'active'
                      ? 'text-secondary-container fill'
                      : 'text-outline'
                  }`}>
                    {step.state === 'done' ? 'check' : step.icon}
                  </span>
                </div>

                {/* Inhalt */}
                <div className={`flex-1 pb-8 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <p className={`font-label-md text-label-md ${
                      step.state === 'pending' ? 'text-outline' : 'text-primary-container'
                    }`}>
                      {step.label}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      step.state === 'done'
                        ? 'bg-green-100 text-green-700'
                        : step.state === 'active'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-surface-container text-outline'
                    }`}>
                      {step.state === 'done' ? 'Erledigt' : step.time}
                    </span>
                    {step.state === 'active' && (
                      <span className="flex items-center gap-1 text-xs font-bold text-secondary-container">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
                        Als nächstes
                      </span>
                    )}
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed">
                    {step.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Konfigurationsübersicht */}
        <div className="bg-surface-container rounded-2xl p-6 border border-surface-variant">
          <h2 className="font-label-md text-label-md text-outline uppercase tracking-widest mb-5">
            Deine Konfiguration
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: 'roofing',              text: `${data.roofType} · ${ORIENTATION_LABEL[data.orientation] ?? data.orientation}` },
              { icon: 'bolt',                  text: `ca. ${data.consumption.toLocaleString('de-DE')} kWh/Jahr` },
              { icon: 'location_on',           text: `PLZ ${data.zip}` },
              { icon: 'battery_charging_full', text: `Speicher: ${data.battery ? 'Ja' : 'Nein'}` },
            ].map(({ icon, text }) => (
              <div key={icon} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-surface-container-lowest border border-surface-variant flex items-center justify-center text-primary-container shrink-0">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </div>
                <span className="font-label-md text-label-md text-primary-container text-xs">{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary-container text-on-primary-container hover:opacity-90 transition-all font-label-md text-label-md shadow-ambient"
          >
            <span className="material-symbols-outlined">dashboard</span>
            Zum Kunden-Dashboard
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-surface-variant text-on-surface-variant hover:bg-surface-container transition-colors font-label-md text-label-md"
          >
            Zurück zur Startseite
          </Link>
        </div>

      </div>
    </div>
  );
};
