import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { EVENTS } from '@/data/events';
import { CATEGORY_META } from '@/data/categories';
import { EventImage } from '@/components/EventImage';

export function CategoryTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {CATEGORY_META.map((category) => {
        const members = EVENTS.filter((event) => event.category === category.name);
        const cover = members.find((event) => event.featured) ?? members[0];
        const Icon = category.icon;
        return (
          <Link
            key={category.slug}
            to={`/explore?category=${encodeURIComponent(category.name)}`}
            className="group relative flex aspect-[4/3] overflow-hidden rounded-xl border border-line bg-surface sm:aspect-[5/4]"
          >
            {cover && <EventImage src={cover.coverImage} alt="" className="absolute inset-0 h-full w-full" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 transition-opacity duration-500 group-hover:opacity-90" />
            <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-4 text-white sm:p-5">
              <div>
                <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold sm:text-xl">{category.name}</h3>
                <p className="mt-1 hidden text-xs text-white/75 sm:block">{category.description}</p>
                <p className="mt-1 text-xs font-semibold text-white/85">
                  {members.length} {members.length === 1 ? 'event' : 'events'}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 shrink-0 translate-y-1 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
