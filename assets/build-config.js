/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.38',
  release: '1.1.0-test.38',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.38',
  releaseNotes: {
    de: [
      'Die eigene Astro-Wolkenkarte in der 2×2-Ansicht nutzt die aktuellen Einstellungen aus der Planung inklusive Kartenansicht, Glättung, Prozentwerten und Overlays.',
      'Der zusätzliche Zeitregler in der eigenen Vergleichskarte entfällt; die zentrale Vergleichszeit steuert diese Karte direkt.',
      'Ortszeile, Himmelsrichtungen und schwarze Randbereiche wurden aus der kompakten eigenen Vergleichskarte entfernt. Bei Karte + Wolken liegt die Basiskarte vollflächig unter der Wolkenebene.'
    ],
    en: [
      'The own astro cloud map in the 2x2 view uses the current planning settings including map view, smoothing, percentage labels and overlays.',
      'The extra time slider inside the own comparison map is removed; the shared comparison time controls this map directly.',
      'The location header, compass labels and black margins were removed from the compact own comparison map. With Map + clouds, the base map is full-panel below the cloud layer.'
    ]
  }});
