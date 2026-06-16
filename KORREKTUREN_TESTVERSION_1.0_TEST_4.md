# Korrekturen und Erweiterungen – Astro Night Planner 1.0.0-test.4

## Meteoblue

- Die in Version 0.9 funktionierende eingebettete **Meteoblue Astronomy Seeing**-Ansicht wurde wiederhergestellt.
- Verwendet wird wieder der spezielle Meteoblue-Widget-Endpunkt und nicht die normale, gegen Einbettung geschützte Webseite.
- Zusätzlich wurde die **Meteoblue-Wetterkarte** eingebettet.
- Beide Ansichten besitzen eine Großansicht und einen Link zur zugehörigen Meteoblue-Seite.
- Für Standorte mit bekannter Meteoblue-/GeoNames-ID wird der Standort fest übergeben; andernfalls wird Meteoblues Standorterkennung verwendet.

## Eigene Astro-Wolkenkarte

- Neue visuelle 24-Stunden-Wolkenprognose rund um den gewählten Standort.
- Zeitregler, Vor/Zurück um eine Stunde und automatische Animation.
- Darstellung von Gesamtbewölkung sowie tiefen, mittleren und hohen Wolken.
- Gewichteter **Modellkonsens** aus DWD ICON, ECMWF IFS und NOAA GFS.
- Umschaltung auf jedes einzelne Wettermodell.
- Eigener Modus **Modellabweichung** mit Grün/Gelb/Rot-Verlauf.
- Anzeige von Bewölkung am Standort, Kartenmittel und mittlerer Modellabweichung.
- Niederschlag wird ergänzend in der Karte markiert.
- Geschätzte Verlagerungsrichtung und Geschwindigkeit des Wolkenfeldes.
- Automatisch ermitteltes nächstes voraussichtlich klares Zeitfenster.
- Optional gekoppelte Zeit mit Höhenkurve, Horizontansicht und Framing.
- Kartenrohdaten werden für 90 Minuten in IndexedDB zwischengespeichert.

## Datenmenge und Einstellungen

Neue Rubrik **Zentrale Einstellungen → Wolkenkarte und Datenmenge**:

- 25 Kartenpunkte – sparsam,
- 49 Kartenpunkte – Standard,
- 81 Kartenpunkte – detailliert,
- Kartenradius 60, 120 oder 200 km,
- langsame, normale oder schnelle Animation,
- Standardmodell, Standard-Wolkenschicht und Standard-Kartenmodus,
- Zeitkopplung ein/aus,
- initialer Zustand der Wolkenkarte und der Meteoblue-Wetterkarte.

## Standortvergleich

- Gespeicherte Beobachtungsorte können auf Anforderung verglichen werden.
- Angezeigt werden durchschnittliche Bewölkung, bestes klares Fenster und Modellstreuung.
- Der Vergleich verwendet nur Punktprognosen und ist deutlich datensparsamer als mehrere vollständige Karten.

## Stabilität

- Frühere Wolkenkarten-Anfragen werden bei einer neuen Anfrage abgebrochen.
- Daten von vorherigem Datum, Standort oder Profil werden beim Wetterwechsel verworfen.
- Wettermodelle mit Gewicht 0 werden aus dem gewichteten Konsens korrekt ausgeschlossen.
- Die bestehende Trennung von Test- und Produktivdatenbank sowie Test- und Produktivcache bleibt unverändert.
