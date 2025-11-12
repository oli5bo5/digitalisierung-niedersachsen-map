'use client';

import { useState } from 'react';
import { FilterSidebar } from '@/components/Sidebar/FilterSidebar';
import { MapView } from '@/components/Map/MapView';
import { DetailDrawer } from '@/components/DetailPanel/DetailDrawer';
import { useStakeholders } from '@/hooks/useStakeholders';
import { Stakeholder } from '@/lib/types/stakeholder';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { stakeholders, isLoading, error } = useStakeholders();
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const handleFeedback = (stakeholder: Stakeholder) => {
    setShowFeedbackDialog(true);
    // TODO: Feedback-Dialog implementieren
    console.log('Feedback for:', stakeholder.name);
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">
            Fehler beim Laden der Daten
          </p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <FilterSidebar />

      {/* Map Container */}
      <div className="flex-1 relative">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Lade Daten...</p>
            </div>
          </div>
        ) : (
          <MapView
            stakeholders={stakeholders}
            selectedStakeholder={selectedStakeholder}
            onSelectStakeholder={setSelectedStakeholder}
          />
        )}
      </div>

      {/* Detail Drawer */}
      {selectedStakeholder && (
        <DetailDrawer
          stakeholder={selectedStakeholder}
          onClose={() => setSelectedStakeholder(null)}
          onFeedback={handleFeedback}
        />
      )}
    </div>
  );
}
