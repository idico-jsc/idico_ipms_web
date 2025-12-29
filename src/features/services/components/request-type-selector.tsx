import { useTranslation } from 'react-i18next';
import { Hammer, Zap, Shield, Wifi, LucideIcon } from 'lucide-react';
import { Card } from '@/components/atoms/card';
import { cn } from '@/utils';
import type { RequestType } from '@/types/service-request.types';

interface RequestTypeSelectorProps {
  value: RequestType;
  onChange: (value: RequestType) => void;
  error?: string;
}

interface TypeOption {
  value: RequestType;
  icon: LucideIcon;
  labelKey: string;
  descriptionKey: string;
}

export function RequestTypeSelector({ value, onChange, error }: RequestTypeSelectorProps) {
  const { t } = useTranslation('pages');

  const getLabel = (type: RequestType) => {
    return t(`serviceRequests.requestTypes.${type}` as any);
  };

  const getDescription = (type: RequestType) => {
    return t(`serviceRequests.requestTypeDescriptions.${type}` as any);
  };

  const options: TypeOption[] = [
    {
      value: 'infrastructure',
      icon: Hammer,
      labelKey: 'serviceRequests.requestTypes.infrastructure',
      descriptionKey: 'serviceRequests.requestTypeDescriptions.infrastructure',
    },
    {
      value: 'electricity_water',
      icon: Zap,
      labelKey: 'serviceRequests.requestTypes.electricity_water',
      descriptionKey: 'serviceRequests.requestTypeDescriptions.electricity_water',
    },
    {
      value: 'security',
      icon: Shield,
      labelKey: 'serviceRequests.requestTypes.security',
      descriptionKey: 'serviceRequests.requestTypeDescriptions.security',
    },
    {
      value: 'it_internet',
      icon: Wifi,
      labelKey: 'serviceRequests.requestTypes.it_internet',
      descriptionKey: 'serviceRequests.requestTypeDescriptions.it_internet',
    },
  ];

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {options.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;

          return (
            <Card
              key={option.value}
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 hover:shadow-md',
                isSelected
                  ? 'border-2 border-primary bg-primary/5'
                  : 'border border-muted hover:border-primary/50'
              )}
              onClick={() => onChange(option.value)}
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <Icon
                  className={cn(
                    'h-8 w-8 md:h-10 md:w-10',
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
                <div>
                  <div
                    className={cn(
                      'font-medium text-sm md:text-base',
                      isSelected ? 'text-primary' : 'text-foreground'
                    )}
                  >
                    {getLabel(option.value)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getDescription(option.value)}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
