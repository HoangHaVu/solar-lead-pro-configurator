import React from 'react';

interface StepMieterInfoProps {
  onContinueAnyway: () => void;
  onBack: () => void;
}

export const StepMieterInfo: React.FC<StepMieterInfoProps> = ({ onContinueAnyway, onBack }) => (
  <div className="flex flex-col gap-stack-lg w-full max-w-2xl">
    {/* Header */}
    <div className="flex flex-col gap-stack-sm">
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-label-md text-label-md w-fit">
        <span className="material-symbols-outlined text-[16px]">info</span>
        Mieter-Hinweis
      </span>
      <h1 className="font-headline-xl text-primary">Als Mieter gibt es besondere Optionen</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">
        Für eine klassische Dachanlage brauchst du die Zustimmung deines Vermieters.
        Hier sind deine Alternativen — plus wie du deinen Vermieter überzeugst.
      </p>
    </div>

    {/* Option 1: Balkonkraftwerk */}
    <div className="bg-secondary-container/10 border-2 border-secondary-container rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-white fill">bolt</span>
        </div>
        <div>
          <h2 className="font-headline-md text-primary">Balkonkraftwerk (sofort, ohne Vermieter)</h2>
          <p className="text-xs text-on-surface-variant">Bis 800 W — kein Antrag, keine Genehmigung nötig</p>
        </div>
      </div>
      <ul className="space-y-2 text-sm text-on-surface-variant">
        <li className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary-container text-[18px] shrink-0 mt-0.5 fill">check_circle</span>
          Einmalinvestition ca. <strong className="text-primary">400–800 €</strong> — oft in 2–4 Jahren amortisiert
        </li>
        <li className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary-container text-[18px] shrink-0 mt-0.5 fill">check_circle</span>
          Kein Elektriker nötig — Steckdose reicht (Schuko oder Wieland)
        </li>
        <li className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary-container text-[18px] shrink-0 mt-0.5 fill">check_circle</span>
          Spart ca. <strong className="text-primary">150–300 € pro Jahr</strong> (abhängig vom Strompreis)
        </li>
        <li className="flex items-start gap-2">
          <span className="material-symbols-outlined text-secondary-container text-[18px] shrink-0 mt-0.5 fill">check_circle</span>
          Muss dem Vermieter nur <em>gemeldet</em> werden — Zustimmung nicht erforderlich
        </li>
      </ul>
    </div>

    {/* Option 2: Vermieter überzeugen */}
    <div className="bg-surface-container-lowest border border-slate-200 rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary fill">handshake</span>
        </div>
        <div>
          <h2 className="font-headline-md text-primary">Vermieter überzeugen</h2>
          <p className="text-xs text-on-surface-variant">Dachanlage mit Einverständnis des Vermieters</p>
        </div>
      </div>
      <p className="text-sm text-on-surface-variant">
        Viele Vermieter sind aufgeschlossen — besonders wenn die Anlage den Immobilienwert steigert
        und der Mieter sich an den Kosten beteiligt. Du kannst ihnen unsere Wirtschaftlichkeitsanalyse
        direkt übergeben.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-center">
        {[
          { icon: 'trending_up', text: 'Immobilienwert steigt um 3–5 %' },
          { icon: 'eco',         text: 'ESG-Score des Gebäudes verbessert sich' },
          { icon: 'euro',        text: 'Kein Kapitaleinsatz für Vermieter nötig' },
        ].map(({ icon, text }) => (
          <div key={text} className="flex flex-col items-center gap-1 p-3 bg-slate-50 rounded-lg">
            <span className="material-symbols-outlined text-secondary-container text-2xl">{icon}</span>
            <span className="text-on-surface-variant">{text}</span>
          </div>
        ))}
      </div>
    </div>

    {/* CTA-Bereich */}
    <div className="flex flex-col gap-3 pt-2">
      <p className="text-sm text-on-surface-variant text-center">
        Du kannst trotzdem eine vollständige Analyse erstellen — z.B. um sie deinem Vermieter zu zeigen.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onContinueAnyway}
          className="flex items-center justify-center gap-2 bg-secondary-container text-primary-container font-label-md text-label-md px-8 py-4 sm:py-3 rounded-lg hover:brightness-110 shadow-ambient transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">calculate</span>
          Trotzdem Analyse erstellen
        </button>
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-primary font-label-md text-label-md px-6 py-4 sm:py-3 border border-primary rounded-lg hover:bg-surface-container-low transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Zurück
        </button>
      </div>
    </div>
  </div>
);
