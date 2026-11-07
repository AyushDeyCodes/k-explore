import { useState } from 'react';
import { AlertTriangle, Ticket } from 'lucide-react';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { Modal } from '@/components/Modal';
import { RegistrationCard } from '@/components/RegistrationCard';
import { SectionHeader } from '@/components/SectionHeader';
import { Skeleton } from '@/components/Skeleton';
import { useMyRegistrations } from '@/hooks/useMyRegistrations';
import { getEventById } from '@/services/eventService';
import type { Registration } from '@/types/registration';

export function MyRegistrationsPage() {
  const { registrations, state, cancel, reload } = useMyRegistrations();
  const [pending, setPending] = useState<Registration | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const confirmCancel = async () => {
    if (!pending) return;
    setCancelling(true);
    await cancel(pending.id);
    setCancelling(false);
    setPending(null);
  };

  const pendingEvent = pending ? getEventById(pending.eventId) : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Your tickets"
        title="My registrations"
        description="Registrations made from this browser. Keep your registration ID handy for event day."
      />

      {state === 'loading' && (
        <div className="flex flex-col gap-4" role="status" aria-label="Loading registrations">
          {[0, 1].map((key) => (
            <Skeleton key={key} className="h-56 w-full" rounded="rounded-2xl" />
          ))}
        </div>
      )}

      {state === 'error' && (
        <EmptyState
          icon={AlertTriangle}
          tone="error"
          title="We could not load your registrations"
          description="Check your connection and try again."
          action={{ label: 'Try again', onClick: reload }}
        />
      )}

      {state === 'ready' && registrations.length === 0 && (
        <EmptyState
          icon={Ticket}
          title="No registrations yet"
          description="When you register for an event it will show up here, so you can find your registration ID any time."
          action={{ label: 'Explore events', to: '/explore' }}
        />
      )}

      {state === 'ready' && registrations.length > 0 && (
        <div className="flex flex-col gap-4">
          {registrations.map((registration) => (
            <RegistrationCard
              key={registration.id}
              registration={registration}
              event={getEventById(registration.eventId)}
              onCancel={setPending}
            />
          ))}
        </div>
      )}

      <Modal
        open={pending !== null}
        onClose={() => (cancelling ? undefined : setPending(null))}
        title="Cancel this registration?"
        description={
          pendingEvent
            ? `Your seat for ${pendingEvent.title} will be released. You can register again later if seats are available.`
            : 'Your seat will be released.'
        }
        size="sm"
      >
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setPending(null)} disabled={cancelling}>
            Keep registration
          </Button>
          <Button onClick={confirmCancel} loading={cancelling}>
            Yes, cancel it
          </Button>
        </div>
      </Modal>
    </div>
  );
}
