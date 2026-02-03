'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LogIn, UserPlus, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

export function Header() {
    const pathname = usePathname();
    const { data: session, status } = useSession();

    const isActive = (href: string) => pathname === href;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-purple-600">
                        <Home className="size-4 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        NextHub
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/"
                        className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        href="/about"
                        className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        About
                    </Link>
                    <Link
                        href="/docs"
                        className={`text-sm font-medium transition-colors ${pathname.startsWith('/docs') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Docs
                    </Link>
                </nav>

                {/* Auth buttons */}
                <div className="flex items-center gap-3">
                    {status === 'loading' ? (
                        <div className="size-8 animate-pulse rounded-full bg-muted" />
                    ) : session?.user ? (
                        <Link href="/dashboard">
                            <Button variant="gradient">
                                Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    <LogIn className="mr-2 size-4" />
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">
                                    <UserPlus className="mr-2 size-4" />
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* GitHub link */}
                    <a
                        href="https://github.com/vercel/next.js"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:flex"
                    >
                        <Button variant="ghost" size="icon">
                            <Github className="size-4" />
                        </Button>
                    </a>
                </div>
            </div>
        </header>
    );
}
