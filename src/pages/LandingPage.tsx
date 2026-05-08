import React from 'react';
import { IMAGES } from '../data/mockData';
import { SEO } from '../components/SEO';
import { useRegionalStats } from '../hooks/useRegionalStats';

const LANDING_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SolarConfig PV-Konfigurator',
  description: 'Kostenloser Online-Konfigurator für Solaranlagen. Wirtschaftlichkeitsanalyse, regionale Förderungen und Angebote von zertifizierten Fachbetrieben.',
  applicationCategory: 'UtilityApplication',
  operatingSystem: 'Web',
  inLanguage: 'de-DE',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  provider: {
    '@type': 'Organization',
    name: 'SolarConfig GmbH',
    url: 'https://solarconfig.de',
    address: { '@type': 'PostalAddress', addressLocality: 'München', addressCountry: 'DE' },
  },
};

interface LandingPageProps {
  onStartConfig?: (zip: string) => void;
}

const STATS_BASE = { analyses: 1240, savings: 5800000, avgAmortization: 11.2 };

export const LandingPage: React.FC<LandingPageProps> = ({ onStartConfig }) => {
  const [zip, setZip] = React.useState('');
  const { totalCount } = useRegionalStats('');

  return (
    <>
    <SEO
      title="Solaranlage konfigurieren & Kosten berechnen"
      description="In 5 Minuten zur kostenlosen Wirtschaftlichkeitsanalyse. Regionale Förderungen, genaue kWp-Berechnung und direktes Angebot vom zertifizierten Fachbetrieb."
      canonical="/"
      jsonLd={LANDING_JSON_LD}
    />
    <main className="min-h-screen pt-section-padding pb-section-padding">
      {/* Stats-Banner */}
      <section aria-label="Plattform-Statistiken" className="max-w-container-max mx-auto px-6 mb-8">
        <div className="grid grid-cols-3 gap-4 bg-surface-container-lowest border border-surface-container-highest rounded-2xl px-6 py-4 shadow-sm">
          {[
            {
              value: (STATS_BASE.analyses + (totalCount ?? 0)).toLocaleString('de-DE') + '+',
              label: 'Konfigurierte Anlagen',
              icon: 'solar_power',
            },
            {
              value: '4,8 Mio. €',
              label: 'Förderungen ermittelt',
              icon: 'savings',
            },
            {
              value: `Ø ${STATS_BASE.avgAmortization} Jahre`,
              label: 'Amortisationszeit',
              icon: 'trending_up',
            },
          ].map(({ value, label, icon }) => (
            <div key={label} className="flex flex-col items-center text-center gap-1">
              <span className="material-symbols-outlined text-secondary-container text-[22px] fill">{icon}</span>
              <span className="font-bold text-primary text-sm md:text-base">{value}</span>
              <span className="text-xs text-on-surface-variant hidden sm:block">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="hero-heading" className="max-w-container-max mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[716px]">
          <div className="flex flex-col gap-stack-lg z-10">
            <div className="flex flex-col gap-stack-md">
              <div className="inline-flex items-center gap-2 bg-surface-container px-3 py-1.5 rounded-full w-fit border border-surface-container-highest shadow-sm">
                <span aria-hidden="true" className="material-symbols-outlined text-secondary-container fill text-[16px]">verified_user</span>
                <span className="font-caption text-on-surface-variant font-medium">TÜV geprüfte Qualität</span>
              </div>
              <h1 className="font-headline-xl text-primary text-headline-xl" id="hero-heading">
                Dein Weg zur eigenen Solaranlage
              </h1>
              <p className="font-body-lg text-on-surface-variant text-body-lg max-w-xl">
                Entdecke das Potenzial deines Daches. Prüfe jetzt unverbindlich die Verfügbarkeit und starte in eine nachhaltige, kosteneffiziente Zukunft.
              </p>
            </div>

            <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-xl shadow-[0px_4px_20px_rgba(13,33,55,0.05)] border border-surface-container-highest flex flex-col gap-stack-md max-w-md relative overflow-hidden" id="configurator">
              <div aria-hidden="true" className="absolute top-0 left-0 w-full h-1 bg-secondary-container"></div>
              <div className="flex flex-col gap-2">
                <h2 className="font-headline-md text-primary text-headline-md">Verfügbarkeit prüfen</h2>
                <p className="font-body-md text-on-surface-variant text-body-md">Gib deine Postleitzahl ein, um zu starten.</p>
              </div>
              <form
                className="flex flex-col gap-stack-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  onStartConfig?.(zip);
                }}
              >
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-on-surface text-label-md" htmlFor="postal-code">Deine Postleitzahl</label>
                  <div className="relative">
                    <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">location_on</span>
                    <input
                      className="w-full pl-12 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all font-body-md text-on-surface placeholder:text-outline shadow-sm"
                      id="postal-code"
                      maxLength={5}
                      name="zip"
                      pattern="[0-9]{5}"
                      placeholder="z.B. 10115"
                      required
                      type="text"
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  className="w-full bg-secondary-container text-on-secondary-container py-4 rounded-lg font-headline-md text-base shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
                  type="submit"
                >
                  Jetzt berechnen
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </form>
              <div className="flex items-center justify-center gap-2 mt-2 pt-4 border-t border-surface-container-high">
                <span aria-hidden="true" className="material-symbols-outlined text-outline text-[16px]">lock</span>
                <span className="font-caption text-outline text-caption">100% Datenschutz gem. DSGVO</span>
              </div>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden shadow-[0px_8px_30px_rgba(13,33,55,0.1)] order-first lg:order-last">
            <div 
              aria-label="Modern home with solar panels on the roof under a clear blue sky" 
              className="absolute inset-0 bg-cover bg-center" 
              role="img" 
              style={{ backgroundImage: `url('${IMAGES.hero}')` }}
            ></div>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>
            <div className="absolute bottom-6 left-6 bg-surface-container-lowest/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-white/20 flex items-center gap-4 animate-fade-in-up">
              <div className="w-12 h-12 bg-primary-fixed rounded-full flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-primary fill text-[24px]">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-primary text-headline-md leading-none">Bis zu 80%</span>
                <span className="font-caption text-on-surface-variant text-caption mt-1">Stromkosten sparen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Referenzprojekte */}
      <section aria-label="Referenzprojekte" className="max-w-container-max mx-auto px-6 py-14 mt-4">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">Echte Ergebnisse</p>
          <h2 className="text-2xl md:text-3xl font-black text-primary mb-3">Was unsere Kunden erreicht haben</h2>
          <p className="text-slate-500 text-base max-w-xl mx-auto">Verifizierte Ergebnisse aus abgeschlossenen Projekten auf der Plattform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Familie Mayer',     city: 'München, Bayern',         kwp: 12.4, savings: 1_240, amort: 7,  rating: 5, roof: 'Satteldach SW', date: 'März 2026',   badge: 'Mit KfW 270 finanziert' },
            { name: 'Thomas Becker',     city: 'Hamburg, HH',             kwp: 9.8,  savings: 980,  amort: 8,  rating: 5, roof: 'Flachdach S',   date: 'Februar 2026', badge: 'Eigenkapital' },
            { name: 'Petra & Klaus W.', city: 'Stuttgart, Baden-Württemberg', kwp: 15.2, savings: 1_520, amort: 6, rating: 5, roof: 'Pultdach SO', date: 'April 2026',   badge: 'Inkl. Batteriespeicher' },
          ].map(({ name, city, kwp, savings, amort, rating, roof, date, badge }) => (
            <div key={name} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-4 hover:shadow-md hover:border-secondary/40 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-primary text-base">{name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{city} · {date}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: rating }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-secondary text-[16px] fill">star</span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Anlage', value: `${kwp} kWp` },
                  { label: 'Ersparnis', value: `${savings.toLocaleString('de-DE')} €/J` },
                  { label: 'Amort.', value: `${amort} Jahre` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">{label}</p>
                    <p className="font-black text-primary text-sm">{value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{roof}</span>
                <span className="bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full border border-green-100 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] fill">verified</span>
                  {badge}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust-Siegel */}
      <section aria-label="Zertifizierungen und Qualitätsmerkmale" className="max-w-container-max mx-auto px-6 py-10 mt-4">
        <p className="text-center text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-6">
          Geprüfte Qualität & Sicherheit
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
          {[
            { icon: 'verified',        label: 'TÜV-geprüft',       sub: 'Qualitätssicherung' },
            { icon: 'electric_bolt',   label: 'VDE-konform',        sub: 'Elektrische Sicherheit' },
            { icon: 'engineering',     label: 'Meisterbetriebe',    sub: 'Zertifizierte Fachkräfte' },
            { icon: 'shield_lock',     label: 'DSGVO-konform',      sub: '100 % Datenschutz' },
            { icon: 'wb_sunny',        label: 'BSW Solar',          sub: 'Bundesverband Solarwirtschaft' },
            { icon: 'euro_symbol',     label: '0 % MwSt.',          sub: 'Automatisch eingerechnet' },
          ].map(({ icon, label, sub }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 text-center w-24">
              <div className="w-12 h-12 rounded-xl bg-surface-container border border-surface-container-highest flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-secondary-container text-[22px] fill">{icon}</span>
              </div>
              <span className="font-bold text-primary text-xs">{label}</span>
              <span className="text-[10px] text-on-surface-variant leading-tight">{sub}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
    </>
  );
};
