# Smart Meal Planner v10

Version v10 enthält:
- das neue warme Design-System
- eine echte Backend-Struktur
- eine direkte Frontend-Anbindung an `/api/meal-plan`

## Struktur

- `apps/web` – React / Vite Frontend
- `apps/api` – Express Backend für OpenAI

## Lokal starten

### 1. Installieren
```bash
npm install
```

### 2. API konfigurieren
```bash
cp apps/api/.env.example apps/api/.env
```

### 3. Frontend konfigurieren
```bash
cp apps/web/.env.example apps/web/.env.local
```

### 4. Starten
```bash
npm run dev
```

## Wichtig

Trage in `apps/api/.env` deinen OpenAI-Key ein.

## Test

- Frontend: `http://localhost:5173`
- API: `http://localhost:8787`
- Healthcheck: `http://localhost:8787/health`

Nach Klick auf **Mit Assistent planen** lädt das Frontend jetzt echte Rezepte aus der API.
