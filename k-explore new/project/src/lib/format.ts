import type { KEvent } from '@/types/event';

const TIME_ZONE = 'Asia/Kolkata';

export function getEventStart(event: Pick<KEvent, 'date' | 'time'>): Date {
  return new Date(`${event.date}T${event.time}:00+05:30`);
}

export function formatEventDate(event: Pick<KEvent, 'date' | 'time'>): string {
  return getEventStart(event).toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: TIME_ZONE,
  });
}

export function formatShortDate(event: Pick<KEvent, 'date' | 'time'>): string {
  return getEventStart(event).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    timeZone: TIME_ZONE,
  });
}

export function formatEventTime(event: Pick<KEvent, 'date' | 'time'>): string {
  return getEventStart(event).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE,
  });
}

export function formatDeadline(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIME_ZONE,
  });
}

export function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  finished: boolean;
}

export function getTimeLeft(target: Date, now: Date = new Date()): TimeLeft {
  const diff = target.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    finished: false,
  };
}
