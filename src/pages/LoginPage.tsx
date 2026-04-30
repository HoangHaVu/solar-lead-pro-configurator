import React from 'react';
import { Mail, Lock, Engineering, ArrowForward, Shield, Zap, Verified, Sun } from 'lucide-react';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      <main className="flex-grow flex items-center justify-center p-6 relative">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex">
          <div className="w-1/2 h-full bg-surface-container-low hidden lg:block"></div>
          <div className="w-full lg:w-1/2 h-full bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCz3xK-zzX-X8BGuM6-VC22IPae7Q-vzcpxcg8Uk_aSamv8s8Htn89mJ67f8gk3k1yHejcForFIVNrq6c_Vdmmt3KyZtW6Od6DwvQhNW6t9G58qUgSNGsPrZc_ElllAf-w-63_j9Abhcil55tfv3V_aOSw7fYp00AOBobqp4vAHZbus8sEFClfUS87wusbZs0OfVpqHoLT93jYVsG6Vlzc0v_H_KqbnRmGcpsb_A7CHIV_CdNt5D0xSpG7bN5BmWIKDLEtgQwnBeww')" }}>
            <div className="absolute inset-0 bg-primary-container/80 mix-blend-multiply"></div>
          </div>
        </div>

        <div className="z-10 w-full max-w-[1000px] bg-surface rounded-xl shadow-[0_4px_30px_rgba(13,33,55,0.1)] overflow-hidden flex flex-col lg:flex-row relative">
          {/* Left Side: Login Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-card-padding flex flex-col justify-center bg-surface">
            <div className="mb-stack-lg">
              <h1 className="font-headline-lg text-3xl text-primary-container mb-2 tracking-tighter font-bold">Willkommen zurück</h1>
              <p className="font-body-md text-outline">Bitte melde dich an, um fortzufahren.</p>
            </div>

            <form className="space-y-6">
              {/* E-Mail Input */}
              <div>
                <label className="block font-label-md text-sm text-primary-container mb-2 font-semibold" htmlFor="email">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                    id="email"
                    name="email"
                    placeholder="name@beispiel.de"
                    required
                    type="email"
                  />
                </div>
              </div>

              {/* Passwort Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block font-label-md text-sm text-primary-container font-semibold" htmlFor="password">Passwort</label>
                  <a className="text-xs text-secondary hover:underline font-medium transition-colors" href="#">Passwort vergessen?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type="password"
                  />
                </div>
              </div>

              {/* Angemeldet bleiben */}
              <div className="flex items-center">
                <input
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary bg-surface"
                  id="remember"
                  name="remember"
                  type="checkbox"
                />
                <label className="ml-2 block text-sm text-outline" htmlFor="remember">Angemeldet bleiben</label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-4">
                <button
                  className="w-full py-3 px-6 bg-secondary text-white hover:bg-secondary/90 font-bold rounded-lg transition-all shadow-lg flex justify-center items-center gap-2"
                  type="submit"
                >
                  Als Kunde anmelden
                  <ArrowForward className="w-4 h-4" />
                </button>
                <button
                  className="w-full py-3 px-6 bg-surface border-2 border-primary text-primary hover:bg-surface-container-low font-bold rounded-lg transition-colors flex justify-center items-center gap-2"
                  type="button"
                >
                  Als Installateur anmelden
                  <Engineering className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* GDPR Badge inside form area for mobile */}
            <div className="mt-8 flex items-center justify-center gap-2 text-outline lg:hidden">
              <Shield className="text-secondary w-5 h-5 fill-secondary/20" />
              <span className="text-xs">100% Datenschutz nach DSGVO</span>
            </div>
          </div>

          {/* Right Side: Value Proposition / Brand (Hidden on Mobile) */}
          <div className="hidden lg:flex w-1/2 p-8 flex-col justify-between text-white bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #fea619 0%, transparent 50%)" }}></div>
            <div>
              <div className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-2">
                <Sun className="text-secondary w-8 h-8 fill-secondary" />
                SolarKonfigurator
              </div>
              <div className="space-y-6 mt-12">
                <div className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg h-fit backdrop-blur-sm border border-white/20">
                    <Zap className="text-secondary w-6 h-6 fill-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-1">Schnelle Planung</h3>
                    <p className="text-xs text-white/70">Dein Projekt in Rekordzeit konfiguriert.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg h-fit backdrop-blur-sm border border-white/20">
                    <Verified className="text-secondary w-6 h-6 fill-secondary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-1">Geprüfte Qualität</h3>
                    <p className="text-xs text-white/70">Nur zertifizierte Komponenten.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 bg-white/10 py-3 px-4 rounded-lg backdrop-blur-sm w-fit border border-white/10">
              <Shield className="text-secondary w-5 h-5 fill-secondary" />
              <span className="text-xs font-medium">100% Datenschutz nach DSGVO</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
