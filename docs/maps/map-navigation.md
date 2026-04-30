# map-navigation.md
# Navigations-Graph — Solar Lead Pro
# Letzte Aktualisierung: 2026-04-30

## Screen-Graph

### Public / Marketing Flow
LandingPage (/) → ConfiguratorPage (/configurator)
LandingPage (/) → LoginPage (/login) → (Dashboard ODER Pipeline)
LoginPage (/login) → CustomerRegistrationPage (/register)
LoginPage (/login) → InstallerRegistrationPage (/register-installer)

### Customer Dashboard Flow
DashboardPage (/dashboard)
  ├── ROIPage (/roi)
  ├── DocumentsPage (/documents)
  └── SupportChatPage (/support)

### Installer Management Flow
LeadPipelinePage (/pipeline)
  ├── ProjectDetailsPage (/project-details)
  ├── CalendarPage (/calendar)
  └── BusinessStatsPage (/stats)

## Routes (react-router-dom)
/                       → LandingPage
/configurator           → ConfiguratorPage
/login                  → LoginPage
/register               → CustomerRegistrationPage
/register-installer     → InstallerRegistrationPage
/dashboard              → DashboardPage
/roi                    → ROIPage
/documents              → DocumentsPage
/support                → SupportChatPage
/pipeline               → LeadPipelinePage
/project-details        → ProjectDetailsPage
/stats                  → BusinessStatsPage
/calendar               → CalendarPage

## Shared State / Context (Geplant)
- AuthContext: User Rolle (Kunde/Installateur), Login-Status
- ProjectContext: Aktuelle Konfigurationsdaten (aus ConfiguratorPage)
