'use client';

import { useState, useMemo } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import { Stakeholder } from '@/lib/supabase';
import 'mapbox-gl/dist/mapbox-gl.css';

interface ManusMapProps {
  stakeholders: Stakeholder[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  loading: boolean;
}

// Manus Stakeholder Types mit exakten Farben aus dem Screenshot
const STAKEHOLDER_TYPES = {
  'government': { color: '#374151', letter: 'G', label: 'Regierung' }, // grau/schwarz
  'ngo': { color: '#10b981', letter: 'N', label: 'NGO' }, // grün  
  'business': { color: '#3b82f6', letter: 'B', label: 'Unternehmen' }, // blau
  'research': { color: '#8b5cf6', letter: 'R', label: 'Forschung' }, // lila
} as const;

// Niedersachsen Zentrum - wie in Manus
const INITIAL_VIEW_STATE = {
  longitude: 9.8,
  latitude: 52.5,
  zoom: 7.5,
  pitch: 0,
  bearing: 0,
};

export default function ManusMap({ 
  stakeholders, 
  selectedId, 
  setSelectedId, 
  loading 
}: ManusMapProps) {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Get stakeholder type info
  const getTypeInfo = (type: string) => {
    return STAKEHOLDER_TYPES[type as keyof typeof STAKEHOLDER_TYPES] || STAKEHOLDER_TYPES.government;
  };

  // Render markers - Letter-basierte Marker wie in Manus
  const markers = useMemo(() => {
    return stakeholders.map((stakeholder) => {
      const typeInfo = getTypeInfo(stakeholder.type);
      const isSelected = selectedId === stakeholder.id;
      const isHovered = hoveredId === stakeholder.id;
      
      // Use latitude/longitude from stakeholder
      const longitude = stakeholder.longitude || stakeholder.location?.coordinates?.[0];
      const latitude = stakeholder.latitude || stakeholder.location?.coordinates?.[1];
      
      if (!longitude || !latitude || isNaN(longitude) || isNaN(latitude)) {
        return null;
      }
      
      return (
        <Marker
          key={stakeholder.id}
          longitude={longitude}
          latitude={latitude}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            setSelectedId(stakeholder.id);
          }}
        >
          <div className="relative">
            {/* Manus-Style Letter Marker */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer transition-all duration-200 ${
                isSelected || isHovered ? 'scale-110 shadow-lg' : 'shadow-md'
              }`}
              style={{ backgroundColor: typeInfo.color }}
              onMouseEnter={() => setHoveredId(stakeholder.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {typeInfo.letter}
            </div>
            
            {/* Selected indicator - Ring um Selected Marker */}
            {isSelected && (
              <div 
                className="absolute inset-0 rounded-full border-3 border-white shadow-lg animate-pulse"
                style={{ borderColor: typeInfo.color }}
              />
            )}
            
            {/* Hover Tooltip - Wie in Manus */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50">
                <div className="font-semibold">{stakeholder.name}</div>
                <div className="text-gray-300">{typeInfo.label}</div>
                {/* Tooltip Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900" />
              </div>
            )}
          </div>
        </Marker>
      );
    }).filter(Boolean);
  }, [stakeholders, selectedId, hoveredId, setSelectedId]);

  // Handle map click (deselect)
  const onMapClick = () => {
    if (selectedId) {
      setSelectedId(null);
    }
  };

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

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Karte wird geladen...</p>
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
        mapStyle="mapbox://styles/mapbox/light-v11" // Heller Stil wie in Manus
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
        style={{ width: '100%', height: '100%' }}
      >
        {/* Navigation Controls - Oben rechts wie in Manus */}
        <NavigationControl position="top-right" showCompass={false} />
        
        {/* Alle Marker rendern */}
        {markers}
      </Map>

      {/* Selected Stakeholder Info - Unten links */}
      {selectedId && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-xs z-10">
          {(() => {
            const selected = stakeholders.find(s => s.id === selectedId);
            if (!selected) return null;
            
            const typeInfo = getTypeInfo(selected.type);
            
            return (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: typeInfo.color }}
                  >
                    {typeInfo.letter}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selected.name}</h3>
                    <p className="text-sm text-gray-600">{typeInfo.label}</p>
                  </div>
                </div>
                
                {selected.description && (
                  <p className="text-sm text-gray-700 mb-2">{selected.description}</p>
                )}
                
                <div className="text-xs text-gray-500">
                  {selected.city || selected.region_code}
                </div>
                
                <button
                  onClick={() => setSelectedId(null)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  Schließen
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Stakeholder Count - Oben links */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg border border-gray-200 px-3 py-2 z-10">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{stakeholders.length}</span> Ergebnisse
        </p>
      </div>

      {/* Made with Manus Badge - Unten rechts */}
      <div className="absolute bottom-4 right-4 z-10">
        <div className="bg-gray-900 text-white px-3 py-1 rounded-full text-xs font-medium">
          🗺️ Made with Manus
        </div>
      </div>
    </div>
  );
}
