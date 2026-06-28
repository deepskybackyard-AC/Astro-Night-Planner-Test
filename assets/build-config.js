/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.41',
  release: '1.1.0-test.41',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.41',
  releaseNotes: {
    de: [
      'Die eigene Astro-Wolkenkarte wurde aus der Wettervergleichsansicht entfernt.',
      'Die Vergleichsansicht zeigt jetzt links oben Windy, rechts oben Ventusky und links unten Meteoblue.',
      'Die gemeinsame Vergleichszeit lädt Windy und Ventusky weiterhin mit bestmöglicher Zeitübergabe neu; Meteoblue bleibt bei der eigenen Zeitachse.'
    ],
    en: [
      'The own astro cloud map has been removed from the weather comparison view.',
      'The comparison view now shows Windy in the top-left, Ventusky in the top-right and Meteoblue in the bottom-left.',
      'The shared comparison time continues to reload Windy and Ventusky with the best available time handoff; Meteoblue keeps its own timeline.'
    ]
  }});
