# Installation Astro Night Planner 1.0.0-test.17

Diese Testversion ist für das Test-Repository vorgesehen.

## Hochladen

1. ZIP-Datei lokal entpacken.
2. Den gesamten Inhalt des entpackten Ordners in das GitHub-Test-Repository übernehmen.
3. Alte Dateien im Repository ersetzen.
4. Commit erstellen und GitHub Pages/Actions abwarten.

## Nach dem Deployment prüfen

- Version im Infobereich: `1.0.0-test.17`.
- Service Worker/Cache aktualisiert: Seite hart neu laden oder Updatehinweis bestätigen.
- Aladin-Survey `DSS2 red (nativ schwarzweiß)` muss schwarzweiß erscheinen, nicht pink/rot/violett.
- Andere Surveys müssen in ihrer nativen Aladin-Darstellung erscheinen.
- Hilfe und PDF-Handbuch öffnen in der aktiven Sprache.

## Wichtiger Testhinweis

Falls die Aladin-Ansicht nach dem Update weiterhin farbig oder alt wirkt, zuerst den PWA-/Service-Worker-Cache für die Testdomain löschen oder die Seite mit deaktiviertem Cache neu laden. Die Version 1.0.0-test.17 enthält einen neuen Cache-Namen.
