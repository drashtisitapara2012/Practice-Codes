import Link from 'next/link';
import { cn } from '@/lib/utils';
import { GraduationCap } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <GraduationCap className="h-6 w-6" />
                        <span className="hidden font-bold sm:inline-block">
                            NextLMS
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            href="/catalog"
                            className={cn(
                                "transition-colors hover:text-foreground/80 text-foreground/60"
                            )}
                        >
                            Catalog
                        </Link>
                        <Link
                            href="/pricing"
                            className={cn(
                                "transition-colors hover:text-foreground/80 text-foreground/60"
                            )}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/about"
                            className={cn(
                                "transition-colors hover:text-foreground/80 text-foreground/60"
                            )}
                        >
                            About
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search placeholder */}
                    </div>
                    <nav className="flex items-center">
                        <Link href="/login" className="text-sm font-medium px-4 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-colors">
                            Login
                        </Link>
                        <Link href="/register" className="ml-2 text-sm font-medium px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
                            Get Started
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
