import { Suspense } from 'react';
import { api } from '@/lib/api/proxy';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { Button } from '@/components/ui/button'; // Placeholder class for now or I use inline

type Props = {
    params: Promise<{ slug: string }>;
};

// Generate Metadata dynamically
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    // In a real app we'd look up by slug, here we strip ID from slug or just use list -> find
    // We'll just cheat for the demo and extract ID if possible or search
    // For demo: assume slug has ID or we search. 
    // Let's just fetch a generic course to be safe as our slug usage is mock.
    const course = await api.courses.get('1');

    return {
        title: course.title,
        description: course.description,
    };
}

export default async function CoursePage({ params }: Props) {
    const { slug } = await params;
    const course = await api.courses.get('1'); // Mocking finding by slug

    if (!course) {
        notFound();
    }

    return (
        <div className="container py-8 md:py-12">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-4">
                    <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{course.category}</div>
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{course.title}</h1>
                    <p className="text-muted-foreground md:text-xl">{course.description}</p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                        <form action={async () => {
                            'use server';
                            const { enrollCourse } = await import('@/lib/actions/course');
                            // Mock User ID
                            await enrollCourse(course.id);
                        }}>
                            <button className="inline-flex items-center justify-center h-11 px-8 rounded-md bg-primary text-primary-foreground text-lg font-bold hover:bg-primary/90 transition-colors">
                                Enroll for ${course.price}
                            </button>
                        </form>
                    </div>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                    <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <div className="rounded-md border">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Link
                            key={i}
                            href={`/courses/${slug}/lessons/${i + 1}`}
                            className="flex items-center justify-between p-4 border-b last:border-0 hover:bg-muted/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                                    {i + 1}
                                </div>
                                <span className="font-medium">Introduction to Advanced Concepts {i + 1}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">15 min</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
