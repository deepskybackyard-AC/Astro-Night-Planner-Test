# Installation der Testversion 1.0.0-test.9

Diese Fassung ist ein **kumulatives Update** für das separate Test-Repository. Frühere Testversionen müssen nicht vorher installiert werden.

## Vorher sichern

1. Im Astro Night Planner unter **Einstellungen → Info** eine Gesamtsicherung exportieren.
2. Die Sicherungsdatei außerhalb des Browserprofils aufbewahren.
3. Bestehende Websitedaten nicht löschen. Profile und Einstellungen liegen in IndexedDB.

## Dateien in GitHub ersetzen

1. Das ZIP-Paket entpacken.
2. Den gesamten Inhalt des entpackten Projektordners in das Test-Repository kopieren.
3. Vorhandene Dateien ersetzen; den Ordner `src` vollständig beibehalten.
4. Änderungen in den Branch `main` übertragen.
5. Unter **Actions** warten, bis „Deploy Astro Night Planner to GitHub Pages“ erfolgreich beendet ist.

Der Workflow kopiert den Objektkatalog aus `src/data/catalog.generated.json` nach `assets/catalog.generated.json` und veröffentlicht anschließend die statische Anwendung.

## Versionskontrolle

Nach der Veröffentlichung muss in der Titelzeile beziehungsweise im Versionsdialog stehen:

- Version `1.0.0-test.9`
- Umgebung `TESTVERSION`
- Cache `astro-night-planner-test-1.0.0-test.9`

Falls noch die vorherige Fassung erscheint, die Seite einmal vollständig neu laden. Der geänderte Service-Worker-Cache entfernt alte Test-Caches bei der Aktivierung.

## Besonders zu prüfen

- Topografische Struktur unter den Wolken in **Karte + Wolken**
- Umschaltung **Karte + Wolken / Nur Wolken**
- Schalter **Niederschlag**, **Regen** und **Schnee** in der Kartenlegende
- Datums-, Zeit-, Modell- und Wolkenschichtwechsel
- Aufklapp-Pfeile links an den neuen Rubriken
- Objektellipse bereits beim ersten Öffnen im Katalogwinkel
- **Objektausrichtung zurücksetzen** nach manueller Objektrotation
- **Rahmen auf Bildmitte** nach manuellem Verschieben der Aladin-Ansicht

Die externen Live-Dienste OpenFreeMap, Open-Meteo und Aladin Lite können erst in der veröffentlichten GitHub-Pages-Fassung vollständig geprüft werden.
