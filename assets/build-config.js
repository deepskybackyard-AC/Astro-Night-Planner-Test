/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.16',
  release: '1.1.0-test.16',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.16',
  releaseNotes: {
    de: [
      'Neben „METAR/TAF-Daten aktualisieren“ gibt es wieder einen separaten Button „Flugwetterkarte öffnen“.',
      'Der Kartenbutton öffnet die externe AWC-GFA-Karte nur als optionale Expertenansicht; die App-Auswertung bleibt die verständliche Stationskarte.',
      'Der Fragezeichen-Button und der Hilfe-Link unten öffnen jetzt die integrierte aktuelle Hilfe statt der alten HTML-Hilfedatei.'
    ],
    en: [
      'A separate “Open aviation weather map” button is back next to “Refresh METAR/TAF data”.',
      'The map button opens the external AWC GFA map only as an optional expert view; the app’s readable station cards remain the main view.',
      'The question-mark button and footer help link now open the current integrated help instead of the outdated HTML help file.'
    ]
  }
});
