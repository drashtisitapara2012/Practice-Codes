export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatarUrl?: string;
}

export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    instructorId: string;
    price: number;
    thumbnail: string;
    category: string;
    tags: string[];
    level: 'beginner' | 'intermediate' | 'advanced';
    createdAt: string;
    updatedAt: string;
    lessonsCount: number;
    enrollmentCount: number; // For social proof
}

export interface Lesson {
    id: string;
    courseId: string;
    title: string;
    slug: string;
    content: string; // Markdown or HTML
    duration: number; // minutes
    order: number;
    videoUrl?: string; // Optional embedded video
}

export interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    enrolledAt: string;
    progress: number; // 0-100
    completedLessonIds: string[];
}

export interface Quiz {
    id: string;
    lessonId: string;
    questions: QuizQuestion[];
}

export interface QuizQuestion {
    id: string;
    text: string;
    options: string[];
    correctOptionIndex: number;
}
