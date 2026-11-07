import { AlertTriangle, Heart } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { EventCard } from '@/components/EventCard';
import { SectionHeader } from '@/components/SectionHeader';
import { PosterSkeleton } from '@/components/Skeleton';
import { EVENTS } from '@/data/events';
import { useFavourites } from '@/hooks/useFavourites';

export function FavouritesPage() {
  const { favouriteIds, isLoading, loadError, retry } = useFavourites();
  const saved = EVENTS.filter((event) => favouriteIds.has(event.id));

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Saved for later"
        title="Your favourites"
        description="Tap the heart on any event to keep it here."
      />

      {isLoading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((key) => (
            <PosterSkeleton key={key} />
          ))}
        </div>
      )}

      {!isLoading && loadError && (
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          title="We could not load your favourites"
          description={loadError}
          action={{ label: 'Try again', onClick: retry }}
        />
      )}

      {!isLoading && !loadError && saved.length === 0 && (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          description="Found something you like? Save it with the heart icon and it will wait for you here."
          action={{ label: 'Explore events', to: '/explore' }}
        />
      )}

      {!isLoading && !loadError && saved.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {saved.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
