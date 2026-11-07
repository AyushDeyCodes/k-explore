import { EVENTS } from '@/data/events';
import type { KEvent } from '@/types/event';

export function getAllEvents(): KEvent[] {
  return EVENTS;
}

export function getEventById(id: string): KEvent | undefined {
  return EVENTS.find((event) => event.id === id);
}

export function getRelatedEvents(event: KEvent, limit = 4): KEvent[] {
  return EVENTS.filter((item) => item.id !== event.id)
    .map((item) => ({
      item,
      score: (item.category === event.category ? 2 : 0) + item.tags.filter((tag) => event.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || b.popularity - a.popularity)
    .slice(0, limit)
    .map(({ item }) => item);
}
