/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.6',
  release: '1.1.0-test.6',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.6',
  releaseNotes: {
    de: [
      'Der Horizonteditor verwendet jetzt eine separate transparente Eingabeebene über der Grafik.',
      'Der Tooltip für Azimut und Höhe ist korrigiert und blockiert das Zeichnen nicht mehr.',
      'Maus-, Stift- und Touch-Eingaben werden robuster verarbeitet.',
      'N.I.N.A.-Import und -Export bleiben unverändert verfügbar.'
    ],
    en: [
      'The horizon editor now uses a separate transparent input layer above the chart.',
      'The azimuth and altitude tooltip has been fixed and no longer blocks drawing.',
      'Mouse, pen and touch input is handled more robustly.',
      'N.I.N.A. import and export remain available.'
    ]
  }
});
