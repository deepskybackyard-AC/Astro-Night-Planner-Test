/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.25',
  release: '1.1.0-test.25',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.25',
  releaseNotes: {
    de: [
      'Aladin-Bedienung: Funktionen sind in Tabs für Himmelsbild, Rahmen, Objekte sowie Zeit & Mond gegliedert.',
      'Dämmerungslogik: Astronomische Nacht wird nur bei tatsächlichem Sonnenstand unter −18° angezeigt.',
      'Horizontansicht: Legende und Dämmerungsfarben wurden korrigiert.',
      'Weitere DE/EN-Übersetzungen für neue Labels und dynamische Texte wurden ergänzt.'
    ],
    en: [
      'Aladin controls are grouped into tabs for Sky image, Frame, Objects, and Time & Moon.',
      'Twilight logic: astronomical night is shown only when the Sun actually drops below −18°.',
      'Horizon view: legend and twilight colours were corrected.',
      'Additional DE/EN translations for new labels and dynamic texts were added.'
    ]
  }});
