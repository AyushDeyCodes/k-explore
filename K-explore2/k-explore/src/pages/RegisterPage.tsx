import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, CalendarX, MapPin, Ticket } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { EventImage } from '@/components/EventImage';
import { RegistrationForm } from '@/components/RegistrationForm';
import { RegistrationSuccess } from '@/components/RegistrationSuccess';
import { SectionHeader } from '@/components/SectionHeader';
import { useToast } from '@/hooks/useToast';
import { formatDeadline, formatEventDate, formatEventTime, formatPrice } from '@/lib/format';
import type { RegistrationFormValues } from '@/lib/validation';
import { getEventById } from '@/services/eventService';
import { isEventOpenForRegistration, registerForEvent, RegistrationError } from '@/services/registrationService';
import type { Registration } from '@/types/registration';
import { NotFoundPage } from '@/pages/NotFoundPage';

export function RegisterPage() {
  const { id } = useParams();
  const event = id ? getEventById(id) : undefined;
  const notify = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<Registration | null>(null);

  if (!event) return <NotFoundPage />;

  const handleSubmit = async (values: RegistrationFormValues) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await registerForEvent({ eventId: event.id, ...values });
      setRegistration(created);
      notify('Registration confirmed', 'success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (error instanceof RegistrationError) setSubmitError(error.message);
      else setSubmitError('Something went wrong while saving your registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const shell = 'mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8';

  if (registration) {
    return (
      <div className={shell}>
        <RegistrationSuccess event={event} registration={registration} />
      </div>
    );
  }

  if (!isEventOpenForRegistration(event.id)) {
    return (
      <div className={`${shell} max-w-2xl`}>
        <EmptyState
          icon={CalendarX}
          title="Registration has closed"
          description={`Registration for ${event.title} ended on ${formatDeadline(event.registrationDeadline)}. Explore other events that are still open.`}
          action={{ label: 'Explore events', to: '/explore' }}
        />
      </div>
    );
  }

  return (
    <div className={shell}>
      <Link
        to={`/event/${event.id}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to event
      </Link>
      <SectionHeader
        eyebrow="Save your spot"
        title="Register for this event"
        description={`Registration closes ${formatDeadline(event.registrationDeadline)}.`}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
          <div className="mb-6 flex flex-col gap-2">
            <label htmlFor="reg-event" className="text-sm font-semibold text-ink">
              Selected event
            </label>
            <input
              id="reg-event"
              readOnly
              value={event.title}
              className="h-12 w-full cursor-default rounded-xl border border-line bg-elevated px-4 text-base font-medium text-ink focus:outline-none"
            />
          </div>
          <RegistrationForm submitting={submitting} submitError={submitError} onSubmit={handleSubmit} />
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Event summary">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
            <EventImage src={event.coverImage} alt={event.title} className="aspect-[16/10] w-full" zoomOnHover={false} />
            <div className="flex flex-col gap-4 p-6">
              <h2 className="text-xl font-bold text-ink">{event.title}</h2>
              <ul className="flex flex-col gap-3 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-crimson" aria-hidden="true" />
                  {formatEventDate(event)}, {formatEventTime(event)}
                </li>
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-crimson" aria-hidden="true" />
                  {event.venue}, {event.city}
                </li>
                <li className="flex items-start gap-2">
                  <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-crimson" aria-hidden="true" />
                  {formatPrice(event.price)}
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
