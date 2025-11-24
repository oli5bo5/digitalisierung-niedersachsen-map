'use client';

import { useState, useEffect } from "react";
import MapComponent from "./MapComponent";
import AddActorForm from "./AddActorForm";
import ActorDetail from "./ActorDetail";
import ActorSearch from "./ActorSearch";
import { useStakeholders } from '@/hooks/useStakeholders';
import { Loader2 } from "lucide-react";

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

// Actor type mapping for display
const ACTOR_TYPE_INFO = {
  government: { color: "#374151", icon: "G", label: "Regierung" },
  ngo: { color: "#10b981", icon: "N", label: "NGO" },
  business: { color: "#3b82f6", icon: "B", label: "Unternehmen" },
  research: { color: "#8b5cf6", icon: "R", label: "Forschung" },
  education: { color: "#f59e0b", icon: "E", label: "Bildung" },
  healthcare: { color: "#ef4444", icon: "H", label: "Gesundheit" },
};

export default function Home() {
  const { stakeholders = [], loading: isLoading, error } = useStakeholders();
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [filteredActors, setFilteredActors] = useState<Actor[]>([]);

  // Convert stakeholders to actors format
  const actors: Actor[] = stakeholders.map(stakeholder => {
    const typeInfo = ACTOR_TYPE_INFO[stakeholder.type as keyof typeof ACTOR_TYPE_INFO] || 
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

  // Update filtered actors when actors change
  useEffect(() => {
    setFilteredActors(actors);
  }, [actors]);

  const handleActorAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-600 mb-2">Fehler beim Laden</h1>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Seite aktualisieren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header - Exakt wie Manus */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Niedersachsen Akteure
              </h1>
              <p className="text-gray-600 mt-1">
                Interaktive Karte der Organisationen und Akteure
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Sidebar + Map Layout */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Sidebar - Exakt wie Manus */}
        <aside className="w-80 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <AddActorForm onActorAdded={handleActorAdded} />
          </div>

          {/* Search and Filter */}
          {actors.length > 0 && (
            <div className="px-4 pt-4 border-b border-gray-200">
              <ActorSearch actors={actors} onFilterChange={setFilteredActors} />
            </div>
          )}

          {/* Actors List */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : actors.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">Keine Akteure vorhanden</p>
                <p className="text-xs mt-2">
                  Fügen Sie einen neuen Akteur hinzu, um zu beginnen
                </p>
              </div>
            ) : filteredActors.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">Keine Akteure gefunden</p>
                <p className="text-xs mt-2">
                  Versuchen Sie, Ihre Suchkriterien zu ändern
                </p>
              </div>
            ) : (
              <div className="space-y-2 p-4">
                {filteredActors.map((actor) => (
                  <button
                    key={actor.id}
                    onClick={() => setSelectedActor(actor)}
                    className={`w-full text-left p-3 rounded-lg transition-colors border ${
                      selectedActor?.id === actor.id
                        ? 'bg-blue-50 border-blue-300'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: actor.color }}
                      >
                        {actor.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {actor.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {actor.city || actor.region_code || 'Niedersachsen'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Legend - Exakt wie Manus */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
              Legende
            </p>
            <div className="space-y-2 text-xs">
              {Object.entries(ACTOR_TYPE_INFO).map(([key, info]) => (
                <div key={key} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: info.color }}
                  >
                    {info.icon}
                  </div>
                  <span>{info.label}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Map - Leaflet Integration */}
        <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Karte wird geladen...</p>
              </div>
            </div>
          ) : (
            <MapComponent
              key={refreshKey}
              actors={filteredActors}
              onMarkerClick={setSelectedActor}
            />
          )}
        </div>
      </div>

      {/* Actor Detail Modal */}
      <ActorDetail actor={selectedActor} onClose={() => setSelectedActor(null)} />
    </div>
  );
}
