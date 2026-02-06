'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    LayoutDashboard,
    Cloud,
    Newspaper,
    Film,
    ChefHat,
    Settings,
    LogOut,
    Menu,
    X,
    Bookmark
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Weather', href: '/dashboard/weather', icon: Cloud },
    { name: 'News', href: '/dashboard/news', icon: Newspaper },
    { name: 'Movies', href: '/dashboard/movies', icon: Film },
    { name: 'Recipes', href: '/dashboard/recipes', icon: ChefHat },
    { name: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const { data: session } = useSession();

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="ghost"
                size="icon"
                className="fixed left-4 top-4 z-50 lg:hidden"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-card transition-transform duration-300 lg:translate-x-0',
                    isMobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Logo */}
                <div className="flex h-16 items-center gap-2 border-b px-6">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-purple-600">
                        <Home className="size-4 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        NextHub
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href ||
                            (item.href !== '/dashboard' && pathname.startsWith(item.href));

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <item.icon className="size-5" />
                                {item.name}
                                {isActive && (
                                    <div className="ml-auto size-1.5 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User section */}
                <div className="border-t p-4">
                    {session?.user ? (
                        <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                                <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
                                <AvatarFallback>
                                    {getInitials(session.user.name || 'U')}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-medium">
                                    {session.user.name}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {session.user.email}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => signOut({ callbackUrl: '/' })}
                                title="Sign out"
                            >
                                <LogOut className="size-4" />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button className="w-full">Sign In</Button>
                        </Link>
                    )}
                </div>
            </aside>
        </>
    );
}
