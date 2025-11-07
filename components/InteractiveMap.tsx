'use client';

import { useState } from 'react';
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

  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegionSelect = (region: any) => {
    setFormData(prev => ({
      ...prev,
      region: region.id,
      latitude: region.lat,
      longitude: region.lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
            latitude: formData.latitude,
            longitude: formData.longitude,
            description: formData.description
          }
        ]);

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
    } catch (error) {
      console.error('Fehler beim Hinzufügen:', error);
      alert('Fehler beim Hinzufügen des Akteurs');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="bg-indigo-600 text-white p-4">
        <h1 className="text-2xl font-bold">Digitalisierungsakteure Niedersachsen</h1>
        <p className="text-sm mt-1">Akteure ({stakeholders.length})</p>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        <div className="flex-1 rounded-lg shadow-lg overflow-hidden">
          {!MAPBOX_TOKEN ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <p className="text-red-600 font-semibold">Mapbox Token nicht konfiguriert</p>
            </div>
          ) : (
            <Map
              {...viewState}
              onMove={(evt) => setViewState(evt.viewState)}
              mapboxAccessToken={MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/light-v11"
              style={{ width: '100%', height: '100%' }}
            >
              <NavigationControl position="top-right" />
              {regions.map((region) => (
                <Marker key={region.id} longitude={region.lng} latitude={region.lat}>
                  <div className="cursor-pointer font-bold text-white bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center shadow-lg">
                    {region.name.charAt(0)}
                  </div>
                </Marker>
              ))}
              {stakeholders.map((s) => (
                <Marker
                  key={s.id}
                  longitude={s.longitude}
                  latitude={s.latitude}
                >
                  <div className="cursor-pointer font-bold text-white bg-emerald-600 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-emerald-700" onClick={() => setSelectedMarker(s)}>
                    *
                  </div>
                </Marker>
              ))}
              {selectedMarker && (
                <Popup
                  longitude={selectedMarker.longitude}
                  latitude={selectedMarker.latitude}
                  onClose={() => setSelectedMarker(null)}
                  closeButton={true}
                  closeOnClick={false}
                >
                  <div className="p-3 bg-white rounded">
                    <h3 className="font-bold text-indigo-900 mb-1">{selectedMarker.name}</h3>
                    <p className="text-sm text-gray-700"><strong>Typ:</strong> {selectedMarker.type}</p>
                    <p className="text-sm text-gray-700"><strong>Region:</strong> {selectedMarker.region}</p>
                    {selectedMarker.description && (
                      <p className="text-sm text-gray-600 mt-2">{selectedMarker.description}</p>
                    )}
                  </div>
                </Popup>
              )}
            </Map>
          )}
        </div>

        <div className="w-80 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-3 font-semibold hover:bg-emerald-700 transition"
          >
            + Neuer Akteur
          </button>

          {showForm && (
            <form onSubmit={handleSubmit} className="p-4 border-b border-gray-200 space-y-3 bg-gray-50">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Typ</label>
                <select
                  value={formData.type}
                  onChange={(e) => handleFormChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                >
                  {stakeholderTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Region</label>
                <select
                  value={formData.region}
                  onChange={(e) => {
                    const region = regions.find((r) => r.id === e.target.value);
                    if (region) {
                      handleRegionSelect(region);
                    }
                  }}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                >
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-1">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 rounded text-sm"
                  placeholder="Optional"
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

          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <p className="text-gray-600 text-sm">Wird geladen...</p>
            ) : stakeholders.length === 0 ? (
              <p className="text-gray-600 text-sm">Keine Akteure gefunden. Klicken Sie auf "+  Neuer Akteur", um einen hinzuzufügen.</p>
            ) : (
              <div className="space-y-2">
                {stakeholders.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedMarker(s)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-indigo-50 rounded border border-gray-200 hover:border-indigo-300 transition"
                  >
                    <div className="font-semibold text-indigo-900 text-sm">{s.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{s.type} * {s.region}</div>
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
