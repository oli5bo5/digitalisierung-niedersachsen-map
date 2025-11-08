'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export interface Stakeholder {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  type: string;
  region: string;
  description?: string;
}

export function useStakeholders(regionId?: string) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from('stakeholders')
          .select('id, name, type, region_code, description, location');

        if (regionId) {
          query = query.eq('region_code', regionId);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map database fields to component interface
        const mappedData = (data || []).map((item: any) => {
          let lat = 0;
          let lng = 0;

          // Handle geography data - could be WKB or GeoJSON
          if (item.location) {
            try {
              // If it's a GeoJSON object
              if (typeof item.location === 'object' && item.location.coordinates) {
                lng = item.location.coordinates[0];
                lat = item.location.coordinates[1];
              } else if (typeof item.location === 'string') {
                // If it's a GeoJSON string
                const parsed = JSON.parse(item.location);
                if (parsed.coordinates) {
                  lng = parsed.coordinates[0];
                  lat = parsed.coordinates[1];
                }
              }
            } catch (e) {
              console.warn('Could not parse location:', item.location, e);
            }
          }

          return {
            id: item.id,
            name: item.name,
            latitude: lat,
            longitude: lng,
            type: item.type,
            region: item.region_code,
            description: item.description,
          };
        });

        setStakeholders(mappedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error fetching stakeholders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStakeholders();
  }, [regionId]);

  return { stakeholders, loading, error };
}

export function useRegions() {
  const [regions, setRegions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('regions')
          .select('*');

        if (error) throw error;
        setRegions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error('Error fetching regions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return { regions, loading, error };
}
