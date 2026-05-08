# Solar Konfigurator — Resume Point
<!-- Zuletzt aktualisiert: 2026-05-07 — Kalender CRUD, Rabatt-System -->

## Sofort nach Neustart

### Kontext
**Demo vollständig + Kalender & Rabatt-System live.** Letzte Session (2026-05-07): Rabatt-Migrations (009+010) deployed, InstallerSettingsPage Rabattcode-Verwaltung, Kalender komplett neu mit Termin-Detail-Modal (3 Modi: view/reschedule/confirmCancel), "Neuer Termin"-Button + Create-Modal. TypeScript 0 Fehler, Build erfolgreich (764ms, 2.284 KB).

### Nächster Schritt
1. **Deployment**: Vercel/Netlify + Env-Vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) + SPA-Redirect-Regeln
2. **Resend API Key**: Account auf resend.com anlegen → `supabase secrets set RESEND_API_KEY=re_... --project-ref ecsqbsgbfmvqaqnryvwf`
3. **Edge Functions deployen**: `supabase functions deploy forward-lead` + `supabase functions deploy notify-beta`

### Offene Blocker
- Resend API Key fehlt noch (E-Mail-Features damit blockiert)
- Deployment steht noch aus (Vercel/Netlify)

### Wichtige Pfade & Befehle
- Dev-Server:         `npm run dev` (aus /Users/hoanghavu/myprojects/Solar Konfigurator/)
- Kalender:           src/pages/CalendarPage.tsx + src/hooks/useAppointments.ts + src/components/sections/calendar/
- Rabatt-System:      src/hooks/useDiscountCodes.ts + src/hooks/useInstallerLead.ts (applyCode)
- Installer-Settings: src/pages/InstallerSettingsPage.tsx (Rabattcode-Verwaltung)
- Lead-Details:       src/pages/LeadDetailsPage.tsx (Live-Preisvorschau + Code-Validierung)
- Design Constants:   src/constants/pdfTheme.ts (PDF) + src/constants/theme.ts (React)
- Rechnungs-PDF:      src/components/RechnungPdfDocument.tsx (RechnungType 1|2|3)
- Supabase DB-Befehl: `supabase db push --db-url "postgresql://postgres:Homo-lordi123@db.ecsqbsgbfmvqaqnryvwf.supabase.co:5432/postgres"`

### Aktive Map
docs/maps/map-ui-shared.md
