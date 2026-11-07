import { EVENT_CATEGORIES, type EventCategory, type KEvent } from '@/types/event';
import { getEventStart } from '@/lib/format';

export const DATE_RANGES = {
  any: { label: 'Any date', days: null },
  '7d': { label: 'Next 7 days', days: 7 },
  '30d': { label: 'Next 30 days', days: 30 },
  '90d': { label: 'Next 3 months', days: 90 },
} as const;

export const PRICE_RANGES = {
  any: { label: 'Any price' },
  under500: { label: 'Under ₹500' },
  '500to1500': { label: '₹500 to ₹1,500' },
  above1500: { label: 'Above ₹1,500' },
} as const;

export const SORT_OPTIONS = {
  upcoming: 'Upcoming first',
  popularity: 'Most popular',
  alphabetical: 'Alphabetical',
  price: 'Price: low to high',
} as const;

export type DateRangeKey = keyof typeof DATE_RANGES;
export type PriceRangeKey = keyof typeof PRICE_RANGES;
export type SortKey = keyof typeof SORT_OPTIONS;

export interface EventFilters {
  query: string;
  category: EventCategory | 'all';
  date: DateRangeKey;
  price: PriceRangeKey;
  freeOnly: boolean;
  sort: SortKey;
}

export const DEFAULT_FILTERS: EventFilters = {
  query: '',
  category: 'all',
  date: 'any',
  price: 'any',
  freeOnly: false,
  sort: 'upcoming',
};

function isOneOf<T extends string>(value: string | null, options: readonly T[] | Record<T, unknown>): value is T {
  if (value === null) return false;
  const list = Array.isArray(options) ? options : Object.keys(options);
  return (list as string[]).includes(value);
}

export function parseFilters(params: URLSearchParams): EventFilters {
  const category = params.get('category');
  const date = params.get('date');
  const price = params.get('price');
  const sort = params.get('sort');
  return {
    query: params.get('q') ?? '',
    category: isOneOf(category, EVENT_CATEGORIES) ? category : 'all',
    date: isOneOf(date, DATE_RANGES) ? date : 'any',
    price: isOneOf(price, PRICE_RANGES) ? price : 'any',
    freeOnly: params.get('free') === '1',
    sort: isOneOf(sort, SORT_OPTIONS) ? sort : 'upcoming',
  };
}

export function serializeFilters(filters: EventFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set('q', filters.query.trim());
  if (filters.category !== 'all') params.set('category', filters.category);
  if (filters.date !== 'any') params.set('date', filters.date);
  if (filters.price !== 'any') params.set('price', filters.price);
  if (filters.freeOnly) params.set('free', '1');
  if (filters.sort !== 'upcoming') params.set('sort', filters.sort);
  return params;
}

export function countActiveFilters(filters: EventFilters): number {
  return [
    filters.query.trim() !== '',
    filters.category !== 'all',
    filters.date !== 'any',
    filters.price !== 'any',
    filters.freeOnly,
  ].filter(Boolean).length;
}

export function matchesQuery(event: KEvent, query: string): boolean {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return true;
  const haystack = [event.title, event.category, event.venue, event.city, ...event.tags]
    .join(' ')
    .toLowerCase();
  return tokens.every((token) => haystack.includes(token));
}

function matchesPrice(event: KEvent, range: PriceRangeKey): boolean {
  switch (range) {
    case 'under500':
      return event.price < 500;
    case '500to1500':
      return event.price >= 500 && event.price <= 1500;
    case 'above1500':
      return event.price > 1500;
    default:
      return true;
  }
}

function matchesDate(event: KEvent, range: DateRangeKey, now: Date): boolean {
  const start = getEventStart(event).getTime();
  const days = DATE_RANGES[range].days;
  if (days === null) return true;
  return start >= now.getTime() && start <= now.getTime() + days * 86_400_000;
}

export function applyEventFilters(events: KEvent[], filters: EventFilters, now: Date = new Date()): KEvent[] {
  const filtered = events.filter((event) => {
    if (getEventStart(event).getTime() < now.getTime() - 86_400_000) return false;
    if (filters.category !== 'all' && event.category !== filters.category) return false;
    if (!matchesQuery(event, filters.query)) return false;
    if (!matchesDate(event, filters.date, now)) return false;
    if (!matchesPrice(event, filters.price)) return false;
    if (filters.freeOnly && event.price !== 0) return false;
    return true;
  });
  return sortEvents(filtered, filters.sort);
}

export function sortEvents(events: KEvent[], sort: SortKey): KEvent[] {
  const copy = [...events];
  switch (sort) {
    case 'popularity':
      return copy.sort((a, b) => b.popularity - a.popularity);
    case 'alphabetical':
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case 'price':
      return copy.sort((a, b) => a.price - b.price || a.title.localeCompare(b.title));
    default:
      return copy.sort((a, b) => getEventStart(a).getTime() - getEventStart(b).getTime());
  }
}

export function getSearchSuggestions(events: KEvent[], query: string, limit = 5): KEvent[] {
  if (!query.trim()) return [];
  return events.filter((event) => matchesQuery(event, query)).slice(0, limit);
}
