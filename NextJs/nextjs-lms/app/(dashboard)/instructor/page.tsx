import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api/proxy';
import { PlusCircle } from 'lucide-react';
import { revalidateTag } from 'next/cache';

// Mock Server Action for checking revalidation
async function createCourseAction(formData: FormData) {
    'use server';
    // In a real app, this would write to DB
    console.log('Creating course...');
    // revalidateTag('courses'); // Using revalidatePath as fallback if revalidateTag issues occur
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');
    redirect('/instructor');
}

export default async function InstructorDashboard() {
    const session = await getSession();

    if (!session || session.user.role !== 'instructor') {
        // Middleware handles this, but good for type safety/double check
        redirect('/login');
    }

    // Instructor's own courses
    const myCourses = await api.courses.listByInstructor(session.user.id);

    return (
        <div className="container py-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
                    <p className="text-muted-foreground">Manage your courses and students</p>
                </div>
                <Link
                    href="/instructor/create"
                    className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Course
                </Link>
            </div>

            <div className="rounded-md border">
                <div className="p-4 bg-muted/50 border-b">
                    <h3 className="font-semibold">My Courses</h3>
                </div>
                <div className="p-0">
                    {/* Simple Table */}
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Students</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Action</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {myCourses.map((course) => (
                                <tr key={course.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{course.title}</td>
                                    <td className="p-4 align-middle">{course.enrollmentCount}</td>
                                    <td className="p-4 align-middle"><span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">Published</span></td>
                                    <td className="p-4 align-middle text-right flex justify-end gap-2">
                                        <Link href={`/instructor/courses/${course.id}/edit`} className="inline-flex items-center justify-center h-8 px-3 rounded-md border text-sm font-medium hover:bg-muted transition-colors">Edit</Link>
                                        <form action={async () => {
                                            'use server';
                                            const { deleteCourse } = await import('@/lib/actions/course');
                                            await deleteCourse(course.id);
                                        }}>
                                            <button className="inline-flex items-center justify-center h-8 px-3 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
