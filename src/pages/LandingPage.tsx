import React from 'react';
import { IMAGES } from '../data/mockData';

interface LandingPageProps {
  onStartConfig?: (zip: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartConfig }) => {
  const [zip, setZip] = React.useState('');

  return (
    <main className="pt-24 pb-section-padding min-h-screen">
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
    </main>
  );
};
