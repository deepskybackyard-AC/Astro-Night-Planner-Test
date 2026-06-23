# Prüfprotokoll 1.1.0-test.8

Geprüft:

- JavaScript-Syntax `assets/app.js`
- Service-Worker-Syntax `sw.js`
- JSON-Syntax `VERSION.json`, `manifest.webmanifest`, Katalogdateien
- ZIP-Integrität
- Vorhandensein `.github/workflows/deploy-pages.yml`

Fachliche Hinweise:

- METAR/TAF werden über NOAA AviationWeather vorbereitet. Die API kann browserseitig durch CORS blockieren; Direktlinks bleiben verfügbar.
- MOSMIX/Punktprognose nutzt Bright Sky/DWD-Daten und kann je nach Verfügbarkeit der externen Quelle fehlschlagen.
