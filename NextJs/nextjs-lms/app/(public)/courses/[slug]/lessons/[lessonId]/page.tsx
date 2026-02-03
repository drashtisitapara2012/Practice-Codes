import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button'; // hypothetical
import { revalidatePath } from 'next/cache';

// Mock Server Action to complete lesson
async function completeLesson(formData: FormData) {
    'use server';
    const lessonId = formData.get('lessonId');
    console.log(`Completing lesson ${lessonId}`);
    // Database update...
    revalidatePath('/courses/[slug]/lessons/[lessonId]');
}

export default async function LessonPage({
    params,
}: {
    params: Promise<{ slug: string; lessonId: string }>;
}) {
    const { slug, lessonId } = await params;

    // Mock fetching lesson content
    const lesson = {
        id: lessonId,
        title: `Lesson ${lessonId}: Deep Dive`,
        content: 'In this lesson, we explore the intricacies of Server Components...',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Rick Roll placeholder
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                <iframe
                    src={lesson.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            <div className="prose prose-slate max-w-none dark:prose-invert">
                <h1>{lesson.title}</h1>
                <p>{lesson.content}</p>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            <div className="border-t pt-8 flex justify-end">
                <form action={completeLesson}>
                    <input type="hidden" name="lessonId" value={lessonId} />
                    <button className="inline-flex items-center justify-center h-10 px-6 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
                        Mark as Complete
                    </button>
                </form>
            </div>
        </div>
    );
}
