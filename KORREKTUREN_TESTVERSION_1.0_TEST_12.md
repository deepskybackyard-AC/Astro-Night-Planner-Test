# Korrekturen und Erweiterungen in 1.0.0-test.12

## Stabilität „Meine Aufnahmeziele“

- Fehler `framingStatusLabel is not defined` behoben.
- Hinzufügen von Aufnahmezielen darf Navigation und Einstellungs-Tabs nicht mehr blockieren.
- Suchbegriffe werden normalisiert: `ngc7000`, `NGC7000`, `NGC 7000` und ähnliche Schreibweisen werden gleich behandelt.
- Die Zielsuche läuft in einem Dialog mit manueller Suche, Enter-Taste und automatischer Suche nach ca. 900 ms.
- Ungültige oder nicht gefundene Begriffe erzeugen einen Hinweis statt eines App-Abbruchs.

## Objektliste

- Direktaktion pro Objekt ergänzt: „Zu Meine Aufnahmeziele hinzufügen“ bzw. Status „In Meine Aufnahmeziele“.
- Filterbereich kompakter angeordnet.
- Objektgrößenprofil und vier Größenfelder werden als zusammengehörige Gruppe dargestellt.
- Zahlenfelder wurden kompakter gestaltet.
- „Filter anwenden“ wurde an das Ende des Filterbereichs verschoben.

## Objekttyp-Filter

- Keine Auswahl bedeutet nicht mehr automatisch „alle“.
- Das Standardprofil „Alle Objekttypen ausgewählt“ aktiviert tatsächlich alle verfügbaren Objekttypen.
- Das Abwählen des letzten aktiven Typs wird verhindert beziehungsweise validiert.

## Zentrale Einstellungen / Anzeige

- „Objektlisteninformationen konfigurieren“ ist keine eigene aufklappbare Gesamtrubrik mehr.
- Die Unterrubriken Kompakt, Standard und Detailliert sind sichtbar, aber initial geschlossen.
- Die aktuell geöffnete Unterrubrik bleibt beim Verschieben von Spalten geöffnet.
- „Darstellungsprofil – Aktiv“ wurde in diesen Bereich verschoben und heißt nun „Objektliste Darstellungsprofil – aktiv“.

## Sprache

- Weitere UI-Texte, Filter, Buttons, Tabs und Hinweise wurden für EN ergänzt.
- Die Sprachumschaltung bleibt `🌐 DE | EN`.
