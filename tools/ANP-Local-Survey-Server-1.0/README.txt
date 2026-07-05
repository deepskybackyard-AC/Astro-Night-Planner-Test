Astro Night Planner Local Survey Server 1.0
==========================================

Deutsch
-------
Dieses Hilfsprogramm stellt lokale HiPS-Survey-Ordner über eine lokale HTTP-Adresse bereit, z. B. http://127.0.0.1:8765/. Der Astro Night Planner kann dann diese URL statt eines Windows-Dateipfads verwenden.

Startvarianten:
- Doppelklick auf ANP-Local-Survey-Server-1.0.exe:
  Öffnet die lokale Konfigurationsoberfläche im Standardbrowser.
- ANP-Local-Survey-Server-1.0.exe --background:
  Startet die Konfigurationsoberfläche im Hintergrund. Bei aktivierter Option kann auch der lokale Survey-Server automatisch gestartet werden. Das Programm bleibt über das Tray-Icon erreichbar.
- ANP-Local-Survey-Server-1.0.exe --console:
  Öffnet die textbasierte DOS-/Konsolenbedienung.

Windows-Integration:
- "Mit Windows starten" legt einen Autostart-Eintrag im aktuellen Benutzerprofil an.
- "Beim Start im Hintergrund/Infobereich bleiben" öffnet beim Programmstart nicht automatisch den Browser.
- "Lokalen Survey-Server automatisch starten" startet den Survey-Server direkt mit.
- Das Tray-Menü bietet: Oberfläche öffnen, Server starten, Server stoppen, Beenden.

Einrichtung:
1. Einen gemeinsamen Survey-Hauptordner wählen, z. B. D:\AstroSurveys.
2. Die gewünschten Surveys herunterladen oder vorhandene HiPS-Ordner dort ablegen.
3. Im Astro Night Planner als lokale Survey-Basis-URL z. B. http://127.0.0.1:8765/ eintragen.
4. Pro Survey den relativen Pfad eintragen, z. B. nsns/ohs8/.
5. In Astro Night Planner die lokale Survey-Quelle prüfen.

English
-------
This helper program serves local HiPS survey folders through a local HTTP address, for example http://127.0.0.1:8765/. Astro Night Planner can then use this URL instead of a Windows file path.

Start modes:
- Double-click ANP-Local-Survey-Server-1.0.exe:
  Opens the local configuration interface in the default browser.
- ANP-Local-Survey-Server-1.0.exe --background:
  Starts the configuration interface in the background. If enabled, the local survey server can also start automatically. The program remains available through the tray icon.
- ANP-Local-Survey-Server-1.0.exe --console:
  Opens the text-based DOS/console interface.

Windows integration:
- "Start with Windows" creates an autostart entry for the current Windows user.
- "Start in background / notification area" does not open the browser automatically on program start.
- "Start local survey server automatically" starts the survey server immediately.
- The tray menu offers: open interface, start server, stop server, exit.

Setup:
1. Choose one common survey root folder, for example D:\AstroSurveys.
2. Download the desired surveys or place existing HiPS folders there.
3. In Astro Night Planner, enter the local survey base URL, e.g. http://127.0.0.1:8765/.
4. Enter the relative path for each survey, e.g. nsns/ohs8/.
5. Use Astro Night Planner to check the local survey source.
