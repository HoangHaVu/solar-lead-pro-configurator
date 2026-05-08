import React from 'react';
import type { BuildingType, OwnershipType } from '../../hooks/useConfigurator';

interface StepBuildingTypeProps {
  data: {
    buildingType: BuildingType;
    ownershipType: OwnershipType;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const BUILDING_TYPES: { value: BuildingType; icon: string; label: string; sub: string }[] = [
  { value: 'einfamilienhaus',  icon: 'home',          label: 'Einfamilienhaus',  sub: 'Typisches Wohnhaus'         },
  { value: 'zweifamilienhaus', icon: 'holiday_village',label: 'Zweifamilienhaus', sub: 'Zwei Wohneinheiten'         },
  { value: 'mehrfamilienhaus', icon: 'apartment',      label: 'Mehrfamilienhaus', sub: 'Ab 3 Wohneinheiten'         },
  { value: 'firmengebaeude',   icon: 'business',       label: 'Firmengebäude',    sub: 'Gewerbe & Industrie'        },
  { value: 'sonstiges',        icon: 'category',       label: 'Sonstiges',        sub: 'Landwirtschaft, öffentlich…'},
];

export const StepBuildingType: React.FC<StepBuildingTypeProps> = ({ data, onUpdate, onNext }) => {
  const isMieter = data.ownershipType === 'mieter';

  return (
    <div className="lg:col-span-8 flex flex-col gap-stack-lg">
      <div>
        <p className="font-label-md text-secondary-container mb-2">SCHRITT 1 VON 5</p>
        <h1 className="font-headline-xl text-primary-container mb-4">Um was für ein Gebäude geht es?</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">
          Der Gebäudetyp beeinflusst Förderprogramme, Eigenverbrauchsrate und die optimale Anlagengröße.
        </p>
      </div>

      {/* Gebäudetyp-Auswahl */}
      <div className="flex flex-col gap-stack-sm">
        <h2 className="font-headline-md text-primary-container">Gebäudetyp</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {BUILDING_TYPES.map(({ value, icon, label, sub }) => (
            <label key={value} className="relative cursor-pointer group">
              <input
                className="peer sr-only"
                name="buildingType"
                type="radio"
                value={value}
                checked={data.buildingType === value}
                onChange={() => onUpdate({ buildingType: value })}
              />
              <div className="h-full bg-surface-container-lowest border-2 border-surface-variant rounded-xl p-card-padding flex flex-col items-center text-center transition-all duration-200 peer-checked:border-secondary-container peer-checked:bg-secondary-fixed/10 group-hover:border-secondary-container/50 group-hover:shadow-[0px_4px_20px_rgba(13,33,55,0.05)]">
                <span className="material-symbols-outlined text-4xl text-primary-container mb-4 fill">{icon}</span>
                <span className="font-headline-md text-primary-container">{label}</span>
                <span className="font-caption text-outline mt-2">{sub}</span>
              </div>
              <div className="absolute top-4 right-4 text-secondary-container opacity-0 peer-checked:opacity-100 transition-opacity">
                <span className="material-symbols-outlined fill">check_circle</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-surface-variant" />

      {/* Eigentumsform */}
      <div className="flex flex-col gap-stack-sm">
        <h2 className="font-headline-md text-primary-container">Eigentumsform</h2>
        <p className="font-body-md text-outline">Bist du Eigentümer oder Mieter des Gebäudes?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {([
            { value: 'eigentuemer', icon: 'vpn_key', label: 'Eigentümer', sub: 'Ich besitze das Gebäude' },
            { value: 'mieter',      icon: 'person',  label: 'Mieter',     sub: 'Ich miete das Gebäude' },
          ] as { value: OwnershipType; icon: string; label: string; sub: string }[]).map(({ value, icon, label, sub }) => (
            <label key={value} className="relative cursor-pointer group">
              <input
                className="peer sr-only"
                name="ownershipType"
                type="radio"
                value={value}
                checked={data.ownershipType === value}
                onChange={() => onUpdate({ ownershipType: value })}
              />
              <div className="h-full bg-surface-container-lowest border-2 border-surface-variant rounded-xl p-card-padding flex flex-col items-center text-center transition-all duration-200 peer-checked:border-secondary-container peer-checked:bg-secondary-fixed/10 group-hover:border-secondary-container/50 group-hover:shadow-[0px_4px_20px_rgba(13,33,55,0.05)]">
                <span className="material-symbols-outlined text-4xl text-primary-container mb-4 fill">{icon}</span>
                <span className="font-headline-md text-primary-container">{label}</span>
                <span className="font-caption text-outline mt-2">{sub}</span>
              </div>
              <div className="absolute top-4 right-4 text-secondary-container opacity-0 peer-checked:opacity-100 transition-opacity">
                <span className="material-symbols-outlined fill">check_circle</span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Mieter-Hinweis */}
      {isMieter && (
        <div className="bg-secondary-fixed/10 border border-secondary-container/40 rounded-xl p-5 flex items-start gap-4">
          <span className="material-symbols-outlined text-secondary-container text-2xl mt-0.5 shrink-0">info</span>
          <div>
            <p className="font-label-md text-label-md text-primary-container mb-1">Hinweis für Mieter</p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Als Mieter benötigst du die Zustimmung deines Vermieters. Wir können dir trotzdem eine
              unverbindliche Analyse erstellen — viele Vermieter sind offen, wenn die Zahlen stimmen.
            </p>
          </div>
        </div>
      )}

      {/* Firmengebäude-Hinweis */}
      {data.buildingType === 'firmengebaeude' && (
        <div className="bg-primary-fixed/10 border border-primary-container/20 rounded-xl p-5 flex items-start gap-4">
          <span className="material-symbols-outlined text-primary-container text-2xl mt-0.5 shrink-0">info</span>
          <div>
            <p className="font-label-md text-label-md text-primary-container mb-1">Gewerbe-Vorteil</p>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Firmengebäude nutzen Solarstrom tagsüber direkt — das erhöht den Eigenverbrauchsanteil
              auf bis zu 60 % (ohne Speicher). Zusätzlich sind Abschreibungen steuerlich absetzbar.
            </p>
          </div>
        </div>
      )}

      {/* Weiter-Button */}
      <div className="flex items-center justify-end mt-8 pt-8 border-t border-surface-variant">
        <button
          className="w-full sm:w-auto bg-secondary-container text-primary-container px-8 py-4 sm:py-3 rounded-lg font-label-md font-bold hover:bg-secondary-fixed transition-colors flex items-center justify-center gap-2 shadow-[0px_4px_20px_rgba(13,33,55,0.05)]"
          onClick={onNext}
        >
          Weiter
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
