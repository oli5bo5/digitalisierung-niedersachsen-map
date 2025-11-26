'use client';

import { useState, useCallback, useMemo } from "react";
import { useStakeholders } from '@/hooks/useStakeholders';
import NiedersachsenMap from "./NiedersachsenMap";
import NiedersachsenSidebar from "./NiedersachsenSidebar";

interface Actor {
  id: string;
  name: string;
  type: string;
  address?: string;
  city?: string;
  region_code?: string;
  latitude: number;
  longitude: number;
  description?: string | null;
  color: string;
  icon: string;
}

// Stakeholder type configurations
const STAKEHOLDER_TYPE_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  government: { label: "Regierung", color: "#374151", icon: "G" },
  ngo: { label: "NGO", color: "#10b981", icon: "N" },
  business: { label: "Unternehmen", color: "#3b82f6", icon: "B" },
  research: { label: "Forschung", color: "#8b5cf6", icon: "R" },
  education: { label: "Bildung", color: "#f59e0b", icon: "E" },
  healthcare: { label: "Gesundheit", color: "#ef4444", icon: "H" },
};

export default function NiedersachsenApp() {
  // Data from Supabase
  const { stakeholders = [], loading: isDataLoading, error } = useStakeholders();
  
  // Local state management
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Convert stakeholders to actors format with memoization to prevent rerenders
  const actors: Actor[] = useMemo(() => {
    return stakeholders.map(stakeholder => {
      const typeInfo = STAKEHOLDER_TYPE_CONFIG[stakeholder.type as keyof typeof STAKEHOLDER_TYPE_CONFIG] || 
        { color: "#6b7280", icon: "?", label: stakeholder.type };
      
      return {
        id: stakeholder.id,
        name: stakeholder.name,
        type: stakeholder.type,
        city: stakeholder.city,
        region_code: stakeholder.region_code,
        latitude: stakeholder.latitude || 0,
        longitude: stakeholder.longitude || 0,
        description: stakeholder.description,
        color: typeInfo.color,
        icon: typeInfo.icon,
      };
    });
  }, [stakeholders]);

  // Handle actor selection with useCallback to prevent rerenders
  const handleActorSelect = useCallback((actor: Actor | null) => {
    setSelectedActor(actor);
  }, []);

  // Handle marker clicks from map
  const handleMapMarkerClick = useCallback((actor: Actor) => {
    setSelectedActor(actor);
  }, []);

  // Handle when new actor is added
  const handleActorAdded = useCallback(() => {
    // Trigger a refresh of the stakeholders data
    setRefreshTrigger(prev => prev + 1);
    // Clear selection
    setSelectedActor(null);
  }, []);

  // Error state
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-2">
            Fehler beim Laden der Daten
          </h1>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Seite neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Niedersachsen Akteure
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Interaktive Karte der Organisationen und Akteure
              </p>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isDataLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
              <span className="text-sm text-gray-600 hidden sm:inline">
                {isDataLoading ? 'Lädt...' : `${actors.length} Akteure`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Sidebar */}
        <NiedersachsenSidebar
          actors={actors}
          selectedActor={selectedActor}
          onActorSelect={handleActorSelect}
          onActorAdded={handleActorAdded}
          isLoading={isDataLoading}
        />

        {/* Map */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden relative">
          {isDataLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="text-center">
                <div className="animate-pulse mb-4">
                  <div className="w-20 h-20 bg-blue-200 rounded-full mx-auto mb-4"></div>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Karte wird geladen...
                </h3>
                <p className="text-sm text-gray-500">
                  Bitte warten Sie einen Moment
                </p>
              </div>
            </div>
          ) : (
            <NiedersachsenMap
              key={`${refreshTrigger}-${actors.length}`} // Force refresh when data changes
              actors={actors}
              onMarkerClick={handleMapMarkerClick}
              selectedActorId={selectedActor?.id || null}
            />
          )}
        </div>
      </div>

      {/* Footer / Attribution */}
      <footer className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              © 2024 Niedersachsen Digitalisierungsakteure
            </div>
            <div className="flex items-center gap-4">
              <span>Powered by OpenStreetMap & Leaflet</span>
              <span>•</span>
              <span>🗺️ Kostenlos & Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

