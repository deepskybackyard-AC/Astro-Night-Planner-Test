# Korrekturen und Erweiterungen – Testversion 1.0.0-test.9

## Wolkenkarte

- Die kombinierte Ansicht verwendet eine erkennbare dunkle Topografiekarte statt einer fast schwarzen Hintergrundfläche.
- Gelände, Gewässer, ausgewählte Straßen, Grenzen und Ortsnamen bleiben sichtbar, ohne die Wolken zu überstrahlen.
- Wolken werden als weißes, nach Wolkenanteil transparentes Feld darübergelegt.
- Die Kartenfläche nutzt dieselbe verfügbare Größe wie die reine Wolkenansicht.
- Karteninstanz und Größenanpassung wurden für Datumswechsel und erneutes Öffnen stabilisiert.
- **Karte + Wolken** und **Nur Wolken** bleiben temporär in der Planung umschaltbar.
- Die Glättungsstufen bleiben temporär wählbar.

## Niederschlagsdarstellung

Die Kartenlegende enthält drei direkt schaltbare Ebenen:

- **Niederschlag**: türkisfarbene Markierung für den gesamten prognostizierten Niederschlag
- **Regen**: blaue Regenstruktur
- **Schnee**: violette Schneesymbole

Die Schalter verändern nur die aktuelle Kartendarstellung. Die zugrunde liegenden Werte stammen aus derselben modellbezogenen Open-Meteo-Abfrage wie die Wolkenfelder. Orange Prozentangaben markieren weiterhin den Wolkenanteil an den Prognosepunkten.

## Aladin-Rahmung

- **Rahmen auf Bildmitte** liest die aktuelle Aladin-Bildmitte aus und versetzt den Kamerarahmen dorthin, ohne Zoom oder Bildposition zu verändern.
- Der Button bestätigt den erfolgreichen Vorgang sichtbar.
- Die Objektellipse verwendet bereits beim ersten Öffnen automatisch den Katalog-Positionswinkel.
- Dies gilt ebenso nach Objektwechsel oder Neuaufbau der Aladin-Ansicht.
- Der bisherige Button „Katalogwinkel“ heißt jetzt **Objektausrichtung zurücksetzen**.
- Das Zurücksetzen betrifft ausschließlich die Objektellipse; Kamerarahmen, Kamerarotation und Bildausschnitt bleiben unverändert.

## Aufklappbare Rubriken

Die Pfeile der neu aufklappbaren Rubriken stehen wie bei den bisherigen Bereichen links vor dem Titel. Die Modellzusammenfassung bleibt rechts angeordnet.
