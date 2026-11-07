import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastTone = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const TONE_STYLES: Record<ToastTone, { icon: typeof Info; iconClass: string }> = {
  success: { icon: CheckCircle2, iconClass: 'text-emerald-500' },
  error: { icon: AlertTriangle, iconClass: 'text-crimson' },
  info: { icon: Info, iconClass: 'text-violet' },
};

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end"
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const { icon: Icon, iconClass } = TONE_STYLES[toast.tone];
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink shadow-card"
              role="status"
            >
              <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} aria-hidden="true" />
              <p className="flex-1 font-medium">{toast.message}</p>
              <button
                type="button"
                onClick={() => onDismiss(toast.id)}
                className="rounded-md p-1 text-muted transition-colors hover:text-ink"
                aria-label="Dismiss notification"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
