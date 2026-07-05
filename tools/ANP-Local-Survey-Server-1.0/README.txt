Astro Night Planner Local Survey Server 1.0
==========================================

Deutsch
-------
Dieses Windows-Programm stellt lokale HiPS-Survey-Ordner für den Astro Night Planner über eine lokale HTTP-Adresse bereit. Es benötigt keine Python-Installation.

Das Paket enthält bewusst nur eine EXE:
  ANP-Local-Survey-Server-1.0.exe

Nach dem Start wählst du im Programm die Sprache Deutsch oder English. Danach führt ein Menü durch Konfiguration, Serverstart, Statusprüfung, Download bekannter NSNS-Surveys und Prüfung lokaler Survey-Ordner.

Kurzablauf:
1. ZIP entpacken.
2. ANP-Local-Survey-Server-1.0.exe starten.
3. Menüpunkt 1 öffnen und einen gemeinsamen Survey-Hauptordner wählen, z. B. D:\AstroSurveys.
4. Bekannte NSNS-Surveys über Menüpunkt 4 herunterladen oder vorhandene HiPS-Ordner unterhalb dieses Hauptordners ablegen.
5. Menüpunkt 2 starten und das Fenster während der Nutzung offen lassen.
6. Im Astro Night Planner unter Einstellungen → Zentrale Einstellungen → Anzeige → Aladin → Survey → Lokale Survey-Quellen eintragen:
   Lokale Survey-Basis-URL: http://127.0.0.1:8765/
   Relativer Pfad je Survey, z. B. nsns/ohs8/
7. In der App mit „Lokale Survey-Quelle prüfen“ testen.

Beispielstruktur:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties
D:\AstroSurveys\nsns\oiii8\properties
D:\AstroSurveys\nsns\sii8\properties

Wichtig: Der Astro Night Planner liest keinen lokalen Dateipfad direkt. Die App greift über http://127.0.0.1:8765/ auf den laufenden lokalen Server zu.

English
-------
This Windows program serves local HiPS survey folders to Astro Night Planner through a local HTTP address. It does not require a Python installation.

The package intentionally contains only one EXE:
  ANP-Local-Survey-Server-1.0.exe

After starting the program, choose Deutsch or English. A menu then guides you through configuration, server start, status checks, downloading known NSNS surveys, and validating local survey folders.

Quick setup:
1. Unzip the package.
2. Start ANP-Local-Survey-Server-1.0.exe.
3. Open menu item 1 and choose one common survey root folder, for example D:\AstroSurveys.
4. Download known NSNS surveys with menu item 4 or place existing HiPS folders below this root folder.
5. Start menu item 2 and keep the window open while using local surveys.
6. In Astro Night Planner go to Settings → Central settings → Display → Aladin → Survey → Local survey sources and enter:
   Local survey base URL: http://127.0.0.1:8765/
   Relative path per survey, for example nsns/ohs8/
7. Test it in the app with “Check local survey source”.

Example structure:
D:\AstroSurveys\nsns\ohs8\properties
D:\AstroSurveys\nsns\ohs8\Norder3\...
D:\AstroSurveys\nsns\halpha8\properties
D:\AstroSurveys\nsns\oiii8\properties
D:\AstroSurveys\nsns\sii8\properties

Important: Astro Night Planner does not read local file paths directly. The app accesses the running local server through http://127.0.0.1:8765/.
