import { motion } from 'motion/react';
import { CalendarDays, CheckCircle2, Copy, MapPin, Ticket } from 'lucide-react';
import { LinkButton } from '@/components/Button';
import { EventImage } from '@/components/EventImage';
import { useToast } from '@/hooks/useToast';
import { formatEventDate, formatEventTime, formatPrice } from '@/lib/format';
import type { KEvent } from '@/types/event';
import type { Registration } from '@/types/registration';

interface RegistrationSuccessProps {
  event: KEvent;
  registration: Registration;
}

export function RegistrationSuccess({ event, registration }: RegistrationSuccessProps) {
  const notify = useToast();

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(registration.id);
      notify('Registration ID copied', 'success');
    } catch {
      notify('Could not copy automatically. Please note the ID above.', 'error');
    }
  };

  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 16 }}
        className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden="true" />
      </motion.div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-crimson">Registration confirmed</p>
      <h1 className="mt-3 text-balance text-3xl font-bold text-ink sm:text-4xl">You are in, {registration.name.split(' ')[0]}.</h1>
      <p className="mt-3 text-muted">A seat for {event.title} is reserved under your name.</p>

      <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-surface text-left shadow-card">
        <div className="flex flex-col sm:flex-row">
          <EventImage src={event.poster} alt={event.title} className="aspect-[2/3] w-full sm:aspect-auto sm:w-48 sm:shrink-0" zoomOnHover={false} />
          <div className="flex flex-1 flex-col gap-4 p-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">Registration ID</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-display text-2xl font-bold tracking-wider text-ink">{registration.id}</span>
                <button
                  type="button"
                  onClick={copyId}
                  className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-crimson hover:text-crimson"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Copy
                </button>
              </div>
            </div>
            <h2 className="text-xl font-bold text-ink">{event.title}</h2>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              <li className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-crimson" aria-hidden="true" />
                {formatEventDate(event)}, {formatEventTime(event)}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-crimson" aria-hidden="true" />
                {event.venue}, {event.city}
              </li>
              <li className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-crimson" aria-hidden="true" />
                {formatPrice(event.price)}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <LinkButton to="/" variant="outline" size="lg">
          Back to home
        </LinkButton>
        <LinkButton to="/my-registrations" variant="primary" size="lg">
          View my registrations
        </LinkButton>
      </div>
    </div>
  );
}
