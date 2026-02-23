'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { GitHubUser } from '@/app/types/github';

interface UserResponse {
  success: boolean;
  data?: GitHubUser;
  error?: string;
}

async function fetchUserDetails(username: string): Promise<GitHubUser> {
  const response = await fetch(`/api/github/user/${encodeURIComponent(username)}`);

  if (response.status === 404) {
    throw new Error('USER_NOT_FOUND');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  const result: UserResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch user details');
  }

  return result.data;
}

export default function UserProfile() {
  const params = useParams();
  const username = params.username as string;

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['githubUser', username],
    queryFn: () => fetchUserDetails(username),
    enabled: !!username,
    retry: (failureCount, error: any) => {
      // Don't retry if user not found
      if (error.message === 'USER_NOT_FOUND') return false;
      return failureCount < 3;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Fetching user profile...</p>
        </div>
      </div>
    );
  }

  if (error?.message === 'USER_NOT_FOUND' || (!isLoading && !user)) {
    notFound();
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/30 max-w-md w-full text-center">
          <span className="text-4xl mb-4 block">⚠️</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error.message}</p>
          <Link href="/" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 font-semibold transition-all group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              <span>Back to Dashboard</span>
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-gray-200 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-48 relative">
              <h1 className="text-4xl px-8 pt-10 font-black text-gray-900 dark:text-white mb-1">
                    {user!.login}
                  </h1>
            </div>

            <div className="px-8 pb-10">

              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                  <section>
                    <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 pt-3">About</h2>
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                      {user!.bio || "No bio available for this user."}
                    </p>
                  </section>

                  
                </div>

                <div className="space-y-6">
                  <h2 className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 pt-3">Statistics</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800 hover:border-blue-400 transition-colors">
                      <span className="text-blue-700 dark:text-blue-400 font-bold">Public Repos</span>
                      <span className="text-2xl font-black text-blue-900 dark:text-blue-100">{user!.public_repos}</span>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 hover:border-indigo-400 transition-colors">
                      <span className="text-indigo-700 dark:text-indigo-400 font-bold">Followers</span>
                      <span className="text-2xl font-black text-indigo-900 dark:text-indigo-100">{user!.followers}</span>
                    </div>
                    <div className="flex justify-between items-center p-5 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 hover:border-purple-400 transition-colors">
                      <span className="text-purple-700 dark:text-purple-400 font-bold">Following</span>
                      <span className="text-2xl font-black text-purple-900 dark:text-purple-100">{user!.following}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
