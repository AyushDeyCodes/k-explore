import { useState } from 'react';
import { Aperture } from 'lucide-react';
import { Skeleton } from '@/components/Skeleton';

interface EventImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  zoomOnHover?: boolean;
  eager?: boolean;
}

export function EventImage({ src, alt, className = '', imgClassName = '', zoomOnHover = true, eager = false }: EventImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  return (
    <div className={`relative overflow-hidden bg-elevated ${className}`}>
      {status !== 'error' && (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          } ${zoomOnHover ? 'group-hover:scale-105' : ''} ${imgClassName}`}
        />
      )}
      {status === 'loading' && <Skeleton className="absolute inset-0" rounded="rounded-none" />}
      {status === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-elevated via-surface to-base">
          <Aperture className="h-10 w-10 text-crimson/70" aria-hidden="true" />
          <span className="sr-only">{alt} (image unavailable)</span>
        </div>
      )}
    </div>
  );
}
