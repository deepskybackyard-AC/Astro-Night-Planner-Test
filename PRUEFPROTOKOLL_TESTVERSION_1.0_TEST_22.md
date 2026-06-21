# Prüfprotokoll Testversion 1.0-test.22

## Automatische Prüfung

- JavaScript-Syntaxprüfung für `assets/app.js`.
- JavaScript-Syntaxprüfung für die Skripte aus `aladin-frame.html`.
- JSON-Prüfung für `VERSION.json`, `manifest.webmanifest`, `package.json` und `package-lock.json`.
- PDF-Handbücher aus den aktualisierten HTML-Handbüchern neu erzeugt.
- ZIP-Datei neu aufgebaut und Integrität geprüft.

## Manuell zu testen

1. In der Aladin-/Objektkartenansicht **Mond anzeigen** aktivieren.
2. Prüfen, ob kein Fadenkreuz/Zielkreis mehr als Mond erscheint, sondern ein kleines Mondsymbol mit beleuchtetem Anteil und Beschriftung **Mond** beziehungsweise **Moon**.
3. Den Regler **Zeit im Planungsfenster** bewegen und prüfen, ob Mondposition, Beleuchtung und Symbol aktualisiert werden.
4. Im Basisfilter prüfen, ob der Hinweis **Mindestzeit über Mindesthöhe und persönlichem Horizont** auf breiten Bildschirmen einzeilig bleibt.
5. In Firefox prüfen, ob Zahlenfelder ohne Hoch-/Runter-Pfeile angezeigt werden.
6. Direktsuche und normale Suche aus Test 21 kurz gegenprüfen, damit die Layoutkorrektur keine Regression verursacht hat.
