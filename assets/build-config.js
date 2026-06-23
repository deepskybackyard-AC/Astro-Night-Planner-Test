/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.9',
  release: '1.1.0-test.9',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.9',
  releaseNotes: {
    de: [
      'Aladin-Hauptrahmen lässt sich im Verschiebemodus jetzt per Dragging innerhalb des Rahmens oder am Rahmenrand verschieben.',
      'Aladin-Infofelder werden bei Position oben/unten nicht mehr abgeschnitten und lassen sich zuverlässig ausblenden.',
      'Mondaufgang-/Monduntergang-Hinweise enthalten die tatsächliche Uhrzeit.'
    ],
    en: [
      'The main Aladin frame can now be dragged in move mode from inside the frame or from its border.',
      'Aladin info boxes are no longer clipped in top/bottom positions and can be hidden reliably.',
      'Moonrise/moonset hints include the actual time.'
    ]
  }
});
