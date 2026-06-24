# Astro Night Planner 1.1.0-test.14 – Korrekturhinweise

Diese Testversion trennt die integrierte Flugwetter-Abfrage klar von den externen AviationWeather-Fallback-Links.

## Änderungen

- Der Hauptbutton im Flugwetter-Tab heißt jetzt „METAR/TAF in der App laden“.
- Externe AviationWeather-Links sind in eingeklappte Bereiche verschoben.
- Hinweise erklären, dass AWC-Seiten nur bewusst als externe Fallback-Links geöffnet werden.
- In den Einstellungen gibt es den neuen Button „Proxy testen“.
- Der Proxy-Test ruft `/flight?stations=EDDS` gegen die eingetragene Basisadresse auf.

## Test

1. In den Einstellungen die Cloudflare-Worker-/Proxy-URL eintragen und speichern.
2. „Proxy testen“ anklicken.
3. Im Tab „Flugwetter“ den Button „METAR/TAF in der App laden“ verwenden.
4. Nur die eingeklappten AWC-Links sollten externe AviationWeather-Seiten öffnen.
