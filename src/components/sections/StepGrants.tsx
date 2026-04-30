import React from 'react';
import {
  NATIONAL_GRANTS,
  getRegionalGrants,
  getStateLabel,
  type Grant,
} from '../../data/grants';

interface StepGrantsProps {
  zip: string;
  onNext: () => void;
  onPrev: () => void;
}

const GrantCard: React.FC<{ grant: Grant }> = ({ grant }) => (
  <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-ambient flex flex-col gap-4 relative overflow-hidden hover:border-primary transition-colors">
    <div
      className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-semibold flex items-center gap-1 ${
        grant.type === 'national'
          ? 'bg-primary text-white'
          : 'bg-surface-container-high text-on-surface-variant'
      }`}
    >
      <span className="material-symbols-outlined text-[14px]">
        {grant.type === 'national' ? 'public' : 'location_on'}
      </span>
      {grant.type === 'national' ? 'National' : 'Regional'}
    </div>

    <div className="bg-primary/5 w-12 h-12 rounded-lg flex items-center justify-center text-primary">
      <span className="material-symbols-outlined">{grant.icon}</span>
    </div>

    <div>
      <h4 className="font-bold text-lg text-primary mb-1">{grant.title}</h4>
      <p className="font-body-md text-body-md text-on-surface-variant text-sm">{grant.description}</p>
    </div>

    <div className="mt-auto pt-4 border-t border-surface-variant flex items-center justify-between">
      <div className="flex items-center text-secondary-container font-semibold text-sm gap-1">
        <span className="material-symbols-outlined text-[18px] fill">check_circle</span>
        Berücksichtigt
      </div>
      <span className="text-xs font-semibold text-primary bg-primary/8 px-2 py-1 rounded-full">
        {grant.highlight}
      </span>
    </div>
  </div>
);

export const StepGrants: React.FC<StepGrantsProps> = ({ zip, onNext, onPrev }) => {
  const regionalGrants = getRegionalGrants(zip);
  const stateLabel = getStateLabel(zip);
  const totalGrants = NATIONAL_GRANTS.length + regionalGrants.length;

  return (
    <div className="flex-1 flex flex-col gap-stack-lg w-full max-w-3xl">
      {/* Progress */}
      <div className="flex flex-col gap-stack-sm">
        <div className="flex justify-between items-center">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Schritt 3 von 4</span>
          <span className="font-label-md text-label-md text-primary font-bold">Förderungen</span>
        </div>
        <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden">
          <div className="h-full bg-secondary-container w-[75%] rounded-full transition-all duration-500 ease-out" />
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-stack-sm">
        <h1 className="font-headline-xl text-headline-xl text-primary">Fördermittel für dein Projekt</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Wir haben <strong>{totalGrants} Förderprogramme</strong> für deinen Standort
          {zip ? <> (<strong>{zip} — {stateLabel}</strong>)</> : ''} ermittelt.
          Diese werden automatisch in deiner Wirtschaftlichkeitsberechnung berücksichtigt.
        </p>
      </div>

      {/* Highlight: 0% MwSt */}
      <div className="bg-secondary-container/10 border-2 border-secondary-container rounded-xl p-card-padding flex flex-col md:flex-row items-start md:items-center gap-stack-md shadow-ambient">
        <div className="bg-secondary-container text-on-secondary-container p-4 rounded-full flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-3xl fill">percent</span>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="font-headline-md text-headline-md text-primary">0 % MwSt. — Sofort wirksam</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            <strong>Spare ~19 % auf den Kaufpreis deiner Anlage.</strong> Seit dem 01.01.2023
            entfällt die Umsatzsteuer bundesweit auf PV-Anlagen und Speicher auf Wohngebäuden —
            automatisch in unserem Angebotspreis einkalkuliert.
          </p>
        </div>
      </div>

      {/* Regional grants */}
      {regionalGrants.length > 0 && (
        <div className="flex flex-col gap-stack-md">
          <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-container">location_on</span>
            Regionale Förderungen — {stateLabel}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {regionalGrants.map((grant) => (
              <GrantCard key={grant.id} grant={grant} />
            ))}
          </div>
        </div>
      )}

      {/* National grants (without 0% MwSt — already highlighted above) */}
      <div className="flex flex-col gap-stack-md">
        <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary-container">public</span>
          Bundesweite Förderungen
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {NATIONAL_GRANTS.filter((g) => g.id !== 'mwst').map((grant) => (
            <GrantCard key={grant.id} grant={grant} />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-stack-md pt-stack-md border-t border-surface-variant">
        <button
          className="flex items-center gap-2 text-primary font-label-md text-label-md px-6 py-3 border border-primary rounded-lg hover:bg-surface-container-low transition-colors"
          onClick={onPrev}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Zurück
        </button>
        <button
          className="flex items-center gap-2 bg-secondary-container text-on-secondary-container font-label-md text-label-md px-8 py-3 rounded-lg hover:brightness-110 shadow-ambient transition-all active:scale-95"
          onClick={onNext}
        >
          Weiter zur Zusammenfassung
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
