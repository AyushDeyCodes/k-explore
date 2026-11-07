import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { EventImage } from '@/components/EventImage';
import { Button } from '@/components/Button';
import { formatEventDate, formatEventTime } from '@/lib/format';
import type { KEvent } from '@/types/event';
import type { Registration } from '@/types/registration';

interface RegistrationCardProps {
  registration: Registration;
  event: KEvent | undefined;
  onCancel: (registration: Registration) => void;
}

const STATUS_STYLE: Record<Registration['status'], string> = {
  confirmed: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  cancelled: 'bg-elevated text-muted',
};

export function RegistrationCard({ registration, event, onCancel }: RegistrationCardProps) {
  const cancelled = registration.status === 'cancelled';
  const eventPast = event ? new Date(event.date).getTime() < Date.now() - 86_400_000 : false;

  return (
    <article className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:p-5">
      {event ? (
        <Link to={`/event/${event.id}`} className="group w-28 shrink-0 self-start sm:w-32">
          <EventImage src={event.poster} alt={event.title} className="aspect-[2/3] w-full rounded-xl" />
        </Link>
      ) : (
        <div className="aspect-[2/3] w-28 shrink-0 rounded-xl bg-elevated sm:w-32" aria-hidden="true" />
      )}

      <div className="flex min-w-0 flex-1 flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">{event?.category ?? 'Event'}</p>
            <h2 className="mt-1 text-lg font-bold text-ink sm:text-xl">{event?.title ?? 'Event unavailable'}</h2>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_STYLE[registration.status]}`}>
            {registration.status}
          </span>
        </div>

        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">Registration ID</dt>
            <dd className="mt-1 font-display font-bold tracking-wider text-ink">{registration.id}</dd>
          </div>
          {event && (
            <>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Date and time</dt>
                <dd className="mt-1 flex items-center gap-2 text-ink">
                  <CalendarDays className="h-4 w-4 text-crimson" aria-hidden="true" />
                  {formatEventDate(event)}, {formatEventTime(event)}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-[0.14em] text-muted">Venue</dt>
                <dd className="mt-1 flex items-center gap-2 text-ink">
                  <MapPin className="h-4 w-4 text-crimson" aria-hidden="true" />
                  {event.venue}, {event.city}
                </dd>
              </div>
            </>
          )}
        </dl>

        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          {event && (
            <Link
              to={`/event/${event.id}`}
              className="inline-flex h-10 items-center rounded-full border border-line px-5 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              View event
            </Link>
          )}
          {!cancelled && !eventPast && (
            <Button variant="ghost" size="sm" onClick={() => onCancel(registration)} className="text-crimson hover:bg-crimson/10">
              Cancel registration
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
