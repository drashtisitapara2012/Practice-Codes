import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { CourseCard } from '@/components/features/course-card';

export default async function StudentDashboard() {
    const session = await getSession();

    if (!session) {
        redirect('/login');
    }

    // Fetch true enrolled courses
    const enrolledCourses = await db.enrollments.findByUser(session.user.id);

    return (
        <div className="container py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Welcome back, {session.user.name}</h1>
                <p className="text-muted-foreground">Continue where you left off</p>
            </div>

            <section>
                <h2 className="mb-4 text-xl font-semibold">My Courses</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {enrolledCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </section>
        </div>
    );
}
