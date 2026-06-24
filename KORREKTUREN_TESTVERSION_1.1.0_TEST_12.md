# Korrekturen Testversion 1.1.0-test.12

- Die Cloudflare-Worker-/Proxy-URL im Bereich „Flugwetterstationen Deutschland“ wird nun bereits beim Tippen als Änderung erkannt.
- Beim Speichern der Rubrik „Wettermodelle“ wird die Proxy-URL zusätzlich direkt aus dem Eingabefeld übernommen. Dadurch geht die Änderung nicht verloren, wenn das Feld beim Klick auf „Speichern“ noch fokussiert ist.
- Nach Änderung/Speicherung der Proxy-Einstellung werden alte Flugwetterdaten verworfen, damit der nächste METAR/TAF-Abruf die neue Adresse nutzt.
- Der HTML-Dokumenttitel wurde von dem alten test.7-Rest auf 1.1.0-test.12 korrigiert.
