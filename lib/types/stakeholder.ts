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
  city: string;
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
}

export interface Filters {
  search: string;
  areas: AreaType[];
  types: StakeholderType[];
  status: StatusType[];
  regionCodes: string[];
}
