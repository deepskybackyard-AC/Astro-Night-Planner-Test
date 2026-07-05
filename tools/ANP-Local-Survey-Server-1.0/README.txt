Astro Night Planner Local Survey Server 1.0
==========================================

Deutsch
-------
Dieses Windows-Hilfsprogramm stellt lokale HiPS-Survey-Ordner fuer den Astro Night Planner ueber eine lokale HTTP-Adresse bereit. Es ist fuer Endanwender gedacht und benoetigt keine Python-Installation.

Kurzablauf:
1. ZIP entpacken.
2. ANP-SurveyServer-Konfiguration.exe starten.
3. Gemeinsamen Survey-Hauptordner waehlen, z. B. D:\AstroSurveys.
4. Gewuenschte NSNS-Surveys herunterladen oder vorhandene Survey-Ordner unterhalb des Hauptordners ablegen.
5. ANP-SurveyServer-Start.exe starten und waehrend der Nutzung laufen lassen.
6. Im Astro Night Planner unter Einstellungen - Zentrale Einstellungen - Anzeige - Aladin - Survey - Lokale Survey-Quellen eintragen:
   Lokale Survey-Basis-URL: http://127.0.0.1:8765/
   Relativer Pfad je Survey, z. B. nsns/ohs8/
7. Mit Lokale Survey-Quelle pruefen testen.

Ordnerbeispiele:
D:\AstroSurveys\nsns\ohs8
D:\AstroSurveys\nsns\halpha8
D:\AstroSurveys\nsns\oiii8
D:\AstroSurveys\nsns\sii8
D:\AstroSurveys\nsns\hbr8
D:\AstroSurveys\nsns\rgb8

Wichtig: Der Astro Night Planner liest keinen lokalen Dateipfad direkt. Die App greift ueber http://127.0.0.1:8765/ auf den laufenden lokalen Server zu.

English
-------
This Windows helper serves local HiPS survey folders to Astro Night Planner through a local HTTP address. It is intended for end users and does not require a Python installation.

Quick setup:
1. Unzip the package.
2. Start ANP-SurveyServer-Konfiguration.exe.
3. Choose one common survey root folder, for example D:\AstroSurveys.
4. Download the desired NSNS surveys or place existing survey folders below the root folder.
5. Start ANP-SurveyServer-Start.exe and keep it running while you use local surveys.
6. In Astro Night Planner go to Settings - Central settings - Display - Aladin - Survey - Local survey sources and enter:
   Local survey base URL: http://127.0.0.1:8765/
   Relative path per survey, for example nsns/ohs8/
7. Use Check local survey source to test the setup.

Folder examples:
D:\AstroSurveys\nsns\ohs8
D:\AstroSurveys\nsns\halpha8
D:\AstroSurveys\nsns\oiii8
D:\AstroSurveys\nsns\sii8
D:\AstroSurveys\nsns\hbr8
D:\AstroSurveys\nsns\rgb8

Important: Astro Night Planner does not read local file paths directly. The app accesses the running local server through http://127.0.0.1:8765/.
