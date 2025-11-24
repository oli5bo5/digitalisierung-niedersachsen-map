'use client';

import { X } from "lucide-react";

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
}

interface ActorDetailProps {
  actor: Actor | null;
  onClose: () => void;
}

const ACTOR_TYPES: Record<string, string> = {
  government: "Regierung",
  ngo: "NGO",
  business: "Unternehmen",
  research: "Forschung",
  education: "Bildung",
  healthcare: "Gesundheit",
};

// Actor type colors
const ACTOR_TYPE_COLORS: Record<string, string> = {
  government: "#374151",
  ngo: "#10b981",
  business: "#3b82f6",
  research: "#8b5cf6",
  education: "#f59e0b",
  healthcare: "#ef4444",
};

// Actor type icons
const ACTOR_TYPE_ICONS: Record<string, string> = {
  government: "G",
  ngo: "N",
  business: "B",
  research: "R",
  education: "E",
  healthcare: "H",
};

export default function ActorDetail({ actor, onClose }: ActorDetailProps) {
  if (!actor) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const actorTypeLabel = ACTOR_TYPES[actor.type] || actor.type;
  const actorColor = ACTOR_TYPE_COLORS[actor.type] || "#6b7280";
  const actorIcon = ACTOR_TYPE_ICONS[actor.type] || "?";
  const displayAddress = actor.city || actor.region_code || actor.address || "Niedersachsen";

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 relative" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors z-50 shadow-md hover:shadow-lg"
          aria-label="Schließen"
          title="Schließen (ESC)"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-start justify-between p-6 border-b pr-14">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: actorColor }}
            >
              {actorIcon}
            </div>
            <div>
              <h2 className="font-bold text-lg">{actor.name}</h2>
              <p className="text-sm text-gray-600">{actorTypeLabel}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Standort
            </p>
            <p className="text-sm text-gray-700">{displayAddress}</p>
          </div>

          {actor.description && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Beschreibung
              </p>
              <p className="text-sm text-gray-700">{actor.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Breitengrad
              </p>
              <p className="text-sm font-mono text-gray-700">{actor.latitude.toFixed(4)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Längengrad
              </p>
              <p className="text-sm font-mono text-gray-700">{actor.longitude.toFixed(4)}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t flex gap-2">
          <button
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={() => {
              const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(
                `${actor.latitude},${actor.longitude}`
              )}`;
              window.open(mapsUrl, "_blank");
            }}
          >
            In Google Maps öffnen
          </button>
        </div>
      </div>
    </div>
  );
}
