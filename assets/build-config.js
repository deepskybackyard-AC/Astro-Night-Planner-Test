/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.3.0-test.2',
  release: '1.3.0-test.2',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.3.0-test.2',
  releaseNotes: {
    de: [
      'Korrektur der 1.3-Testserie: Tagesbuttons auf Heute plus 6 Folgetage reduziert und Warn-/Qualitätsrahmen deutlicher dargestellt.',
      'Polarlicht-Hinweis und Dashboard zeigen Warnfarben nur noch bei belastbaren Daten und unterscheiden Datenstatus, Fehler und Bewertungsgrund.',
      'Polarlicht-Einstellungen sind als eigene Unterrubrik in den Zentralen Einstellungen verfügbar.',
      'Die Objektliste trennt Sichtbarkeit nach Mindesthöhe, persönlichem Horizont und Kombination aus beidem in eigenen Spalten.',
      'Aladin-Einstellungen wurden in Anzeige > Aladin neu strukturiert; Survey und Himmel & Horizont sind getrennte aufklappbare Bereiche, Gradnetze sind initial aus und getrennt schaltbar.'
    ],
    en: [
      'Correction of the 1.3 test series: date buttons reduced to today plus 6 following days and warning/quality borders made clearer.',
      'Aurora indicator and dashboard now use warning colors only when supported by data and distinguish data status, errors and reasoning.',
      'Aurora settings are available as a dedicated sub-section in Central settings.',
      'The object list separates visibility above minimum altitude, above the personal horizon, and both combined into separate columns.',
      'Aladin settings were reorganized under Display > Aladin; Survey and Sky & Horizon are separate collapsible sections, grids are initially off and can be toggled independently.'
    ]
  }
});
