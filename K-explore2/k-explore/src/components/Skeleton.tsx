import type { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: string;
}

export function Skeleton({ className = '', rounded = 'rounded-lg', ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden bg-elevated ${rounded} ${className}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
    </div>
  );
}

export function PosterSkeleton() {
  return (
    <div className="flex flex-col gap-3" role="status" aria-label="Loading events">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
