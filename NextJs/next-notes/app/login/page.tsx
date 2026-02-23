"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { validateEmail } from '@/lib/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/notes';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Client-side validation
    const validation = validateEmail(email);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid email');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        email,
        redirect: false,
      });

      if (!result?.ok) {
        throw new Error(result?.error || 'Login failed');
      }

      router.push(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section style={{ maxWidth: '400px', margin: '0 auto', padding: '32px 20px' }}>
      <h1 style={{ marginBottom: '32px', textAlign: 'center' }}>Login to NextNotes</h1>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: 'var(--foreground)',
            }}
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required
            style={{
              width: '100%',
              padding: '12px',
              border: error ? '2px solid #ef4444' : '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '1rem',
              fontFamily: 'inherit',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              transition: 'border-color 0.2s ease',
              boxSizing: 'border-box',
            }}
            onFocus={(e) => {
              if (!error) {
                e.currentTarget.style.borderColor = 'var(--primary)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = error ? '#ef4444' : 'var(--border)';
            }}
          />
          {error && (
            <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '8px' }}>
              {error}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            backgroundColor: isLoading ? '#9ca3af' : 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s ease',
            marginTop: '16px',
          }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p
        style={{
          textAlign: 'center',
          marginTop: '24px',
          color: 'var(--text-secondary)',
          fontSize: '0.875rem',
        }}
      >
        Demo Mode: Use any email to login
      </p>
    </section>
  );
}
