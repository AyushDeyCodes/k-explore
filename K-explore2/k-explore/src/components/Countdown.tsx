import { useEffect, useState } from 'react';
import { getTimeLeft, type TimeLeft } from '@/lib/format';

interface CountdownProps {
  target: Date;
  variant?: 'large' | 'compact';
}

const UNITS: { key: keyof Omit<TimeLeft, 'finished'>; label: string }[] = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Minutes' },
  { key: 'seconds', label: 'Seconds' },
];

export function Countdown({ target, variant = 'large' }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (timeLeft.finished) {
    return <p className="text-sm font-semibold text-crimson">This event has started.</p>;
  }

  const isCompact = variant === 'compact';

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" role="timer" aria-label="Time until event starts">
      {UNITS.map(({ key, label }) => (
        <div
          key={key}
          className={`flex flex-col items-center justify-center rounded-xl border border-line bg-surface ${
            isCompact ? 'py-2' : 'py-3 sm:py-4'
          }`}
        >
          <span
            className={`font-display font-bold tabular-nums text-ink ${isCompact ? 'text-xl' : 'text-2xl sm:text-3xl'}`}
          >
            {String(timeLeft[key]).padStart(2, '0')}
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted sm:text-xs">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
