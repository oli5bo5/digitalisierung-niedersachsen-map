'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SearchBar } from './SearchBar';
import { FilterGroup } from './FilterGroup';
import { useFilterStore } from '@/lib/stores/filterStore';
import { useStakeholders } from '@/hooks/useStakeholders';
import { 
  areaColors, 
  areaLabels, 
  typeIcons, 
  typeLabels 
} from '@/lib/utils/helpers';
import { AreaType, StakeholderType, StatusType } from '@/lib/supabase';

export function FilterSidebar() {
  const {
    areas,
    types,
    status,
    toggleArea,
    toggleType,
    toggleStatus,
    resetFilters,
  } = useFilterStore();

  const { stakeholders, loading } = useStakeholders();

  // Bereiche Options
  const areaOptions = Object.entries(areaLabels).map(([value, label]) => ({
    value,
    label,
    color: areaColors[value as AreaType],
  }));

  // Stakeholder-Typ Options
  const typeOptions = Object.entries(typeLabels).map(([value, label]) => ({
    value,
    label,
    icon: typeIcons[value as StakeholderType],
  }));

  // Status Options
  const statusOptions = [
    { value: 'aktiv', label: 'Aktiv' },
    { value: 'inaktiv', label: 'Inaktiv' },
    { value: 'unbekannt', label: 'Unbekannt' },
  ];

  const hasActiveFilters = 
    areas.length > 0 || 
    types.length > 0 || 
    status.length > 0;

  return (
    <aside className="w-80 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg">Filter & Suche</h2>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-blue-600 hover:text-blue-700"
            >
              <X className="h-4 w-4 mr-1" />
              Zurücksetzen
            </Button>
          )}
        </div>
        <SearchBar />
      </div>

      {/* Filter Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <FilterGroup
          title="Bereiche"
          options={areaOptions}
          selectedValues={areas}
          onToggle={(value) => toggleArea(value as AreaType)}
        />

        <div className="border-t border-gray-200 pt-6">
          <FilterGroup
            title="Stakeholder-Typ"
            options={typeOptions}
            selectedValues={types}
            onToggle={(value) => toggleType(value as StakeholderType)}
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <FilterGroup
            title="Status"
            options={statusOptions}
            selectedValues={status}
            onToggle={(value) => toggleStatus(value as StatusType)}
          />
        </div>
      </div>

      {/* Footer mit Ergebnis-Count */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <p className="text-sm text-gray-600 text-center">
          {loading ? (
            <span className="text-gray-400">Lädt...</span>
          ) : (
            <>
              <span className="font-semibold text-gray-900">{stakeholders.length}</span> Ergebnisse
            </>
          )}
        </p>
      </div>
    </aside>
  );
}
