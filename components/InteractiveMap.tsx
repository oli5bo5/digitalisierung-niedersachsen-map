'use client';

import dynamic from 'next/dynamic';
imporimport { useState, Suspense, useEffect } from 'react';
import { useStakeholders } from '@/hooks/useStakeholders';
import { supabase } from '@/lib/supabase';

const MapComponent = dynamic(() => import('./Map'), {
  loading: () => (
    <div className="flex-1 rounded-lg shadow-lg overflow-hidden bg-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 font-semibold">Karte wird geladen...</p>
        <p className="text-gray-300 text-sm mt-2">Bitte warten Sie</p>
      </div>
    </div>
  ),
  ssr: false
});

export default function InteractiveMap() {
  const { stakeholders = [], loading: loadingStakeholders } = useStakeholders();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
          setIsMounted(true);
        }, []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
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

  return (
    <div className="w-full h-screen flex flex-col bg-gray-50">
      <div className="bg-indigo-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold">Digitalisierungsakteure Niedersachsen</h1>
        <p className="text-sm mt-1">Akteure ({stakeholders?.length || 0})</p>
      </div>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {isMounted ? (
              <Suspense fallback={<div className="flex-1 bg-gray-100" />}>
          <MapComponent stakeholders={stakeholders} selectedId={selectedId} setSelectedId={setSelectedId} />
        </Suspense>
              ) : (
                <div className="flex-1 bg-gray-100 flex items-center justify-center">
                              <p className="text-gray-400">Karte wird geladen...</p>
                            </div>
              )}

        <div className="w-80 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden border border-gray-200">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-emerald-600 text-white px-4 py-3 font-semibold hover:bg-emerald-700 transition"
            type="button"
          >
            + Neuer Akteur
          </button>

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
                    className={`w-full text-left p-3 rounded border transition ${
                      selectedId === s.id
                        ? 'bg-indigo-100 border-indigo-300'
                        : 'bg-gray-50 hover:bg-indigo-50 border-gray-300 hover:border-indigo-300'
                    }`}
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
