'use client';

import { 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  AlertCircle,
  Flag
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Stakeholder } from '@/lib/types/stakeholder';
import { 
  areaColors, 
  areaLabels, 
  typeLabels, 
  formatDate 
} from '@/lib/utils/helpers';

interface StakeholderCardProps {
  stakeholder: Stakeholder;
  onFeedback: () => void;
}

export function StakeholderCard({ stakeholder, onFeedback }: StakeholderCardProps) {
  const getStatusBadge = () => {
    switch (stakeholder.status) {
      case 'aktiv':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Aktiv
          </Badge>
        );
      case 'inaktiv':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Inaktiv
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Unbekannt
          </Badge>
        );
    }
  };

  const [lng, lat] = stakeholder.location.coordinates;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="text-xl font-bold text-gray-900">
            {stakeholder.name}
          </h2>
          {getStatusBadge()}
        </div>
        
        {/* Typ Badge */}
        <Badge variant="default" className="mb-3">
          {typeLabels[stakeholder.type]}
        </Badge>
        {/* Bereich Tags */}
        <div className="flex flex-wrap gap-2">
          {stakeholder.areas.map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: areaColors[area] }}
            >
              {areaLabels[area]}
            </span>
          ))}
        </div>
      </div>

      {/* Beschreibung */}
      {stakeholder.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Beschreibung
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {stakeholder.description}
          </p>
        </div>
      )}

      {/* Adresse */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Standort
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          {stakeholder.street && <p>{stakeholder.street}</p>}
          <p>
            {stakeholder.zip} {stakeholder.city}
          </p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 mt-2"
          >
            Route öffnen
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>

      {/* Kontakt */}
      <div className="space-y-2">
        {stakeholder.website && (
          <a
            href={stakeholder.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="h-4 w-4" />
            Website besuchen
          </a>
        )}
        {stakeholder.email && (
          <a
            href={`mailto:${stakeholder.email}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Mail className="h-4 w-4" />
            {stakeholder.email}
          </a>
        )}
        {stakeholder.phone && (
          <a
            href={`tel:${stakeholder.phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Phone className="h-4 w-4" />
            {stakeholder.phone}
          </a>
        )}
      </div>

      {/* Aktualität */}
      {stakeholder.last_checked_at && (
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Zuletzt geprüft: {formatDate(stakeholder.last_checked_at)}
            {stakeholder.check_source === 'auto' && ' (automatisch)'}
          </p>
        </div>
      )}

      {/* Feedback Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onFeedback}
      >
        <Flag className="h-4 w-4 mr-2" />
        Fehler melden / Feedback
      </Button>
    </div>
  );
}
