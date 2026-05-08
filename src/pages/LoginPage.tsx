import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Shield, Zap, BadgeCheck, Sun, AlertCircle, Crown } from 'lucide-react';
import { SEO } from '../components/SEO';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Weiterleiten wenn User bereits eingeloggt
  useEffect(() => {
    if (!isLoading && user) {
      const dest = user.role === 'owner' ? '/stats'
        : user.role === 'installer' ? '/pipeline'
        : '/dashboard';
      navigate(dest, { replace: true });
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Anmeldung fehlgeschlagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <SEO title="Anmelden" noindex />
    <div className="min-h-screen bg-background text-on-background flex flex-col font-body-md">
      <main className="flex-grow flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none flex">
          <div className="w-1/2 h-full bg-surface-container-low hidden lg:block"></div>
          <div
            className="w-full lg:w-1/2 h-full bg-cover bg-center relative"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCz3xK-zzX-X8BGuM6-VC22IPae7Q-vzcpxcg8Uk_aSamv8s8Htn89mJ67f8gk3k1yHejcForFIVNrq6c_Vdmmt3KyZtW6Od6DwvQhNW6t9G58qUgSNGsPrZc_ElllAf-w-63_j9Abhcil55tfv3V_aOSw7fYp00AOBobqp4vAHZbus8sEFClfUS87wusbZs0OfVpqHoLT93jYVsG6Vlzc0v_H_KqbnRmGcpsb_A7CHIV_CdNt5D0xSpG7bN5BmWIKDLEtgQwnBeww')" }}
          >
            <div className="absolute inset-0 bg-primary-container/80 mix-blend-multiply"></div>
          </div>
        </div>

        <div className="z-10 w-full max-w-[1000px] bg-surface rounded-xl shadow-[0_4px_30px_rgba(13,33,55,0.1)] overflow-hidden flex flex-col lg:flex-row relative">
          {/* Left: Login Form */}
          <div className="w-full lg:w-1/2 p-8 lg:p-card-padding flex flex-col justify-center bg-surface">
            <div className="mb-stack-lg">
              <h1 className="font-headline-lg text-3xl text-primary-container mb-2 tracking-tighter font-bold">Willkommen zurück</h1>
              <p className="font-body-md text-outline">Bitte melde dich an, um fortzufahren.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {error && (
                <div className="flex items-center gap-2 bg-error-container text-on-error-container rounded-lg px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm text-primary-container mb-2 font-semibold" htmlFor="email">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                    id="email"
                    type="email"
                    placeholder="name@beispiel.de"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm text-primary-container font-semibold" htmlFor="password">Passwort</label>
                  <a className="text-xs text-secondary hover:underline font-medium" href="#">Passwort vergessen?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Dev-Schnellzugang */}
              <div className="flex gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest shrink-0 mt-1">Dev</span>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => { setEmail('testkunde@test.de'); setPassword('Test123456'); }}
                    className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Testkunde
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('installateur@test.de'); setPassword('Test123456'); }}
                    className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Testinstallateur
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEmail('inhaber@test.de'); setPassword('Test123456'); }}
                    className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                  >
                    <Crown className="w-3 h-3" />
                    Test Inhaber
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  className="w-full py-3 px-6 bg-secondary text-white hover:bg-secondary/90 font-bold rounded-lg transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Anmelden…' : 'Anmelden'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-xs text-outline mt-3">
                  Du wirst automatisch zum richtigen Dashboard weitergeleitet.
                </p>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-outline">
              Noch kein Konto?{' '}
              <Link to="/register" className="text-secondary font-semibold hover:underline">Jetzt registrieren</Link>
            </p>

            <div className="mt-6 flex items-center justify-center gap-2 text-outline lg:hidden">
              <Shield className="text-secondary w-5 h-5" />
              <span className="text-xs">100% Datenschutz nach DSGVO</span>
            </div>
          </div>

          {/* Right: Brand Panel */}
          <div className="hidden lg:flex w-1/2 p-8 flex-col justify-between text-white bg-primary relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, #F59E0B 0%, transparent 50%)" }}></div>
            <div>
              <div className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-2">
                <Sun className="text-secondary w-8 h-8" />
                SolarKonfigurator
              </div>
              <div className="space-y-6 mt-12">
                <div className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg h-fit backdrop-blur-sm border border-white/20">
                    <Zap className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-1">Schnelle Planung</h3>
                    <p className="text-xs text-white/70">Dein Projekt in Rekordzeit konfiguriert.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="bg-white/10 p-3 rounded-lg h-fit backdrop-blur-sm border border-white/20">
                    <BadgeCheck className="text-secondary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold mb-1">Geprüfte Qualität</h3>
                    <p className="text-xs text-white/70">Nur zertifizierte Komponenten.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-white/80 bg-white/10 py-3 px-4 rounded-lg backdrop-blur-sm w-fit border border-white/10">
              <Shield className="text-secondary w-5 h-5" />
              <span className="text-xs font-medium">100% Datenschutz nach DSGVO</span>
            </div>
          </div>
        </div>
      </main>
    </div>
    </>
  );
};
