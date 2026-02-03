import { Suspense } from 'react';
import { WeatherCard } from '@/components/dashboard/weather-card';
import { getWeatherForecast } from '@/lib/api/weather';
import { getPreferences } from '@/app/actions/preferences';
import { LoadingSkeleton, PageLoadingSkeleton } from '@/components/shared/loading-skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Thermometer } from 'lucide-react';
import Image from 'next/image';

export const metadata = {
    title: 'Weather | NextHub',
    description: 'Local and global weather forecasts',
};

/**
 * Weather Page
 * 
 * Uses nested Suspense to avoid blocking the initial shell.
 * getPreferences() accesses cookies, so it must be within a Suspense boundary.
 */
export default function WeatherPage() {
    return (
        <Suspense fallback={<PageLoadingSkeleton />}>
            <WeatherContent />
        </Suspense>
    );
}

async function WeatherContent() {
    const preferences = await getPreferences();
    const city = preferences.defaultCity;

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Weather Forecast</h1>
                <p className="text-muted-foreground">
                    Real-time weather data and 5-day forecast for {city}.
                </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <Suspense fallback={<LoadingSkeleton type="weather" />}>
                        <WeatherCard city={city} />
                    </Suspense>
                </div>

                <div className="lg:col-span-2">
                    <Suspense fallback={<CardSkeleton />}>
                        <ForecastList city={city} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}

async function ForecastList({ city }: { city: string }) {
    const forecast = await getWeatherForecast(city);

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="size-5 text-primary" />
                    5-Day Forecast
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {forecast.map((day) => (
                        <div
                            key={day.date}
                            className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-24 font-medium">
                                    {new Date(day.date).toLocaleDateString('en-US', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </div>
                                <div className="relative size-10">
                                    <Image
                                        src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                                        alt={day.description}
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground capitalize hidden sm:block">
                                    {day.description}
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-1.5">
                                    <Thermometer className="size-4 text-orange-500" />
                                    <span className="font-bold">{Math.round(day.tempMax)}°</span>
                                    <span className="text-muted-foreground font-light">{Math.round(day.tempMin)}°</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function CardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader>
                <div className="flex items-center gap-2">
                    <div className="size-5 rounded bg-muted animate-pulse" />
                    <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-16 w-full bg-muted animate-pulse rounded-lg" />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
