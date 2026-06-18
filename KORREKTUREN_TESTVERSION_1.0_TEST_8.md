# Korrekturen und Erweiterungen – Testversion 1.0.0-test.8

## Struktur und Markenleiste

- **Profile für diese Planung** ist als eigener Hauptbereich auf- und zuklappbar.
- Der bisherige Wetterbereich ist in **Wetter und Aufnahmequalität** sowie **Stündlicher Wetterverlauf** getrennt.
- Alle drei Bereiche sind standardmäßig geöffnet; der jeweilige Startzustand ist in den zentralen Einstellungen änderbar.
- Zentrierte Markenleiste mit transparentem Logo, anklickbarer Homepage `www.deepskyastrophoto.de` und `© Andreas Cordt`.
- Kleine, responsive Fußzeile mit Impressum, Datenschutz, Nutzungshinweisen, Datenquellen & Lizenzen, Hilfe und Version.

## Wolkenkarte

- Karteninstanz und Ebenen werden bei erneutem Rendern, Datumswechsel und Containerwechsel kontrolliert entfernt beziehungsweise neu aufgebaut.
- `ResizeObserver` und gezielte Größenaktualisierung stabilisieren die Karte nach Aufklappen und Größenänderungen.
- Topografische Basiskarte stark abgedunkelt, entsättigt und von Straßen, Gebäuden sowie POIs bereinigt.
- Kombinierte Standardansicht **Karte + Wolken** und temporäre Alternative **Nur Wolken**.
- Standard der Kartenansicht ist in den Einstellungen wählbar, ohne temporäre Planungsänderungen zu überschreiben.
- Glättung direkt in der Planung temporär wählbar: **Strukturiert**, **Ausgewogen**, **Weich**.
- Weiße Wolkenfelder mit deutlich verstärktem Kontrast.
- Prozentangaben an den tatsächlichen Prognosepunkten wiederhergestellt; amberfarbene Schrift mit dunklem Halo und angepasster Beschriftungsdichte.
- Prozentwerte können kompakt ein- und ausgeblendet werden; Standard ist eingeschaltet.
- Kartenfläche entspricht wieder der vorgesehenen vollständigen Darstellungsgröße.

## Aladin und Rahmung

- Objektellipse wird als Himmelskoordinaten-Polygon aus den vollständigen Katalogachsen berechnet.
- Astronomischer Positionswinkel wird von Nord über Ost angewendet.
- Interne Rahmungsbewertung verwendet denselben absoluten Objektwinkel wie die sichtbare Ellipse.
- Kamerarahmen und Objektellipse folgen Zoom, Pan und Größenänderung.
- **Rahmen auf Bildmitte** setzt nach manuellem Verschieben den Kamerarahmen auf die aktuelle Aladin-Bildmitte.
- Rückmeldung **Rahmen zentriert ✓** nach erfolgreicher Zentrierung.
- Zeitregler zeigt konkrete Uhrzeit und aktualisiert Höhe, Azimut/Himmelsrichtung, Abstand zum persönlichen Horizont, Dämmerungsphase und die zeitlich nächstliegenden Wetterwerte.
- Sternfeld und Rahmung bleiben bei der Zeitänderung bewusst unverändert.

## Sicherung und Profilübertragung

- Verständlichere Begriffe: **Gesamtsicherung exportieren** und **Aktuelles Profil exportieren**.
- Neuer Button **Profil importieren**.
- Importierte Profile werden immer als neues Profil mit eindeutigem Namen angelegt; vorhandene Profile werden nicht still überschrieben.
- Vorschau einer Gesamtsicherung berücksichtigt auch Montierungen.

## Rechtliche und informative Inhalte

- Impressum mit den Angaben von Andreas Cordt integriert.
- Datenschutzhinweise zur lokalen Speicherung, zu GitHub Pages und zu externen Diensten vorbereitet.
- Nutzungshinweis zu Prognose-, Berechnungs- und Programmfehlern sowie zur KI-unterstützten Entwicklung integriert.
- Datenquellen- und Lizenzübersicht sowie Versionsdialog ergänzt.

## Dokumentation

- Browserhilfe und Benutzerhandbuch für die Funktionen aus Test 8 aktualisiert.
- HTML- und PDF-Handbuch neu erzeugt und geprüft.
