# Solar Konfigurator — Resume Point
<!-- Zuletzt aktualisiert: 2026-04-29 -->

## Sofort nach Neustart

### Kontext
Antigravity hat das Projekt vollständig initialisiert: Tech-Stack installiert (Vite + React 19 + Tailwind v4), alle 6 Wizard-Steps als Komponenten angelegt, LandingPage + ConfiguratorPage + useConfigurator-Hook vorhanden. Maps und DESIGN.md sind vollständig. Pflichtdateien heute via sync erstellt.

### Nächster Schritt
1. `npm run dev` starten → Wizard-Flow komplett durchklicken
2. Stitch-Design abgleichen: https://stitch.google.com/projects/3955599241460119046
3. ROI-Berechnungslogik in `src/hooks/useConfigurator.ts` prüfen/verfeinern

### Offene Blocker
- PLZ-API für Einstrahlungsdaten noch nicht angebunden
- Lead-Formular hat noch kein Backend (Supabase / Netlify Function)
- Förderungsdaten (StepGrants) noch Platzhalter

### Wichtige Pfade & Befehle
- Dev-Server:   `npm run dev` (aus /Users/hoanghavu/myprojects/Solar Konfigurator/)
- Stitch:       https://stitch.google.com/projects/3955599241460119046
- Design-System: DESIGN.md
- Hook:         src/hooks/useConfigurator.ts
- Steps:        src/components/sections/Step*.tsx

### Aktive Map
docs/maps/map-configurator.md
