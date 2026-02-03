'use client';

import { useState, useTransition, useOptimistic } from 'react';
import { updatePreferences, type UserPreferences } from '@/app/actions/preferences';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
    Settings,
    Moon,
    Sun,
    Monitor,
    MapPin,
    Newspaper,
    Languages,
    Bell,
    Save,
    Loader2,
    Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsPageProps {
    initialPreferences: UserPreferences;
}

/**
 * Settings Page Content - Client Component
 * 
 * Demonstrates:
 * - Server Actions with Form Data
 * - useOptimistic (React 19) for immediate feedback
 * - useTransition for pending states
 */
export default function SettingsPageContent({ initialPreferences }: SettingsPageProps) {
    const [isPending, startTransition] = useTransition();
    const [isSaved, setIsSaved] = useState(false);

    // Optimistic UI state
    const [optimisticPrefs, setOptimisticPrefs] = useOptimistic(
        initialPreferences,
        (state, newPrefs: Partial<UserPreferences>) => ({ ...state, ...newPrefs })
    );

    const handleUpdate = async (formData: FormData) => {
        const theme = formData.get('theme') as any;
        const defaultCity = formData.get('defaultCity') as string;
        const newsCategory = formData.get('newsCategory') as string;

        const updates = { theme, defaultCity, newsCategory };

        startTransition(async () => {
            // Apply optimistic update
            setOptimisticPrefs(updates);

            const result = await updatePreferences(updates);

            if (result.success) {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 3000);
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
                <p className="text-muted-foreground">Customize your dashboard experience and preferences.</p>
            </div>

            <form action={handleUpdate} className="space-y-8">
                {/* Appearance Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sun className="size-5 text-orange-500" />
                            Appearance
                        </CardTitle>
                        <CardDescription>Choose how NextHub looks on your device.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'light', icon: Sun, label: 'Light' },
                                { id: 'dark', icon: Moon, label: 'Dark' },
                                { id: 'system', icon: Monitor, label: 'System' },
                            ].map((theme) => (
                                <label
                                    key={theme.id}
                                    className={cn(
                                        'flex flex-col items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted',
                                        optimisticPrefs.theme === theme.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-transparent bg-muted/30'
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="theme"
                                        value={theme.id}
                                        className="sr-only"
                                        defaultChecked={optimisticPrefs.theme === theme.id}
                                    />
                                    <theme.icon className={cn('size-6', optimisticPrefs.theme === theme.id ? 'text-primary' : 'text-muted-foreground')} />
                                    <span className="text-sm font-bold">{theme.label}</span>
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Localized Settings */}
                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <MapPin className="size-5 text-blue-500" />
                                Weather Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="defaultCity">Default City</Label>
                                <Input
                                    id="defaultCity"
                                    name="defaultCity"
                                    defaultValue={optimisticPrefs.defaultCity}
                                    placeholder="Enter your city..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Newspaper className="size-5 text-emerald-500" />
                                News Preferences
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newsCategory">Favorite Category</Label>
                                <select
                                    id="newsCategory"
                                    name="newsCategory"
                                    defaultValue={optimisticPrefs.newsCategory}
                                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                >
                                    <option value="top">Top Stories</option>
                                    <option value="technology">Technology</option>
                                    <option value="business">Business</option>
                                    <option value="science">Science</option>
                                    <option value="health">Health</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Global Action Bar */}
                <div className="sticky bottom-8 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        className="rounded-full px-8 shadow-xl"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 size-4 animate-spin" />
                                Saving Changes...
                            </>
                        ) : isSaved ? (
                            <>
                                <Check className="mr-2 size-4" />
                                Preferences Saved
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 size-4" />
                                Save Preferences
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
