import React from 'react';
import type { ROICalculations } from '../../hooks/useConfigurator';
import { getScoreResult } from '../../utils/leadScore';

const BUILDING_LABEL: Record<string, string> = {
  einfamilienhaus:  'Einfamilienhaus',
  zweifamilienhaus: 'Zweifamilienhaus',
  mehrfamilienhaus: 'Mehrfamilienhaus',
  firmengebaeude:   'Firmengebäude',
  sonstiges:        'Sonstiges',
};

interface ConfiguratorSidebarProps {
  currentStep: number;
  data: {
    buildingType: string;
    roofType: string;
    consumption: number;
    zip: string;
  };
  calculations: ROICalculations;
}

export const ConfiguratorSidebar: React.FC<ConfiguratorSidebarProps> = ({ currentStep, data, calculations }) => {
  const scoreResult = getScoreResult(calculations.score);

  const steps = [
    { id: 1, label: 'Gebäudetyp',   sub: 'Haus & Eigentümer'    },
    { id: 2, label: 'Dachdetails',  sub: 'Neigung & Ausrichtung' },
    { id: 3, label: 'Stromverbrauch', sub: 'Bedarf & Speicher'  },
    { id: 4, label: 'Förderungen',  sub: 'Regionale Boni'        },
    { id: 5, label: 'Ergebnis',     sub: 'Analyse & ROI'         },
  ];

  return (
    <aside className="hidden lg:block w-full max-w-[340px]">
      <div className="sticky top-[100px] bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant p-card-padding flex flex-col gap-stack-md">
        <h3 className="font-headline-md text-headline-md text-primary border-b border-surface-variant pb-4">Deine Konfiguration</h3>
        
        <ul className="flex flex-col gap-4 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-6 before:w-[2px] before:bg-surface-variant">
          {steps.map((step) => (
            <li key={step.id} className={`flex items-start gap-4 relative ${currentStep < step.id ? 'opacity-50' : ''}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs z-10 shrink-0 ${currentStep === step.id ? 'bg-secondary-container text-primary-container' : currentStep > step.id ? 'bg-green-600 text-white' : 'bg-surface-variant text-outline'}`}>
                {currentStep > step.id ? (
                  <span className="material-symbols-outlined text-xs">check</span>
                ) : (
                  step.id
                )}
              </div>
              <div>
                <p className={`font-label-md ${currentStep === step.id ? 'text-primary-container' : 'text-on-surface'}`}>{step.label}</p>
                {currentStep === step.id && <p className="font-caption text-outline">{step.sub}</p>}
              </div>
            </li>
          ))}
        </ul>

        {currentStep > 1 && (
          <div className="mt-8 p-4 bg-surface-container rounded-lg flex flex-col gap-4">
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-outline">home</span>
              <div>
                <div className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">Gebäude</div>
                <div className="font-body-md text-body-md font-medium text-primary">{BUILDING_LABEL[data.buildingType] ?? data.buildingType}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-outline">roofing</span>
              <div>
                <div className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">Dachtyp</div>
                <div className="font-body-md text-body-md font-medium text-primary">{data.roofType}</div>
              </div>
            </div>
            {currentStep > 2 && (
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-outline">bolt</span>
                <div>
                  <div className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">Verbrauch</div>
                  <div className="font-body-md text-body-md font-medium text-primary">{data.consumption.toLocaleString()} kWh</div>
                </div>
              </div>
            )}
            <div className="flex gap-3">
              <span className="material-symbols-outlined text-outline">location_on</span>
              <div>
                <div className="font-caption text-caption text-on-surface-variant uppercase tracking-wide">PLZ</div>
                <div className="font-body-md text-body-md font-medium text-primary">{data.zip || '10115'}</div>
              </div>
            </div>
          </div>
        )}

        {/* Live-Schätzung */}
        <div className="mt-4 p-4 bg-secondary-fixed/10 border border-secondary-container/30 rounded-lg flex flex-col gap-3">
          <div className="font-caption text-caption text-secondary-container uppercase tracking-wide font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">bolt</span>
            Live-Schätzung
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">Systemgröße</span>
            <span className="font-label-md text-label-md text-primary-container font-bold">{calculations.kwp} kWp</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">Jährl. Ersparnis</span>
            <span className="font-label-md text-label-md text-secondary-container font-bold">ca. {calculations.annualSavings.toLocaleString('de-DE')} €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">Amortisation</span>
            <span className="font-label-md text-label-md text-primary-container font-bold">~{calculations.amortization} Jahre</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-body-md text-body-md text-on-surface-variant">Autarkie</span>
            <span className="font-label-md text-label-md text-primary-container font-bold">{calculations.autarky} %</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-secondary-container/20">
            <span className="font-body-md text-body-md text-on-surface-variant">Lead-Score</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${scoreResult.bgColor} ${scoreResult.color}`}>
              {scoreResult.label} · {scoreResult.score}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
