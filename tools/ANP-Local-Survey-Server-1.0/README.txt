Astro Night Planner Local Survey Server 1.0
==========================================

Deutsch
-------
Dieses Windows-Hilfsprogramm stellt lokale HiPS-Survey-Ordner ueber eine lokale HTTP-Adresse bereit, damit Astro Night Planner sie im Aladin-Himmelsbild verwenden kann.

Start per Doppelklick:
- Oeffnet die lokale Windows-/Browser-Oberflaeche ohne zusaetzliches DOS-Fenster.
- Dort konfigurierst du Survey-Hauptordner, Adresse und Port.
- Du kannst den lokalen Survey-Server starten, lokale Ordner pruefen und bekannte NSNS-Surveys herunterladen.

Konsolenmodus / DOS-Box:
- Eingabeaufforderung im Programmordner oeffnen.
- Starten mit:
  ANP-Local-Survey-Server-1.0.exe --console
- Der Konsolenmodus bietet dieselben Grundfunktionen textbasiert an.

Empfohlene Ordnerstruktur:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties

Eintragung im Astro Night Planner:
Lokale Survey-Basis-URL: http://127.0.0.1:8765/
Relativer Survey-Pfad: nsns/ohs8/ oder nsns/halpha8/ usw.

Der Server muss waehrend der Nutzung lokaler Surveys laufen. Ein normaler Windows-Dateipfad kann vom Browser nicht direkt gelesen werden.

English
-------
This Windows helper serves local HiPS survey folders through a local HTTP address so Astro Night Planner can use them in the Aladin sky image.

Start by double-click:
- Opens the local Windows/browser interface without an additional DOS window.
- Configure survey root folder, address and port.
- Start the local survey server, validate local folders and download known NSNS surveys.

Console mode / DOS window:
- Open Command Prompt in the program folder.
- Start with:
  ANP-Local-Survey-Server-1.0.exe --console
- Console mode offers the same core functions as a text menu.

Recommended folder structure:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties

Settings in Astro Night Planner:
Local survey base URL: http://127.0.0.1:8765/
Relative survey path: nsns/ohs8/ or nsns/halpha8/ etc.

The server must be running while local surveys are used. Browsers cannot read normal Windows file paths directly.
