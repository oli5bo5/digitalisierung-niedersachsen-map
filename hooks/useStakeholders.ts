'use client';

import { useEffect, useState } from 'react';
import { supabase, Stakeholder } from '@/lib/supabase';

export function useStakeholders(regionId?: string) {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStakeholders = async () => {
      try {
        setLoading(true);
        let query = supabase.from('stakeholders').select('*');

        if (regionId) {
          query = query.eq('region_id', regionId);
        }

        const { data, error } = await query;

        if (error) throw error;
        setStakeholders(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
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
        const { data, error } = await supabase.from('regions').select('*');

        if (error) throw error;
        setRegions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  return { regions, loading, error };
}
