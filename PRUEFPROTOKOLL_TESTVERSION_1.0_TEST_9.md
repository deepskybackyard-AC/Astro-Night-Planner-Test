# Prüfprotokoll – Testversion 1.0.0-test.9

## Automatisch und lokal geprüft

- JavaScript-Syntax von `assets/app.js`
- JavaScript-Syntax des eingebetteten Aladin-Frames
- JSON-Syntax von `VERSION.json`, `package.json`, `package-lock.json`, Manifest und Profildateien
- Versionskonsistenz `1.0.0-test.9` in Build-Konfiguration, Paketdateien und Service Worker
- Vorhandensein aller im Service Worker eingetragenen lokalen Kerndateien
- ZIP-Integrität und Dateiliste
- keine verbliebene sichtbare Buttonbezeichnung „Katalogwinkel“ in der aktiven Anwendung

## Codepfade geprüft

- Wolkenkarten-Cache mit neuer Versionskennung
- Abfrage von Gesamtbewölkung, Wolkenschichten, Niederschlag, Regen und Schneefall
- dynamische Schalter der drei Niederschlagsebenen
- Karten-Neuinitialisierung und `resize()` nach Größen- beziehungsweise Datumswechseln
- Katalog-Positionswinkel beim erstmaligen Aufbau der Objektellipse
- Nachrichtenaustausch zwischen Hauptanwendung und Aladin-Frame zum Zentrieren des Kamerarahmens
- linke Position der Aufklapp-Pfeile

## Nach Veröffentlichung manuell zu prüfen

Diese Punkte hängen von externen Diensten und echtem Browserrendering ab:

1. OpenFreeMap-Kacheln und topografischer Kontrast auf GitHub Pages
2. Open-Meteo-Daten für alle gewählten Wettermodelle
3. Sichtbarkeit und Schaltwirkung von Niederschlag, Regen und Schnee
4. Datumswechsel über mehrere Nächte ohne Verschwinden der Karte
5. Aladin-Pan, anschließend **Rahmen auf Bildmitte**
6. korrekter Katalogwinkel bei mehreren Objekten mit unterschiedlichen Positionswinkeln
7. Verhalten auf Desktop und Smartphone

Es wurde nicht behauptet, dass die externen Live-Dienste in der lokalen, netzwerkbegrenzten Prüfumgebung vollständig getestet wurden.
