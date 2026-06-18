# Installation der Testversion 1.0.0-test.8

Dieses Paket ist kumulativ. Frühere Testpakete müssen nicht nacheinander installiert werden.

## Vorgehen im Test-Repository

1. Vorhandene Daten im Planner über **Gesamtsicherung exportieren** sichern.
2. ZIP-Datei vollständig entpacken.
3. Den gesamten Inhalt des entpackten Versionsordners in das Stammverzeichnis des Test-Repositorys kopieren.
4. Gleichnamige Dateien ersetzen. Den Ordner `src` und insbesondere `src/data/catalog.generated.json` nicht löschen.
5. Änderungen nach `main` committen und pushen.
6. Den erfolgreichen GitHub-Pages-Lauf unter **Actions** abwarten.
7. Die Testseite vollständig neu laden und einen angebotenen PWA-Updatehinweis bestätigen.

## Erwarteter Stand

- gelbe Kennzeichnung **TESTVERSION**
- Browser-Titel **Korrektur 8**
- Version `1.0.0-test.8`
- Cache `astro-night-planner-test-1.0.0-test.8`
- weiterhin getrennte Testdatenbank `astro-night-planner-test-v1`
- Profilschema 6

## Nach dem Update gezielt prüfen

- Logo, Homepage und Copyright in der mittleren Titelzeile
- auf- und zuklappbare Bereiche **Profile für diese Planung**, **Wetter und Aufnahmequalität** sowie **Stündlicher Wetterverlauf**
- Standardzustände dieser Bereiche in den Einstellungen
- Wolkenkarte nach Datums-, Zeit-, Modell- und Schichtwechsel
- gleichbleibende Kartengröße sowie Umschaltung **Karte + Wolken** / **Nur Wolken**
- dunkle topografische Basiskarte, klar sichtbare weiße Wolken und orange Prozentwerte
- temporäre Glättung **Strukturiert**, **Ausgewogen**, **Weich**
- M31-Objektellipse: vollständige Achsen, Achsenverhältnis und Positionswinkel
- **Rahmen auf Bildmitte** nach manuellem Verschieben des Aladin-Bildes
- Zeitregler mit Uhrzeit, Höhe, Azimut/Himmelsrichtung, Horizontabstand und Wetterwerten
- **Gesamtsicherung exportieren**, **Aktuelles Profil exportieren** und **Profil importieren**
- Fußzeilenlinks und Dialoge für Impressum, Datenschutz, Nutzungshinweise, Datenquellen/Lizenzen und Version

Bei einem hartnäckig alten Stand die installierte PWA vollständig schließen, erneut öffnen und das Update bestätigen. Websitedaten nur nach einer aktuellen externen Sicherung löschen.
