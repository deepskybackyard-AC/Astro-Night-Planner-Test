# Prüfprotokoll – Astro Night Planner 1.0.0-test.3

## Automatisch geprüft

- JavaScript-Syntax mit Node.js
- JSON-Syntax von `VERSION.json` und `manifest.webmanifest`
- Service-Worker-Cacheversion `1.0.0-test.3`
- Vorhandensein aller statischen Kern-Dateien
- getrennte Testkonfiguration und Testdatenbank

## Im Browser geprüft

- Start der Test-PWA über einen lokalen HTTP-Server
- gelbe Testkennzeichnung
- Planungszeitraum innerhalb `Profile für diese Planung`
- Öffnen der Objektdetails direkt unter der Tabellenzeile
- Aufklappen von Höhenkurve und Horizontansicht
- synchronisierte Zeitregler, Uhrzeitfeld und ±15-Minuten-Schritte
- Dämmerungslegende und stündliche Höhenkarten
- Markierung der aktuellen Aufnahmezeit in beiden Canvas-Grafiken
- Ein-/Ausblenden von Boden/Horizont
- Meteoblue-Bereich ohne blockiertes iframe

## Auf GitHub Pages noch zu prüfen

- externer Aladin-Aufruf und korrekte Objektzentrierung
- echte Wetterabfragen der drei Open-Meteo-Modelle
- Öffnen und Standortwahl bei Meteoblue
- Installation und Updateverhalten der PWA auf Desktop und Smartphone
