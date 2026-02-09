'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          backgroundColor: '#0a0a0a',
          color: '#f3f4f6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '500px',
            padding: '40px',
            borderRadius: '12px',
            border: '1px solid #374151',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: '#ef4444' }}>
            Critical Error
          </h1>
          <p style={{ color: '#d1d5db', marginBottom: '24px', fontSize: '1.1rem' }}>
            {error.message || 'A critical error occurred. The application cannot continue.'}
          </p>
          <button
            onClick={reset}
            style={{
              padding: '12px 32px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reload Page
          </button>
        </div>
      </body>
    </html>
  );
}
