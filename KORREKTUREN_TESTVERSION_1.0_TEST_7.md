# Korrekturen und Erweiterungen - Testversion 1.0.0-test.7

## Aladin und Rahmung

- Objektellipse verwendet vollständige Katalogachsen korrekt als Halbachsen der Aladin-Ellipse.
- Positionswinkel wird als astronomischer Winkel bezogen auf Norden an Aladin übergeben.
- Kamerarahmen und Objektellipse bleiben Himmelskoordinaten-Overlays.
- Rotation aktualisiert nur die Overlays und lädt das Surveybild nicht neu.
- Manueller Button **Himmelsbild neu laden** ergänzt.
- Objektnamen und Katalognummern ein-/ausschaltbar.
- Beschriftungsstufen: Automatisch nach Zoom, nur Hauptobjekte, erweitert.
- Beschriftungszahl wird begrenzt und beim Zoomen/Pannen gedrosselt aktualisiert.

## Objektliste und Bewertung

- „Beste Stunde“ wird ausschließlich im nautischen Planungszeitraum ermittelt.
- Maßgeblich ist der höchste stündliche Qualitätswert; Höhe und Bewölkung entscheiden bei Gleichstand.
- Qualitätsampel konfigurierbar; Defaults Rot 0-59, Gelb 60-79, Grün 80-100.
- Objektlisteninformationen in einer aufklappbaren Auswahl konfigurierbar.
- Sichtbarkeit per Checkbox, Reihenfolge per Drag-and-drop sowie Auf-/Ab-Schaltflächen.
- Texteingabe im Objektfilter mit 900 ms Verzögerung; Enter und **Filter anwenden** reagieren sofort.

## Einstellungen

- Jede Rubrik besitzt einen eigenen Button **Rubrik auf Standard zurücksetzen**.
- Der Reset verändert zunächst nur die Eingaben und wird erst durch Speichern dauerhaft.
- Validierung der Qualitätsgrenzen.

## Wolkenkarte

- Topografische Basiskarte mit MapLibre und OpenFreeMap-Vektordaten.
- Straßen, Gebäude, POIs und Verkehrsebenen werden weitgehend ausgeblendet.
- Gelände, Gewässer, Grenzen und wichtige Ortsnamen bleiben sichtbar.
- Alle Modelle verwenden im Modus Wolkenverteilung dieselbe weiße Wolkendarstellung.
- Wolkenmenge wird nur durch Deckkraft dargestellt.
- Modellabweichungsmodus bleibt unverändert farbig.
- Glättungsstufen Strukturiert, Ausgewogen und Weich.
- Prognosepunktzahl und Darstellungsinterpolation bleiben getrennt.

## Standort und Zeitzone

- Standortsuche zeigt eine Trefferliste mit Ort, Region, Land, Postleitzahl und Koordinaten.
- Bevorzugtes Land ist einstellbar; Default Deutschland.
- Numerische Eingaben werden als Postleitzahl gesucht.
- Zeitzone ist eine Liste gültiger IANA-Zeitzonen statt freiem Text.
- Nach Standortwahl werden Zeitzone und Höhe automatisch ergänzt, soweit verfügbar.

## Dokumentation

- Browserhilfe und Benutzerhandbuch um alle Funktionen aus Test 7 ergänzt.
- PDF-Handbuch neu erzeugt und als 16-seitiges A4-Dokument geprüft.
