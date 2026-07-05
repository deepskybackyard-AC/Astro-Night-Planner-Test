Astro Night Planner Local Survey Server 1.0
==========================================

Deutsch
-------
Dieses Windows-Hilfsprogramm stellt lokale HiPS-Survey-Ordner über eine lokale HTTP-Adresse bereit, damit Astro Night Planner sie im Aladin-Himmelsbild verwenden kann.

Bedienung:
- Doppelklick auf ANP-Local-Survey-Server-1.0.exe öffnet ein sichtbares Windows-Kontrollfenster und zusätzlich die Browser-Konfigurationsseite.
- Wenn der Browser nicht automatisch öffnet, nutze „Oberfläche öffnen“ im Kontrollfenster oder im Tray-Menü.
- Das X im Kontrollfenster versteckt das Fenster nur in den Infobereich. Das Programm läuft weiter.
- „Server stoppen“ stoppt nur den lokalen Survey-Dateiserver.
- „Beenden / Exit“ stoppt Survey-Server und Konfigurationsoberfläche vollständig. Danach ist die EXE freigegeben und kann ersetzt oder gelöscht werden.
- Das Tray-Menü bietet „Oberfläche öffnen“, „Server starten“, „Server stoppen“ und „Beenden“.

Autostart:
- „Mit Windows starten“ legt einen Autostart-Eintrag für den aktuellen Windows-Benutzer an.
- „Beim Start im Hintergrund/Infobereich bleiben“ startet ohne sichtbares Browserfenster und bleibt über das Tray-Icon bedienbar.
- „Lokalen Survey-Server automatisch starten“ startet den eigentlichen Dateiserver automatisch.

Konsolenmodus / DOS-Box:
- Eingabeaufforderung im Programmordner öffnen.
- Starten mit: ANP-Local-Survey-Server-1.0.exe --console
- Hintergrundmodus: ANP-Local-Survey-Server-1.0.exe --background

Empfohlene Ordnerstruktur:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties

Eintragung im Astro Night Planner:
Lokale Survey-Basis-URL: http://127.0.0.1:8765/
Relativer Survey-Pfad: nsns/ohs8/ oder nsns/halpha8/ usw.

Die App kann dieses Windows-Programm nicht direkt starten. Wenn das Hilfsprogramm bereits läuft, kann die App die lokale Konfigurationsoberfläche öffnen. Wenn es nicht erreichbar ist, starte die EXE manuell oder aktiviere den Autostart.

English
-------
This Windows helper serves local HiPS survey folders through a local HTTP address so Astro Night Planner can use them in the Aladin sky image.

Operation:
- Double-click ANP-Local-Survey-Server-1.0.exe to open a visible Windows control window and the browser configuration page.
- If the browser does not open automatically, use “Open interface” in the control window or tray menu.
- Closing the control window with X only hides it to the notification area. The program keeps running.
- “Stop server” stops only the local survey file server.
- “Beenden / Exit” stops the survey server and configuration interface completely. The EXE is then released and can be replaced or deleted.
- The tray menu contains “Open interface”, “Start server”, “Stop server” and “Exit”.

Autostart:
- “Start with Windows” creates an autostart entry for the current Windows user.
- “Start in background / tray” starts without a visible browser window and keeps the helper available through the tray icon.
- “Automatically start local survey server” starts the actual file server automatically.

Console mode / DOS window:
- Open Command Prompt in the program folder.
- Start with: ANP-Local-Survey-Server-1.0.exe --console
- Background mode: ANP-Local-Survey-Server-1.0.exe --background

Recommended folder structure:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties

Settings in Astro Night Planner:
Local survey base URL: http://127.0.0.1:8765/
Relative survey path: nsns/ohs8/ or nsns/halpha8/ etc.

The app cannot directly start this Windows program. If the helper is already running, the app can open the local configuration interface. If it is not reachable, start the EXE manually or enable autostart.
