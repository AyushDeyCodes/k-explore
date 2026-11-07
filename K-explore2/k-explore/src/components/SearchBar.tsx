import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { EVENTS } from '@/data/events';
import { getSearchSuggestions } from '@/lib/eventFilters';
import { formatEventDate } from '@/lib/format';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onNavigate?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onNavigate,
  placeholder = 'Search events, venues, cities…',
  autoFocus = false,
  className = '',
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);
  const suggestions = getSearchSuggestions(EVENTS, value);
  const showSuggestions = focused && value.trim().length > 0;

  return (
    <div className={`relative w-full ${className}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.(value.trim());
        }}
        className="relative"
      >
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input
          type="search"
          value={value}
          autoFocus={autoFocus}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          aria-label="Search events"
          autoComplete="off"
          className="h-12 w-full rounded-full border border-line bg-surface pl-12 pr-11 text-base text-ink placeholder:text-muted transition-colors focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/30 [&::-webkit-search-cancel-button]:appearance-none"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted transition-colors hover:text-ink"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-line bg-surface shadow-card">
          {suggestions.length > 0 ? (
            <ul className="divide-y divide-line">
              {suggestions.map((event) => (
                <li key={event.id}>
                  <Link
                    to={`/event/${event.id}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      onNavigate?.();
                      onChange('');
                    }}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-elevated"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink">{event.title}</span>
                      <span className="block truncate text-xs text-muted">
                        {event.category} · {event.city}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs text-muted">{formatEventDate(event)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-sm text-muted">No events match “{value.trim()}”. Try a city or category.</p>
          )}
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSubmit?.(value.trim())}
            className="block w-full border-t border-line px-4 py-3 text-left text-sm font-semibold text-crimson transition-colors hover:bg-elevated"
          >
            See all results for “{value.trim()}”
          </button>
        </div>
      )}
    </div>
  );
}
