/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.19',
  release: '1.1.0-test.19',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.19',
  releaseNotes: {
    de: [
      'Clear Outside nutzt nun die verfügbare Breite des Anzeigebereichs besser.',
      'Der für Clear Outside wenig hilfreiche Button „Großansicht“ wurde entfernt.',
      'Ein Hinweis erklärt, dass die Beschriftungen im Clear-Outside-Prognosebild Teil der extern gelieferten Grafik sind und nicht durch die App übersetzt werden können.'
    ],
    en: [
      'Clear Outside now uses the available display width better.',
      'The Clear Outside full-screen button has been removed because it did not add useful value.',
      'A note explains that labels inside the Clear Outside forecast image are part of the externally provided graphic and cannot be translated by the app.'
    ]
  }
});
