/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.3.0-test.1',
  release: '1.3.0-test.1',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.3.0-test.1',
  releaseNotes: {
    de: [
      'Mini-Höhenprofile zeigen zusätzlich den aktiven persönlichen Horizont und die Sichtbarkeitszeit über dem Horizont.',
      'Die Datumsbuttons zeigen Mondbeleuchtung und eine farbige Nachtbewertung anhand des gewählten Planungszeitraums.',
      'Der stündliche Wetterverlauf kann in einem neuen Tab für mehrere Nächte geöffnet werden; die Anzahl zusätzlicher Nächte ist einstellbar.',
      'Ein erster Polarlicht-Hinweis mit automatischem Abruf beim App-Start, manueller Aktualisierung, optionalem Intervall und Dashboard wurde ergänzt.',
      'Der externe Aladin-Tab erhält erste experimentelle Himmel-/Horizont-Overlays: äquatoriales Grid, einfache Alt-Az-/Horizont-/Kompassanzeige.'
    ],
    en: [
      'Mini altitude profiles now also show the active personal horizon and the visible time above that horizon.',
      'Date buttons show Moon illumination and a colored night quality rating for the selected planning window.',
      'The hourly weather trend can be opened in a new tab for multiple nights; the number of additional nights is configurable.',
      'A first aurora indicator with automatic loading at app start, manual refresh, optional interval and dashboard has been added.',
      'The external Aladin tab includes first experimental sky/horizon overlays: equatorial grid, simple alt-az, horizon and compass display.'
    ]
  }
});
