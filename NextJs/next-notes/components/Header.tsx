'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from '@/styles/header.module.css';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className={styles.header}>
      <h2 className={styles.logo}>NextNotes</h2>

      <nav className={styles.nav}>
        <Link
          href="/"
          className={isActive('/') ? styles.active : ''}
        >
          Home
        </Link>

        <Link
          href="/notes"
          className={isActive('/notes') ? styles.active : ''}
        >
          Notes
        </Link>

        <Link
          href="/bookmarks"
          className={isActive('/bookmarks') ? styles.active : ''}
        >
          Bookmarks
        </Link>

        <Link
          href="/login"
          className={isActive('/login') ? styles.active : ''}
        >
          Login
        </Link>
      </nav>
    </header>
  );
}
