/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.17',
  release: '1.1.0-test.17',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.17',
  releaseNotes: {
    de: [
      'Der Flugwetter-Kartenbutton öffnet keine externe AWC-GFA-Karte mehr, sondern zeigt eine integrierte Stationskarte in der App.',
      'Die Stationskarte markiert die ausgewählten Flugwetterstationen sowie den Planungsstandort und färbt Marker nach METAR-Flugkategorie.',
      'Der MOSMIX-Tab enthält jetzt eine funktionierende Ladefunktion mit standortnaher Punktprognose und tabellarischer Übersicht.'
    ],
    en: [
      'The aviation weather map button no longer opens the external AWC GFA map; it now shows an integrated station map inside the app.',
      'The station map marks selected aviation weather stations and the planning location, with marker colors based on the METAR flight category.',
      'The MOSMIX tab now includes a working load action with a local point forecast and tabular overview.'
    ]
  }
});
