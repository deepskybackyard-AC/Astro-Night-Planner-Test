# Prüfprotokoll – Astro Night Planner 1.0.0-test.2

Prüfdatum: 16.06.2026

## Automatisch geprüft

- JavaScript-Syntax mit Node.js
- Start der Testfassung im Chromium-Browser
- eindeutige Testkennzeichnung und getrennte Testkonfiguration
- Laden und gewichtetes Zusammenführen von drei simulierten Wettermodellen
- Defaultgewichtung 40 % ICON / 40 % ECMWF / 20 % GFS
- Umschaltung vom Modellkonsens auf NOAA GFS
- Übernahme der Wetterdarstellung als Standard
- Klick auf eine Objektzeile
- Einfügen der Details direkt unter der angeklickten Zeile
- separater Schließen-Button der Detailansicht
- Höhenkurve und Horizontansicht initial eingeklappt
- lokaler Aladin-Aufruf mit Objektkoordinaten und berechnetem Gesichtsfeld
- Aladin-Höhe 645 px
- Speichern des Standard-Planungszeitraums und unmittelbare Übernahme in der Planung
- Anpassung des Mini-Höhenprofils an die astronomische Nacht
- Vorschaugrafik des Horizonteditors und Live-Aktualisierung
- farbige Wetterzellen für gute, mittlere und schlechte Bedingungen
- Produktivkonfiguration ohne gelbe Testkennzeichnung
- Service-Worker-Kernpfade und getrennte Cache-Namen

## Ergebnis

Die automatischen Syntax- und Browser-Smoke-Tests wurden ohne JavaScript-Laufzeitfehler abgeschlossen.

## Noch im veröffentlichten Test-Repository zu prüfen

- echtes Aladin-Lite-Himmelsbild und externe DSS-Daten
- reale Open-Meteo-Daten aller drei Modelle
- Meteoblue-Einbettung
- Verhalten auf iPhone, Android und installierter PWA
- Cache-Aktualisierung nach dem GitHub-Pages-Deployment
- Bedienbarkeit mit dem vollständigen Objektkatalog aus `src/data/catalog.generated.json`
