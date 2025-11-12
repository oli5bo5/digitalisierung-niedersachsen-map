```typescript
'use client';

import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFilterStore } from '@/lib/stores/filterStore';

export function SearchBar() {
  const { search, setSearch } = useFilterStore();

  const handleLocationSearch = () => {
    // TODO: Geolocation API integrieren
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log('User location:', position.coords);
        // Hier würdest du zur User-Position zoomen
      });
    }
  };

  return (
    <div className="space-y-3">
      {/* Text-Suche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Suche nach Ort, PLZ, Organisation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Standort-Suche */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Adresse oder PLZ"
          className="flex-1"
        />
        <Button 
          variant="outline" 
          size="icon"
          onClick={handleLocationSearch}
          title="Mein Standort"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```
