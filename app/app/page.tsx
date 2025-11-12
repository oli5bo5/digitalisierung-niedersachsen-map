'use client';

import { useState, useEffect } from 'react';
import { FilterSidebar } from '@/components/Sidebar/FilterSidebar';
import { MapView } from '@/components/Map/MapView';
import { DetailDrawer } from '@/components/DetailPanel/DetailDrawer';
import { useStakeholders } from '@/hooks/useStakeholders';
import { Stakeholder } from '@/lib/types/stakeholder';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { stakeholders, loading, error } = useStakeholders();
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);

  const handleFeedback = (stakeholder: Stakeholder) => {
    setShowFeedbackDialog(true);
    // TODO: Feedback-Dialog implementieren
    console.log('Feedback for:', stakeholder.name);
  };

  if (error) {
    return (
      <div className="flex h-full w-full flex-items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-lg font-semibold text-red-600">Fehler beim Laden</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Filter Sidebar */}
      <FilterSidebar />

      {/* Main Map View */}
      <main className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
        <MapView
          stakeholders={stakeholders}
          selectedStakeholder={selectedStakeholder}
          onSelectStakeholder={setSelectedStakeholder}
        />
      </main>

      {/* Detail onSelectStakeholder */}
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
