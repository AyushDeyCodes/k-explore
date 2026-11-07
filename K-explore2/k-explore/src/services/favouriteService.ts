import { supabase } from '@/lib/supabase';
import { getOwnerToken, readLocalFavourites, writeLocalFavourites } from '@/lib/storage';

export async function fetchFavouriteIds(): Promise<string[]> {
  if (!supabase) return readLocalFavourites();

  const { data, error } = await supabase.rpc('list_my_favourites', { p_owner_token: getOwnerToken() });
  if (error) throw new Error('Could not load your favourites.');
  if (!Array.isArray(data)) throw new Error('Could not load your favourites.');
  return data
    .map((row: unknown) => (row as { favourite_event_id?: unknown }).favourite_event_id)
    .filter((id): id is string => typeof id === 'string');
}

export async function setFavouriteRemote(eventId: string, active: boolean): Promise<void> {
  if (!supabase) {
    const current = readLocalFavourites().filter((id) => id !== eventId);
    writeLocalFavourites(active ? [eventId, ...current] : current);
    return;
  }

  const { error } = await supabase.rpc('set_favourite', {
    p_owner_token: getOwnerToken(),
    p_event_id: eventId,
    p_active: active,
  });
  if (error) throw new Error('Could not update your favourites. Please try again.');
}
