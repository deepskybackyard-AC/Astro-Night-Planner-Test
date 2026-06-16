# Astro Night Planner 1.0 – TEST-Repository

Dieses Paket gehört **ausschließlich in das Test-Repository** und ersetzt die vorherige Testfassung vollständig.

Die Testfassung ist eindeutig erkennbar an:

- gelb hinterlegtem Titel **Astro Night Planner**,
- sichtbarem Hinweis **TESTVERSION**,
- Dokumenttitel „TESTVERSION – Astro Night Planner 1.0 (Korrektur 2)",
- eigener IndexedDB `astro-night-planner-test-v1`,
- eigenem Service-Worker-Cache `astro-night-planner-test-*`.

## Installation

1. Den gesamten Inhalt dieses Pakets in das Stammverzeichnis des Test-Repositorys kopieren.
2. Gleichnamige Dateien ersetzen.
3. Den vorhandenen Ordner `src` einschließlich `src/data/catalog.generated.json` beibehalten.
4. Prüfen, dass `.github/workflows/deploy-pages.yml` ebenfalls vorhanden ist.
5. Commit und Push in den Branch `main` des Test-Repositorys.
6. Nach dem GitHub-Pages-Deployment die Testseite mit `Strg + F5` neu laden.
7. Prüfen, ob der Titel gelb ist und **TESTVERSION** erscheint.

## Wichtigste Funktionen und Korrekturen

- Klick auf die gesamte Objektzeile öffnet die Details direkt unter dem Objekt.
- Detailansicht besitzt einen eigenen Schließen-Button.
- Große Höhenkurve und Horizontansicht sind wieder vorhanden und auf-/zuklappbar.
- Initialzustand der beiden Detailgrafiken ist konfigurierbar; Default: eingeklappt.
- Aladin Lite öffnet zentriert und passend auf das Objekt gezoomt.
- Aladin-Grafik ist um 50 % höher.
- Meteoblue steht direkt unter den übrigen Wetterdaten.
- Planungszeitraum ist in der Planungsansicht auswählbar und steuert die Mini-Höhenprofile.
- Wetterwerte sind wieder farbig dargestellt.
- Gewichteter Modellkonsens aus DWD ICON, ECMWF IFS und NOAA GFS.
- Defaultgewichtung 40 % / 40 % / 20 %.
- Temporäre Anzeige einzelner Wettermodelle und Übernahme als Standard.
- Vorschaugrafik für den persönlichen Horizont.
- Gradwerte und Himmelsrichtungen in großen Höhen- und Horizontgrafiken.
- lokale Benutzerprofile in IndexedDB
- Profilverwaltung, Export, Import, Sicherung und Wiederherstellung
- installierbare PWA mit getrenntem Testcache und Updatehinweis
- browserbasierte Hilfe und aktualisiertes HTML-Handbuch

## Freigabe

Nach erfolgreichem Test wird **nicht dieses Paket** in Produktion übernommen. Dafür ist das separate kumulative Produktivpaket `astro-night-planner-v1.0-production-cumulative-corrected.zip` vorgesehen.
