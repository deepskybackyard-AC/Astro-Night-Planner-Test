/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.1',
  release: '1.1.0-test.1',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.1',
  releaseNotes: {
    de: [
      'Die Datumsauswahl wurde um ein Kalenderdatum für langfristige Planung ergänzt.',
      'Wetterabhängige Bereiche werden bei Daten außerhalb des Prognosezeitraums automatisch ausgeblendet.',
      'Planungsrubriken können in den Einstellungen vollständig ein- oder ausgeblendet werden.',
      'Der Horizonteditor zeigt beim Zeichnen Azimut und Höhe an.',
      'N.I.N.A.-Horizonte können importiert und exportiert werden.',
      'Die aktuelle Aladin-Rahmung eines einzelnen Objekts kann als N.I.N.A.-Planungsdatei exportiert werden.',
      'LDN und LBN werden als getrennte Katalogfilter angeboten.'
    ],
    en: [
      'The date selector now supports a calendar date for long-term planning.',
      'Weather-dependent sections are automatically hidden for dates outside the forecast range.',
      'Planning sections can be fully shown or hidden in settings.',
      'The horizon editor displays azimuth and altitude while drawing.',
      'N.I.N.A. horizon files can be imported and exported.',
      'The current Aladin framing of a single object can be exported as a N.I.N.A. planning file.',
      'LDN and LBN are offered as separate catalog filters.'
    ]
  }
});
