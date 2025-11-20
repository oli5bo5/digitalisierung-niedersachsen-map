import { useState, useEffect } from 'react';
import { supabase, Stakeholder } from '../lib/supabase';

export function useStakeholders() {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStakeholders();
  }, []);

  const fetchStakeholders = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase credentials missing!');
        setError('Supabase-Konfiguration fehlt. Bitte Umgebungsvariablen setzen.');
        setLoading(false);
        return;
      }

      console.log('✅ Supabase konfiguriert, lade Daten...');
      const { data, error: fetchError } = await supabase
        .from('stakeholders')
        .select('*')
        .order('name', { ascending: true });

      if (fetchError) {
        console.error('Error fetching stakeholders:', fetchError);
        setError(`Fehler beim Laden der Akteure: ${fetchError.message}`);
        setLoading(false);
        return;
      }

      console.log('Raw data from Supabase:', data);
      
      if (data) {
        // Map database fields to component interface - support both column name variants
        const mappedData = (data ?? []).map((item: any) => ({
          id: item.id,
          name: item.name,
          latitude: parseFloat(item.latitude ?? 0) || 0,
          longitude: parseFloat(item.longitude ?? 0) || 0,
          type: item.type ?? item.stakeholder_type ?? 'Unbekannt',
          region: item.region ?? item.region_code ?? 'Niedersachsen',
          description: item.description ?? undefined,
          ...item, // weitere Felder beibehalten
        }))
        .filter((s: Stakeholder) => {
          // Filter out invalid entries (missing coordinates or name)
          const isValid = s.latitude !== 0 && s.longitude !== 0 && s.name;
          if (!isValid) {
            console.warn('Invalid stakeholder (missing data):', s);
          }
          return isValid;
        });
        
        console.log('Valid stakeholders:', mappedData.length);
        setStakeholders(mappedData);
        
        if (mappedData.length === 0 && data.length > 0) {
          setError('Daten gefunden, aber keine gültigen Koordinaten vorhanden.');
        } else if (mappedData.length === 0) {
          setError('Keine Akteure in der Datenbank gefunden.');
        }
      } else {
        console.log('No data returned from Supabase');
        setError('Keine Daten von Supabase erhalten.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(`Unerwarteter Fehler beim Laden der Daten: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    stakeholders,
    loading,
    error,
    refetch: fetchStakeholders,
  };
}

