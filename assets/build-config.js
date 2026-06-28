/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.32',
  release: '1.1.0-test.32',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.32',
  releaseNotes: {
    de: [
      'Astro-Wolkenmodell ist jetzt eine eigene einklappbare Planungsrubrik; der alte Unter-Schalter entfällt.',
      'Meteoblue-Wetterkarten werden wieder konservativer eingebettet; externe Buttons öffnen getrennt Windanimation oder Wolken-/Niederschlagskarte.',
      'Niederschlagslegende und Einstellungslabels wurden fachlich eindeutiger benannt und übersetzt.',
      'Integrierte Hilfe und Handbuch wurden um Praxisbeispiele zu Wolkenmodell, Niederschlag und Meteoblue ergänzt.'
    ],
    en: [
      'The astro cloud model is now its own collapsible planning section; the old inner toggle is removed.',
      'Meteoblue weather maps are embedded more conservatively again; external buttons separately open wind animation or clouds/precipitation.',
      'Precipitation legend and settings labels were made clearer and translated.',
      'Integrated help and manual were expanded with practical examples for the cloud model, precipitation and Meteoblue.'
    ]
  }});
