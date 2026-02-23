'use client';

import { useTransition } from 'react';

export default function RevalidateButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await fetch('/api/revalidate', {
        method: 'POST'
      });
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      style={{
        marginBottom: 16,
        padding: '8px 16px',
        background: '#000',
        color: '#fff',
        borderRadius: 6
      }}
    >
      {isPending ? 'Revalidating…' : 'Revalidate Posts Cache'}
    </button>
  );
}
