/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.5',
  release: '1.1.0-test.5',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.5',
  releaseNotes: {
    de: [
      'Der Update-Button aktualisiert App-Dateien und Cache robuster.',
      'Der Horizonteditor wurde erneut überarbeitet und verwendet direkte Maus-, Stift- und Touch-Eingaben.',
      'N.I.N.A.-Horizontimport und -export öffnen jetzt Datei-Dialog bzw. Download.',
      'Beim Erststart kann direkt eine vorhandene Gesamtsicherung wiederhergestellt werden.',
      'Die Hilfe enthält ein FAQ-Kapitel zu Browserdaten und dauerhaftem lokalen Speicher.'
    ],
    en: [
      'The update button refreshes app files and cache more reliably.',
      'The horizon editor has been revised again and uses direct mouse, pen and touch input.',
      'N.I.N.A. horizon import and export now open the file dialog or download.',
      'The first-run screen can directly restore an existing full backup.',
      'The help contains an FAQ section about browser data and persistent local storage.'
    ]
  }
});
