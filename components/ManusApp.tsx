'use client';

import { useState, useEffect } from 'react';
import { useStakeholders } from '@/hooks/useStakeholders';
import ManusMap from './ManusMap';
import ManusFilter from './ManusFilter';

// Manus-Style App - 1:1 Nachbau der Original Manus App
export default function ManusApp() {
  const { stakeholders, loading, error } = useStakeholders();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('alle');
  const [showAddForm, setShowAddForm] = useState(false);

  // Filter stakeholders
  const filteredStakeholders = stakeholders.filter((stakeholder) => {
    const matchesSearch = !searchQuery || 
      stakeholder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (stakeholder.city && stakeholder.city.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesType = selectedType === 'alle' || stakeholder.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Fehler beim Laden</h1>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* MANUS HEADER - Exakte Nachbildung */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Niedersachsen Akteure</h1>
        <p className="text-sm text-gray-600 mt-1">Interaktive Karte der Organisationen und Akteure</p>
      </header>

      {/* MAIN LAYOUT - Links Sidebar, Rechts Karte */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR - Exakte Nachbildung der Manus Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          <ManusFilter
            stakeholders={filteredStakeholders}
            loading={loading}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            showAddForm={showAddForm}
            setShowAddForm={setShowAddForm}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
          />
        </div>

        {/* RIGHT MAP - Mapbox Integration */}
        <div className="flex-1">
          <ManusMap
            stakeholders={filteredStakeholders}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
