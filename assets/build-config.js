/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.3.0-test.3',
  release: '1.3.0-test.3',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.3.0-test.3',
  releaseNotes: {
    de: [
      'Polarlicht-Bewertung stärker auf den gewählten Standort bezogen; reine Meldungszahlen ohne G-/Kp-Stärke erzeugen keine lokale Warnfarbe.',
      'Polarlicht-Hilfe und Dashboard erklären Datenstatus, lokale Relevanz und Warnstufen verständlicher.',
      'Objektliste behält die horizontale Scrollbar auch bei geöffneter Detailansicht.',
      'Aladin - Himmel & Horizont bereinigt: native Gradnetz-Dopplungen entfernt, azimutales Gradnetz als eigenes App-Overlay mit Farbpicker und Linienstärke ergänzt.',
      'Bodenanzeige im externen Aladin-Tab als Auswahl kein Boden / Standardhorizont / persönlicher Horizont mit Boden-Transparenz ergänzt; Fallback auf Standardhorizont.',
      'Aladin-Infofeld trennt Höhe über mathematischem Horizont und über persönlichem Horizont.'
    ],
    en: [
      'Aurora assessment now relates more strongly to the selected location; message counts without G/Kp strength do not trigger a local warning color.',
      'Aurora help and dashboard explain data status, local relevance and warning levels more clearly.',
      'The object list keeps horizontal scrolling even when object details are open.',
      'Aladin - Sky & Horizon cleaned up: duplicate native grid settings removed, azimuthal grid added as app overlay with color picker and line width.',
      'External Aladin ground display now offers none / standard horizon / personal horizon plus ground opacity and fallback to standard horizon.',
      'Aladin info box separates altitude above mathematical horizon and above personal horizon.'
    ]
  }
});
