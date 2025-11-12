'use client';

import { areaColors, areaLabels } from '@/lib/utils/helpers';
import { AreaType } from '@/lib/types/stakeholder';

export function MapLegend() {
  return (
    <div className="absolute bottom-6 left-6 bg-white rounded-lg shadow-lg p-4 max-w-xs z-10">
      <h3 className="font-semibold text-sm text-gray-900 mb-3">
        Legende
      </h3>
      <div className="space-y-2">
        {Object.entries(areaLabels).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: areaColors[key as AreaType] }}
            />
            <span className="text-xs text-gray-700">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
