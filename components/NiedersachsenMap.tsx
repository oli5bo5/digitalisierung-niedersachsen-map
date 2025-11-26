'use client';

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icons issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Actor {
  id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  region_code?: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  color: string;
  icon: string;
}

interface NiedersachsenMapProps {
  actors: Actor[];
  onMarkerClick?: (actor: Actor) => void;
  selectedActorId?: string | null;
}

// Stakeholder type configurations
const STAKEHOLDER_TYPES: Record<string, { label: string; color: string; icon: string }> = {
  government: { label: "Regierung", color: "#374151", icon: "G" },
  ngo: { label: "NGO", color: "#10b981", icon: "N" },
  business: { label: "Unternehmen", color: "#3b82f6", icon: "B" },
  research: { label: "Forschung", color: "#8b5cf6", icon: "R" },
  education: { label: "Bildung", color: "#f59e0b", icon: "E" },
  healthcare: { label: "Gesundheit", color: "#ef4444", icon: "H" },
};

// Get stakeholder type info
const getStakeholderInfo = (type: string) => {
  return STAKEHOLDER_TYPES[type] || { label: type, color: "#6b7280", icon: "?" };
};

// Create custom marker HTML
const createMarkerIcon = (color: string, icon: string, isSelected: boolean = false): L.DivIcon => {
  const selectedStyles = isSelected 
    ? 'transform: scale(1.2); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3); z-index: 1000;'
    : '';
    
  return L.divIcon({
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: ${color};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 16px;
        font-family: system-ui, -apple-system, sans-serif;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
        ${selectedStyles}
      ">
        ${icon}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: `custom-marker ${isSelected ? 'selected' : ''}`,
  });
};

export default function NiedersachsenMap({ 
  actors, 
  onMarkerClick, 
  selectedActorId 
}: NiedersachsenMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup>(new L.LayerGroup());
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    console.log("🗺️ Initializing Niedersachsen Map with Leaflet + OpenStreetMap");

    // Create map centered on Niedersachsen
    const map = L.map(mapContainer.current, {
      center: [52.6367, 9.8451], // Niedersachsen center
      zoom: 7,
      minZoom: 6,
      maxZoom: 18,
      zoomControl: false, // We'll add custom position
      attributionControl: false, // We'll add custom
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // Add zoom control to top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Add attribution to bottom-right
    L.control.attribution({ 
      position: 'bottomright',
      prefix: false
    }).addTo(map);

    // Add markers layer
    markersLayerRef.current.addTo(map);

    // Store map reference
    mapRef.current = map;
    setMapReady(true);

    console.log("✅ Map initialized successfully");

    // Cleanup function
    return () => {
      if (mapRef.current) {
        console.log("🧹 Cleaning up map");
        mapRef.current.remove();
        mapRef.current = null;
        setMapReady(false);
      }
    };
  }, []);

  // Handle marker click
  const handleMarkerClick = useCallback((actor: Actor) => {
    if (onMarkerClick) {
      onMarkerClick(actor);
    }
  }, [onMarkerClick]);

  // Create markers data
  const markersData = useMemo(() => {
    return actors
      .filter(actor => {
        const lat = actor.latitude;
        const lng = actor.longitude;
        return !isNaN(lat) && !isNaN(lng) && 
               lat >= -90 && lat <= 90 && 
               lng >= -180 && lng <= 180;
      })
      .map(actor => {
        const info = getStakeholderInfo(actor.type);
        const isSelected = selectedActorId === actor.id;
        
        return {
          actor,
          info,
          isSelected,
          position: [actor.latitude, actor.longitude] as [number, number],
          icon: createMarkerIcon(info.color, info.icon, isSelected)
        };
      });
  }, [actors, selectedActorId]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapReady || !mapRef.current || !markersLayerRef.current) {
      return;
    }

    // Clear existing markers
    markersLayerRef.current.clearLayers();

    console.log(`📍 Adding ${markersData.length} markers to map`);

    // Add new markers
    markersData.forEach(({ actor, info, position, icon }) => {
      const marker = L.marker(position, { icon })
        .bindPopup(`
          <div style="font-family: system-ui, sans-serif; min-width: 200px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
              <div style="
                width: 24px; height: 24px; border-radius: 50%; 
                background-color: ${info.color}; 
                display: flex; align-items: center; justify-content: center;
                color: white; font-weight: bold; font-size: 12px;
              ">
                ${info.icon}
              </div>
              <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #1f2937;">
                ${actor.name}
              </h3>
            </div>
            
            <div style="margin-bottom: 8px;">
              <span style="
                display: inline-block; padding: 4px 8px; 
                background-color: ${info.color}; color: white; 
                border-radius: 4px; font-size: 12px; font-weight: 500;
              ">
                ${info.label}
              </span>
            </div>
            
            <div style="font-size: 13px; color: #4b5563; line-height: 1.4;">
              ${actor.city || actor.region_code ? `<p style="margin: 4px 0;"><strong>📍 Ort:</strong> ${actor.city || actor.region_code}</p>` : ''}
              ${actor.description ? `<p style="margin: 4px 0;"><strong>ℹ️ Info:</strong> ${actor.description}</p>` : ''}
              <p style="margin: 4px 0; color: #6b7280; font-size: 11px;">
                <strong>🗺️ Koordinaten:</strong> ${position[0].toFixed(4)}, ${position[1].toFixed(4)}
              </p>
            </div>
          </div>
        `, { 
          maxWidth: 300,
          closeButton: true,
          className: 'custom-popup'
        });

      // Add click handler
      marker.on('click', () => handleMarkerClick(actor));

      // Add hover effects
      marker.on('mouseover', function(this: L.Marker) {
        const element = this.getElement();
        if (element && !element.classList.contains('selected')) {
          element.style.transform = 'scale(1.1)';
          element.style.zIndex = '999';
        }
      });

      marker.on('mouseout', function(this: L.Marker) {
        const element = this.getElement();
        if (element && !element.classList.contains('selected')) {
          element.style.transform = 'scale(1)';
          element.style.zIndex = 'auto';
        }
      });

      // Add to markers layer
      marker.addTo(markersLayerRef.current!);
    });

    // Fit map to markers if we have any
    if (markersData.length > 0) {
      const group = new L.FeatureGroup(markersLayerRef.current!.getLayers());
      if (group.getBounds().isValid()) {
        mapRef.current!.fitBounds(group.getBounds(), { 
          padding: [20, 20],
          maxZoom: 10 
        });
      }
    }

    console.log(`✅ Added ${markersData.length} markers to map`);
  }, [mapReady, markersData, handleMarkerClick]);

  // Handle selected actor change (center map on selected marker)
  useEffect(() => {
    if (!mapRef.current || !selectedActorId) return;

    const selectedActor = actors.find(a => a.id === selectedActorId);
    if (selectedActor && !isNaN(selectedActor.latitude) && !isNaN(selectedActor.longitude)) {
      mapRef.current.setView([selectedActor.latitude, selectedActor.longitude], Math.max(mapRef.current.getZoom(), 12), {
        animate: true
      });
    }
  }, [selectedActorId, actors]);

  if (!mapReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-blue-200 rounded-full mx-auto mb-4"></div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Karte wird geladen...</h3>
            <p className="text-sm text-gray-500">Niedersachsen Akteure Karte</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={mapContainer}
        className="w-full h-full bg-gray-100 relative"
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
      
      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg px-4 py-3 z-[1000]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {actors.length} {actors.length === 1 ? 'Akteur' : 'Akteure'}
            </p>
            <p className="text-xs text-gray-600">Niedersachsen</p>
          </div>
        </div>
      </div>

      {/* Custom CSS for markers */}
      <style jsx global>{`
        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .leaflet-popup-tip {
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .custom-marker:hover {
          transform: scale(1.1) !important;
        }
        .custom-marker.selected {
          transform: scale(1.2) !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3) !important;
        }
      `}</style>
    </>
  );
}
