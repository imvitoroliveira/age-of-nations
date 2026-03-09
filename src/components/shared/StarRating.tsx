import { Star } from 'lucide-react';

interface StarRatingProps {
  count: number;
  max?: number;
  size?: number;
}

export const StarRating = ({ count, max = 3, size = 24 }: StarRatingProps) => (
  <div className="flex gap-1">
    {Array.from({ length: max }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={i < count ? 'fill-kid-yellow text-kid-yellow star-glow' : 'text-muted'}
      />
    ))}
  </div>
);
