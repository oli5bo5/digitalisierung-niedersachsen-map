'use client';
import dynamic from 'next/dynamic';


import { useState, useEffect } from 'react';
import { FilterSidebar } from '@/components/Sidebar/FilterSidebar';

const MapComponent = dynamic(() => import('../components/Map'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading map...</div>
      });
import { DetailDrawer } from '@/components/DetailPanel/DetailDrawer';
import { useStakeholders } from '@/hooks/useStakeholders';
import { Stakeholder } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { stakeholders, loading, error } = useStakeholders();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const handleFeedback = (stakeholder: Stakeholder) => {
    setShowFeedbackDialog(true);
    // TODO: Feedback-Dialog implementieren
    console.log('Feedback for:', stakeholder.name);
  };

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Fehler beim Laden der Daten</h1>
          <p className="text-gray-600">{error}</p>
          <p className="text-sm text-gray-500 mt-4">Bitte überprüfen Sie Ihre Supabase-Konfiguration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <FilterSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Map */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
                <p className="text-gray-600">Daten werden geladen...</p>
              </div>
            </div>
          ) : (
            <MapComponent 
              stakeholders={stakeholders} 
              selectedId={selectedId}
              setSelectedId={setSelectedId}
            />
          )}
        </div>

        {/* Detail Panel */}
        {selectedId && (
          <DetailDrawer
            stakeholder={stakeholders.find(s => s.id === selectedId) || null}
            onClose={() => setSelectedId(null)}
            onFeedback={handleFeedback}
          />
        )}
      </div>
    </div>
  );
}
