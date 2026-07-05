Astro Night Planner Local Survey Server 0.3
=========================================

Dieses optionale Windows-Hilfsprogramm stellt lokale HiPS-/Survey-Daten
unter einer lokalen HTTP-Adresse bereit, damit der Astro Night Planner
lokale Aladin-Surveys nutzen kann.

Keine Python-Installation erforderlich.
Keine wget-/PowerShell-Befehle erforderlich.

Dateien
-------
ANP-SurveyServer-Konfiguration.exe
  Öffnet das Konfigurationsmenü. Hier werden Survey-Hauptordner, Port,
  Autostart und Downloads verwaltet.

ANP-SurveyServer-Start.exe
  Startet den lokalen Webserver sofort mit gespeicherter Konfiguration.
  Wenn keine Konfiguration existiert, zuerst die Konfiguration starten.

ANP-SurveyServer-Status.exe
  Zeigt gespeicherte Konfiguration und lokal erkannte Survey-Strukturen.

Empfohlener Ablauf
------------------
1. ANP-SurveyServer-Konfiguration.exe per Doppelklick starten.
2. Survey-Hauptordner wählen, z. B. D:\AstroSurveys.
3. Port übernehmen, z. B. 8765.
4. Im Menü "Survey vollständig herunterladen" einen NSNS-Survey wählen.
5. Nach dem Download ANP-SurveyServer-Start.exe starten.
6. Im Astro Night Planner die lokale Basis-URL eintragen:
   http://127.0.0.1:8765/
7. Beim Survey den relativen Pfad eintragen, z. B.:
   nsns/ohs8/

Vollständiger Download
----------------------
Der Downloader lädt properties, Moc.fits und die HiPS-Kacheln anhand der
MOC-Coverage. Der Download kann lange dauern und sehr viele kleine Dateien
umfassen. Abgebrochene Downloads können erneut gestartet werden; vorhandene
Dateien werden übersprungen.

Sicherheit
----------
Der Server bindet nur an 127.0.0.1 und ist damit nur lokal auf dem Rechner
erreichbar. Er wird nicht im lokalen Netzwerk veröffentlicht.

Hinweis
-------
Dies ist ein Test-/Prototyp-Werkzeug. Es ist nicht digital signiert. Windows
kann beim ersten Start eine Sicherheitswarnung anzeigen.
