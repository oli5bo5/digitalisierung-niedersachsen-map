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

export interface Stakeholder {
  id: string;
  name: string;
  type: 'government' | 'business' | 'education' | 'nonprofit' | 'other';
  description: string;
  website: string;
  contact_email: string;
  region_id: string;
  location: any;
  address: string;
  created_at: string;
  updated_at: string;
}
