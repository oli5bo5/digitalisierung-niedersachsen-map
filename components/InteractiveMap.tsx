'use client';

import { useStakeholders } from '@/hooks/useStakeholders';
import React, { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { supabase, Stakeholder } from '@/lib/supabase';
import 'react-map-gl/dist/style.css';
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function InteractiveMap() {
    const { stakeholders, loading } = useStakeholders();
    const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);

  return (
        <div className="relative w-full h-screen">
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: 9.8,
          latitude: 52.5,
          zoom: 7
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/light-v11"
      >
        <NavigationControl position="top-right" />

        {stakeholders.map((stakeholder) => {
          if (!stakeholder.location) return null;
          const [lng, lat] = stakeholder.location.coordinates;
          return (
            <Marker
              key={stakeholder.id}
              longitude={lng}
              latitude={lat}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedStakeholder(stakeholder);
              }}
            >
              <div className="cursor-pointer text-2xl">📍</div>
            </Marker>
          );
        })}

        {selectedStakeholder && selectedStakeholder.location && (
          <Popup
            longitude={selectedStakeholder.location.coordinates[0]}
            latitude={selectedStakeholder.location.coordinates[1]}
            onClose={() => setSelectedStakeholder(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2">
              <h3 className="font-bold text-lg">{selectedStakeholder.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedStakeholder.type}</p>
              <p className="text-sm mb-2">{selectedStakeholder.description}</p>
              {selectedStakeholder.website && (
                <a
                  href={selectedStakeholder.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Website besuchen
                </a>
              )}
            </div>
          </Popup>
        )}
      </Map>

      {loading && (
        <div className="absolute top-4 left-4 bg-white px-4 py-2 rounded shadow">
          Lade Stakeholder...
        </div>
      )}
    </div>
  );
}
