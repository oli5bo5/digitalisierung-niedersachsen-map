'use client';

import { Marker } from 'react-map-gl';
import { Stakeholder } from '@/lib/supabase';
import { areaColors } from '@/lib/utils/helpers';

interface StakeholderMarkerProps {
  stakeholder: Stakeholder;
  onClick: () => void;
}

export function StakeholderMarker({ stakeholder, onClick }: StakeholderMarkerProps) {
  // Primäre Farbe basierend auf dem ersten Bereich
  const primaryColor = areaColors[stakeholder.areas[0]] || '#3B82F6';
  
  const [longitude, latitude] = stakeholder.location.coordinates;
  
  return (
    <Marker
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onClick();
      }}
    >
      <div className="relative cursor-pointer group">
        {/* Pin */}
        <div 
          className="w-8 h-8 rounded-full border-2 border-white shadow-lg transition-transform group-hover:scale-110"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="absolute inset-0 rounded-full animate-ping opacity-20"
               style={{ backgroundColor: primaryColor }} />
        </div>
        
        {/* Tooltip on Hover */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          {stakeholder.name}
        </div>
      </div>
    </Marker>
  );
}
