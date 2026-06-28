/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.42',
  release: '1.1.0-test.42',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.42',
  releaseNotes: {
    de: [
      'Die Vergleichszeit im Wettervergleich ist nicht mehr von geladenen Astro-Wolkenkartendaten abhängig.',
      'Windy erhält jetzt den erwarteten calendar-/Forecast-Parameter und metrische Embed-Parameter statt freier ISO-Zeitparameter.',
      'Die Wettervergleichsansicht bleibt: links oben Windy, rechts oben Ventusky, links unten Meteoblue; die eigene Astro-Wolkenkarte bleibt deaktiviert.'
    ],
    en: [
      'The comparison time in the weather comparison view no longer depends on loaded astro cloud-map data.',
      'Windy now receives the expected calendar/forecast parameter and metric embed parameters instead of free ISO time parameters.',
      'The weather comparison layout remains: Windy top-left, Ventusky top-right, Meteoblue bottom-left; the own astro cloud map remains disabled.'
    ]
  }});
