import { Suspense } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Trophy, Users } from 'lucide-react';
import { api } from '@/lib/api/proxy';
import { CourseCard } from '@/components/features/course-card';
import { Button } from '@/components/ui/button'; // Will create this later or mock inline for now.
import { cn } from '@/lib/utils';

// Basic Button component inline for speed, or I should create components/ui/button.tsx
// I'll create components/ui/button.tsx in a separate step or just include standard classes here.
// I'll use standard classes for now to be fast.

async function FeaturedCourses() {
    const courses = await api.courses.list(3);

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    );
}

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32 bg-gradient-to-br from-background via-muted/50 to-background">
                <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                    <Link
                        href="https://github.com/google/antigravity" // Mock link
                        className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium"
                        target="_blank"
                    >
                        Follow on GitHub
                    </Link>
                    <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                        Master Modern Web Development with <span className="text-primary">NextLMS</span>
                    </h1>
                    <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                        A production-grade Learning Management System built with Next.js 16,
                        Server Components, and the latest web standards.
                    </p>
                    <div className="space-x-4">
                        <Link href="/login" className={cn("inline-flex items-center justify-center h-11 px-8 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-medium transition-colors")}>
                            Get Started
                        </Link>
                        <Link href="/catalog" className={cn("inline-flex items-center justify-center h-11 px-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-colors")}>
                            Browse Courses
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container py-8 md:py-12 lg:py-24 space-y-8">
                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <BookOpen className="h-12 w-12 text-primary" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Rich Content</h3>
                                <p className="text-sm text-muted-foreground">Video lessons, quizzes, and projects.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Users className="h-12 w-12 text-primary" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Community</h3>
                                <p className="text-sm text-muted-foreground">Connect with students and instructors.</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                        <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                            <Trophy className="h-12 w-12 text-primary" />
                            <div className="space-y-2">
                                <h3 className="font-bold">Certification</h3>
                                <p className="text-sm text-muted-foreground">Earn certificates upon completion.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="container py-8 md:py-12 lg:py-24">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center mb-10">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
                        Featured Courses
                    </h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Explore our most popular courses and start learning today.
                    </p>
                </div>
                <Suspense fallback={<div className="text-center">Loading courses...</div>}>
                    <FeaturedCourses />
                </Suspense>
                <div className="mt-10 flex justify-center">
                    <Link href="/catalog" className="inline-flex items-center font-semibold text-primary hover:underline">
                        View all courses <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
