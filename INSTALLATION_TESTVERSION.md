# Installation der Testkorrektur 1.0.0-test.2

1. `astro-night-planner-v1.0-test-korrektur-2-update.zip` entpacken.
2. Im Test-Repository **Add file → Upload files** öffnen oder das Repository mit GitHub Desktop bearbeiten.
3. Den gesamten entpackten Inhalt hochladen und gleichnamige Dateien ersetzen.
4. Den bereits vorhandenen Ordner `src` nicht löschen.
5. Besonders prüfen, dass auch `.github/workflows/deploy-pages.yml` im Repository vorhanden ist.
6. Nach `main` committen.
7. Unter **Actions** warten, bis der Pages-Workflow grün abgeschlossen ist.
8. Die Testseite zunächst mit `Strg + F5` neu laden.
9. Falls noch die alte Fassung erscheint: Browserdaten beziehungsweise Service Worker nur für die Testadresse löschen und erneut laden.

Erwartete Kennzeichnung: gelber Titel und sichtbarer Hinweis `TESTVERSION`.

Das korrigierte kumulative Produktivpaket erst nach vollständiger Freigabe der Testversion verwenden.
