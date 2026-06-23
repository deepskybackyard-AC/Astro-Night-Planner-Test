/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.8',
  release: '1.1.0-test.8',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.8',
  releaseNotes: {
    de: [
    "iPad- und Tablet-Layouts wurden robuster gegen Überlappungen gemacht.",
    "Neuanlage-Felder markieren Vorgabetexte beim ersten Antippen automatisch.",
    "Kameras können zusätzlich über Auflösung/Megapixel beschrieben werden; Pixelgröße wird berechnet.",
    "Teleskope/Objektive können über Brennweite und Blende gepflegt werden; die Öffnung wird berechnet.",
    "Reducer/Barlow-Faktoren können als optische Zusatzkomponenten im Setup berücksichtigt werden.",
    "Speichern-Aktionen sind auf Einstellungsseiten zusätzlich oben verfügbar.",
    "Mondaufgang und Monduntergang zeigen bei Hinweisen nun auch die Uhrzeit.",
    "Aladin-Infofelder können ein- und ausgeblendet sowie positioniert werden.",
    "Der Kamerarahmen kann in Aladin frei auf die Bildmitte gesetzt werden.",
    "Ungespeicherte Einstellungen warnen vor dem Verlassen der Seite."
],
    en: [
    "iPad and tablet layouts are more robust against overlap.",
    "New-entry fields automatically select placeholder defaults on first tap.",
    "Cameras can additionally be described by resolution/megapixels; pixel size is calculated.",
    "Telescopes/lenses can be maintained by focal length and f-number; aperture is calculated.",
    "Reducer/Barlow factors can be used as optical accessories in setups.",
    "Save actions are additionally available at the top of settings pages.",
    "Moonrise and moonset hints now include the actual time.",
    "Aladin info boxes can be shown/hidden and positioned.",
    "The camera frame can be freely set to the current Aladin view center.",
    "Unsaved settings warn before leaving the page."
]
  }
});
