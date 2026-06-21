# Korrekturen Testversion 1.0-test.21

## Umgesetzt

- Zweites Suchfeld im Basisfilter ergänzt: **Direktsuche ohne weitere Filter**.
- Normales Suchfeld präzisiert zu **Suche innerhalb der aktiven Filter**.
- Direktsuche ignoriert Kataloge, Objekttypen, Mindesthöhe, Mindestdauer, Mondabstand, Größenfilter, Flächenhelligkeit, Aufnahmefilter, Rahmungsfilter und Mindestbewertung.
- Aktive Suchfelder werden optisch hervorgehoben; bei aktiver Direktsuche erscheint ein klarer Hinweis.
- Zahlenfelder in Basis- und Größenfiltern kompakter gestaltet.
- Wikipedia-Suchlogik geändert: Katalognummern wie `SH 2-119`, `NGC 7000` oder `IC 5070` werden bevorzugt verwendet; gebräuchliche Namen dienen nur noch als Fallback.
- Wikipedia-Suchlogik auch im externen Aladin-Objektpopup angepasst.
- Hilfe und Handbücher um Direktsuche, Wikipedia-Katalogsuche sowie atmosphärische und effektive Transparenz erweitert.
- Service Worker, Build-Konfiguration, Paketversion und Versionsdatei auf Test 21 aktualisiert.

## Nicht erneut angefasst

Die bereits in Test 20 erledigten Punkte 4 bis 10 wurden nicht erneut umgebaut, außer wo die Wikipedia-Suche direkt betroffen war.
