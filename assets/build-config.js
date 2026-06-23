/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.2',
  release: '1.1.0-test.2',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.2',
  releaseNotes: {
    de: [
      'Der interaktive Horizonteditor kann wieder zuverlässig per Maus, Stift oder Touch gezeichnet werden.',
      'Die Live-Anzeige für Azimut und Höhe bleibt beim Zeichnen erhalten.',
      'Beim Start der App wird initial wieder der heutige Tag markiert.',
      'Die Funktionen aus 1.1.0-test.1 bleiben enthalten.'
    ],
    en: [
      'The interactive horizon editor can be drawn reliably again with mouse, pen or touch.',
      'The live azimuth and altitude display remains available while drawing.',
      'On app start, today is selected initially again.',
      'All features from 1.1.0-test.1 remain included.'
    ]
  }
});
