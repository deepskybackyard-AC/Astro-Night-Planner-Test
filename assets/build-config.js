/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.3.0-test.4',
  release: '1.3.0-test.4',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.3.0-test.4',
  releaseNotes: {
    de: [
      'Die Objekt-Detailansicht wird außerhalb der breiten Tabelle dargestellt; der horizontale Scrollbalken gehört wieder zur übergeordneten Objektliste.',
      'Lange Sichtbarkeits-Spaltenköpfe werden mehrzeilig umbrochen.',
      'Polarlicht-Warnfarben Gelb, Orange und Rot sind deutlicher unterscheidbar.',
      'Boden/Horizont und azimutales Gradnetz im externen Aladin-Tab werden als sichtbares Overlay robuster neu projiziert.',
      'Die Bodenmaske folgt der projizierten Horizontlinie statt einer festen Bildschirmgeraden.',
      'Der Farbpicker für das azimutale Gradnetz zeigt zusätzlich ein Farbfeld mit der gewählten Farbe.'
    ],
    en: [
      'Object details are rendered outside the wide table; the horizontal scrollbar belongs to the parent object list again.',
      'Long visibility column headings wrap to multiple lines.',
      'Aurora warning colors yellow, orange and red are easier to distinguish.',
      'Ground/horizon and azimuthal grid in the external Aladin tab are reprojected more robustly as a visible overlay.',
      'The ground mask follows the projected horizon line instead of a fixed screen line.',
      'The azimuthal grid color picker also shows a color swatch with the selected color.'
    ]
  }
});
