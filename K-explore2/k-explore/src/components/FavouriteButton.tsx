import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import { useFavourites } from '@/hooks/useFavourites';

interface FavouriteButtonProps {
  eventId: string;
  title: string;
  variant?: 'floating' | 'inline';
  className?: string;
}

export function FavouriteButton({ eventId, title, variant = 'floating', className = '' }: FavouriteButtonProps) {
  const { isFavourite, toggleFavourite, isLoading } = useFavourites();
  const active = isFavourite(eventId);

  const base =
    variant === 'floating'
      ? 'flex h-10 w-10 items-center justify-center rounded-full bg-base/80 text-ink ring-1 ring-line backdrop-blur-sm transition-colors hover:ring-crimson'
      : 'inline-flex h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-semibold text-ink transition-colors hover:border-crimson hover:text-crimson';

  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleFavourite(eventId, title);
      }}
      disabled={isLoading}
      aria-pressed={active}
      aria-label={active ? `Remove ${title} from favourites` : `Add ${title} to favourites`}
      className={`${base} disabled:opacity-60 ${className}`}
    >
      <motion.span
        key={String(active)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 18 }}
        className="flex"
      >
        <Heart
          className={`h-4 w-4 transition-colors ${active ? 'fill-crimson text-crimson' : ''}`}
          aria-hidden="true"
        />
      </motion.span>
      {variant === 'inline' && <span>{active ? 'Saved to favourites' : 'Add to favourites'}</span>}
    </motion.button>
  );
}
