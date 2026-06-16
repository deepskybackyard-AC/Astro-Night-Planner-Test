# Astro Night Planner 1.0 – Testkorrektur 2

Dieses Paket ersetzt das vorherige Testupdate `1.0.0-test.1` vollständig.

## Behobene beziehungsweise ergänzte Punkte

- Ganze Objektzeile öffnet die Details.
- Details erscheinen direkt unter dem gewählten Objekt und lassen sich separat schließen.
- Große Höhenkurve und Horizontansicht sind wieder vorhanden und einzeln auf-/zuklappbar.
- Initialzustand beider Detailgrafiken ist in den zentralen Einstellungen konfigurierbar; Default: eingeklappt.
- Aladin Lite wird auf das Objekt zentriert und passend gezoomt.
- Setup-Rahmen und Objektgröße werden maßstäblich zur Aladin-Ansicht dargestellt.
- Höhe der Aladin-Ansicht von 430 px auf 645 px erhöht.
- Meteoblue steht wieder direkt unter den übrigen Wetterdaten.
- Planungszeitraum ist in der Planungsansicht auswählbar und steuert auch Mini-Höhenprofile.
- Speichern des Standard-Planungszeitraums wirkt sofort in der Planung.
- Wetterwerte werden wieder farbig nach Aufnahmequalität dargestellt.
- Neues Wettermodell-Prinzip: gewichteter Modellkonsens je Prognosestunde.
- Defaultgewichtung: DWD ICON 40 %, ECMWF IFS 40 %, NOAA GFS 20 %.
- Temporäre Auswahl zwischen Modellkonsens und jedem Einzelmodell in der Planung.
- Wetterdarstellung kann in den Einstellungen oder aus der Planung heraus als Standard gespeichert werden.
- Große Höhen- und Horizontgrafiken zeigen Gradwerte und N/NO/O/SO/S/SW/W/NW.
- Fehlende Einheiten in Objektfiltern ergänzt.
- Vorschaugrafik im Horizonteditor ergänzt.

## Installation im Test-Repository

1. ZIP-Datei entpacken.
2. Den gesamten Inhalt in das Stammverzeichnis des Test-Repositorys kopieren.
3. Gleichnamige Dateien ersetzen.
4. Den vorhandenen Ordner `src` und insbesondere `src/data/catalog.generated.json` nicht löschen.
5. Commit nach `main` durchführen.
6. Nach dem erfolgreichen GitHub-Actions-Lauf die Testseite mit `Strg + F5` neu laden.

Die Testfassung muss den gelben Titel und den Hinweis `TESTVERSION` zeigen.
