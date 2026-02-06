export default function NotesLoading() {
  return (
    <section>
      <h1>Loading notes...</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            style={{
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '16px',
            }}
          >
            <div
              style={{
                height: '16px',
                background: '#e5e7eb',
                width: '70%',
                marginBottom: '12px',
              }}
            />
            <div
              style={{
                height: '12px',
                background: '#e5e7eb',
                width: '100%',
                marginBottom: '8px',
              }}
            />
            <div
              style={{
                height: '12px',
                background: '#e5e7eb',
                width: '90%',
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
