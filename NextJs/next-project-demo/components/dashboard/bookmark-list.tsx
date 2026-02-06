'use client';

import { useTransition, useState } from 'react';
import { removeBookmark, type Bookmark } from '@/app/actions/bookmarks';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Film, ChefHat, Bookmark as BookmarkIcon, Inbox } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BookmarkListProps {
    initialBookmarks: Bookmark[];
}

export function BookmarkList({ initialBookmarks }: BookmarkListProps) {
    const [bookmarks, setBookmarks] = useState(initialBookmarks);
    const [isPending, startTransition] = useTransition();

    const handleRemove = (type: 'movie' | 'recipe', id: string) => {
        startTransition(async () => {
            await removeBookmark(type, id);
            setBookmarks(prev => prev.filter(b => !(b.type === type && b.id === id)));
        });
    };

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-3xl bg-muted/20">
                <div className="p-4 rounded-full bg-muted mb-4">
                    <BookmarkIcon className="size-10 text-muted-foreground opacity-30" />
                </div>
                <h2 className="text-2xl font-bold">No saved content</h2>
                <p className="text-muted-foreground mt-2 max-w-xs">
                    Explore movies and recipes to save your favorites for later.
                </p>
                <div className="flex gap-4 mt-8">
                    <Link href="/dashboard/movies">
                        <Button variant="outline">Browse Movies</Button>
                    </Link>
                    <Link href="/dashboard/recipes">
                        <Button variant="outline">Browse Recipes</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bookmarks.map((bookmark) => (
                <Card key={`${bookmark.type}-${bookmark.id}`} className="group overflow-hidden">
                    <CardContent className="p-0 flex h-32">
                        <div className="relative w-32 shrink-0 bg-muted">
                            {bookmark.thumbnail ? (
                                <Image
                                    src={bookmark.thumbnail}
                                    alt={bookmark.title}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    {bookmark.type === 'movie' ? <Film className="size-8" /> : <ChefHat className="size-8" />}
                                </div>
                            )}
                        </div>

                        <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge
                                        variant="outline"
                                        className={cn(
                                            'text-[10px] uppercase font-bold px-1.5 h-4',
                                            bookmark.type === 'movie' ? 'text-purple-500 border-purple-200' : 'text-orange-500 border-orange-200'
                                        )}
                                    >
                                        {bookmark.type}
                                    </Badge>
                                    <span className="text-[10px] text-muted-foreground">
                                        Added {new Date(bookmark.addedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="font-bold text-sm line-clamp-2 leading-tight">
                                    {bookmark.title}
                                </h3>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="icon" variant="ghost" className="size-8" asChild>
                                    <Link href={`/dashboard/${bookmark.type === 'movie' ? 'movies' : 'recipes'}/${bookmark.id}`}>
                                        <ExternalLink className="size-4" />
                                    </Link>
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                                    onClick={() => handleRemove(bookmark.type, bookmark.id)}
                                    disabled={isPending}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
