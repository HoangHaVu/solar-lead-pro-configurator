import React from 'react';

interface StepRoofProps {
  data: {
    roofType: string;
    orientation: string;
    area: number;
    constructionYear: string;
  };
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const StepRoof: React.FC<StepRoofProps> = ({ data, onUpdate, onNext, onPrev }) => {
  return (
    <div className="lg:col-span-8 flex flex-col gap-stack-lg">
      <div>
        <p className="font-label-md text-secondary-container mb-2">SCHRITT 1 VON 4</p>
        <h1 className="font-headline-xl text-primary-container mb-4">Erzähl uns von deinem Dach</h1>
        <p className="font-body-lg text-on-surface-variant max-w-2xl">
          Um die beste Anlage für dich zu planen, benötigen wir ein paar Details zu deinem Haus.
        </p>
      </div>

      {/* Form Section 1: Orientation */}
      <div className="flex flex-col gap-stack-sm">
        <h2 className="font-headline-md text-primary-container">Dachausrichtung</h2>
        <p className="font-body-md text-outline">Wohin neigt sich deine größte Dachfläche?</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          {/* Card 1: South */}
          <label className="relative cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="orientation" 
              type="radio" 
              value="sued"
              checked={data.orientation === 'sued'}
              onChange={() => onUpdate({ orientation: 'sued' })}
            />
            <div className="h-full bg-surface-container-lowest border-2 border-surface-variant rounded-xl p-card-padding flex flex-col items-center text-center transition-all duration-200 peer-checked:border-secondary-container peer-checked:bg-secondary-fixed/10 group-hover:border-secondary-container/50 group-hover:shadow-[0px_4px_20px_rgba(13,33,55,0.05)]">
              <span className="material-symbols-outlined text-4xl text-primary-container mb-4 fill">wb_sunny</span>
              <span className="font-headline-md text-primary-container">Süd</span>
              <span className="font-caption text-outline mt-2">Höchster Ertrag</span>
            </div>
            <div className="absolute top-4 right-4 text-secondary-container opacity-0 peer-checked:opacity-100 transition-opacity">
              <span className="material-symbols-outlined fill">check_circle</span>
            </div>
          </label>
          {/* Card 2: East/West */}
          <label className="relative cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="orientation" 
              type="radio" 
              value="ostwest"
              checked={data.orientation === 'ostwest'}
              onChange={() => onUpdate({ orientation: 'ostwest' })}
            />
            <div className="h-full bg-surface-container-lowest border-2 border-surface-variant rounded-xl p-card-padding flex flex-col items-center text-center transition-all duration-200 peer-checked:border-secondary-container peer-checked:bg-secondary-fixed/10 group-hover:border-secondary-container/50 group-hover:shadow-[0px_4px_20px_rgba(13,33,55,0.05)]">
              <span className="material-symbols-outlined text-4xl text-primary-container mb-4 fill">explore</span>
              <span className="font-headline-md text-primary-container">Ost/West</span>
              <span className="font-caption text-outline mt-2">Gute Verteilung</span>
            </div>
            <div className="absolute top-4 right-4 text-secondary-container opacity-0 peer-checked:opacity-100 transition-opacity">
              <span className="material-symbols-outlined fill">check_circle</span>
            </div>
          </label>
          {/* Card 3: North */}
          <label className="relative cursor-pointer group">
            <input 
              className="peer sr-only" 
              name="orientation" 
              type="radio" 
              value="nord"
              checked={data.orientation === 'nord'}
              onChange={() => onUpdate({ orientation: 'nord' })}
            />
            <div className="h-full bg-surface-container-lowest border-2 border-surface-variant rounded-xl p-card-padding flex flex-col items-center text-center transition-all duration-200 peer-checked:border-secondary-container peer-checked:bg-secondary-fixed/10 group-hover:border-secondary-container/50 group-hover:shadow-[0px_4px_20px_rgba(13,33,55,0.05)]">
              <span className="material-symbols-outlined text-4xl text-outline mb-4 fill">ac_unit</span>
              <span className="font-headline-md text-primary-container">Nord</span>
              <span className="font-caption text-outline mt-2">Geringerer Ertrag</span>
            </div>
            <div className="absolute top-4 right-4 text-secondary-container opacity-0 peer-checked:opacity-100 transition-opacity">
              <span className="material-symbols-outlined fill">check_circle</span>
            </div>
          </label>
        </div>
      </div>

      <hr className="border-surface-variant"/>

      {/* Form Section 2: Area & Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        <div className="flex flex-col gap-2">
          <label className="font-label-md text-primary-container" htmlFor="surface-area">Geschätzte Dachfläche (m²)</label>
          <div className="relative">
            <input 
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg px-4 py-3 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors" 
              id="surface-area" 
              placeholder="z.B. 80" 
              type="number"
              value={data.area || ''}
              onChange={(e) => onUpdate({ area: parseInt(e.target.value) })}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body-md text-outline">m²</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 relative">
          <label className="font-label-md text-primary-container" htmlFor="construction-year">Baujahr des Hauses</label>
          <div className="relative">
            <select 
              className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md rounded-lg px-4 py-3 appearance-none focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors" 
              id="construction-year"
              value={data.constructionYear}
              onChange={(e) => onUpdate({ constructionYear: e.target.value })}
            >
              <option disabled value="">Bitte wählen...</option>
              <option value="after2010">Nach 2010</option>
              <option value="1990-2010">1990 - 2010</option>
              <option value="1980-1989">1980 - 1989</option>
              <option value="pre1980">Vor 1980</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-outline">
              <span className="material-symbols-outlined">expand_more</span>
            </div>
          </div>
        </div>
      </div>

      {data.constructionYear === 'pre1980' && (
        <div className="bg-error-container text-on-error-container p-4 rounded-lg flex items-start gap-3 mt-4 border border-error/20">
          <span className="material-symbols-outlined text-error mt-0.5">warning</span>
          <p className="font-body-md text-sm">
            <strong className="font-semibold">Hinweis:</strong> Bei Häusern vor 1980 kann eine Zählerschranksanierung nötig sein (+1.500–3.000 €).
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between mt-8 pt-8 border-t border-surface-variant">
        <button 
          className="px-6 py-3 border border-primary-container text-primary-container font-label-md rounded-lg hover:bg-surface-variant transition-colors flex items-center gap-2"
          onClick={onPrev}
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Zurück
        </button>
        <button 
          className="bg-secondary-container text-primary-container px-8 py-3 rounded-lg font-label-md font-bold hover:bg-secondary-fixed transition-colors flex items-center gap-2 shadow-[0px_4px_20px_rgba(13,33,55,0.05)]"
          onClick={onNext}
        >
          Weiter
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
