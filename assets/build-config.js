/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.43',
  release: '1.1.0-test.43',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.43',
  releaseNotes: {
    de: [
      'Der Button „Wettervergleich in neuem Tab öffnen“ wurde aus den zusätzlichen Wetterquellen entfernt.',
      'Der nicht mehr benötigte Code für das separate Vergleichsfenster, die zentrale Vergleichszeit und die Zeitübergabe an externe Karten wurde entfernt.',
      'Hilfe und Handbuch beschreiben Windy, Ventusky, Meteoblue und Clear Outside jetzt als einzelne externe Kontrollquellen mit eigener Bedienung.',
    ],
    en: [
      'The “Open weather comparison in new tab” button has been removed from the additional weather sources.',
      'The no longer needed code for the separate comparison window, shared comparison time and time handoff to external maps has been removed.',
      'Help and handbook now describe Windy, Ventusky, Meteoblue and Clear Outside as individual external reference sources with their own controls.',
    ]
  }});
