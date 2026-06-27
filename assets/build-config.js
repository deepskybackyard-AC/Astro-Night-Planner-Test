/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.27',
  release: '1.1.0-test.27',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.27',
  releaseNotes: {
    de: [
      'Aladin-Bedienung: Tabs neu angeordnet in der Reihenfolge Rahmen, Objekte, Himmelsbild, Zeit & Mond.',
      'Himmelsbild in neuem Tab öffnen ist jetzt als dauerhafte Schnellaktion rechts neben den Tabs verfügbar.',
      'Höhen- und Horizontkurven verwenden eine dichtere Objektbahnberechnung für glattere und präzisere Kurven.',
      'Legende der Höhenkurve blendet Astronomische Nacht aus, wenn sie in der Planungsnacht nicht vorkommt.'
    ],
    en: [
      'Aladin controls: tabs reordered to Frame, Objects, Sky image, Time & Moon.',
      'Open sky image in a new tab is now a permanent quick action to the right of the tabs.',
      'Altitude and horizon curves use denser object-track sampling for smoother and more precise curves.',
      'The altitude-curve legend hides astronomical night when it does not occur in the planning night.'
    ]
  }});
