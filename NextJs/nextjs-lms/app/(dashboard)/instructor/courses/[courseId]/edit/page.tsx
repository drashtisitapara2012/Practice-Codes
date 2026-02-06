import { Button } from '@/components/ui/button';
import { updateCourse } from '@/lib/actions/course';
import { api } from '@/lib/api/proxy';
import Link from 'next/link';

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
    const { courseId } = await params;
    const course = await api.courses.get(courseId);

    const updateAction = updateCourse.bind(null, courseId);

    return (
        <div className="container max-w-2xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Course</h1>
                <p className="text-muted-foreground">Update content for {course.title}</p>
            </div>

            <form action={updateAction} className="space-y-6 border p-6 rounded-lg bg-card">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Course Title</label>
                    <input
                        name="title"
                        id="title"
                        defaultValue={course.title}
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                    <input
                        name="price"
                        type="number"
                        defaultValue={course.price}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        defaultValue={course.description}
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/instructor" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </Link>
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
