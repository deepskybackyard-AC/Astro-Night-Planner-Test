/* Explizite Build-Konfiguration: TEST-Repository */
'use strict';
window.ANP_BUILD = Object.freeze({
  environment: 'test',
  repositoryRole: 'test',
  appVersion: '1.1.0-test.20',
  release: '1.1.0-test.20',
  databaseName: 'astro-night-planner-test-v1',
  badgeText: 'TESTVERSION',
  documentTitle: 'Astro Night Planner 1.1.0-test.20',
  releaseNotes: {
    de: [
    'Setup-Rahmen wird beim Objektwechsel wieder auf das ausgewählte Objekt gesetzt.',
    'Aladin-Detailinfos erscheinen nur noch bei echtem Klick auf sichtbar beschriftete Objekte; Verschieben öffnet keine Popups mehr.',
    'Wolkenkarte: geringe Glättung wirkt wolkiger und weniger milchig; Niederschlag, Regen und Schnee sind schaltbar.',
    'Default-Modellgewichtung: DWD ICON 40 %, ECMWF IFS 20 %, NOAA GFS 40 %.',
    'Horizontansicht: Dämmerungsphasen werden zeitlich passend als dezente Grauschattierung angezeigt; Horizontprofile haben mehr Stützpunkte.',
    'Stündlicher Wetterverlauf: Farben sind etwas kräftiger.'
  ],
  en: [
    'The setup frame is reset to the selected object when switching objects.',
    'Aladin detail popups now require a real click on visibly labeled objects; panning no longer opens popups.',
    'Cloud map: low smoothing is more cloud-like and less milky; precipitation, rain and snow are toggleable.',
    'Default model weighting: DWD ICON 40%, ECMWF IFS 20%, NOAA GFS 40%.',
    'Horizon view: twilight phases are shown as subtle time-matched grey shading; horizon profiles use more control points.',
    'Hourly weather trend colours are slightly stronger.'
  ]
  }
});
