/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.24',
  release: '1.1.0-test.24',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.24',
  releaseNotes: {
    de: [
      'Horizontansicht: Dämmerungsphasen bleiben in der 360°-Azimutansicht und verwenden jetzt dieselben Farben wie die Höhenkurve.',
      'Horizontansicht: Die relative Breite der Dämmerungsphasen wird aus dem Sonnenuntergang-bis-Sonnenaufgang-Zeitfenster der Höhenkurve übernommen.',
      'Weitere Funktionen aus test.23 bleiben unverändert.'
    ],
    en: [
      'Horizon view: twilight phases stay in the 360° azimuth view and now use the same colours as the altitude curve.',
      'Horizon view: the relative width of the twilight phases is derived from the sunset-to-sunrise time window of the altitude curve.',
      'Other functions from test.23 are unchanged.'
    ]
  }});
