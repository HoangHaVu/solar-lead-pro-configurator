import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, CheckCircle, ArrowRight, AlertCircle, Phone, Mail, Building2, MapPin, MessageSquare, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const BetaSignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName]   = useState('');
  const [contactName, setContactName]   = useState('');
  const [email, setEmail]               = useState('');
  const [phone, setPhone]               = useState('');
  const [zip, setZip]                   = useState('');
  const [message, setMessage]           = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase.from('beta_requests').insert({
        company_name: companyName.trim(),
        contact_name: contactName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        zip: zip.trim() || null,
        message: message.trim() || null,
      });

      if (dbError) throw new Error(dbError.message);

      // E-Mail-Benachrichtigung fire-and-forget
      supabase.functions.invoke('notify-beta', {
        body: { company_name: companyName, contact_name: contactName, email, phone, zip, message },
      }).catch(() => {/* ignorieren — Daten sind in DB */});

      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Etwas ist schiefgelaufen. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Mini-Nav */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-primary text-lg">
          <Sun className="w-6 h-6 text-secondary" />
          SolarKonfigurator
        </Link>
        <Link to="/login" className="text-sm font-bold text-slate-400 hover:text-primary transition-colors">
          Bereits registriert? Anmelden
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          {/* Linke Spalte — Info */}
          <div className="bg-primary text-white p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at top right, #F59E0B, transparent 60%)' }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-3 py-1 text-xs font-bold text-secondary uppercase tracking-widest mb-8">
                ⭐ Beta-Programm
              </div>
              <h1 className="text-3xl font-black text-white mb-4 leading-tight">
                Werde einer der ersten Beta-Partner
              </h1>
              <p className="text-white/70 mb-10 leading-relaxed">
                Kein Account-Setup, kein Passwort. Hinterlasse einfach deine Kontaktdaten — wir melden uns persönlich bei dir.
              </p>

              <ul className="space-y-5">
                {[
                  { icon: '🎯', title: 'Kostenloser Zugang', text: '30 Tage vollständiger Zugriff ohne Kreditkarte.' },
                  { icon: '📞', title: 'Persönliches Onboarding', text: 'Wir richten alles gemeinsam mit dir ein.' },
                  { icon: '💡', title: 'Direkter Einfluss', text: 'Dein Feedback formt das Produkt.' },
                ].map(item => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="text-2xl leading-none mt-0.5">{item.icon}</span>
                    <div>
                      <p className="font-bold text-white text-sm">{item.title}</p>
                      <p className="text-white/60 text-xs mt-0.5">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="relative text-xs text-white/30 mt-10">
              Wir geben deine Daten nicht weiter. Versprochen.
            </p>
          </div>

          {/* Rechte Spalte — Formular */}
          <div className="p-10">
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-8">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-black text-primary">Danke, {contactName.split(' ')[0]}!</h2>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                  {phone
                    ? <>Wir melden uns in Kürze telefonisch bei dir unter <strong className="text-primary">{phone}</strong>.</>
                    : <>Wir melden uns per E-Mail bei dir unter <strong className="text-primary">{email}</strong>.</>
                  }
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 text-sm font-bold text-slate-400 hover:text-primary transition-colors"
                >
                  ← Zurück zur Startseite
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-black text-primary mb-1">Kontaktdaten hinterlassen</h2>
                <p className="text-sm text-slate-400 mb-8">Kein Passwort, kein Abo — nur ein kurzer Anruf.</p>

                {error && (
                  <div className="flex items-center gap-2 bg-red-50 text-red-700 border border-red-200 rounded-xl px-4 py-3 text-sm mb-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Firma *</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          className="w-full bg-slate-50 border border-slate-200 text-primary rounded-xl pl-9 pr-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                          placeholder="Mustermann GmbH"
                          type="text"
                          required
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          className="w-full bg-slate-50 border border-slate-200 text-primary rounded-xl pl-9 pr-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                          placeholder="Max Mustermann"
                          type="text"
                          required
                          value={contactName}
                          onChange={e => setContactName(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                      Handynummer <span className="text-secondary normal-case tracking-normal font-bold">— für Rückruf (empfohlen)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                      <input
                        className="w-full bg-slate-50 border-2 border-secondary/30 text-primary rounded-xl pl-9 pr-3 py-3 text-sm focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-colors font-medium"
                        placeholder="+49 171 1234567"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">E-Mail *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          className="w-full bg-slate-50 border border-slate-200 text-primary rounded-xl pl-9 pr-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                          placeholder="max@firma.de"
                          type="email"
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">PLZ</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          className="w-full bg-slate-50 border border-slate-200 text-primary rounded-xl pl-9 pr-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors"
                          placeholder="12345"
                          type="text"
                          value={zip}
                          onChange={e => setZip(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-widest">
                      Kurze Nachricht <span className="normal-case tracking-normal font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 text-primary rounded-xl pl-9 pr-3 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-colors resize-none h-20"
                        placeholder="z.B. Wie viele Leads habt ihr pro Monat? Welche Region?"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-secondary text-primary font-black py-3.5 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {isSubmitting ? (
                      <Sun className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Jetzt als Beta-Tester bewerben
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    Kein Abo · Keine Kreditkarte · Jederzeit kündbar
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
