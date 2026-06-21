# Korrekturen Testversion 1.0-test.23

## Aladin / Mondanzeige

- Das Mondsymbol wird nicht mehr als Himmelskoordinaten-Kreis im Aladin-Overlay gezeichnet, sondern als pixelstabiles SVG/DOM-Symbol über dem Himmelsbild positioniert.
- Symbol, Beschriftung und Mondphase verwenden dieselbe berechnete Mondposition. Dadurch soll der bisher sichtbare Versatz zwischen Marker und Symbol vermieden werden.
- Die beleuchtete Seite wird weiß bis leicht warmweiß dargestellt.
- Die unbeleuchtete Seite ist transparent bzw. sehr dunkel-transparent.
- Die Anzeige wird bei Zeitregler, Zoom/Pan, Resize und Overlay-Aktualisierung neu positioniert.

## Basisfilter

- Neben `Filter anwenden` wurde der Button `Basisfilter zurücksetzen` ergänzt.
- Der Reset wirkt ausschließlich auf die Rubrik Basisfilter.
- Kataloge, Aufnahmefilter, Objekttypen, Ausrüstung, Standort, Anzeigeprofile und weitere Planungseinstellungen bleiben unverändert.
- Nach dem Zurücksetzen wird die Objektliste neu berechnet und auf Seite 1 gesetzt.

## Dokumentation und Version

- Browserhilfe und PDF-Handbuch in Deutsch und Englisch aktualisiert.
- Service Worker, Build-Konfiguration, Paketversion und Versionsdatei auf Test 23 aktualisiert.
