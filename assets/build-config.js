/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.36',
  release: '1.1.0-test.36',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.36',
  releaseNotes: {
    de: [
      'Die 2×2-Wettervergleichsansicht lädt Meteoblue, Windy und Ventusky beim Anhalten der Vergleichszeit mit bestmöglichen Zeitparametern neu.',
      'Die eigene Astro-Wolkenkarte reagiert weiterhin direkt auf die gemeinsame Vergleichszeit.',
      'Die Vergleichsansicht zeigt Hinweise zur eingeschränkten Zeitsynchronisierung externer iFrames.'
    ],
    en: [
      'The 2x2 weather comparison view reloads Meteoblue, Windy and Ventusky with best-effort time parameters when the comparison time stops changing.',
      'The own astro cloud map still reacts directly to the shared comparison time.',
      'The comparison view shows notes about limited time synchronization of external iframes.'
    ]
  }});
