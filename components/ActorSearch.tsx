'use client';

import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";

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
}

interface ActorSearchProps {
  actors: Actor[];
  onFilterChange: (filtered: Actor[]) => void;
}

const ACTOR_TYPES = [
  { value: "government", label: "Regierung" },
  { value: "ngo", label: "NGO" },
  { value: "business", label: "Unternehmen" },
  { value: "research", label: "Forschung" },
  { value: "education", label: "Bildung" },
  { value: "healthcare", label: "Gesundheit" },
];

export default function ActorSearch({ actors, onFilterChange }: ActorSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");

  const filteredActors = useMemo(() => {
    return actors.filter((actor) => {
      const matchesSearch =
        actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (actor.city && actor.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (actor.region_code && actor.region_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (actor.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

      const matchesType = selectedType === "all" || actor.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [actors, searchTerm, selectedType]);

  // Notify parent of filtered results in separate useEffect
  useEffect(() => {
    onFilterChange(filteredActors);
  }, [filteredActors, onFilterChange]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
  };

  const hasActiveFilters = searchTerm !== "" || selectedType !== "all";

  return (
    <div className="space-y-3">
      <div>
        <input
          placeholder="Nach Name oder Adresse suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <select 
          value={selectedType} 
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Alle Typen</option>
          {ACTOR_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={handleClearFilters}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          <X className="w-3 h-3" />
          Filter löschen
        </button>
      )}

      <div className="text-xs text-gray-500 px-1">
        {filteredActors.length} von {actors.length} Akteuren
      </div>
    </div>
  );
}

