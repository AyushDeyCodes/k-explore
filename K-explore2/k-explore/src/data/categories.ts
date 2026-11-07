import { Clapperboard, Cpu, Gamepad2, Hammer, Music, PartyPopper, Palette, Trophy, type LucideIcon } from 'lucide-react';
import type { EventCategory } from '@/types/event';

export interface CategoryMeta {
  name: EventCategory;
  slug: string;
  description: string;
  icon: LucideIcon;
}

export const CATEGORY_META: CategoryMeta[] = [
  { name: 'Technology', slug: 'technology', description: 'Conferences, hackathons and founder nights', icon: Cpu },
  { name: 'Music', slug: 'music', description: 'Concerts, DJ sets and intimate live sessions', icon: Music },
  { name: 'Gaming', slug: 'gaming', description: 'Esports finals and indie game expos', icon: Gamepad2 },
  { name: 'Sports', slug: 'sports', description: 'Match nights, races and team events', icon: Trophy },
  { name: 'Art', slug: 'art', description: 'Gallery shows, biennales and light installations', icon: Palette },
  { name: 'Workshops', slug: 'workshops', description: 'Hands-on classes with working experts', icon: Hammer },
  { name: 'Festivals', slug: 'festivals', description: 'Campus fests and open-air celebrations', icon: PartyPopper },
  { name: 'Entertainment', slug: 'entertainment', description: 'Cultural nights, food markets and stage shows', icon: Clapperboard },
];

export function getCategoryMeta(name: EventCategory): CategoryMeta {
  const meta = CATEGORY_META.find((item) => item.name === name);
  if (!meta) throw new Error(`Unknown category: ${name}`);
  return meta;
}
