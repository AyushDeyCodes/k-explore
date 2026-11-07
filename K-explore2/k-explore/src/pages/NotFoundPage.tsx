import { Compass } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pb-16 pt-32">
      <EmptyState
        icon={Compass}
        title="We could not find that page"
        description="The event or page you are looking for may have moved or no longer exists."
        action={{ label: 'Back to home', to: '/' }}
      />
    </div>
  );
}
