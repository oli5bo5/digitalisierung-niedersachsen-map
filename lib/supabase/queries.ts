```typescript
import { supabase } from './client';
import { Filters, Stakeholder } from '@/lib/supabase';

export async function fetchStakeholders(filters: Filters): Promise<Stakeholder[]> {
  let query = supabase
    .from('stakeholders_with_coords')
    .select('*')
    .order('name');

  // Text-Suche
  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,city.ilike.%${filters.search}%,zip.ilike.%${filters.search}%`);
  }

  // Filter: Areas
  if (filters.areas.length > 0) {
    query = query.overlaps('areas', filters.areas);
  }

  // Filter: Types
  if (filters.types.length > 0) {
    query = query.in('type', filters.types);
  }

  // Filter: Status
  if (filters.status.length > 0) {
    query = query.in('status', filters.status);
  }

  // Filter: Regions
  if (filters.regionCodes.length > 0) {
    query = query.in('region_code', filters.regionCodes);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching stakeholders:', error);
    return [];
  }

  // Map data to Stakeholder interface
  return (data ?? []).map((item: any) => ({
    id: item.id,
    name: item.name,
    type: (item.type ?? item.stakeholder_type ?? 'unbekannt') as Stakeholder['type'],
    areas: (item.areas ?? []) as Stakeholder['areas'],
    description: item.description,
    website: item.website,
    email: item.email,
    phone: item.phone,
    street: item.street,
    zip: item.zip,
    city: item.city ?? 'Unbekannt',
    region_code: item.region_code ?? item.region,
    location: {
      type: 'Point' as const,
      coordinates: [parseFloat(item.longitude ?? 0), parseFloat(item.latitude ?? 0)] as [number, number],
    },
    status: (item.status ?? 'unbekannt') as Stakeholder['status'],
    last_checked_at: item.last_checked_at,
    check_source: item.check_source,
    created_at: item.created_at,
    updated_at: item.updated_at,
  })).filter((s: Stakeholder) => 
    s.location.coordinates[0] !== 0 && 
    s.location.coordinates[1] !== 0 &&
    !isNaN(s.location.coordinates[0]) &&
    !isNaN(s.location.coordinates[1])
  );
}

export async function fetchStakeholderById(id: string): Promise<Stakeholder | null> {
  const { data, error } = await supabase
    .from('stakeholders_with_coords')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching stakeholder:', error);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.name,
    type: (data.type ?? data.stakeholder_type ?? 'unbekannt') as Stakeholder['type'],
    areas: (data.areas ?? []) as Stakeholder['areas'],
    description: data.description,
    website: data.website,
    email: data.email,
    phone: data.phone,
    street: data.street,
    zip: data.zip,
    city: data.city ?? 'Unbekannt',
    region_code: data.region_code ?? data.region,
    location: {
      type: 'Point' as const,
      coordinates: [parseFloat(data.longitude ?? 0), parseFloat(data.latitude ?? 0)] as [number, number],
    },
    status: (data.status ?? 'unbekannt') as Stakeholder['status'],
    last_checked_at: data.last_checked_at,
    check_source: data.check_source,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

export async function submitFeedback(
  stakeholderId: string,
  type: string,
  message: string,
  email?: string
) {
  const { error } = await supabase.from('feedback').insert({
    stakeholder_id: stakeholderId,
    type,
    message,
    email,
  });

  if (error) {
    console.error('Error submitting feedback:', error);
    throw error;
  }
}
