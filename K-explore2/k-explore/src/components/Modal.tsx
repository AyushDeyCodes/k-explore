import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASS = {
  sm: 'max-w-md',
  md: 'max-w-xl',
  lg: 'max-w-3xl',
} as const;

export function Modal({ open, onClose, title, description, children, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
            aria-hidden="true"
          />
          <motion.div
            key="panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={`relative max-h-[90vh] w-full ${SIZE_CLASS[size]} overflow-y-auto rounded-t-2xl border border-line bg-surface p-6 shadow-card focus:outline-none sm:rounded-2xl sm:p-8`}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
                {description && <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 rounded-full border border-line p-2 text-muted transition-colors hover:border-ink hover:text-ink"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
