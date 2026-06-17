# Installation der Testversion 1.0.0-test.6

Diese Fassung ist ein **kumulatives Update**. Die Teststände 2 bis 5 müssen nicht vorher installiert werden. Voraussetzung ist das bestehende Test-Repository mit der vollständigen Projektbasis und dem Objektkatalog unter `src/data/catalog.generated.json`.

## Installation

1. Vorhandene Testeinstellungen bei Bedarf über **Info, Hilfe & Sicherung** extern sichern.
2. ZIP-Datei entpacken.
3. Den gesamten entpackten Inhalt in das Stammverzeichnis des Test-Repositorys kopieren beziehungsweise hochladen.
4. Gleichnamige Dateien ersetzen.
5. Den vorhandenen Ordner `src` nicht löschen.
6. Kontrollieren, dass `.github/workflows/deploy-pages.yml` vorhanden ist und keine Vite-Befehle wie `npm run build` ausführt.
7. Änderungen nach `main` committen und pushen.
8. Unter **Actions** den erfolgreichen Pages-Lauf abwarten.
9. Testseite neu laden. Bei einer installierten PWA einen angebotenen Updatehinweis bestätigen und die App anschließend neu öffnen.

## Erkennungsmerkmale

- gelb markierter Titel
- Badge **TESTVERSION**
- Browser-Titel **Korrektur 6**
- Version `1.0.0-test.6` unter **Info, Hilfe & Sicherung**
- Testdatenbank `astro-night-planner-test-v1`
- Service-Worker-Cache `astro-night-planner-test-1.0.0-test.6`

## Nach dem Update besonders prüfen

- Wolkenanimation mit 15, 30 und 60 Minuten
- stabilisierte Wolkenbewegungsrichtung
- Aladin-Kamerarahmen und Objektellipse beim Zoomen, Verschieben und Ändern der Fenstergröße
- Framingbewertung und optimale Rotation
- temporäre Auswahl von Teleskop und Kamera
- mehrere Horizontprofile und temporäre Profilauswahl in der Detailansicht
- PDF- und HTML-Handbuch
- automatische Sicherung und Wiederherstellung

Die Produktivumgebung bleibt unverändert. Ein Produktivpaket wird erst aus dem freigegebenen Teststand erstellt.
