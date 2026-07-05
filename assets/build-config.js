/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.4.0-test.2',
  release: '1.4.0-test.2',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.4.0-test.2',
  releaseNotes: {
    de: [
      'Optionales Windows-Hilfsprogramm „Local Survey Server“ im Paket ergänzt; es benötigt keine Python-Installation und kann bekannte NSNS-HiPS-Dateien bei Bedarf automatisch nachladen.',
      'Die Survey-Konfiguration in den Anzeigeeinstellungen wurde in die Tabs „Surveys“ und „Lokale Survey-Quellen“ aufgeteilt.',
      'Lokale HiPS-/Survey-Quellen können vorbereitet werden: lokale Basis-URL, relativer Pfad pro Survey, Online-Fallback und Erreichbarkeitsprüfung.',
      'Hinter jedem Survey gibt es eine Aktion „Lokale Quelle“, um die lokale Quelle für genau diesen Survey zu konfigurieren.',
      'Ein Hilfebutton führt direkt zum neuen Kapitel „Lokale Surveys und Local Survey Server“ mit Beispielkonfiguration.',
      'NSNS-Surveys bleiben wie bisher vorhanden; bestehende Default-Sichtbarkeiten werden nicht verändert.',
      'Deutsch/Englisch-Übersetzungen für die neuen Survey-Funktionen und Survey-Kategorien wurden ergänzt.'
    ],
    en: [
      'Added optional Windows helper “Local Survey Server” to the package; it does not require Python and can automatically cache known NSNS HiPS files on demand.',
      'Survey configuration in display settings is now split into the “Surveys” and “Local survey sources” tabs.',
      'Local HiPS/survey sources can be prepared with a local base URL, relative path per survey, online fallback and reachability checks.',
      'Each survey now has a “Local source” action to configure the local source for that specific survey.',
      'A help button opens the new “Local surveys and Local Survey Server” chapter directly with an example setup.',
      'NSNS surveys remain available as before; existing default visibility settings are not changed.',
      'German/English translations for the new survey features and survey categories have been completed.'
    ]
  },
  versionHistory: {
    de: {
      version140: { title: 'Version 1.4.0 gegenüber 1.3.1', items: [
        'Optionales Local-Survey-Server-Hilfsprogramm ohne Python mit On-Demand-Download/Cache bekannter NSNS-HiPS-Dateien.',
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
        'Optional Local Survey Server helper without Python, with on-demand download/cache of known NSNS HiPS files.',
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
