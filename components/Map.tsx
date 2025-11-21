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

const BASE_FILL = '#BFDBFE';
const HIGHLIGHT_FILL = '#1D4ED8';
const BORDER_COLOR = '#E0E7FF';

export default function MapComponent({ stakeholders, selectedId, setSelectedId }: MapComponentProps) {
  const selectedStakeholder = useMemo(
    () => stakeholders.find((stakeholder) => stakeholder.id === selectedId) ?? null,
    [selectedId, stakeholders],
  );

  const summary = useMemo(() => {
    const highlighted = stakeholders.filter((stakeholder) =>
      (stakeholder.region || '').toLowerCase().includes('nieders'),
    ).length;

    return {
      total: stakeholders.length,
      highlighted: highlighted || stakeholders.length,
    };
  }, [stakeholders]);

  return (
    <div
      className="flex-1 rounded-lg shadow-lg bg-white relative overflow-hidden"
      onClick={() => setSelectedId(null)}
    >
      <div className="absolute inset-0 pointer-events-none">
        <ComposableMap
          width={800}
          height={900}
          projection="geoMercator"
          projectionConfig={{ center: [10.4515, 51.0], scale: 2500 }}
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
                    strokeWidth={0.8}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>

          <Annotation
            subject={[9.8, 52.8]}
            dx={-80}
            dy={-40}
            connectorProps={{
              stroke: '#1D4ED8',
              strokeWidth: 2,
              strokeLinecap: 'round',
            }}
          >
            <g fill="#1D4ED8">
              <rect x={-90} y={-35} width={160} height={70} rx={8} fill="#1D4ED8" opacity={0.15} />
              <text x={-10} y={-5} textAnchor="middle" fontSize={18} fontWeight={700} fill="#1D4ED8">
                Niedersachsen
              </text>
              <text x={-10} y={20} textAnchor="middle" fontSize={12} fill="#1D4ED8">
                Fokusregion
              </text>
            </g>
          </Annotation>
        </ComposableMap>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white pointer-events-none" />

      <div className="relative h-full flex flex-col justify-between p-6 pointer-events-none">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Deutschlandkarte</h2>
          <p className="text-gray-600 max-w-xl">
            Niedersachsen ist hervorgehoben. Die Karte ist als statische Grafik eingebunden, damit sie auf allen
            Endgeräten identisch aussieht – unabhängig von Mapbox oder WebGL.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-sm text-blue-600">Gesamtanzahl</p>
              <p className="text-2xl font-semibold text-blue-800">{summary.total}</p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <p className="text-sm text-indigo-600">in Niedersachsen</p>
              <p className="text-2xl font-semibold text-indigo-800">{summary.highlighted}</p>
            </div>
          </div>
        </div>

        <div className="pointer-events-auto">
          {selectedStakeholder ? (
            <div className="bg-white/90 border border-blue-100 rounded-lg p-4 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-blue-500 font-semibold mb-1">Auswahl</p>
              <h3 className="text-xl font-bold text-gray-900">{selectedStakeholder.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedStakeholder.type} · {selectedStakeholder.region}
              </p>
              {selectedStakeholder.description && (
                <p className="text-sm text-gray-500 mt-2">{selectedStakeholder.description}</p>
              )}
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedId(null);
                }}
                className="mt-4 text-sm text-blue-600 hover:underline"
              >
                Auswahl zurücksetzen
              </button>
            </div>
          } : (
            <div className="bg-white/90 border border-gray-100 rounded-lg p-4 shadow">
              <p className="text-sm text-gray-600">
                Wähle links einen Akteur, um die Details hier anzuzeigen. Die Karte bleibt eine feste Grafik mit
                hervorgehobener Fokusregion.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

