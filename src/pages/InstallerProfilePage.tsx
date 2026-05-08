import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Sun, MapPin, Phone, Mail, Globe, ShieldCheck, ArrowRight, ChevronLeft } from 'lucide-react';
import { fetchInstallerPublicProfile, type InstallerPublicProfile } from '../services/data';
import { SEO } from '../components/SEO';

export const InstallerProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<InstallerPublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) { setNotFound(true); setLoading(false); return; }
    fetchInstallerPublicProfile(id)
      .then((p) => {
        if (!p) setNotFound(true);
        else setProfile(p);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Sun className="w-10 h-10 text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <p className="text-xl font-bold text-slate-600">Profil nicht gefunden</p>
        <Link to="/" className="text-primary underline text-sm">Zurück zur Startseite</Link>
      </div>
    );
  }

  const displayName = profile.company_name || profile.full_name;
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <>
      <SEO
        title={`${displayName} — Solarinstallateur`}
        description={profile.bio ?? `${displayName} ist zertifizierter Solarinstallateur. Jetzt kostenloses PV-Angebot anfragen.`}
        canonical={`/installer/${id}`}
        noindex={false}
      />

      {/* Header */}
      <header className="bg-[#0D2137] text-white py-4 px-6 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-white/60 hover:text-white flex items-center gap-1 text-sm transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Zurück
        </button>
        <span className="text-white/30">|</span>
        <Link to="/" className="flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-sm">SolarKonfigurator</span>
        </Link>
      </header>

      <main className="min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 py-12">

          {/* Profil-Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 overflow-hidden mb-8">
            {/* Farbige Kopfleiste */}
            <div className="h-24 bg-gradient-to-r from-[#0D2137] to-[#1a3a5c]" />

            <div className="px-8 pb-8">
              {/* Avatar */}
              <div className="flex items-end gap-5 -mt-10 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-yellow-400 flex items-center justify-center text-[#0D2137] font-black text-2xl shadow-lg ring-4 ring-white shrink-0">
                  {initials}
                </div>
                <div className="pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl font-black text-[#0D2137]">{displayName}</h1>
                    {profile.is_verified && (
                      <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" />
                        Verifiziert
                      </span>
                    )}
                  </div>
                  {profile.company_name && profile.full_name !== profile.company_name && (
                    <p className="text-slate-500 text-sm mt-0.5">{profile.full_name}</p>
                  )}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <p className="text-slate-600 leading-relaxed mb-6">{profile.bio}</p>
              )}

              {/* Kontakt-Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profile.zip && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium">PLZ {profile.zip}</span>
                  </div>
                )}
                {profile.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium">{profile.phone}</span>
                  </a>
                )}
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors"
                >
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-sm text-slate-600 font-medium truncate">{profile.email}</span>
                </a>
                {profile.website && (
                  <a
                    href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium truncate">{profile.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-yellow-400 to-amber-400 rounded-2xl p-8 text-center shadow-sm">
            <h2 className="text-2xl font-black text-[#0D2137] mb-2">
              Kostenloses PV-Angebot anfragen
            </h2>
            <p className="text-[#0D2137]/70 mb-6 text-sm">
              Konfiguriere deine Solaranlage in wenigen Minuten — {displayName} erstellt dir ein persönliches Angebot.
            </p>
            <Link
              to={`/configurator?installer=${id}`}
              className="inline-flex items-center gap-2 bg-[#0D2137] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#1a3a5c] transition-colors shadow-md"
            >
              Jetzt konfigurieren
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Footer-Link */}
          <p className="text-center text-xs text-slate-400 mt-8">
            Powered by{' '}
            <Link to="/" className="text-primary hover:underline font-medium">SolarKonfigurator</Link>
          </p>
        </div>
      </main>
    </>
  );
};
