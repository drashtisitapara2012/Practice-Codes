import { getWeather, type WeatherData } from '@/lib/api/weather';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Wind, Sunrise, Sunset } from 'lucide-react';
import Image from 'next/image';

interface WeatherCardProps {
    city: string;
}

/**
 * Weather Card - Server Component with "use cache"
 * 
 * This component demonstrates:
 * - Server Components (async data fetching)
 * - Next.js 16 Cache Components (via getWeather)
 * - Streaming SSR (works with Suspense)
 */
export async function WeatherCard({ city }: WeatherCardProps) {
    const weather = await getWeather(city);

    return (
        <Card className="overflow-hidden">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <Cloud className="size-5 text-blue-500" />
                    Weather in {weather.city}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-4">
                    {/* Weather icon */}
                    <div className="relative size-20">
                        <Image
                            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                            alt={weather.description}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>

                    {/* Temperature */}
                    <div>
                        <div className="text-4xl font-bold">
                            {weather.temperature}°C
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                            {weather.description}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Feels like {weather.feelsLike}°C
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <Droplets className="size-4 text-blue-400" />
                        <span className="text-muted-foreground">Humidity:</span>
                        <span className="font-medium">{weather.humidity}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Wind className="size-4 text-slate-400" />
                        <span className="text-muted-foreground">Wind:</span>
                        <span className="font-medium">{weather.windSpeed} m/s</span>
                    </div>
                </div>

                {/* Sunrise/Sunset */}
                <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Sunrise className="size-3" />
                        {new Date(weather.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-1">
                        <Sunset className="size-3" />
                        {new Date(weather.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
