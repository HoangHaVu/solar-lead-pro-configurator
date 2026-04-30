# Solar Konfigurator — DNA

---

## Bereich 1: Projekt-Brief

### Produkt-Vision
Ein mehrstufiger Solar-Konfigurator für den deutschen Markt. Kein klassisches Lead-Formular – sondern ein Tool, das dem Nutzer zuerst echten Mehrwert liefert: persönliche ROI-Berechnung, Autarkiegrad, regionale Förderungen – alles bevor er seine Kontaktdaten eingibt. Erst Ergebnis, dann Lead.

### Das Kernproblem
Deutsche Kunden sind skeptisch. Standard-Konfiguratoren fragen sofort nach Kontaktdaten ohne Gegenleistung. Wir drehen das um: Der Nutzer bekommt eine vollständige Wirtschaftlichkeitsanalyse seiner Solaranlage – und entscheidet dann selbst, ob er ein Angebot will.

### Phase 1 — Der Konfigurator (jetzt)
Mehrstufiger Wizard-Flow:
1. PLZ-Eingabe (Region & Einstrahlungsdaten)
2. Dachinfo (Fläche, Ausrichtung, Neigung)
3. Stromverbrauch (kWh/Jahr, Haushaltsgröße)
4. Regionale Förderungen (automatisch per PLZ)
5. Live-ROI-Dashboard (Amortisation, Autarkiegrad, jährliche Ersparnis)
6. Lead-Formular (freiwillig, nach dem Ergebnis)
7. Bestätigung & nächste Schritte

**Anforderungen:** DSGVO-konform, Mobile-First, Trust-Siegel (TÜV, VDE, Meisterbetrieb)

### Phase 2 Ideen

**Kunden-Dashboard (nach Auftragserteilung):**
- Projektstatus live: Angebot → Planung → Genehmigung → Installation → Inbetriebnahme
- Live-Ertragsdaten der Anlage (nach Installation, via Wechselrichter-API)
- Amortisationsfortschritt in Echtzeit (kumulierte Ersparnis vs. Investition)
- CO₂-Ersparnis-Tracker mit Visualisierung

**Installateur-Dashboard:**
- Lead- und Projektverwaltung (alle Kunden, alle Phasen)
- Dokumenten-Upload: Angebote, Netzanmeldung, Abnahmeprotokoll
- Direktkommunikation mit dem Kunden (Chat / Kommentare)
- Pipeline-Ansicht: welche Kunden sind in welcher Phase?

**Weitere Erweiterungen:**
- Batterie-Speicher-Konfiguration als Add-on im Wizard
- Wallbox / E-Auto-Integration (Eigenverbrauchsoptimierung)
- White-Label-Lösung für Installationsbetriebe (Multi-Tenant)
- Vergleichsrechner: verschiedene Anlagen-Größen nebeneinander
- KI-gestützte Dachflächenerkennung via Google Maps / Satellitenbild

---

## Bereich 2: Tech-Stack

### Core Architecture
- **Framework:** [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) (using `@tailwindcss/postcss`)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Package Manager:** [npm](https://www.npmjs.com/)
- **Icons:** [Material Symbols Outlined](https://fonts.google.com/icons)
- **Fonts:** [Inter](https://fonts.google.com/specimen/Inter)

### Project Structure
- `src/components/layout/`: Shared UI shell components (Navbar, Footer)
- `src/components/sections/`: Modular wizard steps and sidebar
- `src/pages/`: Main page containers (LandingPage, ConfiguratorPage)
- `src/hooks/`: Business logic and state management (useConfigurator)
- `src/data/`: Static assets and configuration data
- `src/assets/`: Images and global styles

### Conventions & Standards
- **Components:** Functional components with TypeScript interfaces, PascalCase naming
- **Folders:** kebab-case for directory names
- **Styling:** Utility-first approach with Tailwind, design tokens managed via `tailwind.config.js`
- **Logic:** Separation of concern via custom hooks for complex state

### Scripts
- `npm run dev`: Starts the local development server (Vite)
- `npm run build`: Compiles TypeScript and builds for production
- `npm run preview`: Locally previews the production build

### External Resources
- **Stitch Project:** [Solar Lead Pro PV-Konfigurator](https://stitch.google.com/projects/3955599241460119046)
- **Asset Directory:** `/.stitch/designs/` (Raw HTML/CSS reference)

---

## Bereich 3: Seiten-Baum & Komponenten

LandingPage (Marketing & Einstieg)      → docs/maps/map-auth.md
  ├── Navbar (Global)
  ├── HeroSection (PLZ-Check)
  └── Footer (Global)

ConfiguratorPage (Wizard)               → docs/maps/map-configurator.md
  ├── StepRoof
  ├── StepEnergy
  ├── StepGrants
  ├── StepResult (ROI-Dashboard)
  └── StepLeadForm

Auth-Flow                               → docs/maps/map-auth.md
  ├── LoginPage (/login)
  ├── CustomerRegistrationPage (/register)
  └── InstallerRegistrationPage (/register-installer)

Kunden-Dashboard                        → docs/maps/map-dashboard.md
  ├── DashboardPage (/dashboard)
  │   ├── ProjectStatusSection
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
  │   └── KanbanColumn (LeadCard)
  ├── ProjectDetailsPage (/details)      → docs/maps/map-project-details.md
  │   ├── CustomerDataSection
  │   ├── ConfigSummarySection
  │   └── ProjectChatSection
  ├── CalendarPage (/calendar)           → docs/maps/map-calendar.md
  │   └── CalendarGrid (CalendarEvent)
  └── BusinessStatsPage (/stats)         → docs/maps/map-stats.md
      ├── StatsKpiCard
      └── LeadDevelopmentChart

Layout & Navigation                     → docs/maps/map-layout.md
                                        → docs/maps/map-navigation.md
  ├── SideNavBar (Customer)
  ├── TopAppBar (Customer)
  ├── InstallerSideNavBar
  └── InstallerTopAppBar
