# Solar Konfigurator

Mehrstufiger Solar-Konfigurator für den deutschen Markt. Erst vollständige Wirtschaftlichkeitsanalyse — dann Lead. Kein Kontaktdaten-Gate vor dem Ergebnis.

## Das Konzept

Deutsche Kunden sind skeptisch gegenüber klassischen Lead-Formularen. Dieser Konfigurator dreht das Prinzip um: Der Nutzer bekommt zuerst eine vollständige ROI-Berechnung seiner Solaranlage (Amortisation, Autarkiegrad, jährliche Ersparnis, regionale Förderungen) — und entscheidet danach selbst ob er ein Angebot möchte.

## Stack

| | |
|---|---|
| **Framework** | Vite + React 19 |
| **Styling** | Tailwind CSS v4 |
| **Sprache** | TypeScript |
| **Package Manager** | npm |
| **Fonts** | Inter (Google Fonts) |
| **Icons** | Material Symbols Outlined |

## Starten

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production Build
npm run preview  # Production Preview
```

## Projekt-Struktur

```
src/
├── pages/
│   ├── LandingPage.tsx          # Hero, PLZ-Check, Trust-Badges
│   └── ConfiguratorPage.tsx     # Wizard-Container
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── sections/
│       ├── StepRoof.tsx          # Schritt 1: Dachausrichtung, Fläche, Baujahr
│       ├── StepEnergy.tsx        # Schritt 2: Verbrauch, E-Auto, Wärmepumpe, Speicher
│       ├── StepGrants.tsx        # Schritt 3: Regionale & bundesweite Förderungen
│       ├── StepResult.tsx        # Schritt 4: ROI-Dashboard
│       ├── StepLeadForm.tsx      # Schritt 5: Angebotsanfrage (freiwillig)
│       ├── StepConfirmation.tsx  # Schritt 6: Bestätigung & Timeline
│       └── ConfiguratorSidebar.tsx
├── hooks/
│   └── useConfigurator.ts        # Business-Logik & State
└── data/                         # Statische Daten & Konfiguration
```

## Design-System

**Farben:**
- Navy `#0D2137` — Branding, Headlines, Navigation
- Orange `#F59E0B` — CTAs, aktive Zustände
- Background `#FBF9FB` — Haupthintergrund (Low-Glare)
- Weiß `#FFFFFF` — Karten-Oberflächen

**Typografie:** Inter — Headlines bold/tight, Body regulär/großzügig, Labels semi-bold

**Vollständiges Design-System:** `DESIGN.md`

## Maps

- `docs/maps/map-homepage.md` — LandingPage Komponenten
- `docs/maps/map-configurator.md` — Alle Wizard-Steps
- `docs/maps/map-layout.md` — Navbar + Footer

## Anforderungen

- DSGVO-konform (Lead-Formular freiwillig, Datenschutzhinweis)
- Mobile-First (Touch-Targets für Slider & Radio-Cards)
- Trust-Siegel: TÜV, VDE, Meisterbetrieb

---

## Roadmap Phase 2

Sobald der Konfigurator live ist und Leads generiert, folgt die Projektmanagement-Ebene:

**Kunden-Dashboard:**
Projektstatus live (Angebot → Planung → Genehmigung → Installation → Inbetriebnahme), Live-Ertragsdaten via Wechselrichter-API, Amortisationsfortschritt und CO₂-Ersparnis in Echtzeit.

**Installateur-Dashboard:**
Lead- und Projektverwaltung, Dokumenten-Upload (Angebote, Netzanmeldung, Abnahmeprotokoll), Direktkommunikation mit dem Kunden, Pipeline-Ansicht nach Projektphasen.

**Weitere Ideen:**
Batterie-Speicher-Konfiguration, Wallbox/E-Auto-Integration, White-Label für Installationsbetriebe (Multi-Tenant), KI-Dachflächenerkennung via Satellitenbild.
