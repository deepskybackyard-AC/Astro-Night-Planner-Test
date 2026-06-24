# Prüfprotokoll Testversion 1.1.0-test.13

Geprüft:

- JavaScript-Syntaxprüfung mit `node --check assets/app.js` erfolgreich.
- Proxy-URL-Eingabefeld `flightProxyUrl` markiert jetzt den sichtbaren Abschnitt `cloudMap` als geändert.
- Speichern des Abschnitts `cloudMap` synchronisiert die Flugwetter-Eingabefelder direkt aus dem DOM.
- `profile.central.flightWeather` wird beim Speichern des Abschnitts dauerhaft aktualisiert.
- Flugwetterdaten-Cache wird nach Änderung verworfen.
