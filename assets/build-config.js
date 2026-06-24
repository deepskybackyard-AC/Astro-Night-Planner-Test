/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.13',
  release: '1.1.0-test.13',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.13',
  releaseNotes: {
    de: [
      'Die Flugwetter-Proxy-URL wird jetzt im sichtbaren Wolkenkarten-/Flugwetter-Abschnitt gespeichert.',
      '„Wolkenkarte speichern“ übernimmt Proxy-URL, automatische nächste Station und Stationsauswahl dauerhaft.',
      'Veraltete METAR/TAF-Daten werden nach Änderung der Proxy-Einstellung verworfen.'
    ],
    en: [
      'The aviation-weather proxy URL is now saved from the visible cloud-map/aviation-weather section.',
      '“Save cloud map” persists the proxy URL, automatic nearest station and selected stations.',
      'Stale METAR/TAF data is cleared after proxy changes.'
    ]
  }
});
