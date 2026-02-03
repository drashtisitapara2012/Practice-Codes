'use client';

import Link from 'next/link';
import { Note } from '@/lib/notes';
import BookmarkButton from './BookmarkButton';
import { useEffect, useState } from 'react';

export default function NoteCard({ note }: { note: Note }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkBookmarkStatus = async () => {
    try {
      const res = await fetch('/api/bookmarks', {
        cache: 'no-store',
      });

      if (!res.ok) {
        console.error('Failed to fetch bookmarks');
        return;
      }

      const data = await res.json();
      const bookmarkIds = data.bookmarks || [];
      setBookmarked(bookmarkIds.includes(note.id));
    } catch (error) {
      console.error('Error checking bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBookmarkStatus();

    // Listen for bookmark changes
    const handleBookmarkChange = () => {
      checkBookmarkStatus();
    };

    window.addEventListener('bookmarkChanged', handleBookmarkChange);

    return () => {
      window.removeEventListener('bookmarkChanged', handleBookmarkChange);
    };
  }, [note.id]);

  return (
    <div
      style={{
        border: '1px solid #e5e7eb',
        padding: '20px',
        borderRadius: '12px',
        backgroundColor: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        transition: 'all 0.2s ease',
      }}
    >
      <h3 style={{ marginBottom: '12px', fontSize: '18px', fontWeight: 600 }}>
        {note.title}
      </h3>
      
      <p style={{ color: '#6b7280', marginBottom: '16px', lineHeight: 1.6 }}>
        {note.content.slice(0, 100)}...
      </p>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link
          href={`/notes/${note.slug}`}
          style={{
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          Read more →
        </Link>

        {!loading && (
          <BookmarkButton noteId={note.id} initialBookmarked={bookmarked} />
        )}
      </div>
    </div>
  );
}