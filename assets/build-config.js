/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.4',
  release: '1.1.0-test.4',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.4',
  releaseNotes: {
    de: [
      'Der Horizont kann im Horizonteditor wieder direkt per Maus, Stift oder Touch gezeichnet werden.',
      'Der Tooltip zeigt weiterhin Azimut und Höhe während der Bearbeitung.',
      'Gefundene Orte werden bei der Standortanlage wieder zuverlässig in die Eingabefelder übernommen.'
    ],
    en: [
      'The horizon can again be drawn directly in the horizon editor using mouse, pen or touch.',
      'The tooltip continues to show azimuth and altitude while editing.',
      'Found locations are again reliably copied into the input fields when creating a location.'
    ]
  }
});
