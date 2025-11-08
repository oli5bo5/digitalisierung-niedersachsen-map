# Digitalisierung Niedersachsen Map

**Interaktive Karte der Digitalisierungsakteure in Niedersachsen**

## Overview

This project displays an interactive map of digitalization actors (Digitalisierungsakteure) in Lower Saxony, Germany. It visualizes all stakeholders with red markers on a Mapbox GL map, allowing users to explore and interact with each actor's information.

## Features

- 🗺️ **Interactive Map**: Mapbox GL-powered map centered on Lower Saxony
- 📍 **Red Marker Pins**: All 6 digitalization actors displayed as red pins
- 📋 **Actor Information**: Click on markers to view detailed information
- 🔍 **Filtering**: Filter actors by region and type
- ⚙️ **Responsive Controls**: Zoom, pan, and navigate the map
- 🎨 **Modern UI**: Built with React and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 13+ (TypeScript)
- **Mapping**: Mapbox GL JS
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Project Structure

```
app/                    # Next.js app directory
  ├── page.tsx         # Main application page
  ├── layout.tsx       # Application layout
  └── globals.css      # Global styles with Mapbox CSS
components/
  ├── InteractiveMap.tsx  # Main component with state management
  └── Map.tsx             # Map rendering with markers
hooks/
  └── useStakeholders.ts  # Data fetching from Supabase
lib/
  └── supabase.ts        # Supabase client configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Mapbox GL account (API key)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/oli5bo5/digitalisierung-niedersachsen-map.git
cd digitalisierung-niedersachsen-map
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://eleblvoyechmtgxtgjii.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the map.

## Deployment

This project is configured for deployment on Vercel. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Quick Deploy

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel project settings
3. Deploy!

## Database Schema

The `stakeholders` table in Supabase contains:

- `id`: UUID (primary key)
- `name`: String (actor name)
- `type`: String (actor type/category)
- `region_code`: String (Lower Saxony region)
- `latitude`: Number (geographic coordinate)
- `longitude`: Number (geographic coordinate)
- `description`: String (detailed description)

## Features in Detail

### Map Display
- Centered on Lower Saxony coordinates [9.7320, 52.3759]
- Displays all 6 digitalization actors as red pins
- Markers colored #d91c1c (selected) and #8c2626 (unselected)
- Click markers to view popups with actor information

### Interactive Controls
- Zoom in/out using mouse wheel or navigation buttons
- Pan by dragging the map
- Click markers to select and view details
- Filter by region or actor type using the sidebar controls

## Environment Variables

See `.env.local.example` for all required environment variables.

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
