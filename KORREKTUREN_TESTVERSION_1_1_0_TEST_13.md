# Korrekturen Testversion 1.1.0-test.13

- Fehler behoben: Die Flugwetter-Proxy-URL wurde im Abschnitt „Wolkenkarte und Datenmenge“ angezeigt, aber intern als Änderung der Wettermodelle behandelt.
- Dadurch konnte der Nutzer im sichtbaren Abschnitt „Wolkenkarte speichern“ klicken, ohne dass die Proxy-URL dauerhaft gespeichert wurde.
- Die Flugwetter-Einstellungen werden jetzt beim Tippen im aktuellen Abschnitt als Änderung markiert.
- „Wolkenkarte speichern“ übernimmt jetzt Proxy-URL, automatische nächste Station und Stationsauswahl in das Profil und speichert sie in IndexedDB.
- Nach Änderung werden veraltete METAR/TAF-Daten gelöscht.
