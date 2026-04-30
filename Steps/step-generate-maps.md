# STEP: Generate Maps → DNA Bereich 3 + docs/maps/
# In Cursor oder Antigravity einfügen und ausführen lassen
# Wann: Nachdem alle UI-Komponenten fertig sind

---

Analysiere alle Komponenten in src/components/ und erstelle folgendes:

## 1. Seiten-Baum — DNA Bereich 3

Aktualisiere Bereich 3 in der DNA-Datei (*-DNA.md) mit einer flachen Übersicht:
- Jede Seite mit ihren Sections aufgelistet
- Jede Zeile mit Verweis auf die zugehörige Map-Datei
- Format:

```
Homepage                          → docs/maps/map-homepage.md
  ├── HeroSection
  ├── TrustBar
  └── CTABlock

Solutions                         → docs/maps/map-solutions.md
  ├── SolutionsHero
  └── SolutionCards

Layout + geteilte UI              → docs/maps/map-layout.md
                                  → docs/maps/map-ui-shared.md
```

## 2. Seiten-Maps — docs/maps/map-SEITENNAME.md

Erstelle für jede Seite eine eigene Map-Datei.
Analysiere nur Stufe 1 — lies maximal die ersten 30 Zeilen jeder Komponente.

Regeln:
- NUR seiten-spezifische Sections und Komponenten
- KEINE Layout-Komponenten (Header, Footer, Nav) — die kommen in map-layout.md
- KEINE geteilten UI-Komponenten (Button, Badge, Card) — die kommen in map-ui-shared.md

Format pro Map-Datei:
```
# map-SEITENNAME.md
# Letzte Aktualisierung: DATUM

## Seite: SEITENNAME
Route: /ROUTE

## Sections & Komponenten

### HeroSection
Datei:   src/components/sections/HeroSection.tsx
Props:   headline, subline, ctaText, ctaHref
Imports: Button (→ map-ui-shared.md), SplineScene
```

## 3. Layout-Map — docs/maps/map-layout.md

Alle Layout-Komponenten zentral in einer Datei:
Header, Footer, Nav, Sidebar — alles was auf jeder Seite vorkommt.

## 4. Shared UI-Map — docs/maps/map-ui-shared.md

Alle UI-Komponenten die auf mehr als einer Seite vorkommen:
Button, Badge, Card, Modal, Input etc.
Jede mit: Dateiname, Props, welche Seiten sie verwenden.

## 5. Navigations-Map — docs/maps/map-navigation.md (nur bei App-Projekten)

Prüfe zuerst ob es sich um ein App-Projekt handelt:

```
Flutter        → pubspec.yaml vorhanden
React Native   → package.json enthält "react-native"
Komplexe SPA   → package.json enthält "react-router" ODER mehr als 8 Pages/Routes
Website        → keines davon → map-navigation.md WEGLASSEN
```

Nur wenn App-Projekt erkannt: Erstelle docs/maps/map-navigation.md

Format:
```
# map-navigation.md
# Navigations-Graph — nur für App-Projekte
# Letzte Aktualisierung: DATUM

## Screen-Graph

Auth-Flow:
  SplashScreen → LoginScreen → HomeScreen
  SplashScreen → RegisterScreen → HomeScreen

Haupt-Navigation:
  HomeScreen → RecipeDetailScreen (param: recipeId)
  HomeScreen → ProfileScreen
  HomeScreen → ShoppingScreen → ShoppingDetailScreen (param: listId)

## Routes (z.B. go_router / react-router)
  /                → HomeScreen
  /recipe/:id      → RecipeDetailScreen
  /profile         → ProfileScreen
  /shopping        → ShoppingScreen
  /shopping/:id    → ShoppingDetailScreen

## Shared State zwischen Screens
  authState        → alle Screens
  cartState        → HomeScreen, ShoppingScreen, ShoppingDetailScreen

## Deep-Links (falls vorhanden)
  cooksy://recipe/:id   → RecipeDetailScreen
```

Wenn kein App-Projekt → diesen Schritt komplett überspringen, keine Datei erstellen.

---

Erstelle docs/maps/ falls der Ordner nicht existiert.
Benenne Dateien kebab-case: map-homepage.md, map-solutions.md etc.
Bereich 1 und 2 der DNA-Datei NICHT verändern.
