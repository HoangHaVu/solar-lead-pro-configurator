import React, { useState } from 'react';
import { Settings, Webhook, Eye, EyeOff, CheckCircle, XCircle, Loader2, ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { InstallerSideNavBar } from '../components/layout/InstallerSideNavBar';
import { InstallerTopAppBar } from '../components/layout/InstallerTopAppBar';
import { useInstallerSettings } from '../hooks/useInstallerSettings';
import { useAuth } from '../contexts/AuthContext';

const CRM_TEMPLATES = [
  {
    name: 'Zapier',
    icon: '⚡',
    description: 'Verbinde mit 5.000+ Apps — HubSpot, Pipedrive, Salesforce, Gmail u.v.m.',
    hint: 'Webhook-URL aus dem Zapier-Trigger "Webhooks by Zapier" kopieren.',
  },
  {
    name: 'HubSpot',
    icon: '🟠',
    description: 'Lead direkt als Kontakt + Deal in HubSpot anlegen.',
    hint: 'Nutze den HubSpot Workflow → Webhook-Schritt oder Zapier als Brücke.',
  },
  {
    name: 'Pipedrive',
    icon: '🟢',
    description: 'Lead als Person + Deal mit Score im Pipedrive anlegen.',
    hint: 'Pipedrive → Automatisierungen → Webhook-Auslöser aktivieren.',
  },
  {
    name: 'Make (Integromat)',
    icon: '🔵',
    description: 'Flexibler als Zapier, günstiger für mehrere Leads/Monat.',
    hint: 'Make-Szenario → Webhook-Modul → URL kopieren.',
  },
];

const PAYLOAD_EXAMPLE = JSON.stringify({
  event: 'lead.new',
  timestamp: '2026-05-02T10:00:00.000Z',
  lead: {
    id: 'uuid-123',
    name: 'Max Mustermann',
    email: 'max@example.de',
    phone: '+49 160 1234567',
    zip: '80331',
    kwp: 9.5,
    investment: 17100,
    annual_savings: 1420,
    amortization: 12,
    autarky: 72,
    score: 84,
    score_tier: 'heiss',
  },
}, null, 2);

export const InstallerSettingsPage: React.FC = () => {
  const {
    webhookUrl, setWebhookUrl,
    webhookSecret, setWebhookSecret,
    isActive, setIsActive,
    isLoading, isSaving, isTesting,
    saveStatus, testStatus,
    save, testWebhook,
  } = useInstallerSettings();

  const [showSecret, setShowSecret] = useState(false);
  const [copied, setCopied] = useState(false);

  const { user } = useAuth();
  function copyPayload() {
    navigator.clipboard.writeText(PAYLOAD_EXAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50">
        <InstallerSideNavBar />
        <main className="flex flex-col min-h-screen lg:pl-64">
          <InstallerTopAppBar />
          <div className="flex items-center justify-center flex-1">
            <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <InstallerSideNavBar />

      <main className="flex flex-col min-h-screen lg:pl-64">
        <InstallerTopAppBar />

        <div className="px-4 md:px-8 py-6 border-b border-slate-200 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">Einstellungen</h2>
              <p className="text-sm text-slate-500">CRM-Integration & Webhook</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 md:px-8 py-8 max-w-4xl mx-auto w-full space-y-8">

          {/* Webhook-Konfiguration */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
              <Webhook className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-primary text-lg">CRM-Webhook</h3>
              <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">PRIO</span>
            </div>

            <div className="px-6 py-6 space-y-6">
              <p className="text-sm text-slate-600">
                Jeder neue Lead wird automatisch als JSON-Payload an deine Webhook-URL gesendet —
                kompatibel mit <strong>Zapier, Make, HubSpot, Pipedrive</strong> und jedem eigenen System.
              </p>

              {/* Aktiv-Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="font-semibold text-primary text-sm">Webhook aktiv</p>
                  <p className="text-xs text-slate-500 mt-0.5">Leads werden automatisch weitergeleitet</p>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-12 h-6 rounded-full overflow-hidden transition-colors ${isActive ? 'bg-secondary' : 'bg-slate-300'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Webhook URL */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="webhook-url">
                  Webhook-URL
                </label>
                <input
                  id="webhook-url"
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hooks.zapier.com/hooks/catch/..."
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                />
              </div>

              {/* Webhook Secret */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="webhook-secret">
                  Webhook-Secret <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    id="webhook-secret"
                    type={showSecret ? 'text' : 'password'}
                    value={webhookSecret}
                    onChange={(e) => setWebhookSecret(e.target.value)}
                    placeholder="Geheimer Schlüssel für HMAC-SHA256-Signatur"
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 pr-12 text-sm text-primary placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary"
                  />
                  <button
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                  >
                    {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-slate-500">
                  Falls gesetzt, signieren wir jeden Request mit{' '}
                  <code className="bg-slate-100 px-1 rounded">X-SolarConfig-Signature: sha256=…</code>
                </p>
              </div>

              {/* Aktionen */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={save}
                  disabled={isSaving}
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {isSaving ? 'Speichern…' : 'Einstellungen speichern'}
                </button>

                <button
                  onClick={testWebhook}
                  disabled={isTesting || !webhookUrl}
                  className="flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-primary font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Webhook className="w-4 h-4" />}
                  {isTesting ? 'Wird gesendet…' : 'Test-Webhook senden'}
                </button>

                {/* Status-Feedback */}
                {saveStatus !== 'idle' && (
                  <span className={`flex items-center gap-1.5 text-sm font-semibold ${saveStatus === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {saveStatus === 'success'
                      ? <><CheckCircle className="w-4 h-4" /> Gespeichert</>
                      : <><XCircle className="w-4 h-4" /> Fehler beim Speichern</>}
                  </span>
                )}
                {testStatus !== 'idle' && (
                  <span className={`flex items-center gap-1.5 text-sm font-semibold ${testStatus === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {testStatus === 'success'
                      ? <><CheckCircle className="w-4 h-4" /> Test erfolgreich</>
                      : <><XCircle className="w-4 h-4" /> Test fehlgeschlagen</>}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Payload-Vorschau */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-primary text-lg">Payload-Format (JSON)</h3>
              <button
                onClick={copyPayload}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Kopiert!' : 'Kopieren'}
              </button>
            </div>
            <pre className="px-6 py-5 text-xs text-slate-700 bg-slate-50 overflow-x-auto leading-relaxed font-mono">
              {PAYLOAD_EXAMPLE}
            </pre>
          </section>

          {/* CRM-Templates */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h3 className="font-bold text-primary text-lg">Integrationen</h3>
              <p className="text-sm text-slate-500 mt-1">Kompatible Systeme — Webhook-URL aus dem jeweiligen Tool einfügen</p>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CRM_TEMPLATES.map((t) => (
                <div key={t.name} className="border border-slate-200 rounded-lg p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{t.icon}</span>
                    <span className="font-bold text-primary">{t.name}</span>
                  </div>
                  <p className="text-xs text-slate-600">{t.description}</p>
                  <p className="text-xs text-slate-400 italic">{t.hint}</p>
                </div>
              ))}
            </div>
          </section>


          {/* Retry-Hinweis */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
            <ExternalLink className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <strong>Retry-Logik:</strong> Bei einem fehlgeschlagenen Webhook-Aufruf wird der Request
              automatisch <strong>3× wiederholt</strong> (nach 1 s, 2 s, 4 s Backoff).
              Alle Versuche werden im Webhook-Log protokolliert.
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
