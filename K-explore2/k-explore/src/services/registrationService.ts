import { supabase } from '@/lib/supabase';
import { readLocalRegistrations, writeLocalRegistrations, getOwnerToken } from '@/lib/storage';
import { getEventById } from '@/services/eventService';
import { normalizeIndianMobile } from '@/lib/validation';
import { getEventStart } from '@/lib/format';
import type { Registration, RegistrationInput, RegistrationStatus } from '@/types/registration';

export type RegistrationErrorCode =
  | 'EVENT_NOT_FOUND'
  | 'REGISTRATION_CLOSED'
  | 'ALREADY_REGISTERED'
  | 'EVENT_FULL'
  | 'NETWORK'
  | 'UNKNOWN';

export class RegistrationError extends Error {
  code: RegistrationErrorCode;

  constructor(code: RegistrationErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

const FRIENDLY_MESSAGES: Record<RegistrationErrorCode, string> = {
  EVENT_NOT_FOUND: 'This event could not be found. It may have been removed.',
  REGISTRATION_CLOSED: 'Registration for this event has closed.',
  ALREADY_REGISTERED: 'This email is already registered for the event.',
  EVENT_FULL: 'Sorry, this event is now fully booked.',
  NETWORK: 'We could not reach the server. Check your connection and try again.',
  UNKNOWN: 'Something went wrong while saving your registration. Please try again.',
};

function toRegistrationError(message: string | undefined): RegistrationError {
  const code = (Object.keys(FRIENDLY_MESSAGES) as RegistrationErrorCode[]).find((key) =>
    message?.includes(key),
  );
  const resolved = code ?? 'UNKNOWN';
  return new RegistrationError(resolved, FRIENDLY_MESSAGES[resolved]);
}

interface RegistrationRow {
  id: string;
  event_id: string;
  name: string;
  email: string;
  phone: string;
  organization: string | null;
  status: RegistrationStatus;
  created_at: string;
}

function isRegistrationRow(value: unknown): value is RegistrationRow {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return typeof row.id === 'string' && typeof row.event_id === 'string' && typeof row.status === 'string';
}

function mapRow(row: RegistrationRow): Registration {
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    organization: row.organization,
    status: row.status,
    createdAt: row.created_at,
  };
}

function assertRegistrable(eventId: string, email: string, existing: Registration[]): void {
  const event = getEventById(eventId);
  if (!event) throw new RegistrationError('EVENT_NOT_FOUND', FRIENDLY_MESSAGES.EVENT_NOT_FOUND);
  if (Date.now() > new Date(event.registrationDeadline).getTime()) {
    throw new RegistrationError('REGISTRATION_CLOSED', FRIENDLY_MESSAGES.REGISTRATION_CLOSED);
  }
  const normalized = email.trim().toLowerCase();
  const confirmed = existing.filter((item) => item.status === 'confirmed' && item.eventId === eventId);
  if (confirmed.some((item) => item.email.toLowerCase() === normalized)) {
    throw new RegistrationError('ALREADY_REGISTERED', FRIENDLY_MESSAGES.ALREADY_REGISTERED);
  }
  if (confirmed.length >= event.capacity) throw new RegistrationError('EVENT_FULL', FRIENDLY_MESSAGES.EVENT_FULL);
}

function generateLocalId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 8; i += 1) suffix += chars[Math.floor(Math.random() * chars.length)];
  return `KE-${suffix}`;
}

export async function registerForEvent(input: RegistrationInput): Promise<Registration> {
  const payload = {
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: normalizeIndianMobile(input.phone),
    organization: input.organization.trim() || null,
  };

  if (!supabase) {
    const existing = readLocalRegistrations<Registration>();
    assertRegistrable(input.eventId, payload.email, existing);
    const registration: Registration = {
      id: generateLocalId(),
      eventId: input.eventId,
      ...payload,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    writeLocalRegistrations([registration, ...existing]);
    return registration;
  }

  const { data, error } = await supabase.rpc('register_for_event', {
    p_event_id: input.eventId,
    p_owner_token: getOwnerToken(),
    p_name: payload.name,
    p_email: payload.email,
    p_phone: payload.phone,
    p_organization: payload.organization ?? '',
  });

  if (error) throw toRegistrationError(error.message);
  if (!isRegistrationRow(data)) throw new RegistrationError('UNKNOWN', FRIENDLY_MESSAGES.UNKNOWN);
  return mapRow(data);
}

export async function listMyRegistrations(): Promise<Registration[]> {
  if (!supabase) {
    return readLocalRegistrations<Registration>().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const { data, error } = await supabase.rpc('list_my_registrations', { p_owner_token: getOwnerToken() });
  if (error) throw new RegistrationError('NETWORK', FRIENDLY_MESSAGES.NETWORK);
  if (!Array.isArray(data) || !data.every(isRegistrationRow)) {
    throw new RegistrationError('UNKNOWN', FRIENDLY_MESSAGES.UNKNOWN);
  }
  return data.map(mapRow);
}

export async function cancelRegistration(registrationId: string): Promise<void> {
  if (!supabase) {
    const existing = readLocalRegistrations<Registration>();
    writeLocalRegistrations(
      existing.map((item) => (item.id === registrationId ? { ...item, status: 'cancelled' as const } : item)),
    );
    return;
  }

  const { data, error } = await supabase.rpc('cancel_registration', {
    p_registration_id: registrationId,
    p_owner_token: getOwnerToken(),
  });
  if (error) throw new RegistrationError('NETWORK', FRIENDLY_MESSAGES.NETWORK);
  if (data !== true) throw new RegistrationError('UNKNOWN', 'This registration could not be cancelled.');
}

export async function getSeatCounts(): Promise<Record<string, number>> {
  if (!supabase) {
    const counts: Record<string, number> = {};
    readLocalRegistrations<Registration>()
      .filter((item) => item.status === 'confirmed')
      .forEach((item) => {
        counts[item.eventId] = (counts[item.eventId] ?? 0) + 1;
      });
    return counts;
  }

  const { data, error } = await supabase.rpc('get_event_seat_counts');
  if (error) throw new RegistrationError('NETWORK', FRIENDLY_MESSAGES.NETWORK);
  if (!Array.isArray(data)) throw new RegistrationError('UNKNOWN', FRIENDLY_MESSAGES.UNKNOWN);

  const counts: Record<string, number> = {};
  for (const row of data as { seat_event_id?: unknown; seat_count?: unknown }[]) {
    if (typeof row.seat_event_id === 'string') counts[row.seat_event_id] = Number(row.seat_count ?? 0);
  }
  return counts;
}

export function isEventOpenForRegistration(eventId: string): boolean {
  const event = getEventById(eventId);
  if (!event) return false;
  const now = Date.now();
  return now <= new Date(event.registrationDeadline).getTime() && now < getEventStart(event).getTime();
}
