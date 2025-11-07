'use client';

import { useState } from 'react';

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
  return (
    <div className="flex-1 rounded-lg shadow-lg overflow-hidden bg-white flex items-center justify-center">
      <div className="text-center p-8">
        <p className="text-xl font-bold text-gray-700 mb-4">Karte wird geladen...</p>
        <p className="text-gray-500">Niedersachsen Digitalisierungsakteure</p>
        <div className="mt-4 text-sm text-gray-400">
          <p>{stakeholders?.length || 0} Akteure gefunden</p>
        </div>
      </div>
    </div>
  );
}
