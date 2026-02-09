import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LogoutButton from '@/components/LogoutButton';
import { AuthProvider } from '@/components/AuthProvider';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'NextNotes',
    template: '%s | NextNotes',
  },
  description: 'A simple personal knowledge base built with Next.js. Create, manage, and bookmark your notes easily.',
  keywords: ['notes', 'knowledge base', 'nextjs', 'productivity'],
  authors: [{ name: 'You' }],
  creator: 'NextNotes Team',
  publisher: 'NextNotes',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    title: 'NextNotes - Your Personal Knowledge Base',
    description: 'A simple personal knowledge base built with Next.js',
    siteName: 'NextNotes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextNotes',
    description: 'Your personal knowledge base',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Header />
          <LogoutButton/>
          <main style={{ minHeight: '80vh', padding: '32px 20px' }}>
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
