# map-layout.md
# Letzte Aktualisierung: 2026-04-30

## Layout-Komponenten

### SideNavBar
Datei:   src/components/layout/SideNavBar.tsx
Rolle:   Hauptnavigation für Kunden (Dashboard, ROI, Dokumente, Support)
Imports: Link, useLocation (react-router-dom), LayoutDashboard, BarChart3, FolderClosed, MessageSquare, HelpCircle, LogOut, Sun (lucide-react)

### TopAppBar
Datei:   src/components/layout/TopAppBar.tsx
Rolle:   Header für Kunden mit Benachrichtigungen und Profil
Imports: Bell, Settings, User (lucide-react)

### InstallerSideNavBar
Datei:   src/components/layout/InstallerSideNavBar.tsx
Rolle:   Hauptnavigation für Installateure (Pipeline, Details, Kalender, Stats)
Imports: Link, useLocation (react-router-dom), LayoutDashboard, LayoutGrid, Calendar, BarChart3, HelpCircle, LogOut, Plus (lucide-react)

### InstallerTopAppBar
Datei:   src/components/layout/InstallerTopAppBar.tsx
Rolle:   Header für Installateure mit Suche, Benachrichtigungen und Profil
Imports: Search, Bell, Settings (lucide-react)

### Navbar
Datei:   src/components/layout/Navbar.tsx
Rolle:   Navigation für die Landing Page
Imports: Link (react-router-dom), Sun, ArrowRight, LogIn (lucide-react)

### Footer
Datei:   src/components/layout/Footer.tsx
Rolle:   Standard-Footer für die Landing Page
Imports: (keine)
