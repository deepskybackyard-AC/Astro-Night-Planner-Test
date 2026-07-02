/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.3.0-test.6',
  release: '1.3.0-test.6',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.3.0-test.6',
  releaseNotes: {
    de: [
      'Gradzahl-Labels des azimutalen Gradnetzes bleiben auch bei feineren Zoom-Abstufungen am sichtbaren Rand erhalten.',
      'Himmelsrichtungen und Zwischenrichtungen werden bei stärkerem Zoom zuverlässiger an den sichtbaren Rand gesetzt.',
      'Die Farbwahl für das azimutale Gradnetz wurde bereinigt: Es gibt nur noch ein Farbfeld/einen Farbpicker.',
      'Hilfe und Handbuch erklären die Horizontdarstellung im externen Aladin-Tab und die Orientierungshilfe durch das azimutale Raster.'
    ],
    en: [
      'Azimuthal grid degree labels remain visible at the visible edge even with finer zoom-dependent spacing.',
      'Cardinal and intercardinal direction labels are placed more reliably at the visible edge at higher zoom levels.',
      'The azimuthal grid color setting was simplified: only one color field/color picker remains.',
      'Help and manual explain the horizon display in the external Aladin tab and the orientation aid provided by the azimuthal grid.'
    ]
  }
});
