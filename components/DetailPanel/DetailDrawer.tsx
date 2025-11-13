'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StakeholderCard } from './StakeholderCard';
import { Stakeholder } from '@/lib/supabase';

interface DetailDrawerProps {
  stakeholder: Stakeholder | null;
  onClose: () => void;
  onFeedback: (stakeholder: Stakeholder) => void;
}

export function DetailDrawer({ 
  stakeholder, 
  onClose,
  onFeedback 
}: DetailDrawerProps) {
  if (!stakeholder) return null;

  return (
    <aside className="w-96 h-full bg-white border-l border-gray-200 flex flex-col shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="font-semibold text-lg">Details</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <StakeholderCard 
          stakeholder={stakeholder}
          onFeedback={() => onFeedback(stakeholder)}
        />
      </div>
    </aside>
  );
}
