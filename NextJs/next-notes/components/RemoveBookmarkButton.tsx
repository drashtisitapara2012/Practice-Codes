'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type RemoveBookmarkButtonProps = {
  noteId: number;
};

export default function RemoveBookmarkButton({ noteId }: RemoveBookmarkButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRemove = async () => {
    if (!confirm('Remove this bookmark?')) {
      return;
    }

    startTransition(async () => {
      try {
        console.log(`Attempting to remove bookmark for note ${noteId}...`);
        
        const res = await fetch(`/api/bookmarks?noteId=${noteId}`, {
          method: 'DELETE',
        });

        console.log(`Delete response status: ${res.status}`);

        if (!res.ok) {
          const errorData = await res.json();
          console.error('Delete failed:', errorData);
          
          if (res.status === 404) {
            throw new Error('Bookmark not found - it may have already been removed');
          } else if (res.status === 401) {
            throw new Error('You must be logged in to remove bookmarks');
          } else {
            throw new Error(errorData.error || 'Failed to remove bookmark');
          }
        }

        const data = await res.json();
        console.log('Bookmark removed successfully:', data);
        
        // Refresh the page to show updated list
        //router.refresh();
        
      } catch (error) {
        console.error('Remove bookmark error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to remove bookmark. Please try again.';
        alert(errorMessage);
      }
    });
  };

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      style={{
        padding: '8px 16px',
        border: 'none',
        borderRadius: '6px',
        backgroundColor: '#dc2626',
        color: 'white',
        cursor: isPending ? 'not-allowed' : 'pointer',
        opacity: isPending ? 0.6 : 1,
        fontWeight: 500,
        fontSize: '14px',
        transition: 'all 0.2s ease',
      }}
    >
      {isPending ? 'Removing...' : ' Remove'}
    </button>
  );
}