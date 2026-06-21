# Prüfprotokoll Testversion 1.0-test.23

## Automatisierte Prüfungen

- JavaScript-Syntaxprüfung `assets/app.js`: bestanden.
- JavaScript-Syntaxprüfung der Skripte aus `aladin-frame.html`: bestanden.
- JSON-Prüfung `VERSION.json`, `manifest.webmanifest`, `package.json`, `package-lock.json`: bestanden.
- Service-Worker-Version geprüft: `1.0.0-test.23`.
- PDF-Handbücher DE/EN aus HTML neu erzeugt.
- PDF-Handbücher stichprobenartig gerendert und geprüft.
- ZIP-Integritätstest durchgeführt.

## Funktionale Prüfpunkte

- Mondanzeige nutzt pixelstabiles SVG/DOM-Symbol statt skalierender Aladin-Kreisgrafik.
- Beleuchteter Anteil wird hell/weiß dargestellt.
- Mondposition, Beschriftung und Phase werden gemeinsam aktualisiert.
- Button `Basisfilter zurücksetzen` ist neben `Filter anwenden` vorhanden.
- Reset betrifft nur Basisfilter und lässt andere Filtergruppen unverändert.

## Hinweise für den Praxistest

- Mondanzeige bitte im Browser bei mehreren Zoomstufen, Surveywechseln und Zeitreglerpositionen prüfen.
- Den Basisfilter-Reset bitte mit aktiven Katalog-, Aufnahme- und Objekttypfiltern testen. Diese dürfen sich durch den Button nicht ändern.
