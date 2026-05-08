import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import type { ConfigData, ROICalculations } from '../../hooks/useConfigurator';
import { ROIPdfDocument } from '../ROIPdfDocument';

interface StepResultProps {
  data: ConfigData;
  calculations: ROICalculations;
  onNext: () => void;
}

function buildChartPath(chartData: { year: number; value: number }[]): string {
  const W = 1000;
  const H = 200;
  const pad = 12;
  const values = chartData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const toX = (year: number) => (year / 20) * W;
  const toY = (val: number) => H - pad - ((val - minVal) / range) * (H - pad * 2);

  return chartData
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${toX(d.year).toFixed(1)},${toY(d.value).toFixed(1)}`)
    .join(' ');
}

function buildFillPath(chartData: { year: number; value: number }[], linePath: string): string {
  return `${linePath} L1000,200 L0,200 Z`;
}

export const StepResult: React.FC<StepResultProps> = ({ data, calculations, onNext }) => {
  const {
    kwp,
    investment,
    grantSavings,
    effectiveInvestment,
    gridFeedIn,
    autarky,
    annualSavings,
    amortization,
    profit20Years,
    chartData,
  } = calculations;

  const eegRevenue = Math.round(gridFeedIn * 0.082);

  const linePath = buildChartPath(chartData);
  const fillPath = buildFillPath(chartData, linePath);

  // Zero-line Y position for break-even marker
  const values = chartData.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;
  const zeroY = (200 - 12 - ((0 - minVal) / range) * (200 - 24)).toFixed(1);

  return (
    <div className="flex-grow w-full max-w-container-max mx-auto">
      <div className="text-center mb-stack-lg max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md mb-stack-sm">
          <span className="material-symbols-outlined text-[16px] fill">check_circle</span>
          <span>Analyse bereit</span>
        </div>
        <h1 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-primary mb-stack-sm">Deine Wirtschaftlichkeits-Analyse</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Basierend auf deinen Angaben haben wir eine individuelle Prognose für deine Photovoltaikanlage erstellt.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-stack-lg">
        {/* Systemleistung */}
        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl shadow-ambient p-card-padding border border-surface-variant hover:border-primary-container transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center mb-stack-md text-on-primary-fixed">
            <span className="material-symbols-outlined fill">solar_power</span>
          </div>
          <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Systemleistung</h3>
          <div className="font-headline-lg text-headline-lg text-primary">{kwp} <span className="font-headline-md text-headline-md text-on-surface-variant">kWp</span></div>
        </div>

        {/* Investition */}
        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl shadow-ambient p-card-padding border border-surface-variant hover:border-primary-container transition-colors">
          <div className="w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center mb-stack-md text-on-tertiary-fixed">
            <span className="material-symbols-outlined fill">account_balance_wallet</span>
          </div>
          <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Investition</h3>
          {grantSavings > 0 ? (
            <>
              <div className="font-headline-lg text-headline-lg text-primary">
                ca. {effectiveInvestment.toLocaleString('de-DE')} <span className="font-headline-md text-headline-md text-on-surface-variant">€</span>
              </div>
              <p className="text-xs text-secondary-container font-semibold mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] fill">sell</span>
                nach Förderungen (statt {investment.toLocaleString('de-DE')} €)
              </p>
            </>
          ) : (
            <div className="font-headline-lg text-headline-lg text-primary">ca. {investment.toLocaleString('de-DE')} <span className="font-headline-md text-headline-md text-on-surface-variant">€</span></div>
          )}
        </div>

        {/* Amortisation */}
        <div className="md:col-span-4 bg-primary-container rounded-xl shadow-ambient p-card-padding text-on-primary relative overflow-hidden">
          <div className="absolute -right-10 -top-10 opacity-10">
            <span className="material-symbols-outlined text-[120px] fill">trending_up</span>
          </div>
          <div className="relative z-10">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-stack-md text-white backdrop-blur-sm">
              <span className="material-symbols-outlined fill">update</span>
            </div>
            <h3 className="font-body-md text-body-md text-primary-fixed-dim mb-1">Amortisation</h3>
            <div className="font-headline-lg text-headline-lg text-white">~ {amortization} <span className="font-headline-md text-headline-md text-primary-fixed-dim">Jahre</span></div>
          </div>
        </div>

        {/* Förderungsübersicht */}
        <div className="md:col-span-12 bg-gradient-to-r from-secondary-container/10 to-primary/5 border border-secondary-container/30 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-secondary-container fill">verified</span>
            <h3 className="font-bold text-primary text-sm uppercase tracking-widest">Förderungen & Vergünstigungen — bereits eingerechnet</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
              <span className="material-symbols-outlined text-secondary-container fill text-[20px] shrink-0 mt-0.5">percent</span>
              <div>
                <p className="font-bold text-primary text-sm">0 % Mehrwertsteuer</p>
                <p className="text-xs text-on-surface-variant mt-0.5">Preis bereits ohne MwSt. — spart ~19 % auf den Kaufpreis</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
              <span className="material-symbols-outlined text-secondary-container fill text-[20px] shrink-0 mt-0.5">bolt</span>
              <div>
                <p className="font-bold text-primary text-sm">EEG Einspeisevergütung</p>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  {eegRevenue > 0
                    ? `ca. ${eegRevenue.toLocaleString('de-DE')} €/Jahr · 20 Jahre garantiert`
                    : '8,2 ct/kWh · 20 Jahre garantiert'}
                </p>
              </div>
            </div>
            {grantSavings > 0 ? (
              <div className="flex items-start gap-3 bg-secondary-container/10 border border-secondary-container/20 rounded-lg p-4">
                <span className="material-symbols-outlined text-secondary-container fill text-[20px] shrink-0 mt-0.5">savings</span>
                <div>
                  <p className="font-bold text-primary text-sm">Regionaler Zuschuss</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    −{grantSavings.toLocaleString('de-DE')} € vom Kaufpreis abgezogen
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 bg-white/60 rounded-lg p-4">
                <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-0.5">location_on</span>
                <div>
                  <p className="font-bold text-primary text-sm">Regionale Förderung</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">Prüfe zusätzliche Zuschüsse im Förderungsschritt</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ertragsprognose Chart — datengetrieben */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl shadow-ambient p-card-padding border border-surface-variant">
          <div className="flex justify-between items-start mb-stack-md">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary">Ertragsprognose</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Kumulierter Gewinn über 20 Jahre</p>
            </div>
            <div className="text-right">
              <div className="font-label-md text-label-md text-on-surface-variant">Gewinn nach 20 Jahren</div>
              <div className="font-headline-md text-headline-md text-secondary">
                {profit20Years >= 0 ? '+' : ''}{profit20Years.toLocaleString('de-DE')} €
              </div>
            </div>
          </div>
          <div className="h-[240px] bg-surface-container-low rounded-lg border border-surface-variant relative overflow-hidden">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
              {/* Break-even Linie */}
              <line x1="0" y1={zeroY} x2="1000" y2={zeroY} stroke="#C4C6CD" strokeWidth="1.5" strokeDasharray="8 4" />
              {/* Füllfläche */}
              <path d={fillPath} fill="#F59E0B" fillOpacity="0.10" />
              {/* Kurve */}
              <path d={linePath} fill="none" stroke="#F59E0B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Autarkiegrad */}
        <div className="md:col-span-4 bg-surface-container-lowest rounded-xl shadow-ambient p-card-padding border border-surface-variant flex flex-col items-center justify-center text-center">
          <h3 className="font-headline-md text-headline-md text-primary mb-1">Autarkiegrad</h3>
          <div className="relative w-40 h-40 my-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e4e2e4" strokeWidth="10" />
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F59E0B" strokeWidth="10"
                strokeDasharray={`${Math.min(autarky, 100) * 2.51} 251.2`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-lg text-headline-lg text-primary">{autarky}%</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-low rounded-lg p-4">
            <div className="font-body-md text-body-md text-on-surface-variant">Jährliche Ersparnis</div>
            <div className="font-headline-md text-headline-md text-secondary">ca. {annualSavings.toLocaleString('de-DE')} €</div>
          </div>
        </div>
      </div>

      {/* KfW-Finanzierungsrechner */}
      {effectiveInvestment > 0 && (() => {
        const kfwRate = 0.0385;
        const months = 120;
        const mr = kfwRate / 12;
        const monthlyKfw = Math.round(effectiveInvestment * mr / (1 - Math.pow(1 + mr, -months)));
        const monthlySimple = Math.round(effectiveInvestment / months);
        return (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-stack-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-blue-600 fill text-[20px]">account_balance</span>
              <h3 className="font-bold text-primary text-sm uppercase tracking-widest">KfW-Finanzierungsoption — Anlage ohne Eigenkapital</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
                <p className="text-xs text-slate-500 mb-1">Monatliche Rate (KfW 270)</p>
                <p className="text-2xl font-black text-primary">ca. {monthlyKfw.toLocaleString('de-DE')} €</p>
                <p className="text-xs text-slate-400 mt-1">bei ~3,85 % Zins, 10 Jahre</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-blue-100 text-center">
                <p className="text-xs text-slate-500 mb-1">Monatliche Ersparnis</p>
                <p className="text-2xl font-black text-secondary">ca. {Math.round(annualSavings / 12).toLocaleString('de-DE')} €</p>
                <p className="text-xs text-slate-400 mt-1">Strom + Einspeisevergütung</p>
              </div>
              <div className={`rounded-xl p-4 border text-center ${Math.round(annualSavings / 12) >= monthlyKfw ? 'bg-green-50 border-green-200' : 'bg-white border-blue-100'}`}>
                <p className="text-xs text-slate-500 mb-1">Monatliche Netto-Bilanz</p>
                <p className={`text-2xl font-black ${Math.round(annualSavings / 12) >= monthlyKfw ? 'text-green-600' : 'text-primary'}`}>
                  {Math.round(annualSavings / 12) >= monthlyKfw ? '+' : ''}{(Math.round(annualSavings / 12) - monthlyKfw).toLocaleString('de-DE')} €
                </p>
                <p className="text-xs text-slate-400 mt-1">Ersparnis minus Rate</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              * Orientierungswert auf Basis KfW-Programm 270 (Erneuerbare Energien). Tatsächlicher Zinssatz je nach Bonität und aktuellem KfW-Angebot. Keine Finanzierungsberatung.
            </p>
          </div>
        );
      })()}

      {/* CTA */}
      <div className="bg-primary-container rounded-2xl p-stack-lg text-center relative overflow-hidden ambient-shadow-lvl2">
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <h2 className="font-headline-lg text-headline-lg text-white mb-stack-md">Bereit für den nächsten Schritt?</h2>
          <p className="font-body-lg text-body-lg text-primary-fixed-dim mb-stack-lg">Fordere jetzt dein detailliertes, kostenloses und unverbindliches Angebot an.</p>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              className="bg-secondary-container hover:bg-secondary-fixed text-on-secondary-container font-label-md text-label-md px-8 py-4 rounded-lg shadow-md transition-all transform hover:-translate-y-1 flex items-center gap-2"
              onClick={onNext}
            >
              <span>Individuelles Angebot anfordern</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
            <PDFDownloadLink
              document={<ROIPdfDocument data={data} calculations={calculations} />}
              fileName="solarconfig-wirtschaftlichkeitsanalyse.pdf"
              className="bg-white/10 hover:bg-white/20 text-white font-label-md text-label-md px-8 py-4 rounded-lg border border-white/30 transition-all flex items-center gap-2"
            >
              {({ loading }) => (
                <>
                  <span className="material-symbols-outlined text-[20px]">
                    {loading ? 'hourglass_empty' : 'download'}
                  </span>
                  <span>{loading ? 'PDF wird erstellt…' : 'Analyse als PDF speichern'}</span>
                </>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};
