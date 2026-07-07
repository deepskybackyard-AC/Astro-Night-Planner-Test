/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.4.2-test.2',
  release: '1.4.2-test.2',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.4.2-test.2',
  releaseNotes: {
    de: [
      'Unter Windows öffnet Local Survey Server 1.1.1 beim Doppelklick wieder automatisch die Browseroberfläche; das Tray bleibt für Start, Stop und Beenden verfügbar.',
      'Local Survey Server 1.1.1 bietet eine integrierte Downloadverwaltung für bekannte NSNS-HiPS-Surveys.',
      'Survey-Hauptordner und Downloadziele können über Betriebssystem-Ordnerdialoge gewählt werden.',
      'Relative Survey-Pfade lassen sich im Planner aus erkannten lokalen HiPS-Ordnern auswählen.',
      'Der Sammelschalter für lokale Quellen setzt jetzt alle einzelnen Survey-Häkchen gemeinsam.',
      'Hilfe und Handbuch wurden für Downloads, Ordnerauswahl und Fallback-Logik erweitert.'
    ],
    en: [
      'On Windows, Local Survey Server 1.1.1 again opens the browser interface automatically when double-clicked; the tray remains available for start, stop and exit.',
      'Local Survey Server 1.1.1 adds integrated download management for known NSNS HiPS surveys.',
      'Survey root and download targets can be selected with operating-system folder dialogs.',
      'Relative survey paths can be selected in Planner from detected local HiPS folders.',
      'The local-source bulk switch now sets all per-survey checkboxes together.',
      'Help and manual were expanded for downloads, folder selection and fallback logic.'
    ]
  },
  versionHistory: {
    de: {
      version142: { title: 'Version 1.4.2 gegenüber 1.4.1', items: [
        'Local Survey Server 1.1.1 mit integrierter Downloadverwaltung für bekannte NSNS-HiPS-Surveys.',
        'Download starten, pausieren, fortsetzen, abbrechen und vorhandene Daten prüfen.',
        'Betriebssystem-Ordnerdialoge für Survey-Hauptordner und Downloadziel.',
        'Auswahl relativer Survey-Pfade aus den vom laufenden Server erkannten HiPS-Ordnern.',
        'Sammelschalter setzt alle einzelnen lokalen Survey-Häkchen und erlaubt anschließend Einzelabweichungen.',
        'Erweiterte Hilfe und HTML-Anleitungen in Deutsch und Englisch.'
      ]},
      version141: { title: 'Version 1.4.1 gegenüber 1.4.0', items: [
        'Zusätzliches natives Linux/macOS-Paket für lokale HiPS-Surveys ohne Wine und ohne Python-Abhängigkeit.',
        'Browserbasierte Konfigurationsoberfläche des Linux/macOS-Servers mit Status, Pfadprüfung, Start/Stop und Programm beenden.',
        'systemd-user-Beispiel für Linux und LaunchAgent-Beispiel für macOS.',
        'Getrennte Download-Links und Hinweise in den lokalen Survey-Einstellungen: Windows, Linux/macOS und Python-Fallback.',
        'Hilfe und Handbuch verlinken ausführliche HTML-Anleitungen für Windows, Linux/macOS, Linux-Autostart, macOS-Autostart und Python-Fallback.',
        'GitHub-Pages-Testworkflow auf Node-24-kompatible Actions aktualisiert.'
      ]},
      version140: { title: 'Version 1.4.0 gegenüber 1.3.0', items: [
        'Lokale HiPS-Surveys über einen lokalen HTTP-Server und das Windows-Hilfsprogramm ANP Local Survey Server 1.0.',
        'Konfiguration lokaler Survey-Basis-URL und relativer Pfade pro Survey, inklusive Prüfung und Diagnose der tatsächlich geladenen Quelle.',
        'Online-Fallback nur, wenn er aktiviert ist und die lokale Quelle nicht erreichbar ist.',
        'Lokale HiPS-properties werden ausgewertet; PNG- und JPEG-Kachelformate werden passend behandelt.',
        'Aladin-Rahmung mit frei kombinierbarem Teleskop, Reducer/Korrektor/Barlow und Kamera.',
        'Nicht gespeicherte Equipment-Kombinationen bleiben temporär aktiv und können als Setup gespeichert werden.',
        'Erweiterte Mondinformationen: Tagesbuttons zeigen die maximale Mondhöhe im gewählten Planungszeitraum; Planungsdaten markieren Mondaufgang, Mondkulmination und Monduntergang außerhalb des Planungszeitraums.'
      ]}
    },
    en: {
      version142: { title: 'Version 1.4.2 compared with 1.4.1', items: [
        'Local Survey Server 1.1.1 with integrated download management for known NSNS HiPS surveys.',
        'Start, pause, resume and cancel downloads and validate existing data.',
        'Operating-system folder dialogs for survey root and download target.',
        'Select relative survey paths from HiPS folders detected by the running server.',
        'Bulk switch sets all local survey checkboxes while allowing individual overrides afterwards.',
        'Expanded help and HTML guides in German and English.'
      ]},
      version141: { title: 'Version 1.4.1 compared with 1.4.0', items: [
        'Additional native Linux/macOS package for local HiPS surveys without Wine and without a Python dependency.',
        'Browser-based configuration interface of the Linux/macOS server with status, path checks, start/stop and shutdown.',
        'systemd user-service example for Linux and LaunchAgent example for macOS.',
        'Separate download links and guidance in local survey settings: Windows, Linux/macOS and Python fallback.',
        'Help and manual link detailed HTML guides for Windows, Linux/macOS, Linux autostart, macOS autostart and Python fallback.',
        'GitHub Pages test workflow updated to Node 24 compatible actions.'
      ]},
      version140: { title: 'Version 1.4.0 compared with 1.3.0', items: [
        'Local HiPS surveys via a local HTTP server and the ANP Local Survey Server 1.0 Windows helper.',
        'Configuration of local survey base URL and relative paths per survey, including checks and diagnostics for the source actually loaded.',
        'Online fallback is used only when enabled and the local source is not reachable.',
        'Local HiPS properties are evaluated; PNG and JPEG tile formats are handled accordingly.',
        'Aladin framing with freely combinable telescope, reducer/corrector/Barlow and camera.',
        'Unsaved equipment combinations remain temporarily active and can be saved as a setup.',
        'Extended Moon information: date buttons show maximum Moon altitude in the selected planning window; planning data marks moonrise, Moon culmination and moonset outside the planning window.'
      ]}
    }
  }
});
