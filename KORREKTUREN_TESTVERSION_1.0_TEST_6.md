# Korrekturen und Erweiterungen - Testversion 1.0.0-test.6

Diese Version ist kumulativ und enthält alle vorherigen Änderungen der Version 1.0.

## Wolkenkarte

- auswählbares Zeitraster 15, 30 oder 60 Minuten
- Standardwert 30 Minuten, dauerhaft in den zentralen Einstellungen festlegbar
- stündliche Modelldaten bleiben die fachliche Grundlage; Zwischenbilder werden nur zeitlich interpoliert
- Bewegungsrichtung aus mehreren Stunden und räumlicher Kreuzkorrelation statt aus einer empfindlichen Schwerpunktverschiebung
- zirkuläre Glättung und Sicherheitsbewertung
- bei geringer Sicherheit kein wechselnder Pfeil, sondern „Bewegungsrichtung unsicher“

## Rahmung und Aladin Lite

- Setup-Rahmen und Objektellipse werden als Himmelskoordinaten-Overlays gezeichnet
- korrekte Skalierung bei Zoom, Pan, Fenstergrößenänderung und Surveywechsel
- Objektellipse verwendet vollständige Haupt- und Nebenachse als Durchmesser und berücksichtigt den Positionswinkel
- Objektauswahl, Teleskop und Kamera direkt oberhalb der Aladin-Grafik
- temporäre Teleskop- und Kameraauswahl wirkt sofort auf Objektliste, Bildfeld und Rahmung
- Framingbewertung berücksichtigt den kleinsten freien Rand zum Bildfeld
- konfigurierbarer Mindestfreiraum, Standard 10 Prozent je Seite
- neue eindeutige Zustände: „Objekt zu groß für das Bildfeld“, „Objekt passt nur äußerst knapp“, „Objekt nahe am Bildrand“, „Gut gerahmt“, „Viel Umfeld“
- automatische optimale Kamerarotation bei verlässlichem Positionswinkel
- Schaltfläche „Optimale Rotation“

## Horizontprofile

- mehrere Horizontprofile pro Standort
- neues Profil anlegen, duplizieren, umbenennen und löschen
- eigenes Standard-Horizontprofil je Standort
- Horizontlinie und Hindernisse werden je Profil getrennt gespeichert
- temporäre Auswahl des Horizontprofils unter „Profile für diese Planung“
- zusätzliche temporäre Auswahl direkt in der geöffneten Horizontansicht
- ausgewählter persönlicher Horizont und Hindernisse werden in der Detailgrafik verwendet

## Planung und Ausrüstung

- aktives Teleskop, aktive Kamera, Montierung und Horizontprofil werden in der Planungsrubrik angezeigt
- Teleskop und Kamera sind dort temporär auswählbar
- dauerhafte Standards bleiben ausschließlich in den Einstellungen

## Sicherung und Hilfe

- Sicherungsdateien werden eindeutig erklärt:
  - `astro-night-planner-aktuell.json` = neuester, fortlaufend überschriebener Stand
  - datierte Datei = historischer Wiederherstellungspunkt
- Vorschau vor der Wiederherstellung mit Datum und Inhaltszahlen
- vor einer Wiederherstellung wird nach Möglichkeit ein aktueller datierter Sicherungsstand erzeugt
- kompaktere Sicherungsaktionen und einheitliche Speicherleiste
- PDF-Handbuch liegt fest unter `docs/ASTRO_NIGHT_PLANNER_HANDBUCH.pdf`
- Browserhilfe und Handbuch vollständig auf den aktuellen Funktionsstand gebracht
- keine administrativen Updatekapitel in der Anwenderhilfe
- Service-Worker-Cache auf Testversion 6 erhöht

## Breitenstabilität

Die bereits in Version 1.0 vorhandene stabile Inhaltsbreite bleibt erhalten. Detailcontainer, Diagramme, Aladin-Bereich und Auswahlleisten sind weiterhin auf die verfügbare Breite begrenzt. Es wurde kein vermeintlicher Fehler aus Version 0.9 auf Version 1.0 übertragen.
