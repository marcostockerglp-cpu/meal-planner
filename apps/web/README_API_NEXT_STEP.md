# Frontend in v10

Das Frontend ist jetzt direkt an `/api/meal-plan` angebunden.

## Verhalten

- Der Button **Mit Assistent planen** ruft die API auf
- Die API-Antwort wird direkt in die Rezept-States übernommen
- Startseite, Wochenplan, Rezepte und Einkauf verwenden dieselben generierten Rezepte
- Die lokale Demo-Library ist nicht mehr die aktive Hauptquelle

## Nächster sinnvoller Schritt

- Auth-System ergänzen
- `userId` aus echtem Login ans Backend senden
- Wochenpläne pro Nutzer speichern
