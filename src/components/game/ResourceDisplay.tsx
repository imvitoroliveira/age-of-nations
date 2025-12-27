import { Resources } from '@/types/game';
import { cn } from '@/lib/utils';

interface ResourceDisplayProps {
  resources: Resources;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

const resourceConfig = {
  wood: {
    icon: '🪵',
    label: 'Madeira',
    className: 'resource-wood',
  },
  food: {
    icon: '🌾',
    label: 'Comida',
    className: 'resource-food',
  },
  gold: {
    icon: '🪙',
    label: 'Ouro',
    className: 'resource-gold',
  },
  stone: {
    icon: '🪨',
    label: 'Pedra',
    className: 'resource-stone',
  },
};

const sizeClasses = {
  sm: {
    container: 'gap-2',
    item: 'gap-1 px-2 py-1',
    icon: 'text-sm',
    text: 'text-xs',
  },
  md: {
    container: 'gap-3',
    item: 'gap-2 px-3 py-1.5',
    icon: 'text-base',
    text: 'text-sm',
  },
  lg: {
    container: 'gap-4',
    item: 'gap-2 px-4 py-2',
    icon: 'text-lg',
    text: 'text-base',
  },
};

export const ResourceDisplay = ({
  resources,
  size = 'md',
  showLabels = false,
}: ResourceDisplayProps) => {
  const sizes = sizeClasses[size];

  return (
    <div className={cn('flex items-center', sizes.container)}>
      {(Object.entries(resources) as [keyof Resources, number][]).map(([type, amount]) => {
        const config = resourceConfig[type];
        return (
          <div
            key={type}
            className={cn(
              'flex items-center rounded-md bg-muted/50 border border-border/50',
              sizes.item
            )}
            title={config.label}
          >
            <span className={sizes.icon}>{config.icon}</span>
            {showLabels && (
              <span className={cn('text-muted-foreground', sizes.text)}>{config.label}:</span>
            )}
            <span className={cn('font-semibold text-foreground', sizes.text)}>
              {amount.toLocaleString()}
            </span>
          </div>
        );
      })}
    </div>
  );
};

interface ResourceIconProps {
  type: keyof Resources;
  className?: string;
}

export const ResourceIcon = ({ type, className }: ResourceIconProps) => {
  const config = resourceConfig[type];
  return (
    <div className={cn('resource-icon', config.className, className)}>
      {config.icon}
    </div>
  );
};
