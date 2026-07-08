/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.4.3-test.1',
  release: '1.4.3-test.1',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.4.3-test.1',
  releaseNotes: {
    de: [
      'Local Survey Server 1.1 (Build 1.1.5) wiederholt temporäre Netzwerkfehler automatisch und setzt .part-Dateien fort.',
      'Ein einzelner Verbindungsabbruch beendet nicht mehr den gesamten Survey-Download.',
      'Nach dem Hauptlauf werden fehlgeschlagene Dateien automatisch in einem weiteren Durchlauf erneut versucht.',
      'Downloads von www.simg.de verwenden zwei parallele Verbindungen; andere Quellen standardmäßig vier.',
      'Der Downloadstatus zeigt Wiederholungsversuch, Wartezeit, fehlgeschlagene Dateien und parallele Verbindungen.',
      'Das Windows-Tray-Menü wurde stabilisiert, nach Explorer-Neustarts wiederhergestellt und erhält eine sichere Beenden-Funktion.',
      'Hilfe und Handbuch wurden auf Deutsch und Englisch aktualisiert.'
    ],
    en: [
      'Local Survey Server 1.1 (build 1.1.5) automatically retries temporary network failures and resumes .part files.',
      'A single interrupted connection no longer stops the complete survey download.',
      'After the main pass, failed files are retried automatically in an additional recovery pass.',
      'Downloads from www.simg.de use two parallel connections; other sources use four by default.',
      'Download status shows retry attempt, wait time, failed files and parallel connections.',
      'The Windows tray menu was stabilised, restored after Explorer restarts and given a safe exit fallback.',
      'Help and manual were updated in German and English.'
    ]
  },
  versionHistory: {
    de: {
      version143: { title: 'Version 1.4.3 gegenüber 1.4.2', items: [
        'Local Survey Server 1.1 (Build 1.1.5) mit automatischen Wiederholungen bei temporären Netzwerkfehlern, Timeouts sowie HTTP 429/5xx.',
        'Einzelne fehlerhafte Kacheln stoppen den Gesamtdownload nicht mehr; nach dem Hauptlauf folgt ein automatischer Wiederholungsdurchlauf.',
        'Downloads von www.simg.de verwenden zur Schonung der Quelle zwei parallele Verbindungen; andere Quellen standardmäßig vier.',
        'Downloadstatus mit Wiederholungsversuch, Wartezeit, fehlgeschlagenen Dateien und Anzahl paralleler Verbindungen.',
        'Stabileres Windows-Tray-Menü mit festem UI-Thread, Unterstützung aktueller Tray-Ereignisse, Wiederherstellung nach Explorer-Neustart und sicherer Beenden-Funktion.',
        'Aktualisierte Hilfe und Dokumentation für Windows, Linux und macOS.'
      ]},
      version142: { title: 'Version 1.4.2 gegenüber 1.4.1', items: [
        'Local Survey Server 1.1 (Build 1.1.4) mit Downloadverwaltung für alle in der App eingebauten Surveys sowie benutzerdefinierte HiPS-Quellen.',
        'Freie Quelladresse und relativer Zielpfad für benutzerdefinierte Survey-Downloads.',
        'Download starten, pausieren, fortsetzen, abbrechen und vorhandene Daten prüfen.',
        'Zuverlässige native Ordnerauswahl unter Windows auf dem UI-Thread; Ordnerdialoge auch unter Linux und macOS.',
        'Automatische Übernahme einer vorhandenen Windows-Konfiguration aus Server 1.0.',
        'Speichern-Bestätigung direkt am Button statt Erfolgs-Popup.',
        'Verständlicher Dialog zur Auswahl relativer Survey-Pfade aus den vom laufenden Server erkannten HiPS-Ordnern.',
        'Sammelschalter setzt alle einzelnen lokalen Survey-Häkchen und erlaubt anschließend Einzelabweichungen.',
        'Wiederhergestellte Tray-Steuerung für Öffnen, Starten, Stoppen und Beenden sowie erweiterte Hilfe in Deutsch und Englisch.'
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
      version143: { title: 'Version 1.4.3 compared with 1.4.2', items: [
        'Local Survey Server 1.1 (build 1.1.5) automatically retries temporary network errors, timeouts and HTTP 429/5xx.',
        'Individual failed tiles no longer stop the complete download; an automatic recovery pass follows the main pass.',
        'Downloads from www.simg.de use two parallel connections to reduce server load; other sources use four by default.',
        'Download status shows retry attempt, wait time, failed files and parallel connection count.',
        'More reliable Windows tray menu with a dedicated UI thread, current tray event support, recovery after Explorer restarts and safe exit fallback.',
        'Updated help and documentation for Windows, Linux and macOS.'
      ]},
      version142: { title: 'Version 1.4.2 compared with 1.4.1', items: [
        'Local Survey Server 1.1 (Build 1.1.4) with download management for every survey built into the app and for custom HiPS sources.',
        'Custom source URL and relative target path for user-defined survey downloads.',
        'Start, pause, resume and cancel downloads and validate existing data.',
        'Reliable native Windows folder picker on the UI thread, with folder dialogs also on Linux and macOS.',
        'Automatic migration of an existing Windows server 1.0 configuration.',
        'Save confirmation directly on the button instead of a success popup.',
        'Clear dialog for selecting relative survey paths from HiPS folders detected by the running server.',
        'Bulk switch sets all local survey checkboxes while allowing individual overrides afterwards.',
        'Restored tray controls for open, start, stop and exit, plus expanded help in German and English.'
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
