import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CheckCircle2, MapPin, Ticket, Users } from 'lucide-react';
import { CategoryBadge } from '@/components/CategoryBadge';
import { Countdown } from '@/components/Countdown';
import { EventCard } from '@/components/EventCard';
import { EventImage } from '@/components/EventImage';
import { FavouriteButton } from '@/components/FavouriteButton';
import { LinkButton } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';
import { Skeleton } from '@/components/Skeleton';
import { useSeatCounts } from '@/hooks/useSeatCounts';
import { formatDeadline, formatEventDate, formatEventTime, formatPrice, getEventStart } from '@/lib/format';
import { getEventById, getRelatedEvents } from '@/services/eventService';
import { isEventOpenForRegistration } from '@/services/registrationService';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function EventDetailPage() {
  const { id } = useParams();
  const event = id ? getEventById(id) : undefined;
  const { counts, isLoading: seatsLoading, error: seatsError } = useSeatCounts();

  if (!event) return <NotFoundPage />;

  const open = isEventOpenForRegistration(event.id);
  const taken = counts[event.id] ?? 0;
  const seatsLeft = Math.max(event.capacity - taken, 0);
  const seatsKnown = !seatsLoading && !seatsError;
  const soldOut = seatsKnown && seatsLeft === 0;
  const fewLeft = seatsKnown && seatsLeft > 0 && seatsLeft <= Math.max(5, Math.round(event.capacity * 0.1));
  const related = getRelatedEvents(event, 4);

  let ctaLabel = 'Register now';
  if (!open) ctaLabel = 'Registration closed';
  else if (soldOut) ctaLabel = 'Fully booked';

  return (
    <article>
      <section className="relative isolate flex min-h-[460px] items-end overflow-hidden pt-16 sm:min-h-[520px]">
        <EventImage
          src={event.coverImage}
          alt=""
          eager
          zoomOnHover={false}
          className="absolute inset-0 -z-10 h-full w-full"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-base via-base/70 to-base/20" />
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8">
          <Link
            to="/explore"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All events
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge category={event.category} />
            <span className="text-sm font-semibold text-white/80">{formatPrice(event.price)}</span>
          </div>
          <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {event.title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/80 sm:text-lg">{event.shortDescription}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_400px] lg:px-8">
        <div className="min-w-0">
          <h2 className="text-2xl font-bold text-ink">About this event</h2>
          <p className="mt-4 text-base leading-8 text-muted">{event.description}</p>

          <h3 className="mt-10 text-xl font-bold text-ink">Highlights</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {event.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-ink">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-crimson" aria-hidden="true" />
                <span className="text-sm leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
            {event.tags.map((tag) => (
              <li key={tag} className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Event details and registration">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Starts in</p>
            <div className="mt-3">
              <Countdown target={getEventStart(event)} />
            </div>

            <ul className="mt-6 flex flex-col gap-4 text-sm text-ink">
              <li className="flex items-start gap-3">
                <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-crimson" aria-hidden="true" />
                <span>
                  {formatEventDate(event)}
                  <span className="block text-muted">{formatEventTime(event)} IST</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-crimson" aria-hidden="true" />
                <span>
                  {event.venue}
                  <span className="block text-muted">{event.city}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-crimson" aria-hidden="true" />
                <span>
                  {formatPrice(event.price)}
                  <span className="block text-muted">Register by {formatDeadline(event.registrationDeadline)}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="mt-0.5 h-5 w-5 shrink-0 text-crimson" aria-hidden="true" />
                <span>
                  {seatsLoading ? (
                    <Skeleton className="h-4 w-28" />
                  ) : seatsKnown ? (
                    <>
                      {soldOut ? 'Fully booked' : `${seatsLeft.toLocaleString('en-IN')} seats left`}
                      {fewLeft && <span className="block font-semibold text-crimson">Filling fast</span>}
                    </>
                  ) : (
                    `Capacity ${event.capacity.toLocaleString('en-IN')}`
                  )}
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              {open && !soldOut ? (
                <LinkButton to={`/register/${event.id}`} size="lg" fullWidth>
                  {ctaLabel}
                </LinkButton>
              ) : (
                <span
                  className="inline-flex h-12 w-full cursor-not-allowed items-center justify-center rounded-full bg-elevated text-base font-semibold text-muted"
                  aria-disabled="true"
                >
                  {ctaLabel}
                </span>
              )}
              <FavouriteButton
                eventId={event.id}
                title={event.title}
                variant="inline"
                className="w-full justify-center"
              />
            </div>
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="mx-auto max-w-[1440px] px-4 pb-8 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Keep exploring" title="You might also like" />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <EventCard key={item.id} event={item} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
