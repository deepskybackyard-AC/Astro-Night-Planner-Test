# Astro Night Planner 1.0.0-test.12 installieren

Diese Testversion ist kumulativ zu test.9/test.10/test.11 und korrigiert insbesondere die Stabilität von „Meine Aufnahmeziele“, die Filteranordnung, die Objekttyp-Logik, die Objektlisten-Konfiguration und weitere englische UI-Texte.

## Installation im Test-Repository

1. ZIP-Datei entpacken.
2. Den Inhalt des entpackten Ordners in das GitHub-Testrepository kopieren.
3. Vorhandene Dateien ersetzen.
4. Änderungen committen und nach GitHub pushen.
5. GitHub Pages abwarten und die Testseite mit hartem Neuladen öffnen.

## Empfohlene Prüfung nach dem Upload

- Seite öffnen und Version `1.0.0-test.12` prüfen.
- Ein Objekt in der Objektliste direkt zu „Meine Aufnahmeziele“ hinzufügen.
- Ohne Neuladen zu Einstellungen wechseln und dort Tabs wechseln.
- In „Meine Aufnahmeziele“ den Suchdialog öffnen und `ngc7000`, `NGC7000` und `NGC 7000` testen.
- Ungültige Suche testen; es darf nur ein Hinweis erscheinen, kein App-Abbruch.
- Objekttypen prüfen: Im Standardprofil sind alle Typen aktiv; keine Auswahl bedeutet nicht mehr automatisch „alle“.
- Anzeige → Objektlisteninformationen konfigurieren prüfen: Überschrift ist statisch, Kompakt/Standard/Detailliert sind sichtbar und initial geschlossen.
- Eine Liste öffnen und mehrere Spalten nacheinander verschieben; sie darf nicht nach jeder Verschiebung zuklappen.
- Sprache auf EN stellen und die wichtigsten Ansichten auf deutsche Resttexte prüfen.

## Hinweis

Open-Meteo, OpenFreeMap, Meteoblue und Aladin Lite müssen im echten GitHub-Pages-Betrieb getestet werden, da sie externe Dienste sind.
