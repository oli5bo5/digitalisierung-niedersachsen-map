'use client';

import { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { useStakeholders } from '@/hooks/useStakeholders';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface StakeholderMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  region: string;
  description?: string;
}

export default function InteractiveMap() {
  const { stakeholders, loading } = useStakeholders('hannover');
  const [selectedMarker, setSelectedMarker] = useState<StakeholderMarker | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 9.7,
    latitude: 52.4,
    zoom: 6
  });

  // Niedersachsen Regions
  const regions = [
    { name: 'Hannover', lat: 52.37, lng: 9.73, id: 'hannover' },
    { name: 'Braunschweig', lat: 52.27, lng: 10.54, id: 'braunschweig' },
    { name: 'Oldenburg', lat: 53.15, lng: 8.22, id: 'oldenburg' },
    { name: 'Osnabrück', lat: 52.27, lng: 8.05, id: 'osnabrueck' }
  ];

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">
            Mapbox Token nicht konfiguriert
          </h1>
          <p className="text-red-700">
            Bitte stellen Sie sicher, dass NEXT_PUBLIC_MAPBOX_TOKEN in den Umgebungsvariablen gesetzt ist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Interaktive Karte der Digitalisierungsakteure
        </h1>
        <p className="text-indigo-100">
          Niedersachsen - Entdecken Sie die Digitalisierer in Ihrer Region
        </p>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">
            Regionen in Niedersachsen
          </h2>
          <div className="space-y-2">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() =>
                  setViewState({
                    longitude: region.lng,
                    latitude: region.lat,
                    zoom: 10
                  })
                }
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 border border-indigo-200 transition"
              >
                <span className="font-semibold text-indigo-900">{region.name}</span>
              </button>
            ))}
          </div>

          {/* Stakeholders List */}
          <div className="mt-8 border-t pt-4">
            <h3 className="text-lg font-bold text-indigo-900 mb-3">
              Akteure ({stakeholders.length})
            </h3>
            {loading ? (
              <p className="text-gray-600">Laden...</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {stakeholders.map((s) => (
                  <button
                    key={s.id}
                    onClick={() =>
                      setViewState({
                        longitude: s.longitude,
                        latitude: s.latitude,
                        zoom: 12
                      })
                    }
                    className="w-full text-left px-3 py-2 rounded text-sm hover:bg-indigo-100 transition"
                  >
                    <div className="font-semibold text-indigo-900">{s.name}</div>
                    <div className="text-xs text-gray-600">{s.type}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="mt-8 border-t pt-4 text-xs text-gray-600">
            <p className="font-semibold mb-2">Phase 1: Karten-Integration ✓</p>
            <p className="font-semibold mb-2">Phase 2: Daten-Anbindung ✓</p>
            <p className="font-semibold mb-2">Phase 3: Interaktive Features ✓</p>
            <p className="font-semibold">Phase 4: Stakeholder-Daten ✓</p>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 rounded-lg shadow-lg overflow-hidden">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v11"
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />

            {/* Region Markers */}
            {regions.map((region) => (
              <Marker
                key={region.id}
                longitude={region.lng}
                latitude={region.lat}
                color="#4F46E5"
              >
                <div
                  className="cursor-pointer font-bold text-white bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-indigo-700"
                  title={region.name}
                >
                  ◉
                </div>
              </Marker>
            ))}

            {/* Stakeholder Markers */}
            {stakeholders.map((s) => (
              <Marker
                key={s.id}
                longitude={s.longitude}
                latitude={s.latitude}
                onClick={() => setSelectedMarker(s)}
              >
                <div
                  className="cursor-pointer w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-lg hover:scale-125 transition"
                  title={s.name}
                />
              </Marker>
            ))}

            {/* Popup for Selected Marker */}
            {selectedMarker && (
              <Popup
                longitude={selectedMarker.longitude}
                latitude={selectedMarker.latitude}
                onClose={() => setSelectedMarker(null)}
                closeButton={true}
                closeOnClick={true}
              >
                <div className="p-3 bg-white rounded">
                  <h3 className="font-bold text-indigo-900">{selectedMarker.name}</h3>
                  <p className="text-sm text-gray-700">{selectedMarker.type}</p>
                  {selectedMarker.description && (
                    <p className="text-xs text-gray-600 mt-2">{selectedMarker.description}</p>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}
