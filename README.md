# Digitalisierungsakteure Niedersachsen

Eine interaktive Karte zur Visualisierung von Digitalisierungsakteuren in Niedersachsen.

## Features

- 🗺️ Interaktive Karte mit Mapbox GL
- 📍 Rote Marker für jeden Akteur
- 🎯 Hervorhebung von Niedersachsen
- 📊 Liste aller Akteure in der Sidebar
- 🔍 Klick auf Akteur fokussiert die Karte

## Setup

1. Installiere die Abhängigkeiten:
```bash
npm install
```

2. Erstelle eine `.env.local` Datei basierend auf `.env.local.example`:
```bash
cp .env.local.example .env.local
```

3. Fülle die Umgebungsvariablen aus:
   - `NEXT_PUBLIC_MAPBOX_TOKEN`: Dein Mapbox Access Token von https://console.mapbox.com/account/access-tokens/
   - `NEXT_PUBLIC_SUPABASE_URL`: Deine Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Dein Supabase Anon Key

4. Starte den Development Server:
```bash
npm run dev
```

Die Anwendung läuft dann auf http://localhost:3000

## Supabase Datenbankstruktur

Die Tabelle `stakeholders` sollte folgende Spalten haben:
- `id` (uuid, primary key)
- `name` (text)
- `latitude` (numeric)
- `longitude` (numeric)
- `type` (text)
- `region` (text)
- `description` (text, optional)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Deployment

Das Projekt kann auf Cloudflare Pages deployed werden. Stelle sicher, dass die Umgebungsvariablen in den Cloudflare Pages Settings gesetzt sind.

