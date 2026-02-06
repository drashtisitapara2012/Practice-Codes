import { Course } from '../types';
import { db } from '../db';

export const api = {
    courses: {
        list: async (limit = 10, skip = 0) => {
            // In a real DB we would implement pagination here
            const allCourses = await db.courses.list();
            return allCourses.slice(skip, skip + limit);
        },
        get: async (id: string) => {
            const course = await db.courses.find(id);
            if (!course) throw new Error('Course not found');
            return course;
        },
        search: async (query: string) => {
            const allCourses = await db.courses.list();
            const lowerQ = query.toLowerCase();
            return allCourses.filter(c =>
                c.title.toLowerCase().includes(lowerQ) ||
                c.description.toLowerCase().includes(lowerQ)
            );
        },
        // Adding method for instructor's courses
        listByInstructor: async (instructorId: string) => {
            const allCourses = await db.courses.list();
            return allCourses.filter(c => c.instructorId === instructorId);
        }
    },
};

