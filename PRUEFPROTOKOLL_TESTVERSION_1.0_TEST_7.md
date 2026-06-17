# Prüfprotokoll - Testversion 1.0.0-test.7

## Automatisch beziehungsweise statisch geprüft

- JavaScript-Syntax von `assets/app.js`
- JavaScript-Syntax des eingebetteten Aladin-Skripts
- JSON-Syntax von `VERSION.json` und `manifest.webmanifest`
- explizite Testkonfiguration und Cache-Version `1.0.0-test.7`
- Vorhandensein aller im Service Worker referenzierten lokalen Dateien
- Qualitätsdefaults 60/80 und Validierungslogik
- nautischer Zeitraum in der Berechnung „Beste Stunde“
- 900-ms-Debounce sowie Enter-/Button-Auslösung
- Konfigurationsdaten für Sichtbarkeit und Reihenfolge der Objektlisteninformationen
- Nominatim-Trefferlistenlogik und IANA-Zeitzonenliste
- einheitliche weiße Wolkenfarbskala und drei Glättungsstufen
- kein `render()` beim Ändern von Kamera- oder Objektrotation
- Aladin-Nachrichten für Rahmen, Objektellipse und Beschriftungsebene
- PDF-Handbuch vollständig gerendert: 16 Seiten; Titelseite, Mittelteil und Schlussseite visuell kontrolliert

## Nach Veröffentlichung auf GitHub Pages zu prüfen

- echte OpenFreeMap-/MapLibre-Basiskarte und Attribution
- Suche nach `72108` und Auswahl von Rottenburg am Neckar
- echte Aladin-Ellipse bei M31 und anderen länglichen Objekten
- zoomabhängige Beschriftung mit dem vollständigen Katalog
- kein Survey-Reload bei Rotation
- Verhalten auf Desktop, Smartphone und installierter PWA
- externe Meteoblue-, Open-Meteo- und Aladin-Verbindungen

## Hinweis zur Browserprüfung

Die lokale Browsernavigation war in der Erstellungsumgebung durch eine Administratorrichtlinie blockiert. Deshalb wurden keine erfolgreichen lokalen End-to-End-Browsertests behauptet. Die genannten externen und interaktiven Punkte müssen auf der veröffentlichten Testseite geprüft werden.
