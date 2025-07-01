import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as UnfilledStarIcon } from '@heroicons/react/24/outline';

interface RatingProps {
  id: string;
  loading?: boolean;
  value: number;
  handleClick?: (index: number) => void;
}

export const Rating = ({ id, loading, value, handleClick }: RatingProps) => {
  const MAX_RATING = 5;
  const fullStars = Math.floor(value);
  const hasHalf = value - fullStars !== 0;
  const halfStars = hasHalf ? 1 : 0;
  const emptyStars = MAX_RATING - fullStars - halfStars;
  const starComponents: Array<typeof StarIcon | typeof HalfStar | typeof UnfilledStarIcon> = [
    ...(Array.from({ length: fullStars }).fill(StarIcon) as Array<typeof StarIcon>),
    ...(Array.from({ length: halfStars }).fill(HalfStar) as Array<typeof HalfStar>),
    ...(Array.from({ length: emptyStars }).fill(UnfilledStarIcon) as Array<typeof UnfilledStarIcon>),
  ];

  return (
    <div className="flex flex-row gap-1">
      {starComponents.map((El, i) => {
        const renderKey = `${id}-${i}`;
        // If a click handler is present, wrap the element in a button and attach the handler
        return handleClick ? (
          <button
            key={renderKey}
            className="enabled:cursor-pointer hover:text-amber-400 disabled:opacity-75"
            onClick={() => handleClick(i)}
            disabled={loading}
          >
            <El className="size-5" />
            <span className="sr-only">Rate {i + 1} stars</span>
          </button>
        ) : (
          <El key={renderKey} className="size-5" />
        );
      })}
    </div>
  );
};

// Heroicons doesn't include a half star icon, so I'm faking one here
const HalfStar = () => {
  return (
    <span className="block relative size-5">
      <UnfilledStarIcon className="absolute inset-0" />
      <span className="absolute inset-0 w-1/2 overflow-hidden">
        <StarIcon className="size-5" />
      </span>
    </span>
  );
};
