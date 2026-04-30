# map-configurator.md
# Letzte Aktualisierung: 2026-04-29

## Seite: ConfiguratorPage
Route: / (State: isConfiguring = true)

## Sections & Komponenten

### StepRoof (Schritt 1)
Datei:   src/components/sections/StepRoof.tsx
Sektionen:
  - **Dachausrichtung**: Radio-Cards für Süd, Ost/West, Nord
  - **Dachfläche & Baujahr**: Numerisches Input & Dropdown
  - **Sanierungshinweis**: Bedingte Warnung für Häuser vor 1980
Props:   data, onUpdate, onNext, onPrev

### StepEnergy (Schritt 2)
Datei:   src/components/sections/StepEnergy.tsx
Sektionen:
  - **Verbrauchsanalyse**: Haushaltsgröße-Cards & Schieberegler für kWh
  - **Zukunftsausblick**: Toggles für E-Auto (Wallbox) & Wärmepumpe
  - **System-Setup**: Toggle für Stromspeicher & Strompreis-Slider
Props:   data, onUpdate, onNext, onPrev

### StepGrants (Schritt 3)
Datei:   src/components/sections/StepGrants.tsx
Sektionen:
  - **Förderübersicht**: Grid mit Bundesweiten & Regionalen Förderungen
Props:   onNext, onPrev

### StepResult (Schritt 4)
Datei:   src/components/sections/StepResult.tsx
Sektionen:
  - **ROI-Dashboard**: Karten für Ersparnis, Amortisation und Autarkie
  - **Zusammenfassung**: Tabellarische Auflistung der Konfiguration
Props:   data, onNext

### StepLeadForm (Schritt 5)
Datei:   src/components/sections/StepLeadForm.tsx
Sektionen:
  - **Kontaktdaten**: Formular für Name, Email, Telefon
  - **Trust-Faktoren**: Siegel und Datenschutz-Hinweise
Props:   data, onNext, onPrev

### StepConfirmation (Schritt 6)
Datei:   src/components/sections/StepConfirmation.tsx
Sektionen:
  - **Erfolgsmeldung**: Check-Animation & Bestätigungstext
  - **Konfigurations-Review**: Zusammenfassung der gewählten Optionen
  - **Nächste Schritte**: Timeline-Visualisierung (Dach-Check, Angebot, Montage)
Props:   data

### ConfiguratorSidebar
Datei:   src/components/sections/ConfiguratorSidebar.tsx
Sektionen:
  - **Fortschrittsbalken**: Anzeige des aktuellen Schritts
  - **Echtzeit-Berechnung**: Dynamische Schätzung der Systemgröße & Ersparnis
Props:   currentStep, data
