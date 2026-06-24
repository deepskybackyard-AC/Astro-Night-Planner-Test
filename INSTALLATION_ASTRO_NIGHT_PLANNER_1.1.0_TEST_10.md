# Installation Astro Night Planner 1.1.0-test.10

Testversion mit Cloudflare-Worker-Proxy für Flugwetterdaten. Das Paket ist für das Test-Repository gedacht und enthält `.github/workflows/deploy-pages.yml`.

## Zusätzlich enthalten

- Ordner `cloudflare-worker/` mit Worker-Vorlage und `wrangler.toml`
- App-Einstellung für die Proxy-URL, empfohlen `https://weather-api.deepskyastrophoto.de`
- Flugwetter-Tab nutzt den Proxy-Endpunkt `/flight?stations=...`, sobald die URL erreichbar ist
