"use client";

import { useState } from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function LogoutButton() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user) {
    return null;
  }

  async function handleLogout() {
    setIsLoading(true);
    try {
      await signOut({ 
        redirect: true, 
        callbackUrl: '/login'
      });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        zIndex: 1000,
      }}
    >
      <span
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          padding: '8px 12px',
          borderRadius: '8px',
          backgroundColor: 'var(--background)',
          border: '1px solid var(--border)',
        }}
        title="Current user"
      >
        {session.user.email}
      </span>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        style={{
          padding: '10px 16px',
          backgroundColor: isLoading ? '#9ca3af' : '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: '500',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          fontSize: '0.9rem',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#dc2626';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.backgroundColor = '#ef4444';
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  );
}
