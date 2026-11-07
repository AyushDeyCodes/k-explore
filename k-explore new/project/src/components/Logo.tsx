import { Link } from 'react-router-dom';
import { Aperture } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 ${className}`} aria-label="K Explore home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-crimson shadow-glow transition-transform duration-300 group-hover:rotate-45">
        <Aperture className="h-5 w-5 text-white" aria-hidden="true" />
      </span>
      <span className="font-display text-lg font-bold tracking-[0.12em] text-ink">
        K<span className="text-crimson">&nbsp;</span>EXPLORE
      </span>
    </Link>
  );
}
