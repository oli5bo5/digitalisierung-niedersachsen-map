import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// TypeScript types for database tables
export interface Region {
  id: string;
  name: string;
  coordinates: any;
  boundary: any;
  created_at: string;
}

export type StakeholderType =
  | 'unternehmen'
  | 'forschung'
  | 'politik_verwaltung'
  | 'foerderprogramm'
  | 'projekt'
  | 'netzwerk';

export type AreaType =
  | 'ki'
  | 'robotik'
  | 'immersive_tech'
  | 'daten'
  | 'cybersecurity'
  | 'govtech';

export type StatusType = 'aktiv' | 'inaktiv' | 'unbekannt';

export interface Stakeholder {
  id: string;
  name: string;
  type: StakeholderType;
  areas: AreaType[];
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  street?: string;
  zip?: string;
  city?: string;
  region_code?: string;
  location: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
  status: StatusType;
  last_checked_at?: string;
  check_source?: 'auto' | 'manual';
  created_at: string;
  updated_at: string;
    latitude: number;
    longitude: number;
}

// Filter interface for sidebar filtering
export interface Filters {
  search: string;
  areas: AreaType[];
  types: StakeholderType[];
  status: StatusType[];
  regionCodes: string[];
}
