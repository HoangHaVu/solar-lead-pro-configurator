# Solar Konfigurator — DNA

---

## Bereich 1: Projekt-Brief

### Produkt-Vision
**SolarKonfigurator ist ein vollständiges Solar-Business-OS für deutsche Installationsbetriebe.** Kein klassisches Lead-Formular — sondern eine komplette Plattform: Kunde konfiguriert seine Anlage selbst (inkl. ROI-Analyse), der Installateur bekommt qualifizierte, scorede Leads direkt in sein Dashboard — mit Pipeline, Kalender, PDF-Angeboten und CRM-Webhook.

Zwei Nutzergruppen, eine Plattform:
- **Endkunden:** Self-Service Konfigurator → vollständige Wirtschaftlichkeitsanalyse → freiwilliger Lead → Kunden-Dashboard nach Auftragserteilung
- **Installateure:** Lead-Management-Dashboard → Pipeline → Kalender → PDF-Angebote → CRM-Integration → Business-Analytics

### Das Kernproblem (gelöst)
Deutsche Kunden sind skeptisch. Standard-Konfiguratoren fragen sofort nach Kontaktdaten ohne Gegenleistung. SolarKonfigurator dreht das um: Erst vollständige Wirtschaftlichkeitsanalyse (ROI, Autarkie, Förderungen) — dann freiwilliger Lead. Resultat: höhere Lead-Qualität, mehr Vertrauen.

Für Installateure: Keine Einzellösungen mehr (CRM + Kalender + Angebots-Tool + Lead-Gen = €400+/Monat). SolarKonfigurator ersetzt alles in einem.

### Business-Modell (SaaS B2B)
Zielkunde: Solarinstallationsbetriebe in Deutschland (4.000+ aktive Betriebe).

| Tier | Setup (einmalig) | Monatlich | Leads/Monat |
|------|-----------------|-----------|-------------|
| Starter | €249 | €129 | 15 |
| Pro | €399 | €229 | 40 |
| Scale | €599 | €349 | Unlimited + PLZ-Exklusiv |

**Founder-Deal (erste 5 Kunden):** €199 Setup + 1 Monat gratis → ab Monat 2 reguläres Abo.

### Phase 1 — VOLLSTÄNDIG IMPLEMENTIERT ✅

**Konfigurator-Wizard (7 Schritte):**
1. Gebäudetyp (5 Optionen: EFH, MFH, Gewerbe etc.) + Eigentumsform + Mieter-Gate
2. Dachinfo (Fläche, Ausrichtung, Neigung 10–60° Slider, Dachtyp)
3. Stromverbrauch (kWh/Jahr, Haushaltsgröße, E-Auto, Wärmepumpe)
4. Regionale Förderungen (automatisch per PLZ — national + Bundesland)
5. Live-ROI-Dashboard (Amortisation, Autarkiegrad, jährliche Ersparnis, PDF-Download)
6. Lead-Formular (freiwillig — Planungshorizont, Finanzierungsbedarf, Score-Berechnung)
7. Bestätigung + 4-stufige Timeline-Visualisierung

**Live-Sidebar:** kWp-Schätzung, Ersparnis, Amortisation, Autarkie, Lead-Score — während Wizard läuft

**Mieter-Gate:** Intercept-Screen nach Schritt 1 für Mieter → Balkonkraftwerk-Option + Vermieter-Argumente

**Lead-Scoring (0–100):** PLZ-Einstrahlung + kWp + Investment + Eigentümer-Flag + Speicher + Planungshorizont → Ampel (Heiß/Warm/Kalt)

**PDF-Export:** ROI-Analyse-PDF (A4, @react-pdf/renderer) direkt aus StepResult downloadbar

**Sozialer Beweis:** "X Anlagen im Bereich 80xxx bereits konfiguriert" — greift echte Supabase-Daten ab

**Trust-Siegel:** TÜV, VDE, Meisterbetriebe, DSGVO, BSW Solar, 0% MwSt. (Landing Page + Lead-Formular)

---

**Kunden-Dashboard (nach Auftragserteilung):**
- DashboardPage: Projektstatus (Angebot → Planung → Genehmigung → Installation → Inbetrieb)
- ROIPage: Autarkie-Donut, Amortisations-Chart, Kennzahlen-Kacheln
- DocumentsPage: Dokumente-Übersicht (Angebote, Protokolle, Netzanmeldung)
- SupportChatPage: Direktkommunikation mit Installateur

---

**Installateur-Management-Dashboard:**
- LeadPipelinePage: Kanban-Board (Neu / Kontaktiert / Angebot / Gewonnen / Verloren) + Lead-Score-Badge
- ProjectDetailsPage: Kundendaten, Konfig-Zusammenfassung, Projekt-Chat + **PDF-Angebot generieren**
- CalendarPage: Terminkalender mit Ereignissen
- BusinessStatsPage: KPI-Kacheln + Lead-Entwicklungs-Chart
- InstallerSettingsPage: Webhook-URL + Secret + Test-Button + Integrations-Templates (Zapier, HubSpot, Pipedrive, Make)

---

**Backend & Infrastruktur:**
- Supabase: leads-Tabelle, beta_requests-Tabelle, notes-Tabelle (Migrations 001–007)
- Edge Function: `forward-lead` (Deno, HMAC-SHA256-Signatur, Retry-Logik 3×, Webhook-Log)
- Edge Function: `notify-beta` (E-Mail via Resend bei Beta-Anmeldungen) — **deploy ausstehend**
- AuthContext (Rollen: customer / installer), ProtectedRoute, 12 Routes

---

**Marketing & SEO:**
- Landing Page: Hero (PLZ-Check), Stats-Banner (Gesamtanlagen + Fördersumme + Ø Amortisation), Trust-Section, How-it-Works, FAQ
- SEO: react-helmet-async, OG-Tags, JSON-LD Schema, sitemap.xml, robots.txt, favicon.svg
- DSGVO-Seite (§1–§9), Impressum (§5 TMG), alle toten Links gefixt
- Mobile-First: vollständig responsiv (Touch-Targets, responsive Typography, Wizard full-width Mobile)

---

### Phase 2 Ideen (noch nicht implementiert)

**Distribution & Embed:**
- Script-Tag Widget Embed: `<script src="solarconfig.de/widget.js" data-installer-id="xyz">` — wie Typeform/Intercom
- White-Label-Branding pro Installer (Logo, Primärfarbe via CSS Custom Properties)
- WordPress-Plugin: `[solarconfig installer="xyz"]` Shortcode

**Lead-Qualität:**
- Wunschtermin-Buchung direkt im Wizard (Calendly-Integration oder eigene Slot-Logik)
- Dach-Foto Upload (Supabase Storage → sichtbar in Projektdetails)

**Geschäftsmodell:**
- Pay-per-Lead Abrechnungslogik (Prepaid-Guthaben oder Monatsabo)
- PLZ-Exklusivität buchbar (Installer bucht Regionen exklusiv)
- Installer-Profil-Seite (öffentlich, SEO: "Solaranlage [Stadt]")
- Team-Accounts pro Installateur (Rollen: Admin / Vertrieb / Technik)

**Daten & Analytics:**
- Wizard Drop-off Tracking (datenschutzkonform)
- Installer-Dashboard Conversion-Funnel (Leads gesamt / kontaktiert / Angebot / gewonnen)
- Reaktionszeit-Tracking (SLA — Installateure die schnell reagieren schließen 3× mehr ab)

**KI & Automatisierung:**
- KI-gestützte Dachflächenerkennung via Google Maps / Satellitenbild
- Live-Ertragsdaten nach Installation (Wechselrichter-API-Integration)
- WhatsApp Follow-up Option (Twilio / WhatsApp Business API)

**Weiterentwicklung Konfigurator:**
- Vergleichsrechner: verschiedene Anlagengrößen nebeneinander
- Batterie-Speicher als separater Konfigurationsschritt
- CO₂-Ersparnis-Tracker mit Visualisierung

---

## Bereich 2: Tech-Stack

### Core Architecture
- **Framework:** [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/postcss`)
- **Language:** [TypeScript](https://www.typescriptlang.org/) — `moduleResolution: bundler`
- **Package Manager:** [npm](https://www.npmjs.com/)
- **Icons:** [lucide-react](https://lucide.dev/) (ersetzt Material Symbols)
- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter)
- **Routing:** [React Router DOM v6](https://reactrouter.com/) — 12 Routes, useNavigate, useSearchParams

### Backend & Datenbank
- **Database + Auth:** [Supabase](https://supabase.com/) — Projekt-Ref: `ecsqbsgbfmvqaqnryvwf`
  - `src/lib/supabase.ts` — Client-Initialisierung
  - Env-Vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- **Edge Functions:** Deno (Supabase Functions)
  - `supabase/functions/forward-lead/` — CRM-Webhook mit HMAC-SHA256
  - `supabase/functions/notify-beta/` — E-Mail-Benachrichtigung via Resend
- **Migrations:** `supabase/migrations/` (001–007)
  - leads, beta_requests, notes Tabellen

### Zusätzliche Libraries
- **PDF-Generierung:** `@react-pdf/renderer` — ROI-Analyse + Angebots-PDFs
- **SEO:** `react-helmet-async` — Meta-Tags, OG, JSON-LD, HelmetProvider in App.tsx
- **E-Mail (Edge Function):** Resend API — RESEND_API_KEY als Supabase Secret

### Project Structure
- `src/components/layout/`: Navbar, Footer, SideNavBar, TopAppBar, InstallerSideNavBar, InstallerTopAppBar, ProtectedRoute
- `src/components/sections/`: Wizard-Steps, ConfiguratorSidebar, dashboard/, roi/, pipeline/, details/, calendar/, chat/, stats/
- `src/components/`: SEO.tsx, AngebotPdfDocument.tsx, ROIPdfDocument.tsx
- `src/pages/`: LandingPage, ConfiguratorPage, LoginPage, CustomerRegistrationPage, InstallerRegistrationPage, DashboardPage, ROIPage, DocumentsPage, SupportChatPage, LeadPipelinePage, ProjectDetailsPage, CalendarPage, BusinessStatsPage, InstallerSettingsPage, DatenschutzPage, ImpressumPage
- `src/contexts/`: AuthContext.tsx (Rollen: customer / installer, login/logout)
- `src/hooks/`: useConfigurator.ts, useInstallerSettings.ts, useLeads.ts, useProject.ts, useAppointments.ts
- `src/services/`: leads.ts, webhookSettings.ts, stats.ts
- `src/lib/`: supabase.ts
- `src/utils/`: leadScore.ts (0–100 Score, Ampel-System)
- `src/data/`: plzIrradiation.ts (DWD-Werte), grants.ts (national + Bundesland)
- `supabase/functions/`: forward-lead/, notify-beta/
- `supabase/migrations/`: 001–007
- `public/`: favicon.svg, robots.txt, sitemap.xml

### Conventions & Standards
- **Components:** Functional components mit TypeScript interfaces, PascalCase naming
- **Folders:** kebab-case für Verzeichnisnamen
- **Styling:** Utility-first mit Tailwind, Design-Tokens in `tailwind.config.js` + `DESIGN.md`
- **Logic:** Custom Hooks für komplexen State, Services für Supabase-Calls, Utils für reine Berechnungen
- **Auth:** ProtectedRoute wrappen alle geschützten Seiten, Rollen-Check via AuthContext

### Scripts
- `npm run dev`: Lokaler Dev-Server (Vite, Port 5173)
- `npm run build`: TypeScript kompilieren + Production-Build (0 Fehler)
- `npm run preview`: Production-Build lokal vorschauen
- `supabase functions deploy forward-lead`: CRM-Webhook deployen
- `supabase functions deploy notify-beta --use-api`: Beta-E-Mail deployen

### External Resources
- **Stitch Project:** [Solar Lead Pro PV-Konfigurator](https://stitch.google.com/projects/3955599241460119046)
- **Asset Directory:** `/.stitch/designs/` (Raw HTML/CSS Referenz)
- **Supabase Dashboard:** https://supabase.com/dashboard/project/ecsqbsgbfmvqaqnryvwf

---

## Bereich 3: Seiten-Baum & Komponenten

LandingPage (Marketing & Einstieg)      → docs/maps/map-landing.md
  ├── Navbar (Global)
  ├── HeroSection (PLZ-Check + Stats-Banner)
  ├── TrustSection (6 Siegel: TÜV, VDE, Meisterbetriebe, DSGVO, BSW Solar, 0% MwSt.)
  ├── HowItWorksSection
  ├── FAQSection
  ├── InstallerLandingPage (für Installateure-Akquise)
  └── Footer (Global)

ConfiguratorPage (Wizard)               → docs/maps/map-configurator.md
  ├── ConfiguratorSidebar (Live-Schätzung: kWp, Ersparnis, Amortisation, Score)
  ├── StepBuildingType (Gebäudetyp + Eigentumsform)
  ├── StepMieterInfo (Intercept für Mieter — Balkonkraftwerk-Option)
  ├── StepRoof (Dachtyp, Ausrichtung, Fläche, Neigung-Slider 10–60°)
  ├── StepEnergy (kWh/Jahr, Haushaltsgröße, E-Auto, Wärmepumpe)
  ├── StepGrants (PLZ-Förderungen + "X Anlagen regional"-Badge)
  ├── StepResult (ROI-Dashboard + PDF-Download-Button)
  ├── StepLeadForm (Planungshorizont, Finanzierungsbedarf, 4 Trust-Siegel)
  └── StepConfirmation (4-stufige Timeline + Konfig-Übersicht + CTAs)

Auth-Flow                               → docs/maps/map-auth.md
  ├── LoginPage (/login)
  ├── CustomerRegistrationPage (/register)
  └── InstallerRegistrationPage (/register-installer)

Kunden-Dashboard                        → docs/maps/map-dashboard.md
  ├── DashboardPage (/dashboard)
  │   ├── ProjectStatusSection (Angebot→Planung→Genehmigung→Installation→Inbetrieb)
  │   ├── ProjectSpecsSection
  │   └── ContactCard
  ├── ROIPage (/roi)                     → docs/maps/map-roi.md
  │   ├── StatTile
  │   ├── AutarkyDonut
  │   └── AmortizationChart
  ├── DocumentsPage (/documents)         → docs/maps/map-documents.md
  │   └── DocumentRow
  └── SupportChatPage (/support)         → docs/maps/map-support.md
      ├── ChatSidebar
      └── ChatMessage

Installateur-Management                 → docs/maps/map-pipeline.md
  ├── LeadPipelinePage (/pipeline)
  │   └── KanbanColumn (LeadCard mit Score-Badge)
  ├── ProjectDetailsPage (/details)      → docs/maps/map-project-details.md
  │   ├── CustomerDataSection
  │   ├── ConfigSummarySection
  │   ├── ProjectChatSection
  │   └── AngebotPdfDocument (PDF-Angebot-Generator)
  ├── CalendarPage (/calendar)           → docs/maps/map-calendar.md
  │   └── CalendarGrid (CalendarEvent)
  ├── BusinessStatsPage (/stats)         → docs/maps/map-stats.md
  │   ├── StatsKpiCard
  │   └── LeadDevelopmentChart
  └── InstallerSettingsPage (/installer-settings)
      ├── WebhookConfigSection (URL + Secret + Test-Button)
      └── IntegrationsTemplates (Zapier, HubSpot, Pipedrive, Make)

Öffentliche Seiten
  ├── DatenschutzPage (/datenschutz)     — 9 DSGVO-Sektionen
  └── ImpressumPage (/impressum)         — §5 TMG

Layout & Navigation                     → docs/maps/map-layout.md
                                        → docs/maps/map-navigation.md
  ├── SideNavBar (Customer) + Logout
  ├── TopAppBar (Customer)
  ├── InstallerSideNavBar + Logout + Settings-Link
  ├── InstallerTopAppBar
  ├── Navbar (Public)
  ├── Footer (Public — mit /datenschutz + /impressum Links)
  └── ProtectedRoute (Rollen-Guard: customer / installer)
