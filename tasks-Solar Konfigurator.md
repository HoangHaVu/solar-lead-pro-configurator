# Solar Konfigurator — Tasks & TODOs
<!-- Zuletzt aktualisiert: 2026-04-29 -->

## Kritisch (Sofort)

- [x] Dev-Server starten & Wizard-Flow durchklicken (`npm run dev`) (2026-04-29)
- [x] Komponenten vs. Stitch-Design abgleichen — passt (2026-04-29)

## Hoch (Diese Woche)

- [x] ROI-Berechnungslogik in useConfigurator.ts verfeinert (2026-04-29)
       → Orientierungsfaktor, Eigenverbrauchsrate, Einspeisevergütung, E-Auto/Wärmepumpe
- [x] PLZ-Einstrahlungsdaten angebunden (2026-04-29)
       → src/data/plzIrradiation.ts — statische Lookup-Tabelle nach PLZ-Präfix (DWD-Werte)
       → PLZ fließt von LandingPage → App → ConfiguratorPage → useConfigurator → Berechnung
- [x] Förderungen-Daten befüllt (2026-04-29)
       → src/data/grants.ts — 3 nationale + bis zu 2 regionale Programme je Bundesland
       → PLZ-basiert: Bayern, BW, NRW, Berlin, Hamburg, Hessen, Sachsen u.a. abgedeckt
- [x] Lead-Formular Backend angebunden — Supabase (2026-04-29)
       → src/lib/supabase.ts, src/services/leads.ts
       → .env.example mit SQL-Schema für leads-Tabelle + RLS Policy
       → Formular: controlled inputs, loading/error state, DSGVO-Checkbox required

## Normal (Backlog)

- [ ] Mobile-Responsiveness testen (alle Steps, Sidebar, LandingPage)
       → Mobile-First laut DESIGN.md — Touch-Targets für Slider & Radio-Cards prüfen
- [ ] Trust-Siegel als echte Assets einbinden (TÜV, VDE, Meisterbetrieb)
       → Komponente: src/pages/LandingPage.tsx + src/components/sections/StepLeadForm.tsx
- [ ] StepConfirmation Timeline-Visualisierung finalisieren
       → Komponente: src/components/sections/StepConfirmation.tsx → siehe docs/maps/map-configurator.md
       → Dach-Check → Angebot → Montage als visueller Fortschritt
- [ ] Deployment aufsetzen (Vercel / Netlify)
       → `npm run build` lokal testen → dann deployen
- [x] .claudeignore erstellt via Antigravity (2026-04-29)

## Abgeschlossen

- [x] Projekt initialisiert — DNA Bereich 1 erstellt (2026-04-29)
- [x] Tech-Stack installiert — DNA Bereich 2 befüllt (2026-04-29)
- [x] Maps erstellt — map-homepage, map-configurator, map-layout (2026-04-29)
- [x] Komponenten-Gerüst angelegt — alle Steps, Pages, Hooks (2026-04-29)
- [x] DESIGN.md erstellt — vollständiges Design-System dokumentiert (2026-04-29)
- [x] Pflichtdateien erstellt via sync (2026-04-29)
