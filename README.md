# Astro Night Planner 1.1.0-test.7

Testversion mit erweiterten Ausrüstungsdaten, optischen Setup-Faktoren, verbesserter Aladin-Rahmung, Tablet-Layoutverbesserungen und Warnung bei ungespeicherten Einstellungen.


## Testversion 1.1.0-test.9

Diese Testversion ergänzt die Wetter-Tabs Meteoblue, Flugwetter und MOSMIX. Flugwetterstationen können in den Einstellungen gewählt werden. METAR/TAF nutzt die AviationWeather-API, MOSMIX/Punktprognose Bright Sky/DWD-Daten. Bei Browser-CORS-Sperren zeigt die App Quellenlinks und Hinweise.


## Test 1.1.0-test.12

Diese Testversion ergänzt den vorbereiteten Cloudflare-Worker-Proxy für integrierte METAR-/TAF-Flugwetterdaten. Der Worker liegt im Ordner `cloudflare-worker/`. In den Einstellungen kann die Proxy-URL für die Flugwetterdaten gesetzt werden.


## 1.1.0-test.12

Korrektur: Die Flugwetter-Proxy-URL wird gespeichert und nach dem Speichern im Flugwetter-Tab verwendet.
