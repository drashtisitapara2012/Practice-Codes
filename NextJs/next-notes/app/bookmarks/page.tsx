import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { getNotes } from '@/lib/notes';
import { getBookmarksByUser } from '@/lib/bookmark-storage';
import RemoveBookmarkButton from '@/components/RemoveBookmarkButton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BookmarksPage() {
  const session = await getServerSession(authOptions);

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  const userEmail = session.user.email!;
  
  // Get bookmark IDs directly from storage
  const bookmarkIds = getBookmarksByUser(userEmail);
  
  // Get all notes
  const allNotes = await getNotes();
  
  // Filter bookmarked notes
  const bookmarkedNotes = allNotes.filter(note => bookmarkIds.includes(note.id));

  console.log(`Bookmarks page for ${userEmail}:`, bookmarkIds);

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      <style>{`
        .bookmark-header {
          margin-bottom: 32px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e5e7eb;
        }
        .bookmark-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }
        .bookmark-card {
          border: 1px solid #e5e7eb;
          padding: 20px;
          border-radius: 12px;
          background-color: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.2s ease;
        }
        .bookmark-card:hover {
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          transform: translateY(-2px);
        }
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: #f9fafb;
          border-radius: 12px;
          margin-top: 24px;
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        .note-title {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
          color: #111827;
        }
        .note-content {
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 16px;
        }
        .note-link {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          font-size: 14px;
          margin-right: 12px;
        }
        .note-link:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="bookmark-header">
        <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px' }}>
          📚 My Bookmarks
        </h1>
        <p style={{ color: '#6b7280', fontSize: '16px' }}>
          {bookmarkedNotes.length} {bookmarkedNotes.length === 1 ? 'note' : 'notes'} saved
        </p>
      </div>

      {bookmarkedNotes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h2 style={{ fontSize: '24px', marginBottom: '12px', color: '#374151' }}>
            No bookmarks yet
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            Start bookmarking notes from the notes page to see them here.
          </p>
          <a
            href="/notes"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Browse Notes
          </a>
        </div>
      ) : (
        <div className="bookmark-grid">
          {bookmarkedNotes.map((note) => (
            <div key={note.id} className="bookmark-card">
              <h3 className="note-title">{note.title}</h3>
              
              <p className="note-content">
                {note.content.slice(0, 120)}...
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <a href={`/notes/${note.slug}`} className="note-link">
                  Read more →
                </a>
                
                <RemoveBookmarkButton noteId={note.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}