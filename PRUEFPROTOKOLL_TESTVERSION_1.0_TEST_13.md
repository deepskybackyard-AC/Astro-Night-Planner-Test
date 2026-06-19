# Prüfprotokoll 1.0.0-test.13

Geprüft im Paket vor Auslieferung:

- JavaScript-Syntax mit `node --check assets/app.js`
- JSON-Syntax von `VERSION.json` und `manifest.webmanifest`
- Versionsstände in `VERSION.json`, `assets/build-config.js`, `sw.js`, `public/sw.js`, `dist/sw.js`
- ZIP-Erstellung und Dateiintegrität

Nach dem Upload auf GitHub Pages zusätzlich im Browser prüfen:

- Darstellung und Bedienung der Objektfilter auf Desktop und Smartphone
- Filterung und Speichern in „Meine Aufnahmeziele“
- Öffnen von Referenzlinks in neuem Tab
- PWA-Update/Service-Worker-Aktualisierung
- Live-Dienste: Open-Meteo, OpenFreeMap, Meteoblue und Aladin Lite
