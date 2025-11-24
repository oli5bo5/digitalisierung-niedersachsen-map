'use client';

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

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

interface MapComponentProps {
  actors: Actor[];
  onMarkerClick?: (actor: Actor) => void;
}

// Actor type colors and icons - exakt wie Manus
const ACTOR_TYPES: Record<string, { label: string; color: string; icon: string }> = {
  government: { label: "Regierung", color: "#374151", icon: "G" },
  ngo: { label: "NGO", color: "#10b981", icon: "N" },
  business: { label: "Unternehmen", color: "#3b82f6", icon: "B" },
  research: { label: "Forschung", color: "#8b5cf6", icon: "R" },
  education: { label: "Bildung", color: "#f59e0b", icon: "E" },
  healthcare: { label: "Gesundheit", color: "#ef4444", icon: "H" },
};

// Get color and icon for stakeholder type
const getActorInfo = (type: string) => {
  return ACTOR_TYPES[type] || { label: type, color: "#6b7280", icon: "?" };
};

// Create custom marker icon HTML - exakt wie Manus
const createMarkerIcon = (color: string, icon: string): L.DivIcon => {
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
        font-size: 18px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s, box-shadow 0.2s;
      ">
        ${icon}
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
    className: "custom-marker",
  });
};

export default function MapComponent({ actors, onMarkerClick }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  // Initialize Leaflet map - KEIN TOKEN NÖTIG!
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log("🗺️ Initializing Leaflet map with OpenStreetMap...");

    // Create map instance - Niedersachsen center
    map.current = L.map(mapContainer.current).setView(
      [52.6367, 9.8451], // Niedersachsen center (lat, lng)
      7 // Zoom level
    );

    // Add OpenStreetMap tiles - KOSTENLOS!
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      minZoom: 2,
    }).addTo(map.current);

    // Add zoom controls
    L.control.zoom({ position: "topright" }).addTo(map.current);

    console.log("✅ Leaflet map initialized successfully!");

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        console.log("🗺️ Map cleaned up");
      }
    };
  }, []);

  // Add/update markers
  useEffect(() => {
    if (!map.current) {
      console.log("Map not ready for markers");
      return;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      map.current?.removeLayer(marker);
    });
    markersRef.current.clear();

    console.log(`📍 Adding ${actors.length} markers to map`);

    // Add new markers
    actors.forEach((actor) => {
      const lat = actor.latitude;
      const lng = actor.longitude;

      // Validate coordinates
      if (isNaN(lat) || isNaN(lng)) {
        console.warn(`Invalid coordinates for actor ${actor.id}:`, { latitude: lat, longitude: lng });
        return;
      }

      // Validate bounds
      if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        console.warn(`Out of bounds coordinates for actor ${actor.id}:`, { latitude: lat, longitude: lng });
        return;
      }

      try {
        // Get actor type info
        const actorInfo = getActorInfo(actor.type);
        
        // Create custom icon
        const markerIcon = createMarkerIcon(actorInfo.color, actorInfo.icon);

        // Create marker
        const marker = L.marker([lat, lng], { icon: markerIcon })
          .addTo(map.current!)
          .bindPopup(
            `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; font-size: 16px;">${actor.name}</h3>
              <div style="margin-bottom: 8px;">
                <span style="display: inline-block; padding: 2px 8px; background-color: ${actorInfo.color}; color: white; border-radius: 4px; font-size: 12px; font-weight: bold;">
                  ${actorInfo.label}
                </span>
              </div>
              <p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Ort:</strong> ${actor.city || actor.region_code || 'Niedersachsen'}</p>
              ${actor.description ? `<p style="margin: 0 0 4px 0; font-size: 13px;"><strong>Beschreibung:</strong> ${actor.description}</p>` : ""}
              <p style="margin: 0; font-size: 12px; color: #666;">
                <strong>Koordinaten:</strong> ${lat.toFixed(4)}, ${lng.toFixed(4)}
              </p>
            </div>
          `,
            { maxWidth: 300 }
          );

        // Add click handler
        marker.on("click", () => {
          onMarkerClick?.(actor);
        });

        // Add hover effects - wie Manus
        marker.on("mouseover", function (this: L.Marker) {
          const element = this.getElement();
          if (element) {
            element.style.transform = "scale(1.2)";
            element.style.zIndex = "1000";
            element.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
          }
        });

        marker.on("mouseout", function (this: L.Marker) {
          const element = this.getElement();
          if (element) {
            element.style.transform = "scale(1)";
            element.style.zIndex = "auto";
            element.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)";
          }
        });

        markersRef.current.set(actor.id, marker);

        console.log(`✅ Marker added for ${actor.name} at [${lat}, ${lng}]`);
      } catch (error) {
        console.error(`Error creating marker for actor ${actor.id}:`, error);
      }
    });

    console.log(`📍 Total markers on map: ${markersRef.current.size}`);
  }, [actors, onMarkerClick]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#f0f0f0",
      }}
      className="leaflet-map-container"
    />
  );
}
