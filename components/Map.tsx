'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    try {
      // Set Mapbox access token
      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoibXBvbGlzYm9zIiwiYSI6ImNtaG9uN2sycjA2Z2syb3NlbTI2eHhtcDMifQ.qMZ0pxhhl-Xpb-qQHGgvng';
      mapboxgl.accessToken = token;

      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [9.7320, 52.3759], // Center of Niedersachsen
        zoom: 7,
        attributionControl: true
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Set loaded state when map is ready
      map.current.on('load', () => {
        setMapLoaded(true);
        setError(null);
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Fehler beim Laden der Karte');
      });

    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Karte konnte nicht initialisiert werden');
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add markers when map is loaded and stakeholders change
  useEffect(() => {
    if (!map.current || !mapLoaded || !stakeholders.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    stakeholders.forEach(stakeholder => {
      if (!map.current || !stakeholder.latitude || !stakeholder.longitude) return;

      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
            el.style.backgroundColor = stakeholder.type === 'Akteur' ? '#dc2626' : (selectedId === stakeholder.id ? '#2563eb' : '#3b82f6');
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'all 0.2s';

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([stakeholder.longitude, stakeholder.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 8px; min-width: 200px;">
                <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${stakeholder.name}</h3>
                <p style="margin: 4px 0; font-size: 14px; color: #666;">
                  <strong>Typ:</strong> ${stakeholder.type}
                </p>
                <p style="margin: 4px 0; font-size: 14px; color: #666;">
                  <strong>Region:</strong> ${stakeholder.region}
                </p>
                ${stakeholder.description ? `<p style="margin: 8px 0 0 0; font-size: 13px;">${stakeholder.description}</p>` : ''}
              </div>
            `)
        )
        .addTo(map.current);

      marker.getElement().addEventListener('click', () => {
        setSelectedId(stakeholder.id);
      });

      markersRef.current.push(marker);
    });
  }, [stakeholders, mapLoaded, selectedId, setSelectedId]);

  // Update marker colors when selection changes
  useEffect(() => {
    markersRef.current.forEach((marker, index) => {
      const stakeholder = stakeholders[index];
      if (stakeholder) {
        const el = marker.getElement();
                el.style.backgroundColor = stakeholder.type === 'Akteur' ? '#dc2626' : (selectedId === stakeholder.id ? '#2563eb' : '#3b82f6');
      }
    });
  }, [selectedId, stakeholders]);

  // Fly to selected stakeholder
  useEffect(() => {
    if (!map.current || !selectedId || !mapLoaded) return;

    const stakeholder = stakeholders.find(s => s.id === selectedId);
    if (stakeholder && stakeholder.latitude && stakeholder.longitude) {
      map.current.flyTo({
        center: [stakeholder.longitude, stakeholder.latitude],
        zoom: 10,
        duration: 1000
      });
    }
  }, [selectedId, stakeholders, mapLoaded]);

  if (error) {
    return (
      <div className="flex-1 rounded-lg shadow-lg overflow-hidden bg-white flex items-center justify-center">
        <div className="text-center p-8">
          <p className="text-xl font-bold text-red-600 mb-4">{error}</p>
          <p className="text-gray-500">Bitte versuchen Sie es später erneut</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-lg shadow-lg overflow-hidden bg-white relative">
      <div ref={mapContainer} className="w-full h-full" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90">
          <div className="text-center p-8">
            <p className="text-xl font-bold text-gray-700 mb-4">Karte wird geladen...</p>
            <p className="text-gray-500">Niedersachsen Digitalisierungsakteure</p>
          </div>
        </div>
      )}
    </div>
  );
}
