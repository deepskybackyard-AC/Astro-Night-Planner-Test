# Installation der Testversion 1.0.0-test.7

Dieses Paket ist kumulativ. Test 2 bis Test 6 müssen nicht erneut installiert werden.

## Vorgehen im Test-Repository

1. ZIP-Datei vollständig entpacken.
2. Den gesamten Inhalt in das Stammverzeichnis des Test-Repositorys kopieren.
3. Gleichnamige Dateien ersetzen.
4. Den vorhandenen Ordner `src` und insbesondere `src/data/catalog.generated.json` nicht löschen.
5. Prüfen, dass `.github/workflows/deploy-pages.yml` weiterhin den statischen Inhalt veröffentlicht.
6. Nach `main` committen und pushen.
7. Den erfolgreichen GitHub-Pages-Lauf unter **Actions** abwarten.
8. Die Testseite neu laden und einen angebotenen PWA-Updatehinweis bestätigen.

## Erwarteter Stand

- gelbe Kennzeichnung **TESTVERSION**
- Browser-Titel **Korrektur 7**
- Version `1.0.0-test.7`
- Cache `astro-night-planner-test-1.0.0-test.7`
- weiterhin eigene Testdatenbank `astro-night-planner-test-v1`

## Nach dem Update gezielt prüfen

- M31-Objektellipse: Größe, Achsenverhältnis und Positionswinkel
- Zoom, Pan und Rotation in Aladin ohne unnötiges Neuladen
- zoomabhängige Objektnamen und Katalognummern
- Rubrik-Reset und anschließendes Speichern
- Qualitätsgrenzen 60/80
- „Beste Stunde“ innerhalb des nautischen Zeitraums
- verzögerte Textfilterung und sofortige Suche mit Enter
- Sichtbarkeit und Reihenfolge der Objektlisteninformationen
- topografische Wolkenkarte, weiße Wolken und drei Glättungsstufen
- Standortsuche für `72108` mit deutscher Trefferliste
- Zeitzonen-Auswahlliste

Bei einem hartnäckig alten Stand die PWA vollständig schließen, neu öffnen und den neuen Updatehinweis bestätigen. Websitedaten nicht ohne aktuelle Sicherung löschen.
