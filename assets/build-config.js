/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.3.0-test.5',
  release: '1.3.0-test.5',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.3.0-test.5',
  releaseNotes: {
    de: [
      'Die Boden-Transparenz im externen Aladin-Tab wird richtig herum interpretiert: 0 % = stark abgedunkelt, 100 % = vollständig transparent.',
      'Das azimutale Gradnetz nutzt im Auto-Modus feinere Abstufungen je nach Zoomstufe und kann manuell auf Auto, 10°, 5°, 2° oder 1° gesetzt werden.',
      'Gradzahl-Labels werden am sichtbaren Rand der azimutalen Rasterlinien gezeichnet.',
      'Himmelsrichtungen und Zwischenrichtungen werden robuster an den sichtbaren Rand gesetzt.',
      'Das Farbfeld des azimutalen Gradnetzes wurde vergrößert.',
      'Hilfe und Handbuch wurden zu Boden-Transparenz, azimutalem Gradnetz und Himmelsrichtungen aktualisiert.'
    ],
    en: [
      'Ground transparency in the external Aladin tab is interpreted correctly: 0% = strongly darkened, 100% = fully transparent.',
      'The azimuthal grid now uses finer automatic spacing depending on zoom level and can be set manually to Auto, 10°, 5°, 2° or 1°.',
      'Degree labels are drawn at the visible edges of azimuthal grid lines.',
      'Cardinal and intercardinal direction labels are clamped to the visible edge more robustly.',
      'The azimuthal grid color swatch was enlarged.',
      'Help and manual were updated for ground transparency, the azimuthal grid and compass directions.'
    ]
  }
});
