'use client';

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { supabase } from '@/lib/supabase';

const ACTOR_TYPES = [
  { value: "government", label: "Regierung", color: "#374151", icon: "G" },
  { value: "ngo", label: "NGO", color: "#10b981", icon: "N" },
  { value: "business", label: "Unternehmen", color: "#3b82f6", icon: "B" },
  { value: "research", label: "Forschung", color: "#8b5cf6", icon: "R" },
  { value: "education", label: "Bildung", color: "#f59e0b", icon: "E" },
  { value: "healthcare", label: "Gesundheit", color: "#ef4444", icon: "H" },
];

interface AddActorFormProps {
  onActorAdded?: () => void;
}

export default function AddActorForm({ onActorAdded }: AddActorFormProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    address: "",
    description: "",
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeResult, setGeocodeResult] = useState<{
    lat: string;
    lng: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGeocodeAddress = async () => {
    if (!formData.address) {
      alert("Bitte geben Sie eine Adresse ein");
      return;
    }

    setIsGeocoding(true);
    try {
      console.log('🔍 Geocoding address:', formData.address);
      
      // Use OpenStreetMap Nominatim API for geocoding - KOSTENLOS!
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          formData.address + ", Niedersachsen, Deutschland"
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const result = data[0];
        setGeocodeResult({
          lat: result.lat,
          lng: result.lon,
        });
        console.log('✅ Coordinates found:', result.lat, result.lon);
        alert("Adresse gefunden!");
      } else {
        alert("Adresse nicht gefunden");
      }
    } catch (error) {
      alert("Geocoding-Fehler");
      console.error('Geocoding error:', error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.type || !geocodeResult) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus und führen Sie die Adresssuche durch");
      return;
    }

    const selectedType = ACTOR_TYPES.find((t) => t.value === formData.type);
    if (!selectedType) return;

    setIsSubmitting(true);

    try {
      console.log('💾 Creating actor:', {
        name: formData.name,
        type: formData.type,
        latitude: parseFloat(geocodeResult.lat),
        longitude: parseFloat(geocodeResult.lng),
      });

      const { error } = await supabase.from('stakeholders').insert([{
        name: formData.name,
        type: formData.type,
        city: formData.address,
        region_code: 'niedersachsen',
        latitude: parseFloat(geocodeResult.lat),
        longitude: parseFloat(geocodeResult.lng),
        description: formData.description || null,
      }]);

      if (error) throw error;

      alert("Akteur erfolgreich hinzugefügt!");
      setFormData({ name: "", type: "", address: "", description: "" });
      setGeocodeResult(null);
      setOpen(false);
      onActorAdded?.();

      // Reload to see new stakeholder
      window.location.reload();
    } catch (error: any) {
      console.error('Error creating actor:', error);
      alert(`Fehler: ${error.message || 'Unbekannter Fehler'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <>
      {/* Button to open modal */}
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        + Neuer Akteur
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleOverlayClick}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[95vh] overflow-hidden flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - SEHR SICHTBAR */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-full transition-all z-50 shadow-lg hover:shadow-xl border-2 border-red-700"
              aria-label="Schließen"
              title="Schließen"
            >
              <X className="w-7 h-7" />
            </button>

            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4 pr-16">
              <h2 className="text-lg font-bold">Neuen Akteur hinzufügen</h2>
              <p className="text-sm text-gray-600">
                Füllen Sie das Formular aus, um einen neuen Akteur zur Karte hinzuzufügen.
              </p>
            </div>

            {/* Form - Scrollable */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="z.B. Niedersächsisches Ministerium"
                  required
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Typ *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Wählen Sie einen Typ</option>
                  {ACTOR_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Adresse *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => {
                      console.log("Address input changed:", e.target.value);
                      setFormData({ ...formData, address: e.target.value });
                    }}
                    placeholder="z.B. Hannover, Niedersachsen"
                    required
                    autoComplete="off"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={handleGeocodeAddress}
                    disabled={isGeocoding || !formData.address}
                    className="whitespace-nowrap px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    {isGeocoding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Suchen"
                    )}
                  </button>
                </div>
                {geocodeResult && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ Koordinaten gefunden: {geocodeResult.lat}, {geocodeResult.lng}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Beschreibung</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optionale Beschreibung..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>

            {/* Footer - Fixed */}
            <div className="border-t border-gray-200 bg-gray-50 p-4 flex gap-2">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold disabled:opacity-50 transition-colors"
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                    Wird hinzugefügt...
                  </>
                ) : (
                  "Hinzufügen"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
