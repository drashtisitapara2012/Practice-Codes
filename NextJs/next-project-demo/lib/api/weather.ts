/**
 * Weather API Client using OpenWeatherMap
 * 
 * Demonstrates Next.js 16 Cache Components with "use cache" directive
 * Uses cacheLife for time-based caching and cacheTag for tag-based revalidation
 */

import { cacheLife, cacheTag } from 'next/cache';
import { weatherTag } from '@/lib/cache/tags';

export interface WeatherData {
    temperature: number;
    feelsLike: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
    city: string;
    country: string;
    sunrise: number;
    sunset: number;
}

export interface WeatherForecast {
    date: string;
    tempMin: number;
    tempMax: number;
    description: string;
    icon: string;
}

/**
 * Get current weather for a city
 * Uses "use cache" for automatic caching with Next.js 16
 */
export async function getWeather(city: string): Promise<WeatherData> {
    'use cache';
    cacheLife('hours'); // Built-in profile: 1 hour cache
    cacheTag(weatherTag(city));

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        // Return mock data if no API key is configured
        return getMockWeather(city);
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            console.error(`Weather API error: ${response.status} ${response.statusText}`);
            return getMockWeather(city);
        }

        const data = await response.json();

        return {
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon,
            city: data.name,
            country: data.sys.country,
            sunrise: data.sys.sunrise,
            sunset: data.sys.sunset,
        };
    } catch (error) {
        console.error('Weather fetch error:', error);
        return getMockWeather(city);
    }
}

/**
 * Get 5-day weather forecast
 */
export async function getWeatherForecast(city: string): Promise<WeatherForecast[]> {
    'use cache';
    cacheLife('hours');
    cacheTag(`forecast-${city.toLowerCase()}`);

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const isValidKey = apiKey && !apiKey.startsWith('your-');

    if (!isValidKey) {
        return getMockForecast();
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
            console.error(`Forecast API error: ${response.status} ${response.statusText}`);
            return getMockForecast();
        }

        const data = await response.json();

        // Group by day and get daily summary
        const dailyForecasts = new Map<string, WeatherForecast>();

        for (const item of data.list) {
            const date = new Date(item.dt * 1000).toISOString().split('T')[0];

            if (!dailyForecasts.has(date)) {
                dailyForecasts.set(date, {
                    date,
                    tempMin: item.main.temp_min,
                    tempMax: item.main.temp_max,
                    description: item.weather[0].description,
                    icon: item.weather[0].icon,
                });
            } else {
                const existing = dailyForecasts.get(date)!;
                existing.tempMin = Math.min(existing.tempMin, item.main.temp_min);
                existing.tempMax = Math.max(existing.tempMax, item.main.temp_max);
            }
        }

        return Array.from(dailyForecasts.values()).slice(0, 5);
    } catch (error) {
        console.error('Forecast fetch error:', error);
        return getMockForecast();
    }
}

// Mock data for when API key is not configured
function getMockWeather(city: string): WeatherData {
    return {
        temperature: 22,
        feelsLike: 24,
        description: 'partly cloudy',
        humidity: 65,
        windSpeed: 12,
        icon: '02d',
        city: city,
        country: 'US',
        sunrise: Date.now() / 1000 - 21600,
        sunset: Date.now() / 1000 + 21600,
    };
}

function getMockForecast(): WeatherForecast[] {
    const today = new Date();
    return Array.from({ length: 5 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        return {
            date: date.toISOString().split('T')[0],
            tempMin: 18 + Math.random() * 5,
            tempMax: 25 + Math.random() * 5,
            description: ['sunny', 'partly cloudy', 'cloudy', 'light rain', 'clear sky'][i],
            icon: ['01d', '02d', '03d', '10d', '01d'][i],
        };
    });
}
