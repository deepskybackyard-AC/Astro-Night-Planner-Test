# Astro Night Planner 1.0 – TEST-Repository

Dieses Paket gehört **ausschließlich in das Test-Repository**.

Die Testfassung ist eindeutig erkennbar an:

- gelb hinterlegtem Titel **Astro Night Planner**,
- sichtbarem Hinweis **TESTVERSION**,
- Dokumenttitel „TESTVERSION – Astro Night Planner 1.0“,
- eigener IndexedDB `astro-night-planner-test-v1`,
- eigenem Service-Worker-Cache `astro-night-planner-test-*`.

## Installation

1. Das Test-Repository muss auf dem aktuellen Stand des Produktiv-Repositorys basieren.
2. Den gesamten Inhalt dieses Pakets in das Stammverzeichnis des Test-Repositorys kopieren.
3. Gleichnamige Dateien ersetzen.
4. Den vorhandenen Ordner `src` einschließlich `src/data/catalog.generated.json` beibehalten.
5. Commit und Push in den Branch `main` des Test-Repositorys.
6. Nach dem GitHub-Pages-Deployment prüfen, ob der Titel gelb ist und **TESTVERSION** erscheint.

## Enthalten

- lokale Benutzerprofile in IndexedDB
- automatisch vorbelegtes Profil **Standard**
- Profilverwaltung, Export, Import, Sicherung und Wiederherstellung
- Dämmerung, Mond, persönliche Standorte und Horizont
- Wettervergleich aus ICON, ECMWF IFS und GFS über Open-Meteo
- Meteoblue-Kontrollansicht
- bewertete, gefilterte und paginierte Deep-Sky-Objektliste
- Mini-Höhenprofile passend zum gewählten Planungszeitraum
- Ausrüstung, Bildfeld und Aladin-Lite-Rahmung
- browserbasierte Hilfe und HTML-Handbuch
- installierbare PWA mit Offline-App-Shell und Updatehinweis

## Freigabe

Nach erfolgreichem Test wird **nicht dieses Paket** in Produktion übernommen. Dafür ist das separate Paket `astro-night-planner-v1.0-production-cumulative-update.zip` vorgesehen.
