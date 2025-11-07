'use client';

import { useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Stakeholder {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  region: string;
  description?: string;
}

interface MapComponentProps {
  stakeholders: Stakeholder[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export default function MapComponent({ stakeholders, selectedId, setSelectedId }: MapComponentProps) {
  const [viewState, setViewState] = useState({
    longitude: 9.5,
    latitude: 52.5,
    zoom: 7
  });

  const regions = [
    { name: 'Hannover', lat: 52.37, lng: 9.73, id: 'hannover' },
    { name: 'Braunschweig', lat: 52.27, lng: 10.54, id: 'braunschweig' },
    { name: 'Oldenburg', lat: 53.15, lng: 8.22, id: 'oldenburg' },
    { name: 'Osnabrück', lat: 52.27, lng: 8.05, id: 'osnabrueck' }
  ];

  const selectedMarker = stakeholders.find(s => s.id === selectedId) || null;

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex-1 rounded-lg shadow-lg overflow-hidden bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-bold">Mapbox Token nicht konfiguriert</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-lg shadow-lg overflow-hidden bg-white">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        style={{ width: '100%', height: '100%' }}
      >
        <NavigationControl position="top-right" />

        {regions.map((region) => (
          <Marker key={`region-${region.id}`} longitude={region.lng} latitude={region.lat}>
            <div className="text-2xl cursor-pointer" title={region.name}>📍</div>
          </Marker>
        ))}

        {stakeholders.map((s) => (
          <Marker key={`stakeholder-${s.id}`} longitude={s.longitude} latitude={s.latitude}>
            <button
              type="button"
              onClick={() => setSelectedId(s.id)}
              className={`text-lg rounded-full p-1 shadow-md hover:shadow-lg transition ${
                selectedId === s.id ? 'bg-blue-500 text-white' : 'bg-white'
              }`}
              title={s.name}
              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              •
            </button>
          </Marker>
        ))}

        {selectedMarker && (
          <Popup
            longitude={selectedMarker.longitude}
            latitude={selectedMarker.latitude}
            onClose={() => setSelectedId(null)}
            closeButton
            className="mapboxgl-popup"
          >
            <div className="p-3 max-w-xs">
              <h3 className="font-bold text-sm">{selectedMarker.name}</h3>
              <p className="text-xs text-gray-600 mt-1">{selectedMarker.type}</p>
              <p className="text-xs text-gray-600">{selectedMarker.region}</p>
              {selectedMarker.description && <p className="text-xs mt-2">{selectedMarker.description}</p>}
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
