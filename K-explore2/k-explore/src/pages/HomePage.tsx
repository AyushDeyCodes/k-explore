import { ArrowRight } from 'lucide-react';
import { CategoryTiles } from '@/components/CategoryTiles';
import { EventCard } from '@/components/EventCard';
import { EventCarousel } from '@/components/EventCarousel';
import { Hero } from '@/components/Hero';
import { LinkButton } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { SectionHeader } from '@/components/SectionHeader';
import { getUpcomingEvents } from '@/services/eventService';

export function HomePage() {
  const upcoming = getUpcomingEvents();
  const featured = upcoming.filter((event) => event.featured).slice(0, 5);
  const trending = upcoming
    .filter((event) => event.trending)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 10);
  const comingUp = upcoming.slice(0, 8);

  return (
    <>
      <Hero events={featured.length > 0 ? featured : upcoming.slice(0, 4)} />

      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
        <Reveal>
          <section className="mb-20">
            <SectionHeader
              eyebrow="The crowd favourites"
              title="Trending right now"
              description="The events everyone is talking about. Swipe through and save your seat before they fill up."
              action={{ label: 'Explore all events', to: '/explore' }}
            />
            <EventCarousel label="Trending events">
              {trending.map((event) => (
                <div key={event.id} className="w-44 shrink-0 snap-start sm:w-52 lg:w-60">
                  <EventCard event={event} />
                </div>
              ))}
            </EventCarousel>
          </section>
        </Reveal>

        <Reveal>
          <section id="categories" className="mb-20 scroll-mt-24">
            <SectionHeader
              eyebrow="Find your vibe"
              title="Explore by category"
              description="From big ideas to unforgettable nights. Pick a category and jump straight in."
            />
            <CategoryTiles />
          </section>
        </Reveal>

        <Reveal>
          <section>
            <SectionHeader
              eyebrow="Mark your calendar"
              title="Coming up next"
              description="Upcoming events, soonest first."
              action={{ label: 'View all events', to: '/explore' }}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {comingUp.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal>
          <section className="mt-20 overflow-hidden rounded-3xl border border-line bg-surface px-6 py-12 text-center sm:px-12 sm:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crimson">Ready when you are</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-balance text-3xl font-bold text-ink sm:text-4xl">
              Your next favourite memory is one registration away.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">
              No account needed. Pick an event, fill in your details and get your registration ID instantly.
            </p>
            <div className="mt-8 flex justify-center">
              <LinkButton to="/explore" size="lg" icon={ArrowRight}>
                Browse all events
              </LinkButton>
            </div>
          </section>
        </Reveal>
      </div>
    </>
  );
}
