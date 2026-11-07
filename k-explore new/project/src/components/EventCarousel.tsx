import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface EventCarouselProps {
  label: string;
  children: ReactNode;
}

export function EventCarousel({ label, children }: EventCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
  };

  const arrowClass =
    'flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:border-crimson hover:text-crimson';

  return (
    <div className="relative">
      <div
        ref={trackRef}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 gap-2 lg:flex">
        <button type="button" onClick={() => scrollBy(-1)} className={`${arrowClass} pointer-events-auto`} aria-label="Scroll left">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button type="button" onClick={() => scrollBy(1)} className={`${arrowClass} pointer-events-auto`} aria-label="Scroll right">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
