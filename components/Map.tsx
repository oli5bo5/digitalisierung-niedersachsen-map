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

interface MapComponentProps {
  stakeholders: Stakeholder[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

export default function MapComponent({ stakeholders, selectedId, setSelectedId }: MapComponentProps) {
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
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg shadow-lg flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🗺️ Deutschland-Karte</h2>
        <div className="text-xs text-gray-400 mb-4">Version: 2024-11-21 11:45 - Statische Implementierung</div>
        <p className="text-lg text-gray-700 mb-6">
          Fokusregion: <span className="font-bold text-blue-600">Niedersachsen</span>
        </p>
      </div>

      {/* Simplified Germany Map using CSS */}
      <div className="relative mb-8">
        {/* Germany outline - simplified shape */}
        <div className="relative w-80 h-96 mx-auto">
          {/* Base Germany shape */}
          <div className="absolute inset-0 bg-gray-200 rounded-3xl border-4 border-gray-300 shadow-lg transform rotate-12"></div>
          
          {/* Niedersachsen region - highlighted */}
          <div className="absolute top-16 left-8 w-24 h-20 bg-blue-600 rounded-xl shadow-md border-2 border-blue-800"></div>
          <div className="absolute top-14 left-6 text-white text-xs font-bold bg-blue-700 px-2 py-1 rounded transform -rotate-12">
            Niedersachsen
          </div>
          
          {/* Other regions - lighter */}
          <div className="absolute top-8 right-12 w-16 h-16 bg-gray-300 rounded-lg opacity-60"></div>
          <div className="absolute bottom-20 left-12 w-20 h-16 bg-gray-300 rounded-lg opacity-60"></div>
          <div className="absolute bottom-12 right-8 w-18 h-20 bg-gray-300 rounded-lg opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-14 h-18 bg-gray-300 rounded-lg opacity-60"></div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-6 mb-8 max-w-md w-full">
        <div className="bg-white border-2 border-blue-200 rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-blue-600 mb-2">{totalStakeholders}</div>
          <div className="text-sm text-gray-600 font-medium">Akteure Gesamt</div>
        </div>
        <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 text-center shadow-lg">
          <div className="text-3xl font-bold text-blue-800 mb-2">{niedersachsenStakeholders}</div>
          <div className="text-sm text-blue-700 font-medium">in Niedersachsen</div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white/90 rounded-lg p-4 shadow-md max-w-md w-full">
        <h3 className="font-bold text-gray-800 mb-3 text-center">Legende</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded mr-3"></div>
            <span className="text-sm text-gray-700">Niedersachsen (Fokusregion)</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-3"></div>
            <span className="text-sm text-gray-700">Andere Bundesländer</span>
          </div>
        </div>
      </div>

      {/* Selected Stakeholder Info */}
      {selectedStakeholder && (
        <div className="absolute bottom-4 right-4 bg-white/95 border-2 border-blue-200 rounded-lg p-4 shadow-lg max-w-xs backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-gray-900">{selectedStakeholder.name}</h3>
            <button
              onClick={(event) => {
                event.stopPropagation();
                setSelectedId(null);
              }}
              className="text-gray-400 hover:text-gray-600 ml-2"
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Typ:</span> {selectedStakeholder.type}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Region:</span> {selectedStakeholder.region}
          </p>
          {selectedStakeholder.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-3">{selectedStakeholder.description}</p>
          )}
        </div>
      )}

      {/* Info Text */}
      <div className="absolute bottom-4 left-4 bg-white/80 rounded p-3 text-xs text-gray-600 max-w-xs">
        ℹ️ Diese statische Karte zeigt die geografische Verteilung der Digitalisierungsakteure in Deutschland mit Fokus auf Niedersachsen.
      </div>
    </div>
  );
}