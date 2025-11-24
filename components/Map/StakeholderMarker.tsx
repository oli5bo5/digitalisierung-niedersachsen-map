'use client';

import { Marker } from 'react-map-gl';
import { Stakeholder } from '@/lib/supabase';
import { areaColors } from '@/lib/utils/helpers';

interface StakeholderMarkerProps {
  stakeholder: Stakeholder;
  onClick: () => void;
}

export function StakeholderMarker({ stakeholder, onClick }: StakeholderMarkerProps) {
  // Primäre Farbe basierend auf dem ersten Bereich (falls verfügbar)
  const primaryColor = stakeholder.areas && stakeholder.areas[0] ? 
    areaColors[stakeholder.areas[0]] : '#3B82F6';
  
  // Use latitude/longitude from stakeholder object with proper fallbacks
  const longitude = stakeholder.longitude || stakeholder.location?.coordinates?.[0] || 9.73;
  const latitude = stakeholder.latitude || stakeholder.location?.coordinates?.[1] || 52.37;
  
  if (!longitude || !latitude) {
    return null; // Don't render marker without coordinates
  }
  
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
