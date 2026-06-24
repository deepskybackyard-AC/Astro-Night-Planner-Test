/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.14',
  release: '1.1.0-test.14',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.14',
  releaseNotes: {
    de: [
      'Die Flugwetter-Abfrage ist jetzt klar von externen AviationWeather-Fallback-Links getrennt.',
      'Der Hauptbutton heißt „METAR/TAF in der App laden“; externe AWC-Links liegen in eingeklappten Bereichen.',
      'In den Einstellungen kann die eingetragene Proxy-Adresse direkt mit „Proxy testen“ geprüft werden.'
    ],
    en: [
      'The aviation-weather fetch is now clearly separated from external AviationWeather fallback links.',
      'The main button loads METAR/TAF inside the app; external AWC links are placed in collapsed sections.',
      'Settings now include a direct “Test proxy” check for the configured proxy URL.'
    ]
  }
});
