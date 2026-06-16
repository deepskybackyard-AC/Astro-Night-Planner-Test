# Astro Night Planner 1.0 – TEST-Repository

Dieses Paket gehört **ausschließlich in das Test-Repository** und aktualisiert die Testfassung auf **1.0.0-test.4**.

Die Testfassung ist eindeutig erkennbar an:

- gelb hinterlegtem Titel **Astro Night Planner**,
- sichtbarem Hinweis **TESTVERSION**,
- Dokumenttitel „TESTVERSION – Astro Night Planner 1.0 (Korrektur 4)",
- eigener IndexedDB `astro-night-planner-test-v1`,
- eigenem Service-Worker-Cache `astro-night-planner-test-*`.

## Installation

1. Den gesamten Inhalt dieses Pakets in das Stammverzeichnis des Test-Repositorys kopieren.
2. Gleichnamige Dateien ersetzen.
3. Den vorhandenen Ordner `src` einschließlich `src/data/catalog.generated.json` beibehalten.
4. Prüfen, dass `.github/workflows/deploy-pages.yml` weiterhin vorhanden ist.
5. Commit und Push in den Branch `main` des Test-Repositorys.
6. Nach dem GitHub-Pages-Deployment die Testseite mit `Strg + F5` neu laden.
7. Prüfen, ob der Titel gelb ist und **TESTVERSION** erscheint.

## Neu in Testkorrektur 4

- Meteoblue Astronomy Seeing wieder über den speziellen einbettbaren Widget-Endpunkt integriert.
- Zusätzliche eingebettete Meteoblue-Wetterkarte mit Satellit, Wolken/Niederschlag, Wind, Böen, Temperatur und weiteren Ebenen.
- Eigene animierte 24-Stunden-Wolkenkarte rund um den gewählten Aufnahmeort.
- Gewichteter Modellkonsens aus DWD ICON, ECMWF IFS und NOAA GFS sowie Auswahl jedes Einzelmodells.
- Umschaltung zwischen Gesamtbewölkung, tiefen, mittleren und hohen Wolken.
- Eigener Kartenmodus **Modellabweichung** zur Anzeige widersprüchlicher Prognosen.
- Anzeige des nächsten voraussichtlich klaren Fensters.
- Schätzung der Wolkenverlagerungsrichtung aus aufeinanderfolgenden Kartenstunden.
- Optional synchronisierte Kartenzeit mit Höhenkurve, Horizontansicht und Framing.
- Vergleich der gespeicherten Beobachtungsstandorte.
- Neue Einstellung **Wolkenkarte und Datenmenge** mit 25, 49 oder 81 Kartenpunkten, 60/120/200 km Radius, Animationsgeschwindigkeit sowie Standardansichten.
- 90-minütiger lokaler Zwischenspeicher der Kartenrohdaten.

## Bereits enthaltene Korrekturen

- gesamte Objektzeile öffnet die Details unmittelbar unter dem Objekt,
- Detailansicht lässt sich schließen,
- große Höhenkurve und Horizontansicht mit synchronisierten Zeitreglern,
- Dämmerungslegende, stündliche Höhe und Himmelsrichtung,
- zentrierte und vergrößerte Aladin-Rahmungsansicht,
- farbige Wettertabelle und gewichtete Wettermodellansicht,
- Vorschaugrafik für den persönlichen Horizont,
- lokale Profile, Export/Import, Sicherung/Wiederherstellung und getrennte Test-PWA.

## Freigabe

Nach erfolgreichem Test wird **nicht dieses Testpaket** in Produktion übernommen. Das kumulative Produktivupdate wird erst aus dem abschließend freigegebenen Teststand erzeugt.
