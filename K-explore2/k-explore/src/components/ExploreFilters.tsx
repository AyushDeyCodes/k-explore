import { useState } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { DATE_RANGES, PRICE_RANGES, SORT_OPTIONS, type EventFilters } from '@/lib/eventFilters';
import { EVENT_CATEGORIES } from '@/types/event';

interface ExploreFiltersProps {
  filters: EventFilters;
  onChange: (patch: Partial<EventFilters>) => void;
  onClear: () => void;
  activeCount: number;
}

const SELECT_CLASS =
  'h-11 w-full rounded-full border border-line bg-surface px-4 text-sm text-ink transition-colors hover:border-ink focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/30';

export function ExploreFilters({ filters, onChange, onClear, activeCount }: ExploreFiltersProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <CategoryFilter
        value={filters.category}
        onChange={(category) => onChange({ category })}
        categories={EVENT_CATEGORIES}
        label="Filter events by category"
      />
      <div className="flex items-center justify-between gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="h-10 rounded-full border border-line px-4 text-sm font-semibold text-ink"
        >
          {open ? 'Hide filters' : 'More filters'}
          {activeCount > 0 && ` (${activeCount})`}
        </button>
        {activeCount > 0 && (
          <button type="button" onClick={onClear} className="text-sm font-semibold text-crimson">
            Clear all
          </button>
        )}
      </div>
      <div className={`${open ? 'grid' : 'hidden'} gap-3 md:grid md:grid-cols-[repeat(3,minmax(0,1fr))_auto_auto] md:items-center`}>
        <label className="flex flex-col gap-1.5 md:contents">
          <span className="sr-only">Date</span>
          <select className={SELECT_CLASS} value={filters.date} onChange={(e) => onChange({ date: e.target.value as EventFilters['date'] })}>
            {Object.entries(DATE_RANGES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 md:contents">
          <span className="sr-only">Price</span>
          <select className={SELECT_CLASS} value={filters.price} onChange={(e) => onChange({ price: e.target.value as EventFilters['price'] })}>
            {Object.entries(PRICE_RANGES).map(([key, meta]) => (
              <option key={key} value={key}>{meta.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 md:contents">
          <span className="sr-only">Sort by</span>
          <select className={SELECT_CLASS} value={filters.sort} onChange={(e) => onChange({ sort: e.target.value as EventFilters['sort'] })}>
            {Object.entries(SORT_OPTIONS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </label>
        <label className="flex h-11 cursor-pointer items-center gap-3 rounded-full border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:border-ink">
          <input
            type="checkbox"
            checked={filters.freeOnly}
            onChange={(e) => onChange({ freeOnly: e.target.checked })}
            className="h-4 w-4 accent-crimson"
          />
          Free events
        </label>
        <button
          type="button"
          onClick={onClear}
          disabled={activeCount === 0}
          className="hidden h-11 rounded-full px-4 text-sm font-semibold text-crimson transition-opacity disabled:opacity-40 md:block"
        >
          Clear all
        </button>
      </div>
    </div>
  );
}
