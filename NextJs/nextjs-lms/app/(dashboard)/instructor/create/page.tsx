import { Button } from '@/components/ui/button';
import { createCourse } from '@/lib/actions/course';
import Link from 'next/link';

export default function CreateCoursePage() {
    return (
        <div className="container max-w-2xl py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Create New Course</h1>
                <p className="text-muted-foreground">Start building your next masterpiece.</p>
            </div>

            <form action={createCourse} className="space-y-6 border p-6 rounded-lg bg-card">
                <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">Course Title</label>
                    <input
                        name="title"
                        id="title"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="e.g. Advanced Next.js Patterns"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="price" className="text-sm font-medium">Price ($)</label>
                    <input
                        name="price"
                        type="number"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        placeholder="0.00"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="What will students learn?"
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <Link href="/instructor" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                        Cancel
                    </Link>
                    <Button type="submit">Create Course</Button>
                </div>
            </form>
        </div>
    );
}
