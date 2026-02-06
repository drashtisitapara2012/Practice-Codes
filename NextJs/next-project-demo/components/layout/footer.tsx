'use client';

import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { useEffect, useState } from 'react';

/**
 * Footer Component - Client Component
 * 
 * Moved to Client Component to safely use current time for copyright year
 * without delaying the initial server render or causing hydration mismatches.
 */
export function Footer() {
    const [year, setYear] = useState(2026);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-12">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-purple-600">
                                <span className="text-sm font-bold text-white">N</span>
                            </div>
                            <span className="text-xl font-bold">NextHub</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            A comprehensive Next.js 16 demo application showcasing all the latest features
                            and best practices.
                        </p>
                        <div className="flex gap-4">
                            <a
                                href="https://github.com/vercel/next.js"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Github className="size-5" />
                            </a>
                            <a
                                href="https://twitter.com/nextjs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Twitter className="size-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h3 className="font-semibold mb-4">Product</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/weather" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Weather
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/news" className="text-muted-foreground hover:text-foreground transition-colors">
                                    News Feed
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard/movies" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Movies
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="font-semibold mb-4">Resources</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link href="/docs" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="https://nextjs.org/docs"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Next.js Docs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://react.dev"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    React Docs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://ui.shadcn.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    shadcn/ui
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="font-semibold mb-4">Next.js 16 Features</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="text-muted-foreground">✓ Cache Components</li>
                            <li className="text-muted-foreground">✓ Turbopack</li>
                            <li className="text-muted-foreground">✓ React 19.2</li>
                            <li className="text-muted-foreground">✓ View Transitions</li>
                            <li className="text-muted-foreground">✓ proxy.ts</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        © {year} NextHub. Built with Next.js 16.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                            Privacy
                        </Link>
                        <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
