import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchFavouriteIds, setFavouriteRemote } from '@/services/favouriteService';
import { useToast } from '@/hooks/useToast';

interface FavouritesContextValue {
  favouriteIds: Set<string>;
  isLoading: boolean;
  loadError: string | null;
  isFavourite: (eventId: string) => boolean;
  toggleFavourite: (eventId: string, title?: string) => void;
  retry: () => void;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const notify = useToast();
  const [ids, setIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLoadError(null);
    fetchFavouriteIds()
      .then((loaded) => {
        if (!cancelled) setIds(loaded);
      })
      .catch((error: unknown) => {
        if (!cancelled) setLoadError(error instanceof Error ? error.message : 'Could not load favourites.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const favouriteIds = useMemo(() => new Set(ids), [ids]);

  const toggleFavourite = useCallback(
    (eventId: string, title?: string) => {
      const active = !favouriteIds.has(eventId);
      const label = title ?? 'Event';
      setIds((current) => (active ? [eventId, ...current] : current.filter((id) => id !== eventId)));
      setFavouriteRemote(eventId, active)
        .then(() => {
          notify(active ? `${label} added to favourites` : `${label} removed from favourites`, active ? 'success' : 'info');
        })
        .catch(() => {
          setIds((current) => (active ? current.filter((id) => id !== eventId) : [eventId, ...current]));
          notify('Could not update your favourites. Please try again.', 'error');
        });
    },
    [favouriteIds, notify],
  );

  const value = useMemo<FavouritesContextValue>(
    () => ({
      favouriteIds,
      isLoading,
      loadError,
      isFavourite: (eventId) => favouriteIds.has(eventId),
      toggleFavourite,
      retry: () => setReloadKey((key) => key + 1),
    }),
    [favouriteIds, isLoading, loadError, toggleFavourite],
  );

  return <FavouritesContext.Provider value={value}>{children}</FavouritesContext.Provider>;
}

export function useFavourites(): FavouritesContextValue {
  const context = useContext(FavouritesContext);
  if (!context) throw new Error('useFavourites must be used inside FavouritesProvider');
  return context;
}
