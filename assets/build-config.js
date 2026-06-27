/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.22',
  release: '1.1.0-test.22',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.22',
  releaseNotes: {
    de: [
    'Setup-Rahmen wird beim Objektwechsel automatisch wie über den Zurücksetzen-Button neu gesetzt.',
    'Horizontansicht: Dämmerungsschattierungen werden zeitlich wie im Mini-Höhenprofil gezeichnet.',
    'Horizonteditor: freie Hindernis-Konturen mit Stützpunkten ergänzt.',
    'Aladin extern: Umriss schließen/speichern repariert und Pannen während des Zeichnens verhindert.',
    'Aladin extern: Aufnahmeziel-Button zeigt ein Erfolgsfeedback.',
    'Wolkenkarte: Weiche Glättung ist sichtbar stärker geglättet.',
    'Einstellungen: Ungespeicherte Änderungen können je Rubrik verworfen werden.'
  ],
  en: [
    'The setup frame is automatically reset when switching objects.',
    'Horizon view: twilight shading is drawn by time, matching the mini altitude profile.',
    'Horizon editor: free obstacle contours with control points added.',
    'External Aladin: outline close/save repaired and panning while drawing prevented.',
    'External Aladin: imaging-target button shows success feedback.',
    'Cloud map: soft smoothing is visibly stronger.',
    'Settings: unsaved section changes can be discarded.'
  ]
  }
});
