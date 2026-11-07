export const EVENT_CATEGORIES = [
  'Technology',
  'Music',
  'Gaming',
  'Sports',
  'Art',
  'Workshops',
  'Festivals',
  'Entertainment',
] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export interface KEvent {
  id: string;
  slug: string;
  title: string;
  category: EventCategory;
  description: string;
  shortDescription: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  price: number;
  poster: string;
  coverImage: string;
  featured: boolean;
  trending: boolean;
  popularity: number;
  capacity: number;
  registrationDeadline: string;
  highlights: string[];
  tags: string[];
}
