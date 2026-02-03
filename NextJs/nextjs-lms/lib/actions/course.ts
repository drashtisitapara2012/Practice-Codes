'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession } from '../auth'; // We need this to get current user ID
import { randomUUID } from 'crypto';

export async function createCourse(formData: FormData) {
    const session = await getSession();
    if (!session || session.user.role !== 'instructor') {
        throw new Error('Unauthorized');
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string) || 0;

    const newCourse = {
        id: randomUUID(),
        title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        instructorId: session.user.id,
        price,
        thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg', // Placeholder
        category: 'General',
        tags: [],
        level: 'beginner' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessonsCount: 0,
        enrollmentCount: 0,
    };

    await db.courses.create(newCourse);

    revalidatePath('/instructor');
    revalidatePath('/catalog'); // Ensure new course appears in catalog
    redirect(`/instructor`);
}

export async function updateCourse(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);

    await db.courses.update(id, { title, description, price, updatedAt: new Date().toISOString() });

    revalidatePath('/instructor');
    revalidatePath(`/courses/${id}`);
    redirect('/instructor');
}

export async function deleteCourse(id: string) {
    await db.courses.delete(id);
    revalidatePath('/instructor');
}

export async function enrollCourse(courseId: string) {
    const session = await getSession();
    if (!session) redirect('/login');

    await db.enrollments.create({
        id: randomUUID(),
        userId: session.user.id,
        courseId,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completedLessonIds: []
    });

    revalidatePath('/student');
    redirect('/student');
}
