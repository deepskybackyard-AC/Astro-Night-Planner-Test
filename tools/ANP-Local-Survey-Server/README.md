# Astro Night Planner Local Survey Server - Test-Prototyp 0.2

Dieses Zusatzprogramm stellt lokale HiPS-/Survey-Daten ohne Python-Installation bereit.
Es nutzt Windows PowerShell, die auf modernen Windows-Systemen vorhanden ist.

## Dateien

- `AstroSurveyServer_Konfiguration.cmd` - Konfiguration erfassen oder ändern.
- `AstroSurveyServer_Start.cmd` - lokalen Webserver mit gespeicherter Konfiguration starten.
- `AstroSurveyServer_Download_Startdateien.cmd` - NSNS-Startdateien (`properties`, `Moc.fits`) herunterladen.
- `AstroSurveyServer_Status.cmd` - gespeicherte Basis-URL anzeigen.

## Wichtig

Der Server lädt bekannte NSNS-HiPS-Dateien bei Bedarf automatisch aus der Online-Quelle nach,
wenn Aladin oder die App sie anfordert. Dadurch müssen nicht sofort komplette Surveys manuell
mit wget heruntergeladen werden. Bereits geladene Dateien bleiben im Survey-Hauptordner gespeichert.

Beispiel in der App:

- Lokale Survey-Basis-URL: `http://127.0.0.1:8765/`
- NSNS OHS lokaler Pfad: `nsns/ohs8/`

Der Test der App ruft `.../properties` ab. Falls diese Datei noch fehlt, lädt der Server sie automatisch.

## Sicherheit

Der Server bindet standardmäßig nur an `127.0.0.1` und ist damit nicht im Netzwerk erreichbar.
