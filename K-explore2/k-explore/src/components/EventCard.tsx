import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { EventImage } from '@/components/EventImage';
import { CategoryBadge } from '@/components/CategoryBadge';
import { FavouriteButton } from '@/components/FavouriteButton';
import { formatEventDate, formatPrice } from '@/lib/format';
import type { KEvent } from '@/types/event';

interface EventCardProps {
  event: KEvent;
  className?: string;
}

export function EventCard({ event, className = '' }: EventCardProps) {
  return (
    <article className={`group relative ${className}`}>
      <Link
        to={`/event/${event.id}`}
        className="relative block aspect-[2/3] overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-crimson/50"
      >
        <EventImage src={event.poster} alt={event.title} className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-4 text-white">
          <CategoryBadge category={event.category} className="self-start" />
          <h3 className="line-clamp-2 text-lg font-bold leading-snug sm:text-xl">{event.title}</h3>
          <p className="line-clamp-2 max-h-0 text-sm text-white/80 opacity-0 transition-all duration-300 group-hover:max-h-12 group-hover:opacity-100">
            {event.shortDescription}
          </p>
          <div className="flex flex-col gap-1 text-xs text-white/85 sm:text-sm">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {formatEventDate(event)}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{event.venue}</span>
            </span>
          </div>
          <span className="pt-1 text-sm font-semibold text-white">{formatPrice(event.price)}</span>
        </div>
      </Link>
      <div className="absolute right-3 top-3 z-10">
        <FavouriteButton eventId={event.id} title={event.title} />
      </div>
    </article>
  );
}
