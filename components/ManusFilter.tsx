'use client';

import { useState } from 'react';
import { Stakeholder } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';

interface ManusFilterProps {
  stakeholders: Stakeholder[];
  loading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

// Manus Stakeholder Types mit exakten Farben aus dem Screenshot
const STAKEHOLDER_TYPES = [
  { key: 'alle', label: 'Alle Typen', color: '', letter: '' },
  { key: 'government', label: 'Regierung', color: '#374151', letter: 'G' }, // grau/schwarz
  { key: 'ngo', label: 'NGO', color: '#10b981', letter: 'N' }, // grün  
  { key: 'business', label: 'Unternehmen', color: '#3b82f6', letter: 'B' }, // blau
  { key: 'research', label: 'Forschung', color: '#8b5cf6', letter: 'R' }, // lila
];

// Regions für das Add-Form
const REGIONS = [
  { name: 'Hannover', lat: 52.37, lng: 9.73, id: 'hannover' },
  { name: 'Braunschweig', lat: 52.27, lng: 10.54, id: 'braunschweig' },
  { name: 'Oldenburg', lat: 53.15, lng: 8.22, id: 'oldenburg' },
  { name: 'Osnabrück', lat: 52.27, lng: 8.05, id: 'osnabrueck' }
];

export default function ManusFilter({
  stakeholders,
  loading,
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  showAddForm,
  setShowAddForm,
  selectedId,
  setSelectedId
}: ManusFilterProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'government',
    region_code: 'hannover',
    latitude: 52.37,
    longitude: 9.73,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Get stakeholder type info  
  const getTypeInfo = (type: string) => {
    return STAKEHOLDER_TYPES.find(t => t.key === type) || STAKEHOLDER_TYPES[1];
  };

  const handleRegionChange = (regionId: string) => {
    const region = REGIONS.find(r => r.id === regionId);
    if (region) {
      setFormData(prev => ({
        ...prev,
        region_code: regionId,
        latitude: region.lat,
        longitude: region.lng
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase.from('stakeholders').insert([{
        name: formData.name,
        type: formData.type,
        region_code: formData.region_code,
        latitude: formData.latitude,
        longitude: formData.longitude,
        description: formData.description
      }]);
      
      if (error) throw error;
      
      // Reset form
      setShowAddForm(false);
      setFormData({
        name: '',
        type: 'government',
        region_code: 'hannover',
        latitude: 52.37,
        longitude: 9.73,
        description: ''
      });
      
      // Refresh page to show new stakeholder
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Fehler bei der Speicherung');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* + NEUER AKTEUR BUTTON - Exakt wie Manus */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          + Neuer Akteur
        </button>
      </div>

      {/* ADD FORM - Wenn aktiv */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {STAKEHOLDER_TYPES.slice(1).map(type => (
                <option key={type.key} value={type.key}>{type.label}</option>
              ))}
            </select>
            
            <select
              value={formData.region_code}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {REGIONS.map(region => (
                <option key={region.id} value={region.id}>{region.name}</option>
              ))}
            </select>
            
            <textarea
              placeholder="Beschreibung"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            
            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Wird hinzugefügt...' : 'Hinzufügen'}
            </button>
          </form>
        </div>
      )}

      {/* SEARCH FIELD - Exakt wie Manus */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Nach Name oder Adresse suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* TYPE DROPDOWN - Exakt wie Manus */}
      <div className="p-4 border-b border-gray-200">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STAKEHOLDER_TYPES.map(type => (
            <option key={type.key} value={type.key}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* COUNTER - Exakt wie Manus */}
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600">
          {stakeholders.length} von {stakeholders.length} Akteuren
        </p>
      </div>

      {/* LEGENDE - Exakt wie Manus mit den richtigen Farben */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">LEGENDE</h3>
        <div className="space-y-2">
          {STAKEHOLDER_TYPES.slice(1).map(type => (
            <div key={type.key} className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: type.color }}
              >
                {type.letter}
              </div>
              <span className="text-sm text-gray-700">{type.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ERROR BANNER - Wie in Manus (optional) */}
      <div className="px-4 py-2">
        <div className="bg-red-100 border border-red-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">!</span>
          </div>
          <span className="text-sm text-red-700">1 error</span>
          <button className="ml-auto text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      </div>

      {/* STAKEHOLDER LIST - Scrollable wie in Manus */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Wird geladen...</p>
          </div>
        ) : stakeholders.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">Keine Akteure gefunden</p>
          </div>
        ) : (
          <div className="p-2">
            {stakeholders.map((stakeholder) => {
              const typeInfo = getTypeInfo(stakeholder.type);
              const isSelected = selectedId === stakeholder.id;
              
              return (
                <button
                  key={stakeholder.id}
                  onClick={() => setSelectedId(stakeholder.id)}
                  className={`w-full text-left p-3 mb-2 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 shadow-sm'
                      : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: typeInfo.color }}
                    >
                      {typeInfo.letter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-gray-900 truncate">
                        {stakeholder.name}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {typeInfo.label} • {stakeholder.region_code || stakeholder.city}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
