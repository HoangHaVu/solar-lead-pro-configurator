import React from 'react';

interface StepEnergyProps {
  data: {
    consumption: number;
    futureNeeds: { eCar: boolean; heatPump: boolean };
    battery: boolean;
    electricityPrice: number;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepEnergy: React.FC<StepEnergyProps> = ({ data, onUpdate, onNext, onPrev }) => {
  return (
    <div className="lg:col-span-8 flex flex-col gap-stack-lg">
      <div>
        <h1 className="font-headline-xl text-headline-xl text-primary-container mb-stack-sm">Dein Energiebedarf</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Um deine Anlage optimal zu dimensionieren, benötigen wir ein paar Angaben zu deinem aktuellen und zukünftigen Stromverbrauch.</p>
      </div>

      {/* Card 1: Annual Consumption Slider */}
      <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_20px_rgba(13,33,55,0.05)] border border-surface-variant transition-all hover:border-outline focus-within:border-primary-container">
        <div className="flex items-center gap-3 mb-stack-md">
          <span className="material-symbols-outlined text-secondary-container text-3xl fill">bolt</span>
          <h2 className="font-headline-md text-headline-md text-primary-container">Jährlicher Stromverbrauch</h2>
        </div>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-end">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Aktueller Verbrauch</span>
            <div className="flex items-baseline gap-1">
              <span className="font-headline-lg text-headline-lg text-primary-container">{data.consumption.toLocaleString()}</span>
              <span className="font-body-md text-body-md text-on-surface-variant font-medium">kWh/Jahr</span>
            </div>
          </div>
          <div className="relative pt-2 pb-6">
            <input 
              className="w-full appearance-none bg-transparent focus:outline-none" 
              max="8000" 
              min="2000" 
              step="100" 
              type="range" 
              value={data.consumption}
              onChange={(e) => onUpdate({ consumption: parseInt(e.target.value) })}
              style={{
                background: `linear-gradient(to right, #F59E0B ${((data.consumption - 2000) / 6000) * 100}%, #c4c6cd ${((data.consumption - 2000) / 6000) * 100}%)`,
                height: '4px',
                borderRadius: '2px',
                WebkitAppearance: 'none'
              }}
            />
            <div className="flex justify-between mt-2 font-caption text-caption text-outline">
              <span>2.000 kWh</span>
              <span>8.000 kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Future Needs */}
      <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_20px_rgba(13,33,55,0.05)] border border-surface-variant">
        <div className="flex items-center gap-3 mb-stack-md">
          <span className="material-symbols-outlined text-secondary-container text-3xl fill">electric_car</span>
          <h2 className="font-headline-md text-headline-md text-primary-container">Zukünftiger Bedarf</h2>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6">Planst du in naher Zukunft größere Anschaffungen, die Strom benötigen?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-surface-container-low transition-colors ${data.futureNeeds.eCar ? 'border-primary-container bg-primary-fixed-dim/20' : 'border-surface-variant bg-surface'}`}>
            <div className="flex items-center h-6">
              <input 
                className="w-5 h-5 rounded border-outline text-primary-container focus:ring-primary-container" 
                type="checkbox" 
                checked={data.futureNeeds.eCar}
                onChange={(e) => onUpdate({ futureNeeds: { ...data.futureNeeds, eCar: e.target.checked } })}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">E-Auto</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">+ ca. 2.500 kWh/Jahr</span>
            </div>
          </label>
          <label className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer hover:bg-surface-container-low transition-colors ${data.futureNeeds.heatPump ? 'border-primary-container bg-primary-fixed-dim/20' : 'border-surface-variant bg-surface'}`}>
            <div className="flex items-center h-6">
              <input 
                className="w-5 h-5 rounded border-outline text-primary-container focus:ring-primary-container" 
                type="checkbox"
                checked={data.futureNeeds.heatPump}
                onChange={(e) => onUpdate({ futureNeeds: { ...data.futureNeeds, heatPump: e.target.checked } })}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-primary-container">Wärmepumpe</span>
              <span className="font-caption text-caption text-on-surface-variant mt-1">+ ca. 4.000 kWh/Jahr</span>
            </div>
          </label>
        </div>
        <hr className="border-surface-variant my-8"/>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-outline text-2xl">battery_charging_full</span>
            <div>
              <div className="font-label-md text-label-md text-primary-container">Batteriespeicher integrieren?</div>
              <div className="font-caption text-caption text-on-surface-variant">Erhöht deinen Eigenverbrauch signifikant.</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              className="sr-only peer" 
              type="checkbox" 
              checked={data.battery}
              onChange={(e) => onUpdate({ battery: e.target.checked })}
            />
            <div className="w-14 h-7 bg-surface-variant peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-container rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-surface-container-lowest after:border-outline-variant after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-secondary-container"></div>
            <span className={`ml-3 font-label-md text-label-md ${data.battery ? 'text-secondary-container' : 'text-primary-container'}`}>
              {data.battery ? 'Ja' : 'Nein'}
            </span>
          </label>
        </div>
      </div>

      {/* Card 3: Strompreis Input */}
      <div className="bg-surface-container-lowest p-card-padding rounded-xl shadow-[0_4px_20px_rgba(13,33,55,0.05)] border border-surface-variant">
        <div className="flex items-center gap-3 mb-stack-md">
          <span className="material-symbols-outlined text-secondary-container text-3xl fill">payments</span>
          <h2 className="font-headline-md text-headline-md text-primary-container">Dein aktueller Strompreis</h2>
        </div>
        <div className="max-w-xs">
          <label className="block font-label-md text-label-md text-on-surface-variant mb-2" htmlFor="strompreis">Preis pro kWh (in Euro)</label>
          <div className="relative">
            <input 
              className="block w-full rounded-lg border-outline-variant bg-surface-container-lowest py-3 pl-4 pr-12 font-body-md text-body-md text-primary-container focus:border-primary-container focus:ring-primary-container shadow-sm transition-colors" 
              id="strompreis" 
              type="number" 
              step="0.01"
              value={data.electricityPrice}
              onChange={(e) => onUpdate({ electricityPrice: parseFloat(e.target.value) })}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
              <span className="font-body-md text-body-md text-on-surface-variant">€/kWh</span>
            </div>
          </div>
          <p className="font-caption text-caption text-outline mt-2">Durchschnitt in DE: ca. 0,35 €/kWh</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-stack-md pt-6 border-t border-surface-variant gap-3">
        <button
          className="w-full sm:w-auto px-6 py-4 sm:py-3 rounded-lg border-2 border-primary-container text-primary-container font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
          onClick={onPrev}
        >
          <span className="material-symbols-outlined text-xl">arrow_back</span>
          Zurück
        </button>
        <button
          className="w-full sm:w-auto px-8 py-4 sm:py-3 rounded-lg bg-secondary-container text-on-secondary-container font-headline-md text-[16px] shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          onClick={onNext}
        >
          Weiter zu Förderungen
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
