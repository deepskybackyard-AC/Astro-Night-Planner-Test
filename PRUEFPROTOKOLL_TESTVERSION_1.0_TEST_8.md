# Prüfprotokoll – Testversion 1.0.0-test.8

## Automatisch und statisch geprüft

- JavaScript-Syntax von `assets/app.js`, `sw.js` und dem eingebetteten Aladin-Skript
- TypeScript-Prüfung des ergänzenden React/Vite-Projekts mit `npm run check`
- JSON-Syntax von `VERSION.json` und `manifest.webmanifest`
- Versionskonsistenz `1.0.0-test.8` in Build-Konfiguration, Paketdateien und Service Worker
- Vorhandensein aller im Service Worker referenzierten lokalen Dateien
- Profilschema 6 und Migration des bisherigen relativen Objektwinkels auf einen absoluten Katalogwinkel
- identische Winkelbasis für sichtbare Objektellipse und rechnerische Framingbewertung
- neue temporäre Kartenansicht, Glättung und Prozentwertanzeige
- kontrollierte MapLibre-Lebensdauer mit Entfernen, Neuinitialisierung und Resize-Beobachtung
- Standardzustände der drei neuen aufklappbaren Hauptbereiche
- neue Export-/Importbezeichnungen und Import als neues Profil
- Impressum, Datenschutz-, Nutzungs-, Quellen- und Versionsdialoge

## Browserbasierter Komponententest

In einem isolierten Chromium-Dokument wurden ohne externe Netzwerkdienste geprüft:

- Rendering der Planungsansicht und der drei aufklappbaren Hauptbereiche
- zentrale Einstellungen für Kartenmodus und Aufklappzustände
- Öffnen des Impressumsdialogs
- Vorhandensein der drei Sicherungs-/Profilbuttons
- Rahmungsbedienung und sichtbare Aktualisierung des Zeitreglers
- Wolkenkarte mit simulierten 7×7-Prognosefeldern
- weiße Wolkendarstellung, dunkler Hintergrund, orange Prozentwerte, Legende und Umschaltung auf **Nur Wolken**

Die im isolierten Test protokollierten IndexedDB-Fehler entstehen ausschließlich dadurch, dass die Testseite bewusst ohne geöffnete Datenbank initialisiert wurde. Syntax, Layout und Berechnungsfunktionen waren davon nicht betroffen.

## Nach Veröffentlichung auf GitHub Pages zu prüfen

- echte OpenFreeMap-/MapLibre-Basiskarte einschließlich Attribution und Abdunklung
- Stabilität der Karte nach Wechsel auf einen anderen Tag und zurück
- Live-Abfragen aller drei Open-Meteo-Modelle
- echte Aladin-Darstellung von M31 und weiteren länglichen Objekten
- **Rahmen auf Bildmitte** nach Zoom und Pan im realen Aladin-Viewer
- zoomabhängige Objektbeschriftungen mit dem vollständigen Katalog
- Meteoblue-Einbettungen
- Verhalten auf Desktop, Smartphone und installierter PWA

## Einschränkung der Erstellungsumgebung

Direkte lokale Navigation und externe Browserzugriffe waren in der Erstellungsumgebung eingeschränkt. Deshalb werden Live-End-to-End-Tests der externen Karten-, Wetter-, Meteoblue- und Aladin-Dienste erst auf der veröffentlichten Testseite durchgeführt.
