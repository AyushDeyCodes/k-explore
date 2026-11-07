import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { EventCard } from '@/components/EventCard';
import { ExploreFilters } from '@/components/ExploreFilters';
import { SearchBar } from '@/components/SearchBar';
import { SectionHeader } from '@/components/SectionHeader';
import { EVENTS } from '@/data/events';
import {
  applyEventFilters,
  countActiveFilters,
  parseFilters,
  serializeFilters,
  type EventFilters,
} from '@/lib/eventFilters';

export function ExplorePage() {
  const [params, setParams] = useSearchParams();
  // The URL is the single source of truth, so filters survive refresh and can be shared as links.
  const filters = useMemo(() => parseFilters(params), [params]);
  const results = useMemo(() => applyEventFilters(EVENTS, filters), [filters]);
  const activeCount = countActiveFilters(filters);

  const update = (patch: Partial<EventFilters>) => {
    setParams(serializeFilters({ ...filters, ...patch }), { replace: true });
  };
  const clear = () => setParams(new URLSearchParams(), { replace: true });

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <SectionHeader
        eyebrow="Discover"
        title="Explore events"
        description="Search by name, venue or city, then narrow down by category, date and price."
      />

      <div className="mb-8 flex flex-col gap-5">
        <SearchBar
          value={filters.query}
          onChange={(query) => update({ query })}
          className="max-w-xl"
        />
        <ExploreFilters filters={filters} onChange={update} onClear={clear} activeCount={activeCount} />
      </div>

      <p className="mb-5 text-sm text-muted" aria-live="polite">
        {results.length} {results.length === 1 ? 'event' : 'events'} found
      </p>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={SearchX}
          title="No events match your filters"
          description="Try a different search term, or clear the filters to see everything that is coming up."
          action={{ label: 'Clear all filters', onClick: clear }}
        />
      )}
    </div>
  );
}
