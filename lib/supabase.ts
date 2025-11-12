import { createClient } from '@supabase/supabase-js';
import { Stakeholder } from './types/stakeholder';

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

// Re-export Stakeholder type from types/stakeholder.ts
export type { Stakeholder };
