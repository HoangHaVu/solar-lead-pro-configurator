# Solar Konfigurator — Session State
<!-- Zuletzt aktualisiert: 2026-05-07 — Rabatt-System, Kalender vollständig (CRUD + Detail-Modal + Neuer Termin) -->

## Aktuelle Session
- Datum:   2026-05-07
- Status:  Aktiv — Demo-Features vollständig implementiert, Deployment ausstehend
- Version: 0.8.0
- Phase:   Phase 1 abgeschlossen (Demo-ready), Deployment + Resend-Integration als nächstes

## Stack
- Framework:  Vite + React 19
- Styling:    Tailwind CSS v4 (`@tailwindcss/postcss`)
- Sprache:    TypeScript
- Package:    npm
- Design:     Corporate Modern — Navy #0D2137, Orange #F59E0B, Background #FBF9FB
- Fonts:      Inter (Google Fonts)
- Icons:      lucide-react
- Backend:    Supabase (leads-Tabelle + Auth geplant)

## Screens (12 Routes — alle als UI fertig)
| Screen | Route | Status |
|--------|-------|--------|
| LandingPage | / | UI ✅ |
| ConfiguratorPage (Wizard) | /configurator | UI ✅, Routing ausstehend |
| LoginPage | /login | UI ✅ |
| CustomerRegistrationPage | /register | UI ✅ |
| InstallerRegistrationPage | /register-installer | UI ✅ |
| DashboardPage (Kunde) | /dashboard | UI ✅, Mock-Daten |
| ROIPage | /roi | UI ✅, Mock-Daten |
| DocumentsPage | /documents | UI ✅, Mock-Daten |
| SupportChatPage | /support | UI ✅, Mock-Daten |
| LeadPipelinePage (Installer) | /pipeline | UI ✅, Mock-Daten |
| ProjectDetailsPage | /project-details | UI ✅, Mock-Daten |
| CalendarPage | /calendar | UI ✅, Mock-Daten |
| BusinessStatsPage | /stats | UI ✅, Mock-Daten |

## Letzte Änderungen (2026-05-07)
- **CalendarPage komplett neu**: Termin-Detail-Modal (3 Modi: view / reschedule / confirmCancel), "Neuer Termin"-Button + Create-Modal mit allen Feldern (Titel, Typ, Datum, Von/Bis, Ort, Notizen)
- **useAppointments Hook**: `create()`, `update()`, `remove()` + `sortByStart` Helper
- **data.ts**: `createAppointment`, `updateAppointment`, `deleteAppointment` Service-Funktionen
- **CalendarGrid/CalendarEvent**: `onSelect`-Callback + `onClick`-Prop Bubbling durch 2 Komponenten-Ebenen
- **LeadDetailsPage**: Rabattcode-Dropdown mit Regelhinweisen + Live-Preisvorschau (IIFE in JSX) + `codeError` State
- **useInstallerLead Hook**: `applyCode(code, percentage, createdBy)` ruft `redeemDiscountCode()` vor `applyDiscountCode()` auf
- **Migration 010 deployed**: Rabatt-Regeln — min_investment, max_uses, uses_count, valid_until + `redeem_discount_code()` RPC-Funktion
- **Migration 009 deployed**: discount_codes Tabelle + Rabatt-Spalten in leads (discount_code, discount_percentage, discount_status, final_price). Fix: `profiles.email` → JOIN auf `auth.users`
- Design Constants: `src/constants/pdfTheme.ts` + `src/constants/theme.ts` (Single Source of Truth)
- AngebotPdfDocument.tsx: Zahlungsplan-Abschnitt (3 Raten), auf pdfTheme.ts umgestellt
- RechnungPdfDocument.tsx: NEU — Abschlagsrechnung-Generator (Typen 1/2/3, §12 Abs. 3 UStG)
- StepResult.tsx: KfW-270-Finanzierungsrechner (Annuitätsformel, 3 Kacheln)
- ProjectDetailsPage.tsx: Angebot-Senden-Modal, Offer-Status-Badge, Zahlungsstatus-Toggles, Rechnungs-PDFs
- LeadCard.tsx: SLA-Tracking (getSlaBadge), Offer-Status-Badge, OfferStatus-Typ exportiert
- DashboardPage.tsx: Angebot-Banner, Annahme-Bestätigung, Änderungswunsch-Flow
- BusinessStatsPage.tsx: 4-stufiger Conversion-Funnel + SLA-Hinweis-Banner
- LandingPage.tsx: Referenzprojekte-Section (3 verifizierte Mock-Projekte)

## Nächste Schritte
- [ ] Deployment aufsetzen (Vercel/Netlify + Env-Vars + SPA-Redirect-Regeln)
- [ ] Resend API Key einrichten (resend.com → `supabase secrets set RESEND_API_KEY=re_...`)
- [ ] Edge Function notify-beta deployen
- [ ] Edge Function forward-lead deployen (`supabase functions deploy forward-lead`)

## Session-Log
| Datum | Aktion |
|-------|--------|
| 2026-04-29 | Projekt initialisiert — DNA + Antigravity-Setup |
| 2026-04-29 | Tech-Stack installiert, 6 Wizard-Steps, ROI-Logik, PLZ-API, Förderungen, Supabase-Backend |
| 2026-04-29 | Claude: Pflichtdateien via sync erstellt |
| 2026-04-30 | Antigravity: Auth-Flow + Kunden-Dashboard + Installer-Management Screens + 11 Maps |
| 2026-04-30 | GitHub push — sync Pflichtdateien aktualisiert |
| 2026-05-01 | Wizard-Flow verdrahtet, StepBuildingType, Mobile-Responsiveness gefixt |
| 2026-05-02 | Lead-Score, CRM-Webhook, Mieter-Gate, Budget/Zeitraum, SEO, Regionalstats |
| 2026-05-04 | Angebots-PDF, StepConfirmation Timeline, Trust-Siegel, LandingPage Stats-Banner |
| 2026-05-06 | Impressum, Datenschutz, Supabase Migrations 006/007 (beta_requests, notes) |
| 2026-05-07 | Design Constants (pdfTheme.ts, theme.ts), Rechnungen, KfW-Rechner, Offer-Status, SLA, Funnel, Referenzprojekte |
| 2026-05-07 | Rabatt-System (Migrations 009+010, useDiscountCodes, InstallerSettingsPage), Kalender CRUD + Detail-Modal + Neuer-Termin-Flow |
