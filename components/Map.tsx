'use client';

import { useMemo } from 'react';
import { ComposableMap, Geographies, Geography, Annotation } from 'react-simple-maps';

interface Stakeholder {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  region: string;
  description?: string;
}

interface MapComponentProps {
  stakeholders: Stakeholder[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const GEO_URL =
  'https://raw.githubusercontent.com/deldersveld/topojson/master/countries/germany/germany-states.json';

const BASE_FILL = '#E0E7FF';
const HIGHLIGHT_FILL = '#1D4ED8';
const BORDER_COLOR = '#FFFFFF';
const ANNOTATION_COLOR = '#1E40AF';

export default function MapComponent({ stakeholders, selectedId, setSelectedId }: MapComponentProps) {
  const totalStakeholders = stakeholders.length;
  const niedersachsenStakeholders = useMemo(
    () => stakeholders.filter((s) => s.region?.toLowerCase().includes('nieders') || s.region === 'NI' || s.region === 'H').length,
    [stakeholders],
  );

  const selectedStakeholder = useMemo(
    () => stakeholders.find((s) => s.id === selectedId),
    [stakeholders, selectedId],
  );

  return (
    <div className="relative w-full h-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Digitalisierungs-Landkarte Deutschland</h2>
      <p className="text-gray-600 mb-6">
        Fokus auf Niedersachsen mit {niedersachsenStakeholders} von {totalStakeholders} Akteuren
      </p>
      
      {/* Debug: Force new deployment */}
      <div className="text-xs text-gray-400 mb-2">Version: 2024-11-21 11:42</div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 3500, // Adjust scale to fit Germany
          center: [10.5, 51.5], // Center on Germany
        }}
        width={800}
        height={800}
        className="w-full h-full"
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const stateName =
                (geo.properties as Record<string, string | undefined>).name ||
                (geo.properties as Record<string, string | undefined>).NAME_1 ||
                '';
              const isNiedersachsen = stateName.toLowerCase().includes('nieders');
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isNiedersachsen ? HIGHLIGHT_FILL : BASE_FILL}
                  stroke={BORDER_COLOR}
                  strokeWidth={0.5}
                  style={{
                    hover: {
                      fill: isNiedersachsen ? HIGHLIGHT_FILL : '#A0A0A0',
                      outline: 'none',
                    },
                    pressed: {
                      fill: isNiedersachsen ? HIGHLIGHT_FILL : '#808080',
                      outline: 'none',
                    },
                  }}
                  onClick={() => {
                    // Handle click on a state if needed
                    console.log('Clicked on state:', stateName);
                    setSelectedId(null); // Deselect any stakeholder
                  }}
                />
              );
            })
          }
        </Geographies>

        {/* Annotation for Niedersachsen */}
        <Annotation
          subject={[9.8, 52.5]} // Coordinates for Niedersachsen
          dx={-90}
          dy={-30}
          connectorProps={{
            stroke: ANNOTATION_COLOR,
            strokeWidth: 2,
            strokeLinecap: 'round',
          }}
        >
          <text x="-8" textAnchor="end" alignmentBaseline="middle" fill={ANNOTATION_COLOR} fontSize={16} fontWeight="bold">
            Niedersachsen
          </text>
        </Annotation>
      </ComposableMap>

      {selectedStakeholder && (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-md max-w-xs">
          <h3 className="font-bold text-lg mb-1">{selectedStakeholder.name}</h3>
          <p className="text-sm text-gray-600">Typ: {selectedStakeholder.type}</p>
          <p className="text-sm text-gray-600">Region: {selectedStakeholder.region}</p>
          {selectedStakeholder.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-3">{selectedStakeholder.description}</p>
          )}
        </div>
      )}
    </div>
  );
}