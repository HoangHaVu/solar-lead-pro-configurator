import React, { useState } from 'react';
import { submitLead } from '../../services/leads';
import type { ConfigData, ROICalculations } from '../../hooks/useConfigurator';

interface StepLeadFormProps {
  data: ConfigData;
  calculations: ROICalculations;
  onNext: () => void;
  onPrev: () => void;
}

const INPUT_CLASS =
  'w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-md text-body-md transition-colors placeholder:text-outline';

export const StepLeadForm: React.FC<StepLeadFormProps> = ({
  data,
  calculations,
  onNext,
  onPrev,
}) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    wantsZoomCall: false,
    privacyConsent: false,
  });
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
        calculations
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
                <span className="text-primary-container font-medium underline decoration-secondary-container underline-offset-4">
                  Datenschutzerklärung
                </span>{' '}
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
            <div className="flex items-center gap-2 mt-stack-sm text-primary-container/80">
              <span className="material-symbols-outlined text-[18px] fill">shield_lock</span>
              <span className="font-caption text-caption font-medium">
                100 % Datenschutz gemäß DSGVO
              </span>
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
