Astro Night Planner Local Survey Server 1.0
==========================================

Deutsch
-------
Dieses Windows-Hilfsprogramm stellt lokale HiPS-Survey-Ordner über eine lokale HTTP-Adresse bereit, damit Astro Night Planner sie im Aladin-Himmelsbild verwenden kann.

Wichtig in dieser Fassung:
- Doppelklick öffnet ein sichtbares Kontrollfenster. Zusätzlich wird die Browser-Konfigurationsseite geöffnet.
- Wenn der Browser nicht automatisch öffnet, kann die Oberfläche über das Kontrollfenster oder das Tray-Menü geöffnet werden.
- Das X im Kontrollfenster versteckt das Fenster nur in den Infobereich. Dadurch läuft der Server weiter.
- Zum wirklichen Beenden bitte im Kontrollfenster oder im Tray-Menü „Beenden / Exit“ wählen. Erst dann wird die EXE freigegeben und kann gelöscht oder überschrieben werden.
- Im Tray-Menü stehen „Oberfläche öffnen“, „Server starten“, „Server stoppen“ und „Beenden“ zur Verfügung.
- „Server stoppen“ stoppt den lokalen Survey-Dateiserver. „Beenden“ stoppt zusätzlich die Konfigurationsoberfläche und beendet das Programm vollständig.

Start per Doppelklick:
- Öffnet ein kleines Windows-Kontrollfenster.
- Öffnet zusätzlich die Browser-Konfigurationsseite, sofern Windows den Standardbrowser starten kann.
- In der Browseroberfläche konfigurierst du Survey-Hauptordner, Adresse, Port, Autostart und Hintergrundstart.

Autostart:
- In der Browseroberfläche kann „Mit Windows starten“ aktiviert werden.
- Mit „Beim Start im Hintergrund/Infobereich bleiben“ startet das Programm beim Windows-Start ohne Browserfenster und bleibt über das Tray-Icon bedienbar.
- Mit „Lokalen Survey-Server automatisch starten“ wird der eigentliche Survey-Dateiserver automatisch gestartet.

Konsolenmodus / DOS-Box:
- Eingabeaufforderung im Programmordner öffnen.
- Starten mit:
  ANP-Local-Survey-Server-1.0.exe --console
- Hintergrundmodus für Autostart:
  ANP-Local-Survey-Server-1.0.exe --background

Empfohlene Ordnerstruktur:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties

Eintragung im Astro Night Planner:
Lokale Survey-Basis-URL: http://127.0.0.1:8765/
Relativer Survey-Pfad: nsns/ohs8/ oder nsns/halpha8/ usw.

English
-------
This Windows helper serves local HiPS survey folders through a local HTTP address so Astro Night Planner can use them in the Aladin sky image.

Important in this build:
- Double-click opens a visible control window. The browser configuration page is opened as well.
- If the browser does not open automatically, use the control window or the tray menu to open the interface.
- Closing the control window with X only hides it to the notification area. The server keeps running.
- To really exit, choose “Beenden / Exit” in the control window or tray menu. Only then is the EXE released and can be deleted or replaced.
- The tray menu contains “Open interface”, “Start server”, “Stop server” and “Exit”.
- “Stop server” stops the local survey file server. “Exit” also stops the configuration interface and terminates the program fully.

Double-click start:
- Opens a small Windows control window.
- Also opens the browser configuration page if Windows can launch the default browser.
- Use the browser interface to configure survey root folder, address, port, autostart and background start.

Autostart:
- Enable “Start with Windows” in the browser interface.
- “Start in background / tray” starts the helper without a browser window at Windows login and keeps it available through the tray icon.
- “Automatically start local survey server” starts the actual survey file server automatically.

Console mode / DOS window:
- Open Command Prompt in the program folder.
- Start with:
  ANP-Local-Survey-Server-1.0.exe --console
- Background mode for autostart:
  ANP-Local-Survey-Server-1.0.exe --background

Recommended folder structure:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties

Settings in Astro Night Planner:
Local survey base URL: http://127.0.0.1:8765/
Relative survey path: nsns/ohs8/ or nsns/halpha8/ etc.
