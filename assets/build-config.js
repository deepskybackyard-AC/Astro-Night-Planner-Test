/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.15',
  release: '1.1.0-test.15',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.15',
  releaseNotes: {
    de: [
      'Der Flugwetter-Proxy ist fest im Code hinterlegt; Proxy-Eingabefeld und Proxy-Test wurden entfernt.',
      'Der Flugwetter-Button heißt jetzt „METAR/TAF-Daten aktualisieren“ und zeigt nur noch verständliche Stationskarten ohne externe AWC-Fachlinks.',
      'Ein Fragezeichen-Button in der Kopfzeile öffnet die Hilfe direkt; neue Flugwettertexte wurden für DE/EN ergänzt.'
    ],
    en: [
      'The aviation-weather proxy is fixed in the code; the proxy input and proxy test have been removed.',
      'The aviation-weather button is now labelled “Refresh METAR/TAF data” and only shows readable station cards without external AWC expert links.',
      'A question-mark button in the header opens the help directly; new aviation-weather labels have been added in DE/EN.'
    ]
  }
});
