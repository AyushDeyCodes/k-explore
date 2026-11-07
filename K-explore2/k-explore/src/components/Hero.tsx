import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { CategoryBadge } from '@/components/CategoryBadge';
import { EventImage } from '@/components/EventImage';
import { FavouriteButton } from '@/components/FavouriteButton';
import { LinkButton } from '@/components/Button';
import { formatEventDate, formatEventTime, formatPrice } from '@/lib/format';
import type { KEvent } from '@/types/event';

const AUTOPLAY_MS = 7000;

interface HeroProps {
  events: KEvent[];
}

export function Hero({ events }: HeroProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = events.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const id = window.setInterval(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (count === 0) return null;
  const event = events[index % count];

  const go = (step: number) => setIndex((current) => (current + step + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured events"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative isolate flex min-h-[640px] items-end overflow-hidden pt-16 sm:min-h-[680px] lg:h-[74vh] lg:min-h-[600px]"
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={event.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          className="absolute inset-0 -z-10"
        >
          <EventImage
            src={event.coverImage}
            alt={event.title}
            eager
            zoomOnHover={false}
            className="h-full w-full"
            imgClassName="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-base via-base/70 to-base/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-base via-transparent to-base/40" />

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl text-white"
          >
            <div className="flex flex-wrap items-center gap-3">
              <CategoryBadge category={event.category} />
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">Featured</span>
            </div>
            <h1 className="mt-5 text-balance text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">{event.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/85 sm:text-base">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-crimson" aria-hidden="true" />
                {formatEventDate(event)}, {formatEventTime(event)}
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-crimson" aria-hidden="true" />
                {event.venue}, {event.city}
              </span>
            </div>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">{event.shortDescription}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <LinkButton to={`/event/${event.id}`} variant="onDark" size="lg">
                Explore Event
              </LinkButton>
              <LinkButton to={`/register/${event.id}`} variant="primary" size="lg">
                Register Now · {formatPrice(event.price)}
              </LinkButton>
              <FavouriteButton eventId={event.id} title={event.title} variant="inline" className="border-white/40 text-white hover:border-crimson" />
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white hover:bg-white/10"
            aria-label="Previous featured event"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2" role="tablist" aria-label="Choose featured event">
            {events.map((item, i) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={i === index}
                onClick={() => setIndex(i)}
                aria-label={`Show ${item.title}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index ? 'w-10 bg-crimson' : 'w-4 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-white transition-colors hover:border-white hover:bg-white/10"
            aria-label="Next featured event"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="ml-2 hidden text-sm text-white/60 sm:inline">
            {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
