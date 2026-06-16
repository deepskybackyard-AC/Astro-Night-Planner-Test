# Prüfprotokoll – Astro Night Planner 1.0.0-test.4

## Automatisch beziehungsweise lokal geprüft

- JavaScript-Syntax mit `node --check`.
- JSON-Syntax von `VERSION.json` und `manifest.webmanifest`.
- Start der Anwendung in Chromium mit isolierter In-Memory-Testdatenbank.
- Aufbau der Planung mit simulierten Wetterdaten für alle drei Modelle.
- Laden und Zeichnen der 49-Punkte-Wolkenkarte für 24 Stunden.
- Umschaltung Modellkonsens / DWD ICON / ECMWF IFS / NOAA GFS.
- Umschaltung Gesamt-, tiefe, mittlere und hohe Wolken.
- Umschaltung Wolkenverteilung / Modellabweichung.
- Zeitsteuerung und Schritt um eine Stunde.
- Vorhandensein beider Meteoblue-iframe-Ansichten.
- Erzeugte Astronomy-Seeing-Widget-Adresse für Tübingen.
- Erzeugte Meteoblue-Wetterkarten-Widget-Adresse für Tübingen.
- Einstellungsoptionen 25 / 49 / 81 Kartenpunkte.
- Keine JavaScript- oder Konsolenfehler im simulierten Chromium-Ablauf.
- ZIP-Struktur und SHA-256-Prüfsumme.

## Auf GitHub Pages zu prüfen

Die lokale Testumgebung hat keine freie Internetverbindung. Daher müssen nach dem Deployment folgende Punkte mit den echten Diensten geprüft werden:

1. Open-Meteo liefert für 25, 49 und 81 Kartenpunkte Daten aller drei Modelle.
2. Die Ladezeit auf Desktop und Smartphone bleibt akzeptabel.
3. Meteoblue Astronomy Seeing lädt im eingebetteten Bereich.
4. Die zusätzliche Meteoblue-Wetterkarte lädt und ihre Ebenen sind bedienbar.
5. Standortwechsel aktualisiert beide Meteoblue-Ansichten sinnvoll.
6. Animation, Zeitkopplung und Standortvergleich funktionieren mit realen Prognosedaten.
7. PWA-Neuladen zeigt tatsächlich Version `1.0.0-test.4`.

## Hinweis zur Interpretation

Der Modellkonsens ist eine gewichtete rechnerische Zusammenführung. Die Modellabweichung zeigt, wie unterschiedlich die drei Prognosen sind. Sie ist kein statistisch kalibriertes Konfidenzintervall.
