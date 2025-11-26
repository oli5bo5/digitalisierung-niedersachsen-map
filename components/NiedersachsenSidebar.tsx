'use client';

import { useState, useMemo } from "react";
import AddActorForm from "./AddActorForm";
import ActorSearch from "./ActorSearch";

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

interface NiedersachsenSidebarProps {
  actors: Actor[];
  selectedActor: Actor | null;
  onActorSelect: (actor: Actor | null) => void;
  onActorAdded: () => void;
  isLoading?: boolean;
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

export default function NiedersachsenSidebar({
  actors,
  selectedActor,
  onActorSelect,
  onActorAdded,
  isLoading = false
}: NiedersachsenSidebarProps) {
  const [filteredActors, setFilteredActors] = useState<Actor[]>(actors);

  // Update filtered actors when actors change
  useMemo(() => {
    setFilteredActors(actors);
  }, [actors]);

  const handleActorClick = (actor: Actor) => {
    // Toggle selection: deselect if same actor, otherwise select new one
    if (selectedActor?.id === actor.id) {
      onActorSelect(null);
    } else {
      onActorSelect(actor);
    }
  };

  if (isLoading) {
    return (
      <aside className="w-80 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Lade Akteure...</p>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-white rounded-lg shadow-md flex flex-col overflow-hidden border border-gray-200">
      {/* Header with Add Button */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <AddActorForm onActorAdded={onActorAdded} />
      </div>

      {/* Search and Filter Section */}
      {actors.length > 0 && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <ActorSearch actors={actors} onFilterChange={setFilteredActors} />
        </div>
      )}

      {/* Actors List */}
      <div className="flex-1 overflow-y-auto">
        {actors.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🗺️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Keine Akteure vorhanden
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Fügen Sie den ersten Akteur hinzu, um die Karte zu starten.
              </p>
            </div>
          </div>
        ) : filteredActors.length === 0 ? (
          <div className="p-6 text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Keine Ergebnisse
              </h3>
              <p className="text-sm text-gray-500">
                Keine Akteure entsprechen Ihren Suchkriterien.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {filteredActors.map((actor) => {
              const typeConfig = STAKEHOLDER_TYPE_CONFIG[actor.type] || {
                label: actor.type,
                color: "#6b7280",
                icon: "?"
              };
              
              const isSelected = selectedActor?.id === actor.id;

              return (
                <button
                  key={actor.id}
                  onClick={() => handleActorClick(actor)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 border ${
                    isSelected
                      ? 'bg-blue-50 border-blue-300 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Type Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 transition-transform ${
                        isSelected ? 'scale-110' : ''
                      }`}
                      style={{ backgroundColor: typeConfig.color }}
                    >
                      {typeConfig.icon}
                    </div>

                    {/* Actor Info */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">
                        {actor.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <span 
                          className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: typeConfig.color }}
                        >
                          {typeConfig.label}
                        </span>
                      </div>

                      <p className="text-xs text-gray-500 truncate">
                        📍 {actor.city || actor.region_code || 'Niedersachsen'}
                      </p>

                      {actor.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {actor.description}
                        </p>
                      )}
                    </div>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="flex-shrink-0">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend Section */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Legende
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(STAKEHOLDER_TYPE_CONFIG).map(([key, config]) => {
            const count = actors.filter(actor => actor.type === key).length;
            return (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: config.color }}
                >
                  {config.icon}
                </div>
                <div className="text-xs">
                  <div className="font-medium text-gray-700">{config.label}</div>
                  <div className="text-gray-500">({count})</div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Total Count */}
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Gesamt</span>
            <span className="text-sm font-semibold text-gray-900">
              {filteredActors.length} von {actors.length}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

