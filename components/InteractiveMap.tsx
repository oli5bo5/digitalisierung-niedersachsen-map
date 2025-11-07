'use client';

import { useState, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { useStakeholders } from '@/hooks/useStakeholders';
import { supabase } from '@/lib/supabase';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface Stakeholder {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  region: string;
  description?: string;
}

export default function InteractiveMap() {
  const { stakeholders = [], loading: loadingStakeholders } = useStakeholders();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    longitude: 9.5,
    latitude: 52.5,
    zoom: 7
  });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'government',
    region: 'hannover',
    latitude: 52.37,
    longitude: 9.73,
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  const regions = [
    { name: 'Hannover', lat: 52.37, lng: 9.73, id: 'hannover' },
    { name: 'Braunschweig', lat: 52.27, lng: 10.54, id: 'braunschweig' },
    { name: 'Oldenburg', lat: 53.15, lng: 8.22, id: 'oldenburg' },
    { name: 'Osnabrück', lat: 52.27, lng: 8.05, id: 'osnabrueck' }
  ];

  const stakeholderTypes = [
    { value: 'government', label: 'Behörde' },
    { value: 'research', label: 'Forschung' },
    { value: 'business', label: 'Unternehmen' },
    { value: 'education', label: 'Bildung' },
    { value: 'other', label: 'Sonstiges' }
  ];

  const selectedMarker = Array.isArray(stakeholders) 
    ? stakeholders.find(s => s.id === selectedId) 
    : null;

  const handleRegionChange = (regionId: string) => {
    const region = regions.find(r => r.id === regionId);
    if (region) {
      setFormData(prev => ({
        ...prev,
        region: regionId,
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
        region: formData.region,
        latitude: formData.latitude,
        longitude: formData.longitude,
        description: formData.description
      }]);
      if (error) throw error;
      setShowForm(false);
      setFormData({
        name: '',
        type: 'government',
        region: 'hannover',
        latitude: 52.37,
        longitude: 9.73,
        description: ''
      });
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Fehler bei der Speicherung');
    } finally {
      setSubmitting(false);
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 font-bold text-lg">Fehler: Mapbox Token nicht konfiguriert</p>
          <p className="text-gray-600 text-sm mt-2">Bitte konfigurieren Sie NEXT_PUBLIC_MAPBOX_TOKEN in Cloudflare Pages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Digitalisierungsakteure Niedersachsen</h1>
        <p className="text-sm mt-1">Akteure ({stakeholders?.length || 0})</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Map Container */}
        <div className="flex-1 rounded-lg shadow-lg overflow-hidden bg-white">
          {MAPBOX_TOKEN ? (
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/light-v11"
              style={{ width: '100%', height: '100%' }}
              onLoad={() => setMapLoaded(true)}
            >
              <NavigationControl position="top-right" />
              
              {/* Region Markers */}
              {regions.map((region) => (
                <Marker key={`region-${region.id}`} longitude={region.lng} latitude={region.lat}>
                  <div className="text-2xl cursor-pointer" title={region.name}>📍</div>
                </Marker>
              ))}
              
              {/* Stakeholder Markers */}
              {Array.isArray(stakeholders) && stakeholders.length > 0 && stakeholders.map((s) => (
                <Marker key={`stakeholder-${s.id}`} longitude={s.longitude} latitude={s.latitude}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(s.id)}
                    className="text-lg bg-white rounded-full p-1 shadow-md hover:shadow-lg transition cursor-pointer"
                    title={s.name}
                    style={{ lineHeight: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}
                  >
                    •
                  </button>
                </Marker>
              ))}
              
              {/* Selected Marker Popup */}
              {selectedMarker && (
                <Popup
                  longitude={selectedMarker.longitude}
                  latitude={selectedMarker.latitude}
                  onClose={() => setSelectedId(null)}
                  closeButton
                  className="mapboxgl-popup"
                >
                  <div className="p-3 w-48">
                    <h3 className="font-bold text-sm">{selectedMarker.name}</h3>
                    <p className="text-xs text-gray-600 mt-1">{selectedMarker.type}</p>
                    <p className="text-xs text-gray-600">{selectedMarker.region}</p>
                    {selectedMarker.description && <p className="text-xs mt-2">{selectedMarker.description}</p>}
                  </div>
                </Popup>
              )}
            </Map>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-red-600 font-semibold">Mapbox Token fehlt</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200">
          {/* Add New Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-3 font-semibold hover:bg-emerald-700 transition"
            type="button"
          >
            + Neuer Akteur
          </button>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleSubmit} className="p-4 border-b space-y-3 bg-gray-50">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded text-sm"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full px-3 py-2 border rounded text-sm"
              >
                {stakeholderTypes.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <select
                value={formData.region}
                onChange={(e) => handleRegionChange(e.target.value)}
                className="w-full px-3 py-2 border rounded text-sm"
              >
                {regions.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              <textarea
                placeholder="Beschreibung"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded text-sm"
                rows={3}
              />
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {submitting ? 'Wird hinzugefügt...' : 'Hinzufügen'}
              </button>
            </form>
          )}

          {/* Stakeholder List */}
          <div className="flex-1 overflow-y-auto p-4">
            {loadingStakeholders ? (
              <p className="text-gray-500 text-sm">Wird geladen...</p>
            ) : !Array.isArray(stakeholders) || stakeholders.length === 0 ? (
              <p className="text-gray-500 text-sm">Keine Akteure</p>
            ) : (
              <div className="space-y-2">
                {stakeholders.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedId(s.id)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-indigo-50 rounded border hover:border-indigo-300 transition"
                    type="button"
                  >
                    <div className="font-semibold text-sm">{s.name}</div>
                    <div className="text-xs text-gray-600">{s.type} • {s.region}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
