# Architektur v10

## Aktueller Stand

- `apps/web` = Frontend
- `apps/api` = Backend
- OpenAI-Key bleibt serverseitig
- Frontend ruft `/api/meal-plan` auf
- API liefert strukturierte Rezepte als JSON
- Frontend verwendet diese Rezepte direkt für:
  - Rezeptvorschau
  - Wochenplan
  - Rezeptübersicht
  - Einkaufsliste

## Skalierung

Diese Struktur ist geeignet für:
- Hosting in echter Umgebung
- Login
- Nutzer-spezifische Pläne
- Datenbank
- Team-/Familienkonten

## Nächste Releases

### Release 2
- Login
- Session / Auth
- Nutzer-ID an Backend

### Release 3
- persistente Datenbank
- gespeicherte Wochenpläne
- gespeicherte Favoriten
- Verlauf und Wiederverwendung
