import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/lib/types';
import { Badge } from 'lucide-react'; // Placeholder badge icon, simplified

export function CourseCard({ course }: { course: Course }) {
    return (
        <Link href={`/courses/${course.id}`} className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
            <div className="aspect-video w-full overflow-hidden bg-muted relative">
                <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">{course.category}</span>
                    <span className="text-xs text-muted-foreground">{course.level}</span>
                </div>
                <h3 className="line-clamp-2 text-lg font-bold group-hover:underline">
                    {course.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground flex-1">
                    {course.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold">
                        {course.price === 0 ? 'Free' : `$${course.price}`}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {course.lessonsCount} lessons
                    </span>
                </div>
            </div>
        </Link>
    );
}
