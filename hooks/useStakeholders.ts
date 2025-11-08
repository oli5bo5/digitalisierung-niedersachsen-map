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
        .select('*, location')
        if (regionId) {
          query = query.eq('region_code', regionId);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Map database fields to component interface
        const mappedData = (data || []).map((item: any) => ({
          id: item.id,
          name: item.name,
        latitude: item.location ? JSON.parse(item.location as string).coordinates[1] : 0,                  longitude: item.location ? JSON.parse(item.location as string).coordinates[0] : 0,        type: item.type,
          region: item.region_code,
          description: item.description
        }));

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
