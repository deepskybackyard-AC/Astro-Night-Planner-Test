/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.23',
  release: '1.1.0-test.23',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.23',
  releaseNotes: {
    de: [
      'Aladin extern: Umrisszeichnung ist wieder als dünne Linie sichtbar; Freihandmodus zeigt keine dominanten Stützpunktkreise.',
      'Aladin extern: Schließen und Speichern erfolgen nur über die Buttons; Pannen während des Zeichnens wird blockiert.',
      'Horizonteditor: Freie Hindernisse zeichnen beim Ziehen sichtbar eine Linie/Kontur.',
      'Horizontansicht: wieder 360°-Azimutansicht mit dezenter Dämmerungsschattierung analog zur Höhenkurve.',
      'Setup-Rahmen: Rahmenzentren werden objektbezogen behandelt, damit beim Objektwechsel kein alter Rahmen übernommen wird.'
    ],
    en: [
      'External Aladin: outline drawing is visible again as a thin line; freehand mode has no dominant control-point circles.',
      'External Aladin: closing and saving only happen through the buttons; panning while drawing is blocked.',
      'Horizon editor: free obstacles are visibly drawn as a line/contour while dragging.',
      'Horizon view: restored 360° azimuth view with subtle twilight shading matching the altitude curve.',
      'Setup frame: frame centres are object-specific so switching objects cannot reuse an old frame centre.'
    ]
  }});
