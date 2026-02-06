import { Suspense } from 'react';
import { api } from '@/lib/api/proxy';
import { CourseCard } from '@/components/features/course-card';
import { SearchInput } from '@/components/features/search-input';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Course Catalog',
    description: 'Browse our extensive library of courses.',
};

// Define SearchParams type. In Next.js 15/16, it is a Promise.
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CatalogPage(props: {
    searchParams: SearchParams;
}) {
    const searchParams = await props.searchParams;
    const query = typeof searchParams.q === 'string' ? searchParams.q : '';

    // Data fetching based on search params
    const courses = query
        ? await api.courses.search(query)
        : await api.courses.list(100); // Fetch more for catalog

    return (
        <div className="container py-8 md:py-12">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Course Catalog</h1>
                    <p className="text-muted-foreground">
                        {courses.length} courses found
                        {query && ` for "${query}"`}
                    </p>
                </div>
                <div className="w-full md:w-1/3">
                    <SearchInput />
                </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No courses found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}
