# Astro Night Planner Cloudflare Worker Proxy

Dieser kleine Worker liefert METAR-/TAF-Daten der AviationWeather API mit CORS-Headern an den Astro Night Planner.

## Endpunkte

- `/flight?stations=EDDS,EDDM` - METAR und TAF gemeinsam
- `/metar?stations=EDDS,EDDM` - nur METAR
- `/taf?stations=EDDS,EDDM` - nur TAF

Empfohlene Domain: `https://weather-api.deepskyastrophoto.de`

## Grund

Die statische GitHub-Pages-App kann die AviationWeather API im Browser nicht immer direkt abrufen, weil CORS nicht zuverlässig erlaubt ist. Der Worker ruft die Daten serverseitig ab und gibt sie mit erlaubten CORS-Headern an die App weiter.

## Hinweise

- Ergebnisse werden 5 Minuten gecacht.
- Es werden nur ICAO-Stationscodes mit vier Buchstaben akzeptiert.
- Erlaubte Origins sind im Worker in `ALLOWED_ORIGINS` definiert.
