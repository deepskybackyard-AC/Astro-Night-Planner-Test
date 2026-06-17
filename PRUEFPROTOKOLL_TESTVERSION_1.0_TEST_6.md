# Prüfprotokoll - Testversion 1.0.0-test.6

## Automatisch und lokal geprüft

- JavaScript-Syntax von `assets/app.js`
- JavaScript-Syntax der eingebetteten Aladin-Steuerung
- JSON-Syntax von Manifest und Versionsdatei
- Start der Anwendung mit in-memory Ersatz für IndexedDB
- gelbe Testkennzeichnung und Browser-Titel Korrektur 6
- temporäre Auswahlfelder für Teleskop, Kamera und Horizontprofil
- Öffnen der M31-Details durch Zeilenklick
- Framingstatus mit Mindestfreiraum und optimaler Rotation
- Auswahlfelder im interaktiven Himmelsbild
- mehrere Horizontprofile je Standort
- 30-Minuten-Standard mit 47 interpolierten Darstellungszeitpunkten über 23 Stunden
- stabile synthetische Ostverlagerung mit Sicherheitswert
- keine horizontale Überbreite im Desktop-Smoke-Test (`scrollWidth = clientWidth`)
- aktualisierte Browserhilfe ohne administratives Kapitel 10
- vorhandene relative Links auf HTML- und PDF-Handbuch
- PDF-Handbuch: 15 A4-Seiten, eingebettete Schriftarten, visuelle Kontrolle von erster, mittlerer und letzter Seite

## Nach Veröffentlichung auf GitHub Pages zu prüfen

- echte Aladin-Lite-Bibliothek und Himmelskoordinaten-Overlays bei mehreren Objekten
- Zoom, Pan, Vollbild, Surveywechsel und Browser-Resize
- Meteoblue Astronomy Seeing und Meteoblue-Wetterkarte
- echte Open-Meteo-Abfragen für ICON, ECMWF und GFS
- Wolkenkarte auf Desktop und Smartphone
- tatsächlicher Ordnerzugriff der File System Access API
- automatische aktuelle und datierte Sicherungsdateien
- Wiederherstellung aus beiden Dateitypen
- PWA-Update aus dem vorherigen Cache
- iPhone-/Safari-Fallback für manuellen Export und Import

## Bekannte technische Grenze

15- und 30-Minuten-Wolkenbilder sind interpolierte Zwischenstände der im Wesentlichen stündlichen Modelldaten. Sie verbessern die visuelle Nachvollziehbarkeit, nicht die zeitliche Genauigkeit der Wetterprognose.
