import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/Modal';
import { SearchBar } from '@/components/SearchBar';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const submit = (value: string) => {
    onClose();
    setQuery('');
    navigate(value ? `/explore?q=${encodeURIComponent(value)}` : '/explore');
  };

  return (
    <Modal open={open} onClose={onClose} title="Search events" description="Find events by title, category, venue, city or tag." size="sm">
      <SearchBar
        value={query}
        onChange={setQuery}
        onSubmit={submit}
        onNavigate={() => {
          onClose();
          setQuery('');
        }}
        autoFocus
      />
      <p className="mt-4 text-xs text-muted">Press Enter to see every matching event.</p>
    </Modal>
  );
}
