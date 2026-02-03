import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default async function LessonLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    return (
        <div className="flex min-h-screen flex-col">
            <div className="border-b bg-background/95 backdrop-blur p-4 sticky top-14 z-40">
                <div className="container flex items-center gap-4">
                    <Link href={`/courses/${slug}`} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Course
                    </Link>
                    <h1 className="font-semibold text-lg line-clamp-1">Advanced React Patterns</h1>
                </div>
            </div>
            <div className="container flex-1 py-8">
                {children}
            </div>
        </div>
    );
}
