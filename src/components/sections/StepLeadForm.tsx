import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitLead } from '../../services/leads';
import type { ConfigData, PlanningHorizon, ROICalculations } from '../../hooks/useConfigurator';

interface StepLeadFormProps {
  data: ConfigData;
  calculations: ROICalculations;
  onNext: () => void;
  onPrev: () => void;
  onUpdate: (d: Partial<ConfigData>) => void;
}

const INPUT_CLASS =
  'w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md transition-colors placeholder:text-outline';

const HORIZONS: { value: PlanningHorizon; label: string; sub: string; icon: string }[] = [
  { value: 'sofort',   label: 'So bald wie möglich', sub: 'Ich bin startbereit',       icon: 'rocket_launch' },
  { value: '3monate',  label: 'In 3 Monaten',        sub: 'Ich plane kurzfristig',     icon: 'event' },
  { value: '12monate', label: 'In 12 Monaten',       sub: 'Ich sammle Informationen',  icon: 'schedule' },
];

export const StepLeadForm: React.FC<StepLeadFormProps> = ({
  data,
  calculations,
  onNext,
  onPrev,
  onUpdate,
}) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    wantsZoomCall: false,
    privacyConsent: false,
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      await submitLead(
        {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          wantsZoomCall: form.wantsZoomCall,
        },
        data,
        calculations,
        undefined,
        photo,
      );
      onNext();
    } catch (err) {
      setStatus('error');
      setErrorMsg('Es ist ein Fehler aufgetreten. Bitte versuche es erneut.');
    }
  };

  return (
    <div className="lg:col-span-8 space-y-stack-lg">
      <div>
        <span className="inline-block bg-primary-container/10 text-primary-container font-label-md text-label-md px-3 py-1 rounded-full mb-stack-sm">
          Fast geschafft
        </span>
        <h1 className="font-headline-xl text-headline-xl text-primary mb-stack-sm">
          Dein individuelles Angebot
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Hinterlasse deine Kontaktdaten, damit unsere Experten dein persönliches PV-Angebot
          kalkulieren und dir unverbindlich zusenden können.
        </p>
      </div>

      {/* Planungshorizont */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-card-padding">
        <h2 className="font-headline-md text-primary mb-1">Wann planst du die Umsetzung?</h2>
        <p className="font-body-md text-on-surface-variant text-sm mb-4">Hilft uns, dein Angebot passend zu priorisieren.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HORIZONS.map(({ value, label, sub, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onUpdate({ planningHorizon: value })}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all ${
                data.planningHorizon === value
                  ? 'border-secondary-container bg-secondary-fixed/10'
                  : 'border-surface-variant hover:border-secondary-container/40 bg-surface-container-lowest'
              }`}
            >
              <span className={`material-symbols-outlined text-3xl fill ${data.planningHorizon === value ? 'text-secondary-container' : 'text-outline'}`}>
                {icon}
              </span>
              <span className="font-label-md text-primary text-sm font-bold">{label}</span>
              <span className="text-xs text-on-surface-variant">{sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Finanzierungsbedarf */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-card-padding">
        <h2 className="font-headline-md text-primary mb-1">Hast du Finanzierungsbedarf?</h2>
        <p className="font-body-md text-on-surface-variant text-sm mb-4">
          Wir können dir passende KfW-Finanzierungsoptionen mit einplanen.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: false, label: 'Nein, Eigenkapital', icon: 'account_balance_wallet' },
            { value: true,  label: 'Ja, Finanzierung gewünscht', icon: 'account_balance' },
          ].map(({ value, label, icon }) => (
            <button
              key={String(value)}
              type="button"
              onClick={() => onUpdate({ needsFinancing: value })}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                data.needsFinancing === value
                  ? 'border-secondary-container bg-secondary-fixed/10'
                  : 'border-surface-variant hover:border-secondary-container/40 bg-surface-container-lowest'
              }`}
            >
              <span className={`material-symbols-outlined text-2xl fill ${data.needsFinancing === value ? 'text-secondary-container' : 'text-outline'}`}>
                {icon}
              </span>
              <span className="font-label-md text-primary text-sm font-semibold">{label}</span>
            </button>
          ))}
        </div>
        {data.needsFinancing && (
          <div className="mt-3 flex items-start gap-2 bg-primary/5 rounded-lg p-3 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0 mt-0.5 fill">info</span>
            <span>
              Der <strong className="text-primary">KfW-Kredit 270</strong> bietet Zinsen ab 5,21 % p.a. mit
              Laufzeiten bis 30 Jahren — wir nennen dir die aktuellen Konditionen im Angebot.
            </span>
          </div>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-ambient-sm border border-outline-variant/30 p-card-padding">
        <form className="space-y-stack-md" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-sm">
            <div className="flex flex-col gap-base">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="firstName">
                Vorname
              </label>
              <input
                className={INPUT_CLASS}
                id="firstName"
                placeholder="Max"
                required
                type="text"
                value={form.firstName}
                onChange={(e) => set('firstName', e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-base">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="lastName">
                Nachname
              </label>
              <input
                className={INPUT_CLASS}
                id="lastName"
                placeholder="Mustermann"
                required
                type="text"
                value={form.lastName}
                onChange={(e) => set('lastName', e.target.value)}
              />
            </div>
          </div>

          {/* E-Mail */}
          <div className="flex flex-col gap-base">
            <label className="font-label-md text-label-md text-on-surface" htmlFor="email">
              E-Mail Adresse
            </label>
            <input
              className={INPUT_CLASS}
              id="email"
              placeholder="max.mustermann@beispiel.de"
              required
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>

          {/* Telefon */}
          <div className="flex flex-col gap-base">
            <div className="flex items-center justify-between">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="phone">
                Telefonnummer
              </label>
              <span className="font-caption text-caption text-outline">Optional</span>
            </div>
            <input
              className={INPUT_CLASS}
              id="phone"
              placeholder="+49 151 23456789"
              type="tel"
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
            />
          </div>

          <div className="h-px w-full bg-outline-variant/30 my-stack-md" />

          {/* Checkboxen */}
          <div className="space-y-stack-sm">
            {/* Zoom-Beratung */}
            <label className="flex items-start gap-4 p-4 rounded-lg border border-outline-variant/50 bg-surface-container hover:bg-surface-container-high transition-colors cursor-pointer">
              <div className="relative flex items-center justify-center w-6 h-6 mt-0.5 shrink-0">
                <input
                  className="peer appearance-none w-6 h-6 border-2 border-outline rounded bg-surface-container-lowest checked:bg-primary-container checked:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  type="checkbox"
                  checked={form.wantsZoomCall}
                  onChange={(e) => set('wantsZoomCall', e.target.checked)}
                />
                <span className="material-symbols-outlined absolute text-surface-container-lowest opacity-0 peer-checked:opacity-100 pointer-events-none text-[18px] fill">
                  check
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-primary-container">
                  Zoom-Beratung erwünscht
                </span>
                <span className="font-body-md text-body-md text-on-surface-variant mt-1">
                  Ich wünsche eine kostenlose, 15-minütige Online-Beratung zu meinem Angebot.
                </span>
              </div>
            </label>

            {/* Dach-Foto (optional) */}
            <div className="p-4">
              <p className="font-label-md text-label-md text-on-surface mb-2">
                Dachfoto <span className="text-outline font-normal">(optional)</span>
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-3">
                Ein Foto deines Dachs hilft dem Installateur bei der genauen Kalkulation.
              </p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed transition-colors text-sm font-medium ${
                  photo ? 'border-primary-container bg-primary-container/10 text-primary-container' : 'border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary-container'
                }`}>
                  <span className="material-symbols-outlined text-[18px]">{photo ? 'check_circle' : 'upload'}</span>
                  {photo ? photo.name : 'Foto auswählen'}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  className="hidden"
                  onChange={e => setPhoto(e.target.files?.[0] ?? null)}
                />
                {photo && (
                  <button type="button" onClick={() => setPhoto(null)} className="text-xs text-outline hover:text-error transition-colors">
                    Entfernen
                  </button>
                )}
              </label>
            </div>

            {/* Datenschutz */}
            <label className="flex items-start gap-4 p-4 cursor-pointer">
              <div className="relative flex items-center justify-center w-6 h-6 mt-0.5 shrink-0">
                <input
                  className="peer appearance-none w-6 h-6 border-2 border-outline rounded bg-surface-container-lowest checked:bg-primary-container checked:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all"
                  required
                  type="checkbox"
                  checked={form.privacyConsent}
                  onChange={(e) => set('privacyConsent', e.target.checked)}
                />
                <span className="material-symbols-outlined absolute text-surface-container-lowest opacity-0 peer-checked:opacity-100 pointer-events-none text-[18px] fill">
                  check
                </span>
              </div>
              <span className="font-body-md text-body-md text-on-surface">
                Ich stimme der Verarbeitung meiner Daten gemäß der{' '}
                <Link to="/datenschutz" className="text-primary-container font-medium underline decoration-secondary-container underline-offset-4">
                  Datenschutzerklärung
                </Link>{' '}
                zu.*
              </span>
            </label>
          </div>

          {/* Fehler */}
          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-error-container text-on-error-container border border-error/20">
              <span className="material-symbols-outlined text-error">error</span>
              <span className="font-body-md text-sm">{errorMsg}</span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-stack-sm flex flex-col items-center">
            <button
              className="w-full sm:w-auto min-w-[300px] bg-secondary-container text-primary-container font-label-md text-label-md py-4 px-8 rounded-lg shadow-sm hover:shadow-md hover:bg-secondary-fixed transition-all flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
              type="submit"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">
                    progress_activity
                  </span>
                  Wird gesendet…
                </>
              ) : (
                <>
                  Jetzt Angebot unverbindlich anfragen
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </>
              )}
            </button>
            <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-outline-variant/30">
              {[
                { icon: 'shield_lock',   text: 'DSGVO-konform' },
                { icon: 'verified',      text: 'TÜV-geprüft' },
                { icon: 'engineering',   text: 'Meisterbetriebe' },
                { icon: 'euro_symbol',   text: '0 % MwSt.' },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-1 text-xs text-outline font-medium">
                  <span className="material-symbols-outlined text-[14px] fill text-secondary-container">{icon}</span>
                  {text}
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      <div className="flex justify-start">
        <button
          className="flex items-center gap-2 text-primary font-label-md text-label-md px-6 py-3 border border-primary rounded-lg hover:bg-surface-container-low transition-colors"
          onClick={onPrev}
          type="button"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Zurück
        </button>
      </div>
    </div>
  );
};
