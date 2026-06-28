/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.31',
  release: '1.1.0-test.31',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.31',
  releaseNotes: {
    de: [
      'Aladin-Bedienung: Tab-Reihenfolge Rahmen, Objekte, Himmelsbild, Zeit & Mond; externer Himmelsbild-Button bleibt rechts in der Tab-Zeile.',
      'Meteoblue-Wetterkarten verwenden nun zusätzlich einen Karten-Hash für Wolken/Niederschlag; die Windkarte bleibt separat erreichbar.',
      'Weitere dynamische Speichern-/Änderungsstatus-Texte sowie Objekt-/Profilnamen wurden sprachabhängig nachgezogen.',
      'Hinweis zur Modellgewichtung und weitere Einstellungslabels wurden an die aktuellen Defaults angepasst.'
    ],
    en: [
      'Aladin controls: tab order Frame, Objects, Sky image, Time & Moon; the external sky-image button remains on the right side of the tab row.',
      'Meteoblue weather maps now also use a map hash for clouds/precipitation; the wind map remains available separately.',
      'Additional dynamic save/dirty-state texts and object/profile names were made language-aware.',
      'The model-weighting note and further settings labels were aligned with the current defaults.'
    ]
  }});
