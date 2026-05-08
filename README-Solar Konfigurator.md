# Solar Konfigurator

Mehrstufiger Solar-Konfigurator für den deutschen Markt mit vollständigem Kunden- und Installateur-Dashboard. Erst vollständige Wirtschaftlichkeitsanalyse — dann Lead.

## Das Konzept

Deutsche Kunden sind skeptisch gegenüber klassischen Lead-Formularen. Dieser Konfigurator dreht das Prinzip um: Der Nutzer bekommt zuerst eine vollständige ROI-Berechnung seiner Solaranlage (Amortisation, Autarkiegrad, jährliche Ersparnis, regionale Förderungen) — und entscheidet danach selbst ob er ein Angebot möchte.

## Stack

| | |
|---|---|
| **Framework** | Vite + React 19 |
| **Styling** | Tailwind CSS v4 |
| **Sprache** | TypeScript |
| **Package Manager** | npm |
| **Icons** | lucide-react |
| **Fonts** | Inter (Google Fonts) |
| **Backend** | Supabase (leads, Auth) |

## Starten

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production Build
npm run preview  # Production Preview
```

## Screens & Routen (12 Routes)

### Public
| Route | Beschreibung |
|-------|-------------|
| `/` | LandingPage — Hero, PLZ-Check, Trust-Badges |
| `/configurator` | Konfigurator-Wizard (6 Steps) |
| `/login` | Login (Kunde + Installateur) |
| `/register` | Kunden-Registrierung |
| `/register-installer` | Installateur-Registrierung |

### Kunden-Dashboard
| Route | Beschreibung |
|-------|-------------|
| `/dashboard` | Projektstatus, Specs, Kontaktkarte |
| `/roi` | ROI-Stats, Autarkie-Donut, Amortisations-Chart |
| `/documents` | Dokumente (Angebote, Netzanmeldung etc.) |
| `/support` | Support-Chat mit Installateur |

### Installateur-Management
| Route | Beschreibung |
|-------|-------------|
| `/pipeline` | Kanban Lead-Pipeline |
| `/project-details` | Projektdetails (Kundendaten, Konfiguration) |
| `/calendar` | Terminkalender |
| `/stats` | KPI-Dashboard + Lead-Entwicklung |

## Projekt-Struktur

```
src/
├── pages/
│   ├── LandingPage.tsx
│   ├── ConfiguratorPage.tsx
│   ├── LoginPage.tsx
│   ├── CustomerRegistrationPage.tsx
│   └── InstallerRegistrationPage.tsx
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx + Footer.tsx        (Landing)
│   │   ├── SideNavBar.tsx + TopAppBar.tsx (Kunde)
│   │   └── InstallerSideNavBar.tsx + InstallerTopAppBar.tsx (Installer)
│   └── sections/
│       ├── StepRoof/Energy/Grants/Result/LeadForm/Confirmation.tsx
│       ├── ConfiguratorSidebar.tsx
│       ├── dashboard/   (ProjectStatus, ProjectSpecs, ContactCard)
│       ├── roi/         (StatTile, AutarkyDonut, AmortizationChart)
│       ├── documents/   (DocumentRow)
│       ├── chat/        (ChatMessage, ChatSidebar)
│       ├── pipeline/    (KanbanColumn, LeadCard)
│       ├── details/     (CustomerDataSection, ConfigSummarySection)
│       ├── calendar/    (CalendarGrid, CalendarEvent)
│       └── stats/       (StatsKpiCard, LeadDevelopmentChart)
├── hooks/
│   └── useConfigurator.ts    (ROI-Logik, PLZ-Einstrahlungsdaten)
├── data/
│   ├── plzIrradiation.ts     (DWD-Sonnenstunden nach PLZ-Präfix)
│   └── grants.ts             (Bundesweite + regionale Förderungen)
├── lib/
│   └── supabase.ts           (Supabase Client)
└── services/
    └── leads.ts              (Lead-Speicherung DSGVO-konform)
```

## Design-System

**Farben:**
- Navy `#0D2137` — Branding, Headlines, Navigation
- Orange `#F59E0B` — CTAs, aktive Zustände
- Background `#FBF9FB` — Haupthintergrund (Low-Glare)
- Weiß `#FFFFFF` — Karten-Oberflächen

**Typografie:** Inter — Headlines bold/tight, Body regulär, Labels semi-bold

**Vollständiges Design-System:** `DESIGN.md`

## Maps

```
docs/maps/
├── map-homepage.md        — LandingPage
├── map-configurator.md    — Wizard-Steps (1–6)
├── map-auth.md            — Login, Registrierung
├── map-dashboard.md       — Kunden-Dashboard
├── map-roi.md             — ROI-Seite
├── map-documents.md       — Dokumente
├── map-support.md         — Support-Chat
├── map-pipeline.md        — Installateur Pipeline
├── map-project-details.md — Projektdetails
├── map-calendar.md        — Kalender
├── map-stats.md           — Statistiken
├── map-layout.md          — Alle Layout-Komponenten
├── map-navigation.md      — Routen & Screen-Graph
└── map-ui-shared.md       — Geteilte UI-Komponenten
```

## Anforderungen

- DSGVO-konform (Lead-Formular freiwillig, Einwilligung gespeichert)
- Mobile-First (Touch-Targets für Slider & Radio-Cards)
- Trust-Siegel: TÜV, VDE, Meisterbetrieb

---

## Roadmap Phase 2

Die Phase-2-Screens (Kunden-Dashboard, Installateur-Management) sind als UI-Prototypen bereits implementiert. Nächste Schritte für die Produktion:

- **Auth:** Supabase Auth mit Rollen (customer / installer)
- **Echtdaten:** Projects-Tabelle, Projektstatus, Dokumente
- **Wechselrichter-API:** Live-Ertragsdaten nach Installation
- **Wallbox / E-Auto:** Eigenverbrauchsoptimierung
- **White-Label:** Multi-Tenant für Installationsbetriebe
- **KI-Dachflächenerkennung:** Via Google Maps Satellitenbild
