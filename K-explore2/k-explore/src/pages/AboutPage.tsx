import { CalendarCheck, Search, Ticket } from 'lucide-react';
import { LinkButton } from '@/components/Button';
import { SectionHeader } from '@/components/SectionHeader';

const STEPS = [
  { icon: Search, title: 'Discover', text: 'Browse featured and trending events, or search and filter by category, date and price.' },
  { icon: Ticket, title: 'Register', text: 'Pick an event, enter your name, email and mobile number, and confirm in seconds.' },
  { icon: CalendarCheck, title: 'Experience', text: 'Use your registration ID on event day and manage everything from My Registrations.' },
];

export function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="About K Explore"
        title="Discover. Experience. Register."
        description="K Explore is a cinematic home for conferences, concerts, workshops and campus nights. We make it easy to find what is happening and save your seat in a few taps."
      />

      <ol className="grid gap-4 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="rounded-2xl border border-line bg-surface p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-crimson/15 text-crimson">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted">Step {index + 1}</p>
            <h3 className="mt-1 text-lg font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ol>

      <section id="privacy" className="mt-16 scroll-mt-24">
        <h2 className="text-2xl font-bold text-ink">Privacy</h2>
        <p className="mt-3 leading-7 text-muted">
          There are no accounts on K Explore. Your browser keeps a random private token so we can show you your own
          registrations and favourites. We only use the details you enter to confirm a registration, and we never show
          one visitor's details to another.
        </p>
      </section>

      <section id="terms" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-bold text-ink">Terms</h2>
        <p className="mt-3 leading-7 text-muted">
          K Explore is a demonstration project. The events shown are sample listings, no payment is collected, and a
          registration is a reservation of a seat only. Registration closes at each event's deadline or when it is fully
          booked.
        </p>
      </section>

      <div className="mt-12">
        <LinkButton to="/explore" size="lg">
          Start exploring
        </LinkButton>
      </div>
    </div>
  );
}
