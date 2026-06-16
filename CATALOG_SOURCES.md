# Katalogquellen

Der Astro Night Planner nutzt den bereits im Projekt vorhandenen generierten Objektkatalog. Er enthält insbesondere:

- Messier-Daten
- NGC- und IC-Grunddaten aus OpenNGC
- Sharpless-2-Einträge aus den im bisherigen Projekt dokumentierten VizieR-/Sharpless-Quellen
- Abell-Katalog planetarischer Nebel
- ergänzte gebräuchliche Deep-Sky-Ziele

Fehlende Werte werden in der App nicht künstlich ergänzt. Die Datei `src/data/catalog.generated.json` des bisherigen Repositorys soll beim Update erhalten bleiben. Der GitHub-Pages-Workflow kopiert sie beim Deployment automatisch nach `assets/catalog.generated.json`, damit der vollständige Katalog lokal von der PWA geladen werden kann.

Falls diese Quelldatei nicht vorhanden ist, versucht Version 1.0 den Katalog aus dem öffentlichen Haupt-Repository zu laden und verwendet bei Nichterreichbarkeit einen kleinen integrierten Basiskatalog.
