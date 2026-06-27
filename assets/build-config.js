/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.29',
  release: '1.1.0-test.29',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.29',
  releaseNotes: {
    de: [
      'Aladin-Bedienung: Tab-Reihenfolge Rahmen, Objekte, Himmelsbild, Zeit & Mond; externer Himmelsbild-Button bleibt rechts in der Tab-Zeile.',
      'Meteoblue-Wetterkarten verwenden eine reduzierte öffentliche Widget-Konfiguration mit Wolken/Niederschlag und Windanimation statt geratenen Tiefenparametern.',
      'Weitere gemischte deutsch/englische UI-Texte, dynamische Statusmeldungen, Diagrammtexte, Dropdownwerte und Hilfetexte wurden nachübersetzt.',
      'Hinweis zur Modellgewichtung und weitere Einstellungslabels wurden an die aktuellen Defaults angepasst.'
    ],
    en: [
      'Aladin controls: tab order Frame, Objects, Sky image, Time & Moon; the external sky-image button remains on the right side of the tab row.',
      'Meteoblue weather maps now use a reduced public widget configuration with clouds/precipitation and wind animation instead of guessed deep-link parameters.',
      'Further mixed German/English UI strings, dynamic status messages, chart labels, dropdown values and help texts have been translated.',
      'The model-weighting note and further settings labels were aligned with the current defaults.'
    ]
  }});
