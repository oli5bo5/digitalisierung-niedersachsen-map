'use client';

import { useEffect, useState } from 'react';
import MapComponent from '../components/Map';
import { supabase, Stakeholder } from '../lib/supabase';

export default function Home() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStakeholders();
  }, []);

  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log('🔍 Checking Supabase configuration...');
      console.log('Supabase URL:', supabaseUrl ? '✓ Gesetzt' : '✗ Fehlt');
      console.log('Supabase Key:', supabaseKey ? '✓ Gesetzt' : '✗ Fehlt');
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase credentials missing!');
        console.error('Bitte setze die Umgebungsvariablen in Cloudflare Pages:');
        console.error('1. NEXT_PUBLIC_SUPABASE_URL');
        console.error('2. NEXT_PUBLIC_SUPABASE_ANON_KEY');
        setError('Supabase-Konfiguration fehlt. Bitte Umgebungsvariablen in Cloudflare Pages setzen und Deployment neu starten.');
        setLoading(false);
        return;
      }

      console.log('✅ Supabase konfiguriert, lade Daten...');
      console.log('Fetching stakeholders from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('stakeholders')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        console.error('Error fetching stakeholders:', fetchError);
        setError(`Fehler beim Laden der Akteure: ${fetchError.message}`);
        setLoading(false);
        return;
      }

      console.log('Raw data from Supabase:', data);
      
      if (data) {
        // Helper function to extract coordinates from various formats
        const extractCoordinates = (s: any): { lat: number; lng: number } | null => {
          // Option 1: Direct latitude/longitude fields
          if (s.latitude && s.longitude) {
            const lat = parseFloat(s.latitude);
            const lng = parseFloat(s.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              return { lat, lng };
            }
          }
          
          // Option 2: PostGIS location field (GeoJSON format)
          if (s.location) {
            try {
              // If it's already a GeoJSON object
              if (typeof s.location === 'object' && s.location.coordinates) {
                const [lng, lat] = s.location.coordinates;
                if (!isNaN(lat) && !isNaN(lng)) {
                  return { lat, lng };
                }
              }
              // If it's a string, try to parse as JSON
              if (typeof s.location === 'string') {
                const parsed = JSON.parse(s.location);
                if (parsed.coordinates) {
                  const [lng, lat] = parsed.coordinates;
                  if (!isNaN(lat) && !isNaN(lng)) {
                    return { lat, lng };
                  }
                }
              }
            } catch (e) {
              console.warn('Could not parse location field:', s.location, e);
            }
          }
          
          return null;
        };

        // Ensure all required fields are present - support both column name variants
        const validStakeholders = data
          .map((s: any) => {
            const coords = extractCoordinates(s);
            if (!coords || !s.name) {
              if (s.name) {
                console.warn('Invalid stakeholder (missing coordinates):', s.name);
              }
              return null;
            }
            return {
              id: s.id,
              name: s.name,
              latitude: coords.lat,
              longitude: coords.lng,
              type: s.type || s.stakeholder_type || 'Unbekannt',
              region: s.region || s.region_code || 'Niedersachsen',
              description: s.description || undefined,
            };
          })
          .filter((s: any): s is NonNullable<typeof s> => s !== null);
        
        console.log('Valid stakeholders:', validStakeholders.length);
        console.log('Stakeholders data:', validStakeholders);
        setStakeholders(validStakeholders);
        
        if (validStakeholders.length === 0 && data.length > 0) {
          setError('Daten gefunden, aber keine gültigen Koordinaten vorhanden.');
        } else if (validStakeholders.length === 0) {
          setError('Keine Akteure in der Datenbank gefunden.');
        }
      } else {
        console.log('No data returned from Supabase');
        setError('Keine Daten von Supabase erhalten.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unerwarteter Fehler beim Laden der Daten: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Digitalisierungsakteure Niedersachsen
          </h1>
          <p className="text-gray-600">
            Übersicht der Akteure im Bereich Digitalisierung
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-200px)]">
          {/* Sidebar with stakeholder list */}
          <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Akteure ({stakeholders.length})
              </h2>
              <button
                onClick={fetchStakeholders}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Aktualisieren
              </button>
            </div>

            {loading && (
              <div className="text-center py-8">
                <p className="text-gray-500">Wird geladen...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <p className="font-bold mb-2">⚠️ Fehler:</p>
                <p>{error}</p>
                <div className="mt-3 text-sm">
                  <p className="font-semibold mb-1">Lösung:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Prüfe Browser-Konsole (F12) für Details</li>
                    <li>Stelle sicher, dass Umgebungsvariablen in Cloudflare Pages gesetzt sind</li>
                    <li>Starte ein neues Deployment nach dem Setzen der Variablen</li>
                    <li>Prüfe, ob Daten in der Supabase-Datenbank vorhanden sind</li>
                  </ol>
                </div>
              </div>
            )}

            {!loading && !error && stakeholders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Keine Akteure gefunden</p>
                <button
                  onClick={() => {
                    // Add new stakeholder functionality
                    alert('Neuer Akteur hinzufügen - Funktion noch zu implementieren');
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  + Neuer Akteur
                </button>
              </div>
            )}

            {!loading && stakeholders.length > 0 && (
              <div className="space-y-2">
                {stakeholders.map((stakeholder) => (
                  <div
                    key={stakeholder.id}
                    onClick={() => setSelectedId(stakeholder.id)}
                    className={`p-3 rounded cursor-pointer transition ${
                      selectedId === stakeholder.id
                        ? 'bg-red-100 border-2 border-red-500'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <h3 className="font-semibold text-gray-800">
                      {stakeholder.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Typ:</span> {stakeholder.type}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Region:</span> {stakeholder.region}
                    </p>
                    {stakeholder.description && (
                      <p className="text-sm text-gray-500 mt-2">
                        {stakeholder.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Map component */}
          <div className="lg:w-2/3">
            <MapComponent
              stakeholders={stakeholders}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

