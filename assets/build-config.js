/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.12',
  release: '1.1.0-test.12',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.12',
  releaseNotes: {
    de: [
      'Die Flugwetter-Proxy-URL wird jetzt direkt beim Tippen erfasst.',
      'Beim Speichern wird die URL direkt aus dem Eingabefeld übernommen.',
      'Veraltete METAR/TAF-Daten werden nach Änderung der Proxy-Einstellung verworfen.'
    ],
    en: [
      'The aviation-weather proxy URL is now captured while typing.',
      'Saving reads the URL directly from the input field.',
      'Stale METAR/TAF data is cleared after proxy changes.'
    ]
  }
});
