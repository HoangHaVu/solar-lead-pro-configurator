import React from 'react';

interface ConfiguratorSidebarProps {
  currentStep: number;
  data: {
    roofType: string;
    consumption: number;
    zip: string;
  };
}

export const ConfiguratorSidebar: React.FC<ConfiguratorSidebarProps> = ({ currentStep, data }) => {
  const steps = [
    { id: 1, label: 'Dachdetails', sub: 'Ausrichtung & Baujahr' },
    { id: 2, label: 'Stromverbrauch', sub: 'Bedarf & Speicher' },
    { id: 3, label: 'Förderungen', sub: 'Regionale Boni' },
    { id: 4, label: 'Ergebnis', sub: 'Analyse & ROI' },
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
      </div>
    </aside>
  );
};
