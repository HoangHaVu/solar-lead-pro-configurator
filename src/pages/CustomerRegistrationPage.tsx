import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, ArrowLeft, Mail, Lock, ArrowRight, ShieldCheck, Info, User, AlertCircle, CheckCircle } from 'lucide-react';
import { SEO } from '../components/SEO';
import { signUpCustomer } from '../services/auth';

export const CustomerRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await signUpCustomer(email, password, `${firstName} ${lastName}`.trim());
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registrierung fehlgeschlagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <SEO title="Konto erstellen" noindex />
    <div className="bg-slate-50 min-h-screen flex flex-col font-body-md text-on-surface antialiased">
      <header className="w-full h-20 px-6 flex items-center justify-between max-w-[1200px] mx-auto">
        <Link to="/" className="flex items-center gap-2 group">
          <Sun className="text-secondary w-8 h-8" />
          <span className="text-2xl font-black text-primary tracking-tighter">SolarKonfigurator</span>
        </Link>
        <Link to="/login" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm">
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Login
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="w-full max-w-[520px]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-primary mb-2">Kunden-Konto erstellen</h1>
            <p className="text-slate-500">Sichere deinen Konfigurationsstand und erhalte dein persönliches Angebot.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200/50 p-8">
            {success ? (
              <div className="flex flex-col items-center gap-4 py-8 text-center">
                <CheckCircle className="w-14 h-14 text-secondary" />
                <h2 className="text-xl font-bold text-primary">Konto erstellt!</h2>
                <p className="text-slate-500 text-sm">Bitte bestätige deine E-Mail-Adresse. Danach kannst du dich anmelden.</p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-4 bg-secondary text-white font-bold px-6 py-3 rounded-lg hover:bg-secondary/90 transition-all"
                >
                  Zum Login
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-lg px-4 py-3 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-500" htmlFor="vorname">Vorname</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        className="h-12 w-full pl-10 pr-4 rounded-lg border border-slate-200 bg-white text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                        id="vorname"
                        type="text"
                        placeholder="Max"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-500" htmlFor="nachname">Nachname</label>
                    <input
                      className="h-12 px-4 rounded-lg border border-slate-200 bg-white text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      id="nachname"
                      type="text"
                      placeholder="Mustermann"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-500" htmlFor="email">E-Mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      className="h-12 w-full pl-11 pr-4 rounded-lg border border-slate-200 bg-white text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      id="email"
                      type="email"
                      placeholder="max.mustermann@beispiel.de"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Info className="w-4 h-4 text-secondary" />
                    Wir senden dir eine Bestätigungs-E-Mail
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-500" htmlFor="password">Passwort setzen</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      className="h-12 w-full pl-11 pr-4 rounded-lg border border-slate-200 bg-white text-primary focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      id="password"
                      type="password"
                      placeholder="Mindestens 6 Zeichen"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  className="h-14 mt-4 w-full bg-secondary text-primary rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all shadow-md active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Konto wird erstellt…' : 'Konto erstellen'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {!success && (
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <span className="text-xs">100% Datenschutz nach DSGVO. Deine Daten sind sicher.</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
    </>
  );
};
