import { Country, CountryId } from '@/types/game';
import { cn } from '@/lib/utils';

interface CountryFlagProps {
  country: Country;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  selected?: boolean;
  onClick?: () => void;
  showName?: boolean;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
  xl: 'text-8xl',
};

const containerSizeClasses = {
  sm: 'w-12 h-12',
  md: 'w-16 h-16',
  lg: 'w-24 h-24',
  xl: 'w-32 h-32',
};

export const CountryFlag = ({
  country,
  size = 'md',
  selected = false,
  onClick,
  showName = false,
  animated = true,
}: CountryFlagProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2 transition-all duration-300 cursor-pointer',
        onClick && 'hover:scale-110',
        selected && 'scale-110'
      )}
    >
      <div
        className={cn(
          'relative flex items-center justify-center rounded-lg transition-all duration-300',
          containerSizeClasses[size],
          selected && 'ring-4 ring-gold shadow-lg shadow-gold/30',
          onClick && 'hover:ring-2 hover:ring-gold/50',
          animated && 'flag-wave'
        )}
      >
        <span className={cn(sizeClasses[size], 'drop-shadow-lg')}>
          {country.flag}
        </span>
        {selected && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      {showName && (
        <span className={cn(
          'font-cinzel text-sm text-muted-foreground transition-colors',
          selected && 'text-gold font-semibold'
        )}>
          {country.name}
        </span>
      )}
    </div>
  );
};

interface CountryCardProps {
  country: Country;
  selected?: boolean;
  onClick?: () => void;
}

export const CountryCard = ({ country, selected = false, onClick }: CountryCardProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'game-panel p-4 cursor-pointer transition-all duration-300',
        'hover:border-gold/60 hover:shadow-lg hover:shadow-gold/10',
        selected && 'border-gold shadow-lg shadow-gold/20 scale-105',
        !selected && 'opacity-80 hover:opacity-100'
      )}
    >
      <div className="flex items-start gap-4">
        <div className="text-5xl flag-wave">{country.flag}</div>
        <div className="flex-1">
          <h3 className="font-cinzel text-lg text-gold mb-1">{country.name}</h3>
          <p className="text-sm text-muted-foreground mb-2">{country.description}</p>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-gold/20 rounded text-xs text-gold-light font-medium">
              {country.bonuses.description}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
