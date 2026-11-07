import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { type LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; to: string } | { label: string; onClick: () => void };
  tone?: 'neutral' | 'error';
  children?: ReactNode;
}

const ACTION_CLASS =
  'inline-flex h-11 items-center justify-center rounded-full bg-crimson px-6 text-sm font-semibold text-white shadow-glow transition-all duration-200 hover:-translate-y-0.5 hover:bg-crimson-hover';

export function EmptyState({ icon: Icon, title, description, action, tone = 'neutral', children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center">
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-full ${
          tone === 'error' ? 'bg-crimson/15 text-crimson' : 'bg-elevated text-muted'
        }`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{description}</p>
      {action && (
        <div className="mt-6">
          {'to' in action ? (
            <Link to={action.to} className={ACTION_CLASS}>
              {action.label}
            </Link>
          ) : (
            <button type="button" onClick={action.onClick} className={ACTION_CLASS}>
              {action.label}
            </button>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
