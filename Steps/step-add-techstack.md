# STEP: Add Tech-Stack → DNA Bereich 2
# In Antigravity einfügen und ausführen lassen

---

Lies die DNA-Datei im aktuellen Projektordner (*-DNA.md).
Bereich 1 ist bereits befüllt — er enthält Vision, Seiten und User-Flows.

Deine Aufgaben:

1. REPO-GERÜST erstellen basierend auf Bereich 1
   Wähle einen passenden modernen Stack und installiere alle Dependencies.

2. DNA BEREICH 2 befüllen
   Trage den echten Stack ein den du installiert hast — keine Platzhalter:
   - Framework
   - Styling
   - Sprache
   - Package Manager
   - CMS (falls relevant)
   - Auth / Backend (falls relevant)
   - 3D / Animation (falls relevant)
   - Deployment
   - Dateistruktur (echte Ordnerstruktur die du erstellt hast)
   - Konventionen (PascalCase Komponenten, kebab-case Ordner etc.)
   - Scripts (dev, build, start)
   - Externe Ressourcen (Spline-URL, CMS-Project, GitHub-Repo, Vercel-URL)

   Bereich 1 und Bereich 3 NICHT verändern.

3. .claudeignore erstellen
   Erstelle eine .claudeignore Datei im Projektstamm mit folgendem Inhalt:

   node_modules/
   .next/
   .nuxt/
   dist/
   build/
   .cache/
   .agent/
   .agents/
   *.log
   .env
   .env.*
   coverage/
   .turbo/

4. UI Modularisierung / Refactoring (für importierte Monolithen)
   Sollten Screens als HTML/JSX-Monolithe importiert worden sein (z. B. aus UI-Tools wie Stitch):
   - Zerlege die riesigen Component-Dateien (aus `src/app/` o. Ä.) in saubere, kleine React-Komponenten.
   - Extrahiere Layout-Teile (Header, Footer, Navbar) nach `src/components/layout/`.
   - Extrahiere wiederverwendbare UI-Elemente (Button, Card, Input) nach `src/components/ui/`.
   - Extrahiere funktionale Seiten-Abschnitte (HeroSection, Grid) nach `src/components/sections/`.
   - **Infrastructure Check:** Stelle sicher, dass das Styling-System (z. B. Tailwind + PostCSS) korrekt konfiguriert ist, alle nötigen Dependencies installiert sind und Dateien wie `postcss.config.js` vorhanden sind, damit die importierten Klassen auch tatsächlich gerendert werden.
   - Bereinige die Imports und exportiere saubere Haupt-Seiten.

5. GitHub Push
   Repo initialisieren und pushen.

Wichtig:
- DNA Bereich 3 (Seiten-Baum) wird NICHT von dir erstellt
- docs/maps/ wird NICHT von dir erstellt
- Beides übernimmt step-generate-maps.md nach der UI-Fertigstellung
