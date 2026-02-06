import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { getAllPosts } from '@/lib/api/posts';
import DashboardClient from '@/components/dashboard-client';
import { Loader2 } from 'lucide-react';

// Server Component - Fetches and caches data on the server
async function PostsData({ page, limit }: { page: number; limit: number }) {
    const start = (page - 1) * limit;
    // Data is fetched and cached on the server using Next.js 16 caching ('use cache')
    // Destructure the result because getAllPosts returns { posts, total }
    const { posts, total } = await getAllPosts(limit, start);

    console.log(`Server: Fetched ${posts.length} posts (Page ${page}) from cache/API`);

    return <DashboardClient
        initialPosts={posts}
        currentPage={page}
        itemsPerPage={limit}
        totalItems={total}
    />;
}

// Loading fallback
function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-6 py-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-64 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-24 bg-gray-300 rounded-xl"></div>
                        ))}
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3">
                        <div className="h-96 bg-gray-300 rounded-xl"></div>
                        <div className="lg:col-span-2 h-96 bg-gray-300 rounded-xl"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: PageProps) {
    const session = await auth();
    const params = await searchParams;

    if (!session) {
        redirect('/login');
    }

    const page = typeof params.page === 'string' ? parseInt(params.page) : 1;
    const limit = 5; // Low limit to demonstrate pagination easily

    return (
        <div className="space-y-6">
            <Suspense key={page} fallback={<DashboardSkeleton />}>
                <PostsData page={page} limit={limit} />
            </Suspense>
        </div>
    );
}
