import type { EventCategory } from '@/types/event';

interface CategoryFilterProps {
  value: EventCategory | 'all';
  onChange: (value: EventCategory | 'all') => void;
  categories: readonly EventCategory[];
  label?: string;
}

export function CategoryFilter({ value, onChange, categories, label = 'Filter by category' }: CategoryFilterProps) {
  const options: (EventCategory | 'all')[] = ['all', ...categories];
  return (
    <div className="no-scrollbar -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" role="group" aria-label={label}>
      <div className="flex w-max gap-2 pb-1 sm:w-auto sm:flex-wrap">
        {options.map((option) => {
          const active = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              aria-pressed={active}
              className={`h-9 shrink-0 rounded-full border px-4 text-sm font-medium transition-all duration-200 ${
                active
                  ? 'border-crimson bg-crimson text-white shadow-glow'
                  : 'border-line bg-surface text-muted hover:border-ink hover:text-ink'
              }`}
            >
              {option === 'all' ? 'All categories' : option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
