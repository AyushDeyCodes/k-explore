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
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

// Kept in memory so the app still works when localStorage is blocked (e.g. some private modes).
let memoryToken: string | null = null;

export function getOwnerToken(): string {
  try {
    const existing = window.localStorage.getItem(OWNER_TOKEN_KEY);
    if (existing && existing.length >= 16) return existing;
  } catch {
    // fall through to the in-memory token
  }
  if (memoryToken) return memoryToken;
  memoryToken = createToken();
  try {
    // Stored raw (not JSON-encoded) so the value read back is identical to the one returned now.
    window.localStorage.setItem(OWNER_TOKEN_KEY, memoryToken);
  } catch {
    // Private mode: the in-memory token above is used for this session.
  }
  return memoryToken;
}

export function getStoredTheme(): ThemeName | null {
  try {
    const value = window.localStorage.getItem(THEME_KEY);
    return value === 'dark' || value === 'light' ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: ThemeName): void {
  try {
    window.localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Preference simply will not persist.
  }
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
