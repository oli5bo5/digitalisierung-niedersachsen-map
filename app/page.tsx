'use client';

import { useState, useEffect } from 'react';
import { FilterSidebar } from '@/components/Sidebar/FilterSidebar';
import { MapView } from '@/components/Map/MapView';
import { DetailDrawer } from '@/components/DetailPanel/DetailDrawer';
import { useStakeholders } from '@/hooks/useStakeholders';
import { Stakeholder } from '@/lib/supabase';
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
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Fehler beim Laden</h1>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen">
      <FilterSidebar />
      <div className="flex-1 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <MapView
            stakeholders={stakeholders}
            onStakeholderClick={setSelectedStakeholder}
          />
        )}
      </div>
      <DetailDrawer
        stakeholder={selectedStakeholder}
        onClose={() => setSelectedStakeholder(null)}
        onFeedback={handleFeedback}
      />
    </main>
  );
}
