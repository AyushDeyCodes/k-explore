const OWNER_TOKEN_KEY = 'kexplore.ownerToken';
const THEME_KEY = 'kexplore.theme';
const LOCAL_REGISTRATIONS_KEY = 'kexplore.registrations';
const LOCAL_FAVOURITES_KEY = 'kexplore.favourites';
const LOCAL_CONTACT_KEY = 'kexplore.contactMessages';

export type ThemeName = 'dark' | 'light';

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be full or disabled; the in-memory state still works for this session.
  }
}

function createToken(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export function getOwnerToken(): string {
  const existing = window.localStorage.getItem(OWNER_TOKEN_KEY);
  if (existing && existing.length >= 16) return existing;
  const token = createToken();
  writeJson(OWNER_TOKEN_KEY, token);
  return token;
}

export function getStoredTheme(): ThemeName | null {
  const value = window.localStorage.getItem(THEME_KEY);
  return value === 'dark' || value === 'light' ? value : null;
}

export function storeTheme(theme: ThemeName): void {
  window.localStorage.setItem(THEME_KEY, theme);
}

export function readLocalRegistrations<T>(): T[] {
  return readJson<T[]>(LOCAL_REGISTRATIONS_KEY, []);
}

export function writeLocalRegistrations<T>(items: T[]): void {
  writeJson(LOCAL_REGISTRATIONS_KEY, items);
}

export interface LocalContactMessage {
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export function readLocalContactMessages(): LocalContactMessage[] {
  return readJson<LocalContactMessage[]>(LOCAL_CONTACT_KEY, []);
}

export function writeLocalContactMessages(items: LocalContactMessage[]): void {
  writeJson(LOCAL_CONTACT_KEY, items);
}

export function readLocalFavourites(): string[] {
  return readJson<string[]>(LOCAL_FAVOURITES_KEY, []);
}

export function writeLocalFavourites(ids: string[]): void {
  writeJson(LOCAL_FAVOURITES_KEY, ids);
}
