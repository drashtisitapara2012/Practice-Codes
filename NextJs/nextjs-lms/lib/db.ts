import fs from 'fs/promises';
import path from 'path';
import { Course, User, Enrollment } from './types';
import { MOCK_USERS } from './auth';

const DB_PATH = path.join(process.cwd(), 'data.json');

type DB = {
    users: User[];
    courses: Course[];
    enrollments: Enrollment[];
};

// Seed data
async function getInitialData(): Promise<DB> {
    const users = Object.values(MOCK_USERS);

    // Fetch initial courses from DummyJSON to seed
    let courses: Course[] = [];
    try {
        const res = await fetch('https://dummyjson.com/products?limit=10');
        const data = await res.json();
        courses = data.products.map((p: any) => ({
            id: String(p.id),
            title: p.title,
            slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: p.description,
            instructorId: 'u2', // Assign to Bob
            price: p.price,
            thumbnail: p.thumbnail,
            category: p.category,
            tags: p.tags || [],
            level: 'beginner',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lessonsCount: 10,
            enrollmentCount: p.stock * 5,
        }));
    } catch (e) {
        console.error('Failed to seed from DummyJSON', e);
    }

    return {
        users,
        courses,
        enrollments: [] // Start empty
    };
}

export async function readDB(): Promise<DB> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, seed it
        const initialData = await getInitialData();
        await writeDB(initialData);
        return initialData;
    }
}

export async function writeDB(data: DB) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

export const db = {
    users: {
        find: async (email: string) => {
            const { users } = await readDB();
            return users.find(u => u.email === email);
        },
        create: async (user: User) => {
            const data = await readDB();
            data.users.push(user);
            await writeDB(data);
            return user;
        }
    },
    courses: {
        list: async () => {
            const { courses } = await readDB();
            return courses;
        },
        find: async (id: string) => {
            const { courses } = await readDB();
            return courses.find(c => c.id === id);
        },
        create: async (course: Course) => {
            const data = await readDB();
            data.courses.push(course);
            await writeDB(data);
            return course;
        },
        update: async (id: string, updates: Partial<Course>) => {
            const data = await readDB();
            const index = data.courses.findIndex(c => c.id === id);
            if (index === -1) return null;
            data.courses[index] = { ...data.courses[index], ...updates };
            await writeDB(data);
            return data.courses[index];
        },
        delete: async (id: string) => {
            const data = await readDB();
            data.courses = data.courses.filter(c => c.id !== id);
            await writeDB(data);
        }
    },
    enrollments: {
        create: async (enrollment: Enrollment) => {
            const data = await readDB();
            // Check if exists
            const exists = data.enrollments.some(e => e.userId === enrollment.userId && e.courseId === enrollment.courseId);
            if (exists) return;
            data.enrollments.push(enrollment);
            await writeDB(data);
        },
        findByUser: async (userId: string) => {
            const { enrollments, courses } = await readDB();
            const myEnrollments = enrollments.filter(e => e.userId === userId);
            // Join with courses
            return myEnrollments.map(e => courses.find(c => c.id === e.courseId)).filter(Boolean) as Course[];
        }
    }
};
