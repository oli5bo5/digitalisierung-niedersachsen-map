'use client';

import { useState, useCallback, useMemo } from 'react';
import Map, { NavigationControl, ScaleControl } from 'react-map-gl';
import { StakeholderMarker } from './StakeholderMarker';
import { MapLegend } from './MapLegend';
import { Stakeholder } from '@/lib/supabase';

interface MapViewProps {
  stakeholders: Stakeholder[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

// Niedersachsen Zentrum
const INITIAL_VIEW_STATE = {
  longitude: 9.8,
  latitude: 52.5,
  zoom: 7,
  pitch: 0,
  bearing: 0,
};

export function MapView({ 
  stakeholders, 
  selectedId,
  setSelectedId 
}: MapViewProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [cursor, setCursor] = useState<string>('default');
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Marker rendern
  const markers = useMemo(() => {
    return stakeholders.map((stakeholder) => (
      <StakeholderMarker
        key={stakeholder.id}
        stakeholder={stakeholder}
        onClick={() => setSelectedId(stakeholder.id)}
      />
    ));
  }, [stakeholders, setSelectedId]);

  const onMapClick = useCallback(() => {
    // Deselektiere bei Klick auf Karte
    if (selectedId) {
      setSelectedId(null);
    }
  }, [selectedId, setSelectedId]);

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">
            Mapbox Token fehlt
          </p>
          <p className="text-sm text-gray-600">
            Bitte füge NEXT_PUBLIC_MAPBOX_TOKEN in .env.local hinzu
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={onMapClick}
        onMouseEnter={() => setCursor('grab')}
        onMouseLeave={() => setCursor('default')}
        cursor={cursor}
        mapStyle="mapbox://styles/mapbox/light-v11"
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-right" />

        {/* Markers */}
        {markers}
      </Map>

      {/* Legend */}
      <MapLegend />

      {/* Stakeholder Count */}
      <div className="absolute top-6 left-6 bg-white rounded-lg shadow-lg px-4 py-2 z-10">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{stakeholders.length}</span> Ergebnisse
        </p>
      </div>
    </div>
  );
}
