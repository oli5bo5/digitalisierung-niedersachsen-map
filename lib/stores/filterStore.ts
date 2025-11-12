```typescript
import { create } from 'zustand';
import { Filters, AreaType, StakeholderType, StatusType } from '@/lib/types/stakeholder';

interface FilterState extends Filters {
  setSearch: (search: string) => void;
  toggleArea: (area: AreaType) => void;
  toggleType: (type: StakeholderType) => void;
  toggleStatus: (status: StatusType) => void;
  toggleRegion: (code: string) => void;
  resetFilters: () => void;
}

const initialFilters: Filters = {
  search: '',
  areas: [],
  types: [],
  status: [],
  regionCodes: [],
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialFilters,
  
  setSearch: (search) => set({ search }),
  
  toggleArea: (area) => set((state) => ({
    areas: state.areas.includes(area)
      ? state.areas.filter((a) => a !== area)
      : [...state.areas, area],
  })),
  
  toggleType: (type) => set((state) => ({
    types: state.types.includes(type)
      ? state.types.filter((t) => t !== type)
      : [...state.types, type],
  })),
  
  toggleStatus: (status) => set((state) => ({
    status: state.status.includes(status)
      ? state.status.filter((s) => s !== status)
      : [...state.status, status],
  })),
  
  toggleRegion: (code) => set((state) => ({
    regionCodes: state.regionCodes.includes(code)
      ? state.regionCodes.filter((r) => r !== code)
      : [...state.regionCodes, code],
  })),
  
  resetFilters: () => set(initialFilters),
}));
