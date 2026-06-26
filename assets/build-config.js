/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.18',
  release: '1.1.0-test.18',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.18',
  releaseNotes: {
    de: [
      'Flugwetter/METAR/TAF und MOSMIX wurden aus der normalen Oberfläche und aus den Einstellungen entfernt.',
      'Zusätzliche Wetterquellen sind jetzt als Tabs für Meteoblue, Clear Outside, Windy und Ventusky umgesetzt.',
      'Alle externen Wetterquellen nutzen den aktuellen Planungsstandort und werden erst beim Anwählen des Tabs geladen.'
    ],
    en: [
      'Aviation weather/METAR/TAF and MOSMIX have been removed from the normal interface and settings.',
      'Additional weather sources are now implemented as tabs for Meteoblue, Clear Outside, Windy and Ventusky.',
      'All external weather sources use the current planning location and load only when their tab is selected.'
    ]
  }
});
