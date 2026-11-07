import type { EventCategory } from '@/types/event';

interface CategoryBadgeProps {
  category: EventCategory;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-crimson px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white ${className}`}
    >
      {category}
    </span>
  );
}
