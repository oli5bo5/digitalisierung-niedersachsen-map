'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Stakeholder } from '../lib/supabase';

interface MapComponentProps {
  stakeholders: Stakeholder[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export default function MapComponent({ stakeholders, selectedId, setSelectedId }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [9.73, 52.37],
        zoom: 7
      });

      map.current.on('load', () => setMapLoaded(true));
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Kartenfehler');
      });
    } catch (err) {
      console.error('Map init error:', err);
      setError('Karte konnte nicht geladen werden');
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add markers
  useEffect(() => {
    if (!map.current || !mapLoaded || !Array.isArray(stakeholders)) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Add new markers
    stakeholders.forEach(s => {
      if (!s.latitude || !s.longitude) return;

      const el = document.createElement('div');
      el.className = 'w-6 h-6 bg-indigo-600 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition';

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([s.longitude, s.latitude])
        .addTo(map.current!);

      el.addEventListener('click', () => setSelectedId(s.id));
      markersRef.current.push(marker);
    });
  }, [mapLoaded, stakeholders, setSelectedId]);

  // Handle selected marker
  useEffect(() => {
    if (!selectedId || !map.current || !Array.isArray(stakeholders)) return;

    const selected = stakeholders.find(s => s.id === selectedId);
    if (selected?.latitude && selected?.longitude) {
      map.current.flyTo({
        center: [selected.longitude, selected.latitude],
        zoom: 10,
        duration: 1000
      });
    }
  }, [selectedId, stakeholders]);

  if (error) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return <div ref={mapContainer} className="flex-1 rounded-lg shadow-lg overflow-hidden" />;
}
