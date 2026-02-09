import NoteCard from '@/components/NoteCard';
import { getFilteredNotes } from '@/lib/notes';

type Props = {
  searchParams: Promise<{ query?: string; page?: string }>;
};

export default async function NotesPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = params.query ?? '';
  const page = Number(params.page ?? '1');

  const { notes, totalPages } = await getFilteredNotes(query, page);

  return (
    <section style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <style>{`
        .search-form {
          display: flex;
          gap: 8px;
          margin-top: 24px;
          margin-bottom: 24px;
        }
        .search-input {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 14px;
          flex: 1;
          max-width: 400px;
          background-color: var(--background);
          color: var(--foreground);
          transition: border-color 0.2s ease;
        }
        .search-input:focus {
          outline: none;
          border-color: var(--primary);
        }
        .search-btn {
          padding: 10px 24px;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .search-btn:hover {
          background-color: var(--primary-light);
          transform: translateY(-1px);
        }
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 24px;
        }
        .pagination {
          margin-top: 32px;
          display: flex;
          gap: 16px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
        }
        .pagination a {
          padding: 10px 16px;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--primary);
          font-weight: 500;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .pagination a:hover {
          border-color: var(--primary);
          background-color: var(--primary);
          color: white;
        }
        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-secondary);
        }
      `}</style>
      
      <h1>All Notes</h1>

      <form className="search-form">
        <input 
          type="text" 
          name="query" 
          placeholder="Search notes..." 
          defaultValue={query} 
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      <div className="notes-grid">
        {notes.map((note) => <NoteCard key={note.id} note={note} />)}
      </div>

      {notes.length === 0 && (
        <div className="empty-state">
          <p>No notes found. Try a different search.</p>
        </div>
      )}

      <div className="pagination">
        {page > 1 && (
          <a href={`/notes?query=${query}&page=${page - 1}`}>
            ← Previous
          </a>
        )}
        <span style={{ color: 'var(--text-secondary)' }}>Page {page} of {totalPages}</span>
        {page < totalPages && (
          <a href={`/notes?query=${query}&page=${page + 1}`}>
            Next →
          </a>
        )}
      </div>
    </section>
  );
}
