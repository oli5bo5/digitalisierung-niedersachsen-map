'use client';
import { useEffect, useState } from 'react';
import Map, { Marker, Popup, NavigationControl } from 'react-map-gl';
import { useStakeholders } from '@/hooks/useStakeholders';
import { supabase } from '@/lib/supabase';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

interface StakeholderMarker {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  region: string;
  description?: string;
}

export default function InteractiveMap() {
  const { stakeholders, loading } = useStakeholders();
  const [selectedMarker, setSelectedMarker] = useState<StakeholderMarker | null>(null);
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

  // Niedersachsen Regions
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

  const handleAddStakeholder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('stakeholders')
        .insert([
          {
            name: formData.name,
            type: formData.type,
            region: formData.region,
            latitude: parseFloat(String(formData.latitude)),
            longitude: parseFloat(String(formData.longitude)),
            description: formData.description || null
          }
        ]);
      
      if (error) throw error;
      
      // Reset form
      setFormData({
        name: '',
        type: 'government',
        region: 'hannover',
        latitude: 52.37,
        longitude: 9.73,
        description: ''
      });
      setShowForm(false);
      
      // Reload page to show new data
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      console.error('Error adding stakeholder:', err);
      alert('Fehler beim Hinzufügen des Akteurs');
    } finally {
      setSubmitting(false);
    }
  };

  if (!MAPBOX_TOKEN) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-900 mb-4">
            Mapbox Token nicht konfiguriert
          </h1>
          <p className="text-red-700">
            Bitte stellen Sie sicher, dass NEXT_PUBLIC_MAPBOX_TOKEN in den Umgebungsvariablen gesetzt ist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Interaktive Karte der Digitalisierungsakteure
        </h1>
        <p className="text-indigo-100">
          Niedersachsen - Entdecken Sie die Digitalisierer in Ihrer Region
        </p>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden bg-gray-100">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-6 overflow-y-auto flex flex-col">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">
            Regionen in Niedersachsen
          </h2>
          <div className="space-y-2 mb-6">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() =>
                  setViewState({
                    longitude: region.lng,
                    latitude: region.lat,
                    zoom: 10
                  })
                }
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-indigo-50 border border-indigo-200 transition font-semibold text-indigo-900"
              >
                {region.name}
              </button>
            ))}
          </div>

          {/* Add Stakeholder Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full px-4 py-3 mb-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
          >
            {showForm ? 'Abbrechen' : '+ Neuer Akteur'}
          </button>

          {/* Add Stakeholder Form */}
          {showForm && (
            <form onSubmit={handleAddStakeholder} className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200 space-y-3">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Typ</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                >
                  {stakeholderTypes.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => {
                    const region = regions.find(r => r.id === e.target.value);
                    if (region) {
                      setFormData({
                        ...formData,
                        region: e.target.value,
                        latitude: region.lat,
                        longitude: region.lng
                      });
                    }
                  }}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                  rows={2 as any}
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-3 py-2 bg-indigo-600 text-white rounded text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {submitting ? 'Wird hinzugefügt...' : 'Hinzufügen'}
              </button>
            </form>
          )}

          {/* Stakeholders List */}
          <div className="border-t pt-4 flex-1 overflow-y-auto">
            <h3 className="text-lg font-bold text-indigo-900 mb-3">
              Akteure ({stakeholders.length})
            </h3>
            {loading ? (
              <p className="text-gray-600">Laden...</p>
            ) : stakeholders.length === 0 ? (
              <p className="text-gray-600 text-sm">Keine Akteure gefunden. Klicken Sie "+ Neuer Akteur", um einen hinzuzufügen.</p>
            ) : (
              <div className="space-y-2">
                {stakeholders.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedMarker(s);
                      setViewState({
                        longitude: s.longitude,
                        latitude: s.latitude,
                        zoom: 12
                      });
                    }}
                    className="w-full text-left px-3 py-2 rounded text-sm hover:bg-indigo-100 transition border border-gray-200"
                  >
                    <div className="font-semibold text-indigo-900">{s.name}</div>
                    <div className="text-xs text-gray-600">{s.type} • {s.region}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 rounded-lg shadow-lg overflow-hidden">
          <Map
            {...viewState}
            onMove={(evt) => setViewState(evt.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/light-v11"
            style={{ width: '100%', height: '100%' }}
          >
            <NavigationControl position="top-right" />

            {/* Region Markers */}
            {regions.map((region) => (
              <Marker
                key={region.id}
                longitude={region.lng}
                latitude={region.lat}
              >
                <div
                  className="cursor-pointer font-bold text-white bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-indigo-700 text-sm"
                  title={region.name}
                >
                  ◉
                </div>
              </Marker>
            ))}

            {/* Stakeholder Markers */}
            {stakeholders.map((s) => (
              <Marker
                key={s.id}
                longitude={s.longitude}
                latitude={s.latitude}
              >
                <div
                  onClick={() => setSelectedMarker(s)}
                  className="cursor-pointer w-6 h-6 bg-green-500 border-2 border-white rounded-full shadow-lg hover:scale-125 transition"
                  title={s.name}
                />
              </Marker>
            ))}

            {/* Popup for Selected Marker */}
            {selectedMarker && (
              <Popup
                longitude={selectedMarker.longitude}
                latitude={selectedMarker.latitude}
                onClose={() => setSelectedMarker(null)}
                closeButton={true}
                closeOnClick={true}
              >
                <div className="p-3 bg-white rounded">
                  <h3 className="font-bold text-indigo-900">{selectedMarker.name}</h3>
                  <p className="text-sm text-gray-700">{selectedMarker.type}</p>
                  <p className="text-xs text-gray-600 mt-1">Region: {selectedMarker.region}</p>
                  {selectedMarker.description && (
                    <p className="text-xs text-gray-600 mt-2">{selectedMarker.description}</p>
                  )}
                </div>
              </Popup>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
}
