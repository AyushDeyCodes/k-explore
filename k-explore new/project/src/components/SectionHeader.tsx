import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: { label: string; to: string };
  children?: ReactNode;
}

export function SectionHeader({ eyebrow, title, description, action, children }: SectionHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-crimson">{eyebrow}</p>}
        <h2 className="text-balance text-2xl font-bold text-ink sm:text-3xl lg:text-4xl">{title}</h2>
        {description && <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>}
      </div>
      {children}
      {action && (
        <Link
          to={action.to}
          className="group inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-ink transition-colors hover:text-crimson"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}
