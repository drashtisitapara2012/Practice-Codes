import { getNotes, getNoteBySlug } from '@/lib/notes';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = { params: { slug: string } };

// Pre-generate static pages for all notes (optional, for performance)
export async function generateStaticParams() {
  const notes = await getNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

// Dynamic metadata generation for each note
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNoteBySlug(params.slug);

  if (!note) {
    return {
      title: 'Note Not Found',
      description: 'The note you are looking for does not exist.',
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const noteUrl = `${baseUrl}/notes/${note.slug}`;

  return {
    title: note.title,
    description: note.content.substring(0, 160),
    keywords: [note.title, 'notes', 'nextjs'],
    authors: [{ name: 'You' }],
    openGraph: {
      title: note.title,
      description: note.content.substring(0, 160),
      url: noteUrl,
      type: 'article',
      siteName: 'NextNotes',
    },
    twitter: {
      card: 'summary',
      title: note.title,
      description: note.content.substring(0, 160),
    },
    alternates: {
      canonical: noteUrl,
    },
  };
}

export default async function NotePage({ params }: Props) {
  const note = await getNoteBySlug(params.slug);
  if (!note) notFound();

  return (
    <article style={{ maxWidth: '900px', margin: '0 auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: '24px' }}>{note.title}</h1>
      <div style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>
        <p> Posted in Knowledge Base</p>
      </div>
      <div
        style={{
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid var(--border)',
          backgroundColor: 'var(--background)',
          boxShadow: 'var(--shadow)',
          lineHeight: '1.8',
          fontSize: '1.05rem',
        }}
      >
        <p>{note.content}</p>
      </div>
    </article>
  );
}
