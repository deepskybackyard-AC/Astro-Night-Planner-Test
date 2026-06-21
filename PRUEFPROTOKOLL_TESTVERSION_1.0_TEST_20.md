# Prüfprotokoll 1.0.0-test.20

Geprüft im Erstellungsumfeld:

- JavaScript-Syntax von `assets/app.js` mit `node --check` geprüft.
- Script im externen `aladin-frame.html` extrahiert und mit `node --check` geprüft.
- `VERSION.json` und `package.json` als gültiges JSON geprüft.
- Service-Worker-Version und Build-Konfiguration auf `1.0.0-test.20` aktualisiert.
- PDF-Handbücher aus HTML neu erzeugt und deutsche PDF-Stichprobe gerendert.
- ZIP-Archiv erstellt und Integrität geprüft.

Im Browser nach Upload zusätzlich prüfen:

- Updatehinweis/PWA-Neuladen und Anzeige von Version test.20.
- Pfeile bei auf-/zuklappbaren Bereichen.
- Ausrichtung der Basisfilter.
- Wikipedia-Spalte in der Objektliste: Symbol öffnet Wikipedia, Zeilenklick öffnet Details.
- Aladin-Popup: Schließen-Button und keine doppelten Katalognummern.
- Wikipedia-Suche aus Popup und Detailansicht mit bereinigtem Suchbegriff.
- Objektumriss im externen Tab: zeichnen, schließen, speichern, neu öffnen, in Hauptansicht prüfen, löschen, Fallback prüfen.
- Bei gespeicherten Umrissen darf keine zusätzliche Ellipse/Kreis-Fallbackanzeige erscheinen.
