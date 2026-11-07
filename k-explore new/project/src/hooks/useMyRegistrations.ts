import { useCallback, useEffect, useState } from 'react';
import { cancelRegistration, listMyRegistrations } from '@/services/registrationService';
import type { Registration } from '@/types/registration';
import { useToast } from '@/hooks/useToast';

type LoadState = 'loading' | 'ready' | 'error';

export function useMyRegistrations() {
  const notify = useToast();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [state, setState] = useState<LoadState>('loading');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState('loading');
    listMyRegistrations()
      .then((items) => {
        if (cancelled) return;
        setRegistrations(items);
        setState('ready');
      })
      .catch(() => {
        if (!cancelled) setState('error');
      });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const cancel = useCallback(
    async (registrationId: string) => {
      try {
        await cancelRegistration(registrationId);
        setRegistrations((current) =>
          current.map((item) => (item.id === registrationId ? { ...item, status: 'cancelled' } : item)),
        );
        notify('Your registration has been cancelled.', 'info');
        return true;
      } catch (err) {
        notify(err instanceof Error ? err.message : 'Could not cancel the registration.', 'error');
        return false;
      }
    },
    [notify],
  );

  return {
    registrations,
    state,
    cancel,
    reload: useCallback(() => setReloadKey((key) => key + 1), []),
  };
}
