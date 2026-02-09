'use client';

import { useState, useTransition, useEffect } from 'react';

type BookmarkButtonProps = {
  noteId: number;
  initialBookmarked: boolean;
};

export default function BookmarkButton({ noteId, initialBookmarked }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Update state when initialBookmarked changes
  useEffect(() => {
    setIsBookmarked(initialBookmarked);
  }, [initialBookmarked]);

  const handleToggle = async () => {
    const previousState = isBookmarked;
    setError(null);
    
    // Optimistic update
    setIsBookmarked(!isBookmarked);

    startTransition(async () => {
      try {
        if (!isBookmarked) {
          // Add bookmark
          console.log(` Adding bookmark for note ${noteId}...`);
          
          const res = await fetch('/api/bookmarks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ noteId }),
          });

          const data = await res.json();

          if (!res.ok) {
            console.error('Add failed:', data);
            
            if (res.status === 409) {
              throw new Error('Already bookmarked');
            } else if (res.status === 401) {
              throw new Error('You must be logged in to bookmark notes');
            } else {
              throw new Error(data.error || 'Failed to add bookmark');
            }
          }

          console.log('Bookmark added successfully:', data);
        } else {
          // Remove bookmark
          console.log(` Removing bookmark for note ${noteId}...`);
          
          const res = await fetch(`/api/bookmarks?noteId=${noteId}`, {
            method: 'DELETE',
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || 'Failed to remove bookmark');
          }

          console.log('Bookmark removed successfully:', data);
        }

        // Notify other components
        window.dispatchEvent(new CustomEvent('bookmarkChanged'));
        
      } catch (error) {
        console.error(' Bookmark toggle error:', error);
        
        // Revert on error
        setIsBookmarked(previousState);
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to update bookmark';
        setError(errorMessage);
        
        // Auto-clear error after 3 seconds
        setTimeout(() => setError(null), 3000);
      }
    });
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '4px' }}>
      <button
        onClick={handleToggle}
        disabled={isPending}
        style={{
          padding: '8px 16px',
          border: 'none',
          borderRadius: '6px',
          backgroundColor: isBookmarked ? '#dc2626' : '#2563eb',
          color: 'white',
          cursor: isPending ? 'not-allowed' : 'pointer',
          opacity: isPending ? 0.6 : 1,
          fontWeight: 500,
          fontSize: '14px',
          transition: 'all 0.2s ease',
        }}
      >
        {isPending ? '...' : isBookmarked ? '❌ Remove Bookmark' : '⭐ Bookmark'}
      </button>
      
      {error && (
        <span style={{ 
          fontSize: '12px', 
          color: '#dc2626',
          fontWeight: 500,
        }}>
          {error}
        </span>
      )}
    </div>
  );
}