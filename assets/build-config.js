/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.4.0-test.12',
  release: '1.4.0-test.12',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.4.0-test.12',
  releaseNotes: {
    de: [
      'Die Hilfe und das Handbuch beschreiben lokale Surveys, den Local Survey Server, Tray-Bedienung, Autostart, Fallback und Ordnerstruktur ausführlich als Endanwenderdokumentation.',
      'In den Survey-Einstellungen gibt es einen Button zum Öffnen der Local-Survey-Server-Oberfläche, wenn das Windows-Hilfsprogramm bereits läuft.',
      'Alle neuen Hinweise und Meldungen zum Local Survey Server sind deutsch und englisch hinterlegt.',
      'Die finale 1.4.0-Basis bleibt kompatibel mit lokalen HiPS-Quellen, PNG-Kacheln und Online-Fallback.'
    ],
    en: [
      'Help and manual now describe local surveys, the Local Survey Server, tray usage, autostart, fallback and folder structure in detail for end users.',
      'The survey settings include a button to open the Local Survey Server interface when the Windows helper is already running.',
      'All new Local Survey Server notices and messages are available in German and English.',
      'The final 1.4.0 base remains compatible with local HiPS sources, PNG tiles and online fallback.'
    ]
  },
  versionHistory: {
    de: {
      version140: { title: 'Version 1.4.0 gegenüber 1.3.1', items: [
        'Optionales Local-Survey-Server-Hilfsprogramm ohne Python mit vollständigem HiPS-Download bekannter NSNS-HiPS-Dateien.',
        'Diagnoseanzeige für lokal/online tatsächlich geladene Aladin-Survey-Quelle.',
        'Erweiterte Mondinformationen in Tagesbuttons, stündlichem Wetterverlauf und Mehrnächte-Wetter.',
        'Survey-Einstellungen mit getrennten Tabs für bestehende Surveys und lokale Survey-Quellen.',
        'Optionale lokale HiPS-Basis-URL und relative lokale Pfade pro Survey für Offline-/Lokalsurvey-Nutzung.',
        'Erreichbarkeitsprüfung für lokale Survey-Quellen und Online-Fallback, wenn lokale Daten nicht verfügbar sind.',
        'Direkter Hilfesprung zum ausführlichen Kapitel „Lokale Surveys und Local Survey Server“.',
        'Vollständige deutsch/englische Übersetzung der neuen Survey-Funktionen.'
      ]},
      version131: { title: 'Version 1.3.1 gegenüber 1.3.0', items: [
        'Korrigierte Polarlicht-Bewertung mit strengerer Trennung von Kp-Daten, NOAA-Warnmeldungen und lokalen Warnfarben.',
        'GFZ-Kp-Prognose als zusätzliche seriöse Kontroll- und Bewertungsquelle.',
        'Polarlicht-Dashboard mit Aktualisieren-Button, NOAA-/GFZ-Kontrollgrafiken, Vergrößerungsansicht und Quellenlinks.',
        'Neuerungsübersicht in der Hilfe funktioniert wieder und zeigt aktuelle Neuerungen vor älteren Versionen.'
      ]},
      version130: { title: 'Version 1.3.0 gegenüber 1.2.0', items: [
        'Datumsbuttons mit Mondbeleuchtung und farbiger durchschnittlicher Nachtqualität.',
        'Objektliste mit persönlicher Horizontlinie im Mini-Höhenprofil und getrennten Sichtbarkeitsangaben.',
        'Mehrnächte-Wetterverlauf in einem eigenen Tab.',
        'Polarlicht-Hinweis mit Dashboard und konfigurierbarem Aktualisierungsintervall.',
        'Externer Aladin-Tab mit Boden-/Horizontanzeige und azimutalem App-Gradnetz.'
      ]},
      version120: { title: 'Version 1.2.0 gegenüber 1.1.0', items: [
        'Meteoblue, Clear Outside, Windy und Ventusky bleiben als einzelne externe Kontrollquellen verfügbar.',
        'Der Wettervergleich wurde zugunsten stabiler Einzelquellen entfernt.',
        'Hilfe, Handbuch und Versionshinweise wurden an die stabilere Darstellung der Wetterquellen angepasst.'
      ]}
    },
    en: {
      version140: { title: 'Version 1.4.0 compared with 1.3.1', items: [
        'Optional Local Survey Server helper without Python, with complete HiPS download of known NSNS HiPS files.',
        'Diagnostic display for the actual local/online Aladin survey source loaded.',
        'Extended Moon information in date buttons, hourly weather and multi-night weather.',
        'Survey settings with separate tabs for existing surveys and local survey sources.',
        'Optional local HiPS base URL and relative local path per survey for offline/local survey use.',
        'Reachability checks for local survey sources and online fallback when local data is unavailable.',
        'Direct help jump to the detailed “Local surveys and Local Survey Server” chapter.',
        'Complete German/English translation of the new survey features.'
      ]},
      version131: { title: 'Version 1.3.1 compared with 1.3.0', items: [
        'Corrected aurora assessment with a stricter separation of Kp data, NOAA alerts and local warning colors.',
        'GFZ Kp forecast added as an additional authoritative reference and assessment source.',
        'Aurora dashboard with refresh button, NOAA/GFZ reference graphics, enlarged view and source links.',
        'The Help “What’s new” entry works again and shows current changes before older versions.'
      ]},
      version130: { title: 'Version 1.3.0 compared with 1.2.0', items: [
        'Date buttons with Moon illumination and colored average night quality.',
        'Object list with personal horizon line in the mini altitude chart and separate visibility values.',
        'Multi-night weather trend in a dedicated tab.',
        'Aurora notice with dashboard and configurable refresh interval.',
        'External Aladin tab with ground/horizon view and azimuthal app grid.'
      ]},
      version120: { title: 'Version 1.2.0 compared with 1.1.0', items: [
        'Meteoblue, Clear Outside, Windy and Ventusky remain available as individual external reference sources.',
        'The weather comparison was removed in favor of stable single-source tabs.',
        'Help, manual and version notes were adjusted to the more stable weather-source handling.'
      ]}
    }
  }
});
