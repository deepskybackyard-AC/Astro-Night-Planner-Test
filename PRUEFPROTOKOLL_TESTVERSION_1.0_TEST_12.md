# Prüfprotokoll 1.0.0-test.12

## Automatisierte Prüfungen

- JavaScript-Syntaxprüfung mit `node --check assets/app.js` erfolgreich.
- JSON-Strukturprüfung für Manifest- und Versionsdateien erfolgreich.
- Service-Worker-Version und Build-Konfiguration auf `1.0.0-test.12` gesetzt.
- ZIP-Integrität mit `unzip -t` erfolgreich geprüft.

## Inhaltliche Prüfung

- Fehlerquelle `framingStatusLabel` durch definierte Rahmungsbeschriftungsfunktion geschlossen.
- Zielsuche normalisiert kompakte Katalogschreibweisen wie `ngc7000`.
- Objekttyp-Logik auf „mindestens ein Typ erforderlich“ geändert.
- Objektlisten-Konfiguration ohne übergeordnetes Aufklappen umgesetzt.
- Geöffneter Zustand der Kompakt/Standard/Detailliert-Liste bleibt nach Verschieben erhalten.

## Extern zu prüfen

Nach Upload auf GitHub Pages müssen geprüft werden:

- Aladin Lite und Rahmungsansicht.
- Open-Meteo-Wetterdaten.
- OpenFreeMap/Wolkenkarte.
- Meteoblue-Verknüpfung.
- PWA-Installation und Service-Worker-Update im Browser.
