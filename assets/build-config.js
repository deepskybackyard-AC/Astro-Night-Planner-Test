/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.40',
  release: '1.1.0-test.40',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.40',
  releaseNotes: {
    de: [
      'Die eigene Astro-Wolkenkarte im 2×2-Wettervergleich verwendet wieder den originalen Kartenrenderer der Planungsansicht statt der kompakten Vollflächenkarte.',
      'Seitenverhältnis, Innenrand, Himmelsrichtungen, Standortzeile und Karten-Inset bleiben erhalten; Prozentwerte am Rand werden nicht mehr durch die Vergleichskachel abgeschnitten.',
      'Bei Karte + Wolken liegt die MapLibre-Basiskarte im gleichen Kartenfenster wie in der Planungsansicht unter der Wolkenebene.'
    ],
    en: [
      'The own astro cloud map in the 2x2 weather comparison again uses the original planning-view map renderer instead of the compact full-panel map.',
      'Aspect ratio, inner margin, compass labels, location header and map inset are retained; edge percentage labels are no longer clipped by the comparison tile.',
      'With Map + clouds, the MapLibre base map is placed in the same map window as in the planning view below the cloud layer.'
    ]
  }});
