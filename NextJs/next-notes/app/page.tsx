export default function HomePage() {
  return (
    <section style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h1>Welcome to NextNotes 📘</h1>
      <p style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
        A simple knowledge base built to learn Next.js fundamentals.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <style>{`
          .browse-btn {
            padding: 12px 24px;
            background-color: var(--primary);
            color: white;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
            transition: all 0.2s ease;
          }
          .browse-btn:hover {
            background-color: var(--primary-light);
            transform: translateY(-2px);
            box-shadow: var(--shadow-lg);
          }
        `}</style>
        <a href="/notes" className="browse-btn">
          Browse Notes
        </a>
      </div>
    </section>
  );
}
