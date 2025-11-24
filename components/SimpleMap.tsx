'use client';

import { useMemo } from 'react';

interface Stakeholder {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  region: string;
  description?: string;
}

interface SimpleMapProps {
  stakeholders: Stakeholder[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export default function SimpleMap({ stakeholders, selectedId, setSelectedId }: SimpleMapProps) {
  const totalStakeholders = stakeholders.length;
  const niedersachsenStakeholders = useMemo(
    () => stakeholders.filter((s) => s.region?.toLowerCase().includes('nieders') || s.region === 'NI' || s.region === 'H').length,
    [stakeholders],
  );

  const selectedStakeholder = useMemo(
    () => stakeholders.find((s) => s.id === selectedId),
    [stakeholders, selectedId],
  );

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-6 right-6 text-center z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">🗺️ Deutschland-Karte</h2>
        <p className="text-gray-600">
          Fokusregion: <span className="font-bold text-blue-600">Niedersachsen</span>
        </p>
      </div>

      {/* Simple Germany Map using CSS */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-64 h-80">
          {/* Germany outline - simplified */}
          <svg viewBox="0 0 200 250" className="w-full h-full">
            {/* Base Germany shape */}
            <path
              d="M50 50 L150 45 L160 70 L170 90 L165 120 L175 150 L170 180 L150 200 L130 220 L90 225 L70 210 L50 190 L45 160 L40 130 L35 100 L40 70 Z"
              fill="#E5E7EB"
              stroke="#9CA3AF"
              strokeWidth="2"
            />
            
            {/* Niedersachsen region - highlighted */}
            <path
              d="M60 80 L120 75 L125 100 L115 120 L85 125 L65 115 Z"
              fill="#2563EB"
              stroke="#1E40AF"
              strokeWidth="2"
            />
            
            {/* Niedersachsen label */}
            <text x="90" y="100" textAnchor="middle" className="fill-white text-xs font-bold">
              Niedersachsen
            </text>
            
            {/* Other regions */}
            <circle cx="140" cy="80" r="15" fill="#D1D5DB" opacity="0.7" />
            <circle cx="80" cy="170" r="18" fill="#D1D5DB" opacity="0.7" />
            <circle cx="130" cy="160" r="12" fill="#D1D5DB" opacity="0.7" />
          </svg>
        </div>
      </div>

      {/* Statistics */}
      <div className="absolute bottom-20 left-6 right-6 grid grid-cols-2 gap-4">
        <div className="bg-white/90 border-2 border-blue-200 rounded-lg p-4 text-center shadow-lg backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-600 mb-1">{totalStakeholders}</div>
          <div className="text-xs text-gray-600 font-medium">Akteure Gesamt</div>
        </div>
        <div className="bg-blue-50/90 border-2 border-blue-300 rounded-lg p-4 text-center shadow-lg backdrop-blur-sm">
          <div className="text-2xl font-bold text-blue-800 mb-1">{niedersachsenStakeholders}</div>
          <div className="text-xs text-blue-700 font-medium">in Niedersachsen</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-white/90 rounded-lg p-3 shadow-md backdrop-blur-sm">
        <h3 className="font-bold text-gray-800 mb-2 text-sm">Legende</h3>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span className="text-xs text-gray-700">Niedersachsen</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-300 rounded mr-2"></div>
            <span className="text-xs text-gray-700">Andere Länder</span>
          </div>
        </div>
      </div>

      {/* Selected Stakeholder Info */}
      {selectedStakeholder && (
        <div className="absolute top-20 right-6 bg-white/95 border-2 border-blue-200 rounded-lg p-4 shadow-lg max-w-xs backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-sm text-gray-900 leading-tight">{selectedStakeholder.name}</h3>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setSelectedId(null);
              }}
              className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-gray-600 mb-1">
            <span className="font-medium">Typ:</span> {selectedStakeholder.type}
          </p>
          <p className="text-xs text-gray-600 mb-2">
            <span className="font-medium">Region:</span> {selectedStakeholder.region}
          </p>
          {selectedStakeholder.description && (
            <p className="text-xs text-gray-500 line-clamp-2">{selectedStakeholder.description}</p>
          )}
        </div>
      )}

      {/* Version marker */}
      <div className="absolute bottom-6 right-6 text-xs text-gray-400 bg-white/80 px-2 py-1 rounded">
        v11:50
      </div>
    </div>
  );
}


