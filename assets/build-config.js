/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.11',
  release: '1.1.0-test.11',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.11',
  releaseNotes: {
    de: [
      'Die Flugwetter-Proxy-URL wird jetzt korrekt gespeichert.',
      'Der Flugwetter-Tab nutzt die gespeicherte Cloudflare-Worker-Adresse.',
      'METAR/TAF-Proxy-Einstellungen bleiben nach dem Speichern erhalten.'
    ],
    en: [
      'The aviation-weather proxy URL is now saved correctly.',
      'The aviation-weather tab uses the saved Cloudflare Worker address.',
      'METAR/TAF proxy settings persist after saving.'
    ]
  }
});
