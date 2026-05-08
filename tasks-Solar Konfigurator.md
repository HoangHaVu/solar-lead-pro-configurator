# Solar Konfigurator — Tasks & TODOs
<!-- Zuletzt aktualisiert: 2026-05-07 — Rabatt-System + Kalender CRUD + Detail-Modal + Neuer-Termin-Button -->

## Kritisch (Sofort)

### Beta-Infrastruktur deployen
- [x] Supabase Migration 006 deployen (beta_requests Tabelle) (2026-05-06)
- [x] Supabase Migration 007 deployen (notes Tabelle) (2026-05-06)
      → `supabase db push --db-url "postgresql://postgres:PASSWORD@db.ecsqbsgbfmvqaqnryvwf.supabase.co:5432/postgres"`
      → `supabase db push --password Homo-lordi123 --project-ref ecsqbsgbfmvqaqnryvwf`
- [x] Supabase Migration 008 deployen (offer_status, payment_columns, owner-Rolle) (2026-05-07)
      → offer_status/sent_at/viewed_at + payment_1/2/3_paid in leads
      → profiles.role Constraint erweitert auf 'customer' | 'installer' | 'owner'
      → RLS-Policies aktualisiert, Test-Owner `inhaber@test.de` / Test123456 angelegt
      → 10 Mock-Leads für Muster Solar GmbH (voller Funnel: neu→kontaktiert→angebot→gewonnen)
- [x] Kalender CRUD + Detail-Modal + Neuer-Termin-Flow (2026-05-07)
      → CalendarPage: Termin-Detail-Modal mit 3 Modi (view / reschedule / confirmCancel)
      → "Neuer Termin"-Button: Create-Modal mit Titel, Typ, Datum, Von/Bis, Ort, Notizen
      → useAppointments: create/update/remove + sortByStart, data.ts: 3 neue Service-Funktionen
      → CalendarGrid/CalendarEvent: onSelect-Callback + hover-Animation
- [x] Rabattcode-Verwaltung UI in InstallerSettingsPage (2026-05-07)
      → useDiscountCodes Hook: CRUD mit installerId-Scope, isSaving/error States
      → DiscountCode Interface: min_investment, max_uses, uses_count, valid_until ergänzt
      → InstallerSettingsPage: neue "Rabattcodes"-Section — Code-Liste mit Fortschrittsbalken, Toggle, Löschen (Bestätigung), Formular mit allen 6 Feldern
      → LeadDetailsPage: Live-Preisvorschau + codeError State + Regelhinweise im Dropdown
- [x] Supabase Migration 010 deployen (Rabatt-Regeln) (2026-05-07)
      → discount_codes: min_investment, max_uses, uses_count (atomar), valid_until
      → `redeem_discount_code(installer_id, code, investment)` DB-Funktion — prüft alle Regeln + inkrementiert uses_count Race-Condition-sicher
      → Aufruf aus App-Layer via `supabase.rpc('redeem_discount_code', {...})`
- [x] Supabase Migration 009 deployen (Rabatt-System) (2026-05-07)
      → discount_codes Tabelle mit RLS-Policies (SELECT für alle Auth-User, CRUD nur für Ersteller)
      → leads: discount_code, discount_percentage, discount_status, final_price, discount_note, Timestamps
      → owner_can_select_all_leads Policy ergänzt
      → Fix: profiles.email → JOIN auf auth.users (email liegt im privaten Schema)
- [ ] Resend API Key einrichten
      → Account anlegen: resend.com (Free Tier: 3.000 E-Mails/Monat)
      → Key setzen: `supabase secrets set RESEND_API_KEY=re_... --project-ref ecsqbsgbfmvqaqnryvwf`
- [ ] Edge Function notify-beta deployen
      → `SUPABASE_ACCESS_TOKEN=... supabase functions deploy notify-beta --use-api`
      → Testet ob E-Mail an hoangha.vu@outlook.de ankommt

## Hoch (Diese Woche)

- [x] Wizard-Flow in ConfiguratorPage vollständig verdrahten & testen (2026-05-01)
      → roofType-Selektor in StepRoof ergänzt (Satteldach, Flachdach, Pultdach)
      → StepEnergy Button-Text korrigiert ("Weiter zu Förderungen")
      → ConfiguratorSidebar: Live-Schätzung (kWp, Ersparnis, Amortisation, Autarkie)
      → StepConfirmation auf Design-System-Tokens umgestellt + Timeline-Visualisierung
- [x] StepBuildingType implementiert — Gebäudetyp (5 Optionen) + Eigentumsform + Mieter/Gewerbe-Hinweise (2026-05-01)
      → Gewerbe-Eigenverbrauchsrate angepasst (60% ohne / 80% mit Speicher)
      → Dachneigung-Slider in StepRoof (10–60°, Optimal 30–35°)
      → roofAngleFactor in calculateROI integriert (quadrat. Abfall vom Optimum)
      → Step-Flow 7 Schritte: BuildingType→Dach→Energie→Förderungen→Ergebnis→Lead→Bestätigung
      → Sidebar auf 5-Step-Fortschrittsleiste + Gebäudetyp-Anzeige aktualisiert

- [x] Mobile-Responsiveness geprüft & gefixt (2026-05-01)
      → InstallerSideNavBar: hidden lg:flex ergänzt (blockierte Mobile komplett)
      → LeadPipelinePage: lg:ml-64 → lg:pl-64, Filter-min-w entfernt, Padding responsiv
      → StepResult Headline: text-2xl sm:text-3xl lg:text-4xl (kein Mid-Word-Break mehr)
      → Alle Wizard-Steps: Buttons full-width auf Mobile (flex-col-reverse, w-full sm:w-auto)
      → Dashboard/Calendar: Headings text-xl md:text-2xl lg:text-3xl
      → Touch-Targets: py-4 sm:py-3 in allen Wizard-Buttons

- [x] Mock-Daten durch echtes Supabase ersetzt — verifiziert (2026-05-01)
      → useProject, useLeads, useAppointments etc. greifen auf echtes Supabase zu
      → Dashboard/ROI/Pipeline/Kalender/Stats: alle Komponenten pure Props-Empfänger

## Normal (Backlog)

### Rechnungswesen & Zahlungspläne

- [x] Zahlungsplan-Abschnitt im Angebot-PDF (2026-05-07)
      → 3-Raten-Modell automatisch berechnen (30% Anzahlung / 60% Montage / 10% Abnahme)
      → KfW-Hinweis, §12 Abs. 3 UStG Disclaimer, Datum-Platzhalter
      → In AngebotPdfDocument.tsx via pdfTheme.ts-Tokens

- [x] Abschlagsrechnung-Generator in ProjectDetailsPage (2026-05-07)
      → Drei PDFDownloadLink-Buttons: "Rechnung 1 (30%)" / "Rechnung 2 (60%)" / "Schlussrechnung (10%)"
      → src/components/RechnungPdfDocument.tsx mit RechnungType 1|2|3
      → IBAN, BIC, Verwendungszweck, §12 Abs. 3 UStG, Gesamtabrechnung in Schlussrechnung

- [x] Zahlungsstatus in der Pipeline (2026-05-07)
      → ProjectDetailsPage: 3 Toggle-Buttons mit useState (Demo, kein Schema-Change)
      → Grün wenn bezahlt, running total der eingegangenen Zahlungen
      → Supabase-Spalten (payment_1_paid etc.) für Produktion noch offen

- [x] Finanzierungsrechner in StepResult (2026-05-07)
      → KfW 270 Annuitätsformel: P*(r/12)/(1-(1+r/12)^(-n)), Zinssatz 3,85%, 10 Jahre
      → 3 Kacheln: KfW-Monatsrate / Monatliche Ersparnis / Netto-Bilanz (grün wenn positiv)

- [ ] E-Mail-Erinnerung bei fälliger Zahlung
      → Neue Supabase Edge Function: notify-payment-due
      → Resend-API (bereits vorhanden) — 3 Tage vor Fälligkeit an Endkunden
      → Installateur bekommt CC-Mail
      → Trigger: Cron-Job oder manuell aus ProjectDetailsPage auslösbar

### Digitale Angebotsabwicklung

- [x] "Angebot senden"-Button in ProjectDetailsPage (2026-05-07)
      → Modal mit E-Mail-Input, setzt offerStatus → 'sent' (Demo via useState)
      → Resend API + Edge Function send-offer für Produktion noch offen

- [x] Offer-Status-Badge in Pipeline + ProjectDetailsPage (2026-05-07)
      → LeadCard: OFFER_BADGE mit 5 Status (created/sent/viewed/accepted/rejected), farbkodiert
      → ProjectDetailsPage: farbiger Status-Badge im Header mit Konfigurations-Konstanten in theme.ts

- [x] Annahme/Ablehnung im Kunden-Dashboard (2026-05-07)
      → DashboardPage: Angebot-Banner mit "Angebot annehmen" / "Änderung anfragen" / "Angebot öffnen"
      → Bestätigungs-States für Annahme (grün) und Änderungswunsch (blau)
      → IP + Timestamp (§126b BGB) für Produktion noch offen

- [ ] Auto-Pipeline-Update bei Annahme
      → Supabase Trigger oder Edge Function: offer_status = accepted → Pipeline-Status = Gewonnen
      → Installateur bekommt E-Mail-Benachrichtigung (Resend) + Push (optional)
      → Kunden bekommt Bestätigungs-E-Mail mit PDF-Kopie als Anhang

- [ ] Angebots-Ablauf-Erinnerung (30-Tage-Limit)
      → Edge Function oder Cron: 3 Tage vor Ablauf → Reminder-Mail an Installateur
      → "Ihr Angebot an [Kundenname] läuft in 3 Tagen ab"
      → Option: Angebot verlängern (offer_valid_until neu setzen)

- [x] Änderungswunsch-Flow (2026-05-07)
      → DashboardPage: Textarea-Step für Freitext-Kommentar, Bestätigungs-Anzeige mit zitiertem Text
      → Supabase-Speicherung + Installateur-Notification für Produktion noch offen

### Design Constants (Single Source of Truth)
- [x] `src/constants/pdfTheme.ts` erstellt (2026-05-07)
      → PDF_COLORS, PDF_FONT_SIZE, PDF_BASE — alle PDF-Komponenten importieren daraus
      → AngebotPdfDocument.tsx + RechnungPdfDocument.tsx nutzen PDF_BASE via Spread
- [x] `src/constants/theme.ts` erstellt (2026-05-07)
      → COLORS, SCORE_COLORS, OFFER_STATUS_COLORS, PROJECT_STATUS_COLORS, PAYMENT_PLAN_RATES, CHART_COLORS
      → JS-zugängliche Tokens für React-Komponenten (kein direktes Tailwind-String-Hardcoding mehr)

### Embed & White-Label
- [ ] Script-Tag Widget Embed
      → `<script src="solarconfig.de/widget.js" data-installer-id="xyz">` — wie Typeform/Intercom
      → Installer-ID übergibt Branding + Lead-Routing
      → iFrame-Fallback für einfache Setups
- [ ] White-Label Branding pro Installer
      → Logo, Primärfarbe, Firmenname konfigurierbar per data-Attribut oder Admin-Panel
      → Kein Redesign nötig — CSS Custom Properties
- [ ] WordPress-Plugin
      → Shortcode `[solarconfig installer="xyz"]` → Wizard wird eingebettet
      → Größte Zielgruppe: Handwerksbetriebe nutzen fast alle WordPress

### Lead-Qualität
- [x] Lead-Score berechnen & in Pipeline anzeigen (2026-05-02)
      → src/utils/leadScore.ts: 0-100 Score aus kwp + investment + PLZ-Einstrahlung + Eigentümer + Speicher
      → Ampel-System: Heiß (≥70) / Warm (40-69) / Kalt (<40) mit Icon (Flamme/Blitz/Schneeflocke)
      → Badge in LeadCard (Pipeline) + Live-Score in ConfiguratorSidebar
      → Score wird beim Lead-Submit in Supabase gespeichert (score-Feld)
- [x] Eigentümer-Pflichtabfrage im Wizard (Mieter = andere Journey) (2026-05-02)
      → StepMieterInfo.tsx: Intercept-Screen nach Schritt 1 für Mieter
      → Zeigt Balkonkraftwerk-Option (800W, kein Antrag) + Vermieter-Argumente
      → "Trotzdem Analyse erstellen" führt normal weiter; Intercept-Flag in ConfiguratorPage
- [ ] Wunschtermin-Buchung direkt im Wizard (nach Lead-Formular)
      → Calendly-Integration oder eigene Slot-Logik
      → Ziel: fertiger Beratungstermin statt roher Lead
- [ ] Dach-Foto Upload (optional im Lead-Formular)
      → Supabase Storage → Installer sieht Foto in Projektdetails
      → Reduziert Fehleinschätzungen beim Vorort-Termin
- [x] Budget-Abfrage + Zeitraum-Abfrage (2026-05-02)
      → StepLeadForm: Planungshorizont (sofort / 3 Monate / 12 Monate) als Card-Auswahl
      → StepLeadForm: Finanzierungsbedarf (Eigenkapital / KfW-Finanzierung) mit KfW-Hinweis
      → planningHorizon fließt in Lead-Score ein (+10 sofort, +5 bei 3 Monate)
      → Felder werden mit Lead gespeichert (planning_horizon, needs_financing)

### Installateur-Tools
- [x] Automatischer PDF-Bericht aus Konfiguration (2026-05-01)
      → ROIPdfDocument.tsx: A4-PDF mit @react-pdf/renderer
      → Enthält: Konfiguration, Kennzahlen, Investition+Förderung, Förderprogramme, Disclaimer, Footer
      → PDFDownloadLink-Button in StepResult CTA eingebaut
      → TypeScript 0 Fehler, Build erfolgreich
- [x] CRM-Webhook / E-Mail-Weiterleitung pro Installer (2026-05-02)
      → supabase/functions/forward-lead/index.ts: Deno Edge Function, deploy-ready
      → HMAC-SHA256-Signatur via Web Crypto API (X-SolarConfig-Signature Header)
      → Retry-Logik: 3× mit exp. Backoff (1s / 2s / 4s), Webhook-Log in DB
      → src/pages/InstallerSettingsPage.tsx: Webhook-URL + Secret + Toggle + Test-Button
      → src/hooks/useInstallerSettings.ts + src/services/webhookSettings.ts
      → submitLead() triggert Edge Function fire-and-forget (blockiert nie)
      → Payload-Vorschau + Integrations-Templates (Zapier, HubSpot, Pipedrive, Make)
      → Route /installer-settings + Einstellungen-Link in InstallerSideNavBar
      → Deploy: supabase functions deploy forward-lead
- [x] Angebots-Generator in Pipeline (2026-05-04)
      → src/components/AngebotPdfDocument.tsx: A4-Angebotsvorlage mit @react-pdf/renderer
      → Enthält: Kundendaten, Angebotsnr., Technische Spezifikation, Investitionsaufschlüsselung, ROI-Kacheln, Gültigkeitsdatum (30 Tage), Disclaimer
      → PDFDownloadLink "Angebot als PDF" Button in ProjectDetailsPage Header
- [ ] Team-Accounts pro Installateur
      → Mehrere Nutzer (Vertrieb, Monteur, Büro) unter einem Installer-Account
      → Rolle: Admin / Vertrieb / Technik
- [x] Reaktionszeit-Tracking (SLA) (2026-05-07)
      → LeadCard: getSlaBadge() berechnet Stunden seit created_at → amber/orange/rot-Badge
      → Schwellen: <2h = kein Badge, <24h = amber, <48h = orange, ≥48h = rot (SLA überfällig)

### Vertrauen & Conversion
- [x] Referenzprojekte mit echten Zahlen (2026-05-07)
      → LandingPage: 3 verifizierte Mock-Projekte (München/Hamburg/Stuttgart), kWp+Ersparnis+Amortisation
      → Sterne-Rating, "Mit KfW 270 finanziert"-Badge, hover-Shadow-Effekt
- [x] "X Anlagen in deiner Region" — sozialer Beweis im Wizard (2026-05-04)
      → src/services/stats.ts: fetchRegionalLeadCount (2-stelliger PLZ-Präfix) + fetchTotalLeadCount
      → StepGrants: grünes Badge "X Anlagen im Bereich 80xxx bereits konfiguriert"
      → LandingPage: Stats-Banner mit Gesamtanzahl (Basis + Echtdaten) + Fördersumme + Ø Amortisation
- [ ] WhatsApp Follow-up Option
      → Nach Lead-Abgabe: "Sollen wir dich per WhatsApp informieren?"
      → twilio oder WhatsApp Business API

### Geschäftsmodell-Features
- [ ] Pay-per-Lead Abrechnungslogik
      → Installer-Account hat Lead-Guthaben (Prepaid) oder Monatsabo
      → Lead wird erst freigegeben wenn Guthaben vorhanden
- [ ] PLZ-Exklusivität buchbar
      → Installer kann PLZ-Regionen exklusiv buchen → keine Konkurrenz in dem Gebiet
      → Höherer Preis, aber starkes Verkaufsargument
- [ ] Installer-Profil-Seite (öffentlich)
      → Zertifizierungen, Referenzprojekte, Bewertungen, Reaktionszeit
      → SEO-Seite: "Solaranlage [Stadt]" → konvertiert organisch

### Analytics
- [x] Installer-Dashboard: Conversion-Metriken (2026-05-07)
      → BusinessStatsPage: 4-stufiger Conversion-Funnel (Balken, %-Anzeige, Farbkodierung)
      → SLA-Hinweis-Banner wenn unkontaktierte Leads vorhanden (3× Abschlussrate-Tipp)
- [ ] Wizard Drop-off Tracking
      → Welcher Schritt verlässt der Nutzer? → Optimierungspotenzial
      → Datenschutzkonform (keine personenbezogenen Daten)

- [ ] Supabase Setup (Auth + DB für Phase 2)
      → Tabellen: projects, users (customer + installer Rollen)
      → Auth: Supabase Auth
      → leads-Tabelle bereits angelegt (src/lib/supabase.ts)

- [x] StepConfirmation Timeline-Visualisierung finalisiert (2026-05-04)
      → 4-stufige Timeline: Anfrage (done) → Erstgespräch (active, pulsierend) → Angebot → Montage (pending)
      → Zeitangaben pro Schritt, Status-Badges, "Als nächstes"-Marker, Planungshorizont-Badge
      → Konfigurations-Übersicht + zwei CTAs (Dashboard / Startseite)

- [x] Trust-Siegel eingebunden (2026-05-04)
      → LandingPage: Trust-Section mit 6 Siegeln (TÜV, VDE, Meisterbetriebe, DSGVO, BSW Solar, 0% MwSt.)
      → StepLeadForm: 4-er Siegel-Zeile unter Submit-Button (DSGVO, TÜV, Meisterbetriebe, 0% MwSt.)

- [ ] Deployment aufsetzen (Vercel oder Netlify)
      → npm run build lokal testen
      → Env-Vars: Supabase URL + Anon Key
      → Redirect-Regeln für SPA-Routing

- [x] Impressum-Seite erstellt & alle toten Links gefixt (2026-05-06)
      → ImpressumPage.tsx mit §5 TMG-Inhalt, Route /impressum in App.tsx
      → Alle 9 Seiten: href="#" Impressum/Datenschutz → Link to="/impressum|/datenschutz"
      → Copyright-Jahr 2024 → 2026 in allen Seiten + Footer.tsx + InstallerLandingPage
      → "SolarConfig" → "SolarKonfigurator" vereinheitlicht

- [x] DSGVO-Seite / Datenschutzerklärung (2026-05-01)
      → DatenschutzPage.tsx mit 9 DSGVO-Sektionen (§1–§9)
      → Route /datenschutz in App.tsx (öffentlich, kein ProtectedRoute)
      → Footer.tsx: href="#" → Link to="/datenschutz"
      → StepLeadForm.tsx: span → Link to="/datenschutz"

- [x] SEO & Meta-Tags (2026-05-02)
      → react-helmet-async installiert, HelmetProvider in App.tsx
      → SEO.tsx Komponente (title, description, OG, Twitter Card, JSON-LD)
      → LandingPage: vollständige Tags + WebApplication JSON-LD Schema
      → ConfiguratorPage + DatenschutzPage: eigene Titel/Descriptions
      → LoginPage, CustomerReg, InstallerReg: noindex
      → index.html: OG-Fallback-Tags für Social-Media-Crawler ohne JS
      → public/favicon.svg (Sonnen-Icon), robots.txt, sitemap.xml

## Phase 3 — Team-Accounts & Multi-User (nach Monat 2)

> Erst angehen wenn erste zahlende Kunden aktiv sind und Team-Bedarf bestätigt wird.

### Datenbank-Fundament (zuerst)

- [ ] `organizations`-Tabelle anlegen
      → Felder: id, name, plan_type (starter/pro/scale/enterprise), max_users, billing_email, created_at
      → Migration: supabase/migrations/008_organizations.sql
      → Jeder bestehende Installer-Account wird zu einer Organization migriert

- [ ] `organization_members`-Tabelle anlegen
      → Felder: id, organization_id, user_id, role (owner/sales/technician/office), invited_at, accepted_at
      → Migration: supabase/migrations/009_organization_members.sql
      → RLS-Policy: Mitglieder sehen nur Daten ihrer eigenen Organization

- [ ] Bestehende Tabellen um `organization_id` erweitern
      → leads: + organization_id, assigned_to (user_id), closed_by (user_id), first_contact_at
      → notes: + organization_id
      → Migration: supabase/migrations/010_org_references.sql
      → Alle RLS-Policies auf organization_id umstellen

### User-Management für Inhaber

- [ ] Team-Verwaltungsseite (`/team`) für Owner/Admin
      → Mitglieder einladen per E-Mail (Resend: Einladungs-Mail mit Accept-Link)
      → Rolle zuweisen: Vertrieb / Monteur / Büro
      → User-Limit-Anzeige: "3 von 5 Plätzen belegt" (je nach Plan)
      → Mitglieder entfernen / Rolle ändern

- [ ] User-Limit-Check bei Einladung
      → Vor Einladung prüfen: organization.max_users vs. aktuelle Mitgliederzahl
      → Bei Limit erreicht: Upsell-Banner "Upgrade auf Scale für bis zu 10 User"
      → Extra-User buchbar: +€19/Monat/User (Supabase Billing oder manuell)

- [ ] Rollen-basierte Navigation
      → Owner: alle Seiten + /team + /billing
      → Vertrieb: Pipeline + eigene Leads + Kalender
      → Monteur: zugewiesene Projekte + Kalender
      → Büro: alle Leads + Angebote + Rechnungen (kein /team, kein /billing)

### Master-Dashboard (Inhaber-Ansicht)

- [ ] Team-Performance-Übersicht in BusinessStatsPage
      → Tabelle: Mitarbeiter / Leads zugewiesen / Abschlüsse / Abschlussrate / Ø Reaktionszeit / Umsatz
      → Sortierbar nach jeder Spalte
      → Zeitraum-Filter: diese Woche / dieser Monat / dieses Quartal

- [ ] Leads in Pipeline nach Mitarbeiter filtern
      → Dropdown "Alle Mitarbeiter" → filtert LeadPipelinePage nach assigned_to
      → Jede LeadCard zeigt Avatar/Initialen des zugewiesenen Mitarbeiters

- [ ] Lead-Zuweisung in ProjectDetailsPage
      → Dropdown "Zuständig" → Mitglied der Organization auswählen
      → Bei Zuweisung: Benachrichtigung per E-Mail an den Mitarbeiter (Resend)

### Pricing-Anpassung (parallel zur Implementierung)

- [ ] Plan-Limits in organizations-Tabelle hinterlegen
      → Starter: max_users = 1
      → Pro: max_users = 3
      → Scale: max_users = 10
      → Enterprise: max_users = NULL (unlimited)
- [ ] Upgrade-Flow im Dashboard einbauen
      → /billing Seite: aktueller Plan + Upgrade-Optionen
      → Stripe-Integration (oder manuell über Kontaktformular in Phase 3a)

## Abgeschlossen


- [x] Projekt initialisiert — DNA Bereich 1 erstellt (2026-04-29)
- [x] Tech-Stack installiert — Vite + React 19 + Tailwind v4 + TypeScript (2026-04-29)
- [x] Komponenten-Gerüst angelegt — alle 6 Wizard-Steps, Pages, Hooks (2026-04-29)
- [x] DESIGN.md erstellt — vollständiges Design-System (2026-04-29)
- [x] ROI-Berechnungslogik implementiert — Orientierungsfaktor, E-Auto, Wärmepumpe (2026-04-29)
- [x] PLZ-Einstrahlungsdaten angebunden — src/data/plzIrradiation.ts (DWD-Werte) (2026-04-29)
- [x] Förderungen-Daten befüllt — src/data/grants.ts (national + regional per Bundesland) (2026-04-29)
- [x] Lead-Formular Backend — src/lib/supabase.ts + src/services/leads.ts (DSGVO) (2026-04-29)
- [x] Auth-Flow Screens: LoginPage, CustomerRegistrationPage, InstallerRegistrationPage (2026-04-30)
- [x] Kunden-Dashboard Screens: DashboardPage, ROIPage, DocumentsPage, SupportChatPage (2026-04-30)
- [x] Installer-Management Screens: LeadPipelinePage, ProjectDetailsPage, CalendarPage, BusinessStatsPage (2026-04-30)
- [x] Layout-Komponenten: SideNavBar, TopAppBar, InstallerSideNavBar, InstallerTopAppBar, Navbar, Footer (2026-04-30)
- [x] 14 Maps erstellt — alle Screens + Komponenten dokumentiert (2026-04-30)
- [x] Pflichtdateien via sync aktualisiert (2026-04-30)
- [x] lucide-react installiert + alle defekten Icon-Imports gefixt (Engineering→Wrench, ArrowForward→ArrowRight) (2026-04-30)
- [x] React Router DOM voll verdrahtet — 12 Routes, LandingRoute + ConfiguratorRoute mit useNavigate/useSearchParams (2026-04-30)
- [x] AuthContext erstellt — src/contexts/AuthContext.tsx (Rollen: customer/installer, login/logout) (2026-04-30)
- [x] ProtectedRoute erstellt — src/components/layout/ProtectedRoute.tsx (Routing-Guards per Rolle) (2026-04-30)
- [x] LoginPage verdrahtet — Buttons rufen login() + navigate() auf (2026-04-30)
- [x] SideNavBar + InstallerSideNavBar — Logout-Button ruft logout() + navigate('/login') auf (2026-04-30)
- [x] tsconfig.json auf moduleResolution: bundler aktualisiert (2026-04-30)
- [x] TypeScript 0 Fehler — vollständig kompilierbar (2026-04-30)
