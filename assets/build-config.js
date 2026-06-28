/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.37',
  release: '1.1.0-test.37',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.37',
  releaseNotes: {
    de: [
      'Die 2×2-Wettervergleichsansicht behandelt Meteoblue jetzt ehrlich als nicht zentral zeitsynchron und zeigt den Hinweis rot an.',
      'Die eigene Astro-Wolkenkarte in der 2×2-Ansicht übernimmt Modell, Wolkenschicht, Auswertung, Kartenansicht, Glättung und Overlays aus der Planung.',
      'Bei Karte + Wolken wird die eigene Karte im Wettervergleich mit topografischer Basiskarte und transparenter Wolkenebene dargestellt.'
    ],
    en: [
      'The 2x2 weather comparison now treats Meteoblue honestly as not centrally time-synchronized and shows the warning in red.',
      'The own astro cloud map in the 2x2 view uses model, cloud layer, evaluation, map view, smoothing and overlays from the planning view.',
      'With map + clouds, the own comparison map is shown with a topographic base map and transparent cloud layer.'
    ]
  }});
