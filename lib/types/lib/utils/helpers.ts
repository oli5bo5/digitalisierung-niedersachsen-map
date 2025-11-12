```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { AreaType, StakeholderType } from '../types/stakeholder';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Farben für Bereiche
export const areaColors: Record<AreaType, string> = {
  ki: '#3B82F6', // blue
  robotik: '#10B981', // green
  immersive_tech: '#8B5CF6', // purple
  daten: '#F59E0B', // amber
  cybersecurity: '#EF4444', // red
  govtech: '#6366F1', // indigo
};

// Labels für Bereiche
export const areaLabels: Record<AreaType, string> = {
  ki: 'KI',
  robotik: 'Robotik',
  immersive_tech: 'Immersive Tech',
  daten: 'Daten',
  cybersecurity: 'Cybersecurity',
  govtech: 'GovTech',
};

// Icons für Stakeholder-Typen
export const typeIcons: Record<StakeholderType, string> = {
  unternehmen: '🏢',
  forschung: '🎓',
  politik_verwaltung: '🏛️',
  foerderprogramm: '💶',
  projekt: '🧩',
  netzwerk: '🔗',
};

// Labels für Stakeholder-Typen
export const typeLabels: Record<StakeholderType, string> = {
  unternehmen: 'Unternehmen',
  forschung: 'Forschung',
  politik_verwaltung: 'Politik/Verwaltung',
  foerderprogramm: 'Förderprogramm',
  projekt: 'Projekt',
  netzwerk: 'Netzwerk',
};

// Datum formatieren
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
