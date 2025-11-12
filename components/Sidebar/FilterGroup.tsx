```typescript
'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils/helpers';

interface FilterOption {
  value: string;
  label: string;
  icon?: string;
  color?: string;
}

interface FilterGroupProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggle: (value: string) => void;
}

export function FilterGroup({
  title,
  options,
  selectedValues,
  onToggle,
}: FilterGroupProps) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedValues.includes(option.value)}
              onCheckedChange={() => onToggle(option.value)}
            />
            <span className="flex items-center gap-2 text-sm text-gray-700 group-hover:text-gray-900">
              {option.icon && <span>{option.icon}</span>}
              {option.color && (
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: option.color }}
                />
              )}
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
