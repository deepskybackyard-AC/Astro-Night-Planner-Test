/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.10',
  release: '1.1.0-test.10',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.10',
  releaseNotes: {
    de: [
      'Flugwetterdaten können über einen Cloudflare-Worker-Proxy direkt in der App geladen werden.',
      'Eine Worker-Vorlage für METAR/TAF liegt im Ordner cloudflare-worker bei.',
      'Der Flugwetter-Tab zeigt Proxy-Status, Stationskarten, Kurzinterpretation und Fallback-Links.'
    ],
    en: [
      'Aviation weather can be loaded through a Cloudflare Worker proxy directly in the app.',
      'A Worker template for METAR/TAF is included in the cloudflare-worker folder.',
      'The aviation-weather tab shows proxy status, station cards, short interpretation and fallback links.'
    ]
  }
});
