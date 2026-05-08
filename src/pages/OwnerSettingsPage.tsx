import React, { useState, useRef, useEffect } from 'react';
import {
  Crown, Palette, Building2, Zap, Calculator, Euro, Loader2,
  CheckCircle, Upload, RotateCcw, Sun, TrendingUp, Percent,
  CreditCard, Clock, Tag, Plus, Trash2, ToggleLeft, ToggleRight,
  AlertTriangle, XCircle, Link, Copy, Globe, User,
} from 'lucide-react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { OfferPreviewCard } from '../components/sections/OfferPreviewCard';
import { InvoicePreviewCard } from '../components/sections/InvoicePreviewCard';
import {
  fetchOwnerDiscountCodes, createDiscountCode, toggleDiscountCode, deleteDiscountCode,
  fetchPendingDiscountRequests, resolveDiscountRequest,
  type DiscountCode, type Lead,
} from '../services/data';

const STORAGE_KEY = 'owner_settings_v1';

interface OwnerSettings {
  firmenname: string;
  slogan: string;
  logoDataUrl: string;
  primaryColor: string;
  accentColor: string;
  mindestpreis: string;
  marge: string;
  iban: string;
  zahlungsziel: string;
  panelHersteller: string;
  wechselrichterHersteller: string;
  strompreis: string;
  strompreissteigerung: string;
  kfwZinssatz: string;
  eigenverbrauch: string;
  co2Faktor: string;
  plzGebiete: string;
  maxEntfernung: string;
  // Rechnungs-Pflichtangaben
  steuernummer: string;
  adresse: string;
  ort: string;
  geschaeftsfuehrer: string;
  rechnungskreis: string;
}

const DEFAULTS: OwnerSettings = {
  firmenname: 'SolarKonfigurator',
  slogan: 'Ihre Solaranlage — einfach konfiguriert.',
  logoDataUrl: '',
  primaryColor: '#1e3a5f',
  accentColor: '#f5c842',
  mindestpreis: '12000',
  marge: '18',
  iban: '',
  zahlungsziel: '14',
  panelHersteller: 'Heckert Solar, JA Solar, Trina Solar',
  wechselrichterHersteller: 'SMA, Fronius, Huawei',
  strompreis: '32',
  strompreissteigerung: '3',
  kfwZinssatz: '5.25',
  eigenverbrauch: '65',
  co2Faktor: '0.38',
  plzGebiete: '',
  maxEntfernung: '80',
  steuernummer: '',
  adresse: '',
  ort: '',
  geschaeftsfuehrer: '',
  rechnungskreis: 'RE',
};

function loadSettings(): OwnerSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { ...DEFAULTS };
}

function saveSettingsToStorage(s: OwnerSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}
const Field: React.FC<FieldProps> = ({ label, hint, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700">{label}</label>
    {children}
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </div>
);

const inputCls = 'w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:border-amber-400';

export const OwnerSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<OwnerSettings>(loadSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Öffentliche Profil-Felder (aus Supabase profiles)
  const [profileCompanyName, setProfileCompanyName] = useState('');
  const [profileWebsite, setProfileWebsite] = useState('');
  const [profileBio, setProfileBio] = useState('');

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('company_name, website, bio').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setProfileCompanyName(data.company_name ?? '');
          setProfileWebsite(data.website ?? '');
          setProfileBio(data.bio ?? '');
        }
      });
  }, [user]);

  const profileUrl = user ? `${window.location.origin}/installer/${user.id}` : '';

  function copyProfileLink() {
    navigator.clipboard.writeText(profileUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }

  // Rabatt-Codes State
  const [ownerCodes, setOwnerCodes] = useState<DiscountCode[]>([]);
  const [codesLoading, setCodesLoading] = useState(true);
  const [newCode, setNewCode] = useState({ code: '', label: '', percentage: '' });
  const [isAddingCode, setIsAddingCode] = useState(false);

  // Offene Anfragen State
  const [pendingRequests, setPendingRequests] = useState<Lead[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchOwnerDiscountCodes(user.id)
      .then(setOwnerCodes)
      .catch(console.error)
      .finally(() => setCodesLoading(false));
    fetchPendingDiscountRequests()
      .then(setPendingRequests)
      .catch(console.error)
      .finally(() => setRequestsLoading(false));
  }, [user]);

  async function handleAddCode() {
    if (!user || !newCode.code || !newCode.percentage) return;
    setIsAddingCode(true);
    try {
      const created = await createDiscountCode({
        createdBy: user.id,
        code: newCode.code.toUpperCase(),
        label: newCode.label || undefined,
        percentage: parseFloat(newCode.percentage),
      });
      setOwnerCodes((prev) => [...prev, created]);
      setNewCode({ code: '', label: '', percentage: '' });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingCode(false);
    }
  }

  async function handleToggleCode(id: string, active: boolean) {
    await toggleDiscountCode(id, active);
    setOwnerCodes((prev) => prev.map((c) => c.id === id ? { ...c, active } : c));
  }

  async function handleDeleteCode(id: string) {
    await deleteDiscountCode(id);
    setOwnerCodes((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleResolveRequest(leadId: string, approved: boolean) {
    setResolvingId(leadId);
    try {
      await resolveDiscountRequest(leadId, approved);
      setPendingRequests((prev) => prev.filter((r) => r.id !== leadId));
    } finally {
      setResolvingId(null);
    }
  }

  function update<K extends keyof OwnerSettings>(key: K, value: OwnerSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => update('logoDataUrl', ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function resetLogo() {
    update('logoDataUrl', '');
    if (logoInputRef.current) logoInputRef.current.value = '';
  }

  async function save() {
    setSaveStatus('saving');
    saveSettingsToStorage(settings);
    if (user) {
      await supabase.from('profiles').update({
        company_name: profileCompanyName || null,
        website: profileWebsite || null,
        bio: profileBio || null,
      }).eq('id', user.id);
    }
    setSaveStatus('success');
    setTimeout(() => setSaveStatus('idle'), 2500);
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />

      <main className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />

        {/* Header */}
        <div className="px-4 md:px-8 py-6 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Inhaber-Konfiguration</h2>
              <p className="text-sm text-slate-500">Branding, Kalkulationsparameter & Regionseinstellungen</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 md:px-8 py-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Öffentliches Profil & Share-Link ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-1">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Link className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Öffentliches Profil</h3>
              <span className="ml-auto text-xs text-slate-400">Sichtbar für Kunden</span>
            </div>
            <div className="px-6 py-6 space-y-5">

              {/* Share-Link */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Dein Profil-Link</label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 font-mono truncate">
                    {profileUrl}
                  </div>
                  <button
                    onClick={copyProfileLink}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border font-semibold text-sm transition-colors shrink-0 ${
                      linkCopied
                        ? 'bg-green-50 border-green-200 text-green-700'
                        : 'border-slate-200 hover:bg-slate-50 text-primary'
                    }`}
                  >
                    {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {linkCopied ? 'Kopiert!' : 'Kopieren'}
                  </button>
                </div>
                <p className="text-xs text-slate-400">Teile diesen Link mit Kunden — sie sehen dein Profil und können direkt ein Angebot anfragen.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Firmenname (öffentlich)" hint="Erscheint auf deiner Profilseite">
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={profileCompanyName}
                      onChange={(e) => setProfileCompanyName(e.target.value)}
                      className={`${inputCls} pl-9`}
                      placeholder="Muster Solar GmbH"
                    />
                  </div>
                </Field>
                <Field label="Website" hint="Wird auf der Profilseite verlinkt">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="url"
                      value={profileWebsite}
                      onChange={(e) => setProfileWebsite(e.target.value)}
                      className={`${inputCls} pl-9`}
                      placeholder="https://muster-solar.de"
                    />
                  </div>
                </Field>
              </div>

              <Field label="Kurzbeschreibung" hint="Max. 3 Sätze — erklärt Kunden wer du bist">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className={`${inputCls} pl-9 resize-none h-24`}
                    placeholder="Wir sind ein erfahrener Solarbetrieb aus München mit über 500 installierten Anlagen seit 2012."
                    maxLength={400}
                  />
                </div>
                <p className="text-xs text-slate-400 text-right">{profileBio.length}/400</p>
              </Field>
            </div>
          </section>

          {/* ── Firmenprofil ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-1">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Firmenprofil</h3>
            </div>
            <div className="px-6 py-6 space-y-5">

              {/* Logo */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Firmen-Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 overflow-hidden shrink-0">
                    {settings.logoDataUrl
                      ? <img src={settings.logoDataUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                      : <Sun className="w-8 h-8 text-slate-300" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => logoInputRef.current?.click()}
                      className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-primary font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Upload className="w-4 h-4" />
                      Logo hochladen
                    </button>
                    {settings.logoDataUrl && (
                      <button
                        onClick={resetLogo}
                        className="flex items-center gap-2 text-slate-400 hover:text-red-500 text-xs font-medium transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Zurücksetzen
                      </button>
                    )}
                    <p className="text-xs text-slate-400">PNG, SVG, max. 2 MB — ideal 200×200 px</p>
                  </div>
                </div>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Firmenname">
                  <input
                    type="text"
                    value={settings.firmenname}
                    onChange={(e) => update('firmenname', e.target.value)}
                    className={inputCls}
                    placeholder="Muster Solar GmbH"
                  />
                </Field>
                <Field label="Slogan" hint="Erscheint unter dem Firmennamen im Angebot">
                  <input
                    type="text"
                    value={settings.slogan}
                    onChange={(e) => update('slogan', e.target.value)}
                    className={inputCls}
                    placeholder="Ihr Partner für Solarenergie"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* ── Branding ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-2">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Palette className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Branding & Farben</h3>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Primärfarbe" hint="Wird in Headern, Buttons und Texten verwendet">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => update('primaryColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer p-1 bg-white"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => update('primaryColor', e.target.value)}
                      className={`${inputCls} flex-1`}
                      placeholder="#1e3a5f"
                    />
                  </div>
                </Field>
                <Field label="Akzentfarbe" hint="Hervorhebungen, Badges, Buttons sekundär">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => update('accentColor', e.target.value)}
                      className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer p-1 bg-white"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => update('accentColor', e.target.value)}
                      className={`${inputCls} flex-1`}
                      placeholder="#f5c842"
                    />
                  </div>
                </Field>
              </div>

              {/* Live-Vorschau */}
              <div className="mt-5 rounded-lg border border-slate-200 overflow-hidden">
                <div
                  className="px-5 py-3 text-white text-sm font-bold"
                  style={{ backgroundColor: settings.primaryColor }}
                >
                  {settings.firmenname || 'Ihr Firmenname'}
                </div>
                <div className="px-5 py-3 bg-slate-50 flex items-center gap-3">
                  <span
                    className="text-xs font-bold px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    Angebot erstellt
                  </span>
                  <span className="text-xs text-slate-500">Vorschau der Farbkombination</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Angebots-Konfiguration ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden lg:col-span-1">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Angebots-Konfiguration</h3>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Mindestpreis (€)" hint="Angebote unter diesem Wert werden nicht erstellt">
                  <div className="relative">
                    <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={settings.mindestpreis}
                      onChange={(e) => update('mindestpreis', e.target.value)}
                      className={`${inputCls} pl-9`}
                      min="0"
                      step="500"
                    />
                  </div>
                </Field>
                <Field label="Standard-Marge (%)" hint="Aufschlag auf die Einkaufskosten">
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={settings.marge}
                      onChange={(e) => update('marge', e.target.value)}
                      className={`${inputCls} pl-9`}
                      min="0"
                      max="100"
                      step="0.5"
                    />
                  </div>
                </Field>
                <Field label="Standard-IBAN" hint="Für Rechnungen und Zahlungshinweise">
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={settings.iban}
                      onChange={(e) => update('iban', e.target.value)}
                      className={`${inputCls} pl-9`}
                      placeholder="DE89 3704 0044 0532 0130 00"
                    />
                  </div>
                </Field>
                <Field label="Zahlungsziel (Tage)" hint="Standard-Frist auf Rechnungen">
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={settings.zahlungsziel}
                      onChange={(e) => update('zahlungsziel', e.target.value)}
                      className={`${inputCls} pl-9`}
                      min="0"
                      max="90"
                    />
                  </div>
                </Field>
              </div>

              <Field label="Panel-Hersteller" hint="Komma-getrennte Liste — erscheint im Angebot">
                <input
                  type="text"
                  value={settings.panelHersteller}
                  onChange={(e) => update('panelHersteller', e.target.value)}
                  className={inputCls}
                  placeholder="Heckert Solar, JA Solar, Trina Solar"
                />
              </Field>
              <Field label="Wechselrichter-Hersteller" hint="Komma-getrennte Liste">
                <input
                  type="text"
                  value={settings.wechselrichterHersteller}
                  onChange={(e) => update('wechselrichterHersteller', e.target.value)}
                  className={inputCls}
                  placeholder="SMA, Fronius, Huawei"
                />
              </Field>
            </div>
          </section>

          {/* ── Kalkulations-Parameter ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Calculator className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Kalkulations-Parameter</h3>
              <span className="ml-auto text-xs text-slate-400">Basis für Angebots- & ROI-Berechnung</span>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <Field label="Strompreis (ct/kWh)" hint="Aktueller Bezugspreis des Kunden">
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={settings.strompreis}
                      onChange={(e) => update('strompreis', e.target.value)}
                      className={`${inputCls} pl-9`}
                      min="0"
                      step="0.5"
                    />
                  </div>
                </Field>
                <Field label="Strompreissteigerung (%/Jahr)" hint="Jährliche Kostensteigerung">
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={settings.strompreissteigerung}
                      onChange={(e) => update('strompreissteigerung', e.target.value)}
                      className={`${inputCls} pl-9`}
                      min="0"
                      step="0.1"
                    />
                  </div>
                </Field>
                <Field label="KfW-Zinssatz (%)" hint="Effektivzins für Finanzierungsangebote">
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={settings.kfwZinssatz}
                      onChange={(e) => update('kfwZinssatz', e.target.value)}
                      className={`${inputCls} pl-9`}
                      min="0"
                      step="0.05"
                    />
                  </div>
                </Field>
                <Field label="Eigenverbrauchsquote (%)" hint="Anteil der selbst verbrauchten Energie">
                  <div className="relative">
                    <Sun className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={settings.eigenverbrauch}
                      onChange={(e) => update('eigenverbrauch', e.target.value)}
                      className={`${inputCls} pl-9`}
                      min="0"
                      max="100"
                    />
                  </div>
                </Field>
                <Field label="CO₂-Faktor (kg/kWh)" hint="Emissionsfaktor für CO₂-Einsparung">
                  <input
                    type="number"
                    value={settings.co2Faktor}
                    onChange={(e) => update('co2Faktor', e.target.value)}
                    className={inputCls}
                    min="0"
                    step="0.01"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* ── Region & Verfügbarkeit ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Building2 className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Region & Verfügbarkeit</h3>
            </div>
            <div className="px-6 py-6 space-y-5">
              <Field
                label="Bediente PLZ-Gebiete"
                hint="Komma-getrennte Postleitzahlen oder Präfixe (z. B. 80, 81, 82) — leer = überregional"
              >
                <textarea
                  value={settings.plzGebiete}
                  onChange={(e) => update('plzGebiete', e.target.value)}
                  className={`${inputCls} resize-none h-20`}
                  placeholder="80, 81, 82, 83, 84, 85"
                />
              </Field>
              <Field label="Max. Entfernung (km)" hint="Maximaler Einsatzradius vom Firmenstandort">
                <input
                  type="number"
                  value={settings.maxEntfernung}
                  onChange={(e) => update('maxEntfernung', e.target.value)}
                  className={inputCls}
                  min="0"
                  step="5"
                />
              </Field>
            </div>
          </section>

          {/* ── Rabatt-Codes ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Tag className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Rabatt-Codes</h3>
              <span className="ml-auto text-xs text-slate-400">
                {ownerCodes.filter((c) => c.active).length} aktiv
              </span>
            </div>
            <div className="px-6 py-6 space-y-5">

              {/* Neuen Code hinzufügen */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Code">
                  <input
                    type="text"
                    value={newCode.code}
                    onChange={(e) => setNewCode((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                    className={inputCls}
                    placeholder="SOLAR10"
                  />
                </Field>
                <Field label="Bezeichnung">
                  <input
                    type="text"
                    value={newCode.label}
                    onChange={(e) => setNewCode((p) => ({ ...p, label: e.target.value }))}
                    className={inputCls}
                    placeholder="Treue-Rabatt"
                  />
                </Field>
                <Field label="Rabatt (%)">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newCode.percentage}
                      onChange={(e) => setNewCode((p) => ({ ...p, percentage: e.target.value }))}
                      className={`${inputCls} flex-1`}
                      placeholder="10"
                      min="1"
                      max="50"
                    />
                    <button
                      onClick={handleAddCode}
                      disabled={isAddingCode || !newCode.code || !newCode.percentage}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 rounded-lg disabled:opacity-50 flex items-center gap-1 transition-colors shrink-0"
                    >
                      {isAddingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </button>
                  </div>
                </Field>
              </div>

              {/* Code-Liste */}
              {codesLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                </div>
              ) : ownerCodes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-4">Noch keine Codes erstellt.</p>
              ) : (
                <div className="space-y-2">
                  {ownerCodes.map((code) => (
                    <div
                      key={code.id}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-opacity ${code.active ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 opacity-50'}`}
                    >
                      <span className="font-mono font-bold text-primary text-sm w-24 shrink-0">{code.code}</span>
                      <span className="text-sm text-slate-500 flex-1 truncate">{code.label ?? '—'}</span>
                      <span className="text-sm font-bold text-amber-600 w-10 text-right shrink-0">{code.percentage}%</span>
                      <button
                        onClick={() => handleToggleCode(code.id, !code.active)}
                        className={`p-1 rounded transition-colors shrink-0 ${code.active ? 'text-green-500 hover:text-slate-400' : 'text-slate-300 hover:text-green-500'}`}
                        title={code.active ? 'Deaktivieren' : 'Aktivieren'}
                      >
                        {code.active
                          ? <ToggleRight className="w-5 h-5" />
                          : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <button
                        onClick={() => handleDeleteCode(code.id)}
                        className="p-1 rounded text-slate-300 hover:text-red-500 transition-colors shrink-0"
                        title="Löschen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Offene Rabatt-Anfragen ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Offene Rabatt-Anfragen</h3>
              {pendingRequests.length > 0 && (
                <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                  {pendingRequests.length} offen
                </span>
              )}
            </div>
            <div className="px-6 py-6">
              {requestsLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                </div>
              ) : pendingRequests.length === 0 ? (
                <div className="flex items-center justify-center gap-3 text-slate-400 py-4">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <p className="text-sm font-medium">Keine offenen Anfragen</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div key={req.id} className="flex items-center gap-4 p-4 border border-amber-100 bg-amber-50 rounded-xl">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-primary text-sm">{req.first_name} {req.last_name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Anfrage: <strong>{req.discount_percentage}% Rabatt</strong>
                          {req.investment != null && (
                            <> · Originalpreis: {req.investment.toLocaleString('de-DE')} €</>
                          )}
                          {req.final_price != null && (
                            <> → <strong>{req.final_price.toLocaleString('de-DE')} €</strong></>
                          )}
                        </p>
                        {req.discount_note && (
                          <p className="text-xs text-slate-400 mt-0.5 italic">„{req.discount_note}"</p>
                        )}
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveRequest(req.id, true)}
                          disabled={resolvingId === req.id}
                          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-3 py-2 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Genehmigen
                        </button>
                        <button
                          onClick={() => handleResolveRequest(req.id, false)}
                          disabled={resolvingId === req.id}
                          className="flex items-center gap-1.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-3 py-2 rounded-lg disabled:opacity-50 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Ablehnen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* ── Angebots-Vorschau ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Sun className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Angebots-Vorschau</h3>
              <span className="ml-auto text-xs text-slate-400">Aktualisiert live</span>
            </div>
            <div className="px-6 py-6 bg-slate-50">
              <p className="text-xs text-slate-400 text-center mb-5">
                So sieht dein Angebot für einen Musterkunden aus — ändere Einstellungen oben und sieh das Ergebnis sofort.
              </p>
              <OfferPreviewCard
                firmenname={settings.firmenname}
                slogan={settings.slogan}
                logoDataUrl={settings.logoDataUrl}
                primaryColor={settings.primaryColor}
                accentColor={settings.accentColor}
                iban={settings.iban}
                zahlungsziel={settings.zahlungsziel}
                panelHersteller={settings.panelHersteller}
                wechselrichterHersteller={settings.wechselrichterHersteller}
                marge={settings.marge}
              />
            </div>
          </section>

          {/* ── Rechtliche Pflichtangaben ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Rechtliche Pflichtangaben</h3>
              <span className="ml-auto text-xs text-slate-400">Pflicht auf Rechnungen (§ 14 UStG)</span>
            </div>
            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Steuernummer / USt-IdNr." hint="z. B. 123/456/78901 oder DE123456789">
                  <input
                    type="text"
                    value={settings.steuernummer}
                    onChange={(e) => update('steuernummer', e.target.value)}
                    className={inputCls}
                    placeholder="123/456/78901"
                  />
                </Field>
                <Field label="Rechnungsnummernkreis" hint="Präfix für Rechnungsnummern">
                  <input
                    type="text"
                    value={settings.rechnungskreis}
                    onChange={(e) => update('rechnungskreis', e.target.value)}
                    className={inputCls}
                    placeholder="RE"
                  />
                </Field>
                <Field label="Straße & Hausnummer">
                  <input
                    type="text"
                    value={settings.adresse}
                    onChange={(e) => update('adresse', e.target.value)}
                    className={inputCls}
                    placeholder="Musterstraße 1"
                  />
                </Field>
                <Field label="PLZ & Ort">
                  <input
                    type="text"
                    value={settings.ort}
                    onChange={(e) => update('ort', e.target.value)}
                    className={inputCls}
                    placeholder="80331 München"
                  />
                </Field>
                <Field label="Geschäftsführer" hint="Optional — bei GmbH Pflicht">
                  <input
                    type="text"
                    value={settings.geschaeftsfuehrer}
                    onChange={(e) => update('geschaeftsfuehrer', e.target.value)}
                    className={inputCls}
                    placeholder="Max Mustermann"
                  />
                </Field>
              </div>
            </div>
          </section>

          {/* ── Rechnungs-Vorschau ── */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Euro className="w-5 h-5 text-amber-500" />
              <h3 className="font-bold text-primary text-lg">Rechnungs-Vorschau</h3>
              <span className="ml-auto text-xs text-slate-400">Aktualisiert live</span>
            </div>
            <div className="px-6 py-6 bg-slate-50">
              <p className="text-xs text-slate-400 text-center mb-5">
                Musterrechnung mit deinen Einstellungen — inkl. 0 % MwSt. nach § 12 Abs. 3 UStG.
              </p>
              <InvoicePreviewCard
                firmenname={settings.firmenname}
                slogan={settings.slogan}
                logoDataUrl={settings.logoDataUrl}
                primaryColor={settings.primaryColor}
                accentColor={settings.accentColor}
                iban={settings.iban}
                zahlungsziel={settings.zahlungsziel}
                steuernummer={settings.steuernummer}
                adresse={settings.adresse}
                ort={settings.ort}
                geschaeftsfuehrer={settings.geschaeftsfuehrer}
                rechnungskreis={settings.rechnungskreis}
              />
            </div>
          </section>

          {/* ── Speichern ── */}
          <div className="flex items-center gap-4 pb-8 lg:col-span-2">
            <button
              onClick={save}
              disabled={saveStatus === 'saving'}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-lg transition-colors disabled:opacity-60 shadow-sm"
            >
              {saveStatus === 'saving'
                ? <><Loader2 className="w-4 h-4 animate-spin" />Speichern…</>
                : 'Einstellungen speichern'}
            </button>
            {saveStatus === 'success' && (
              <span className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                <CheckCircle className="w-5 h-5" />
                Gespeichert
              </span>
            )}
          </div>

        </div>
        </div>
      </main>
    </div>
  );
};
