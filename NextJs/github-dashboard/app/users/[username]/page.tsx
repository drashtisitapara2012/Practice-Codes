'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GitHubUser } from '@/app/types/github';

interface UserResponse {
  success: boolean;
  data?: GitHubUser;
  error?: string;
}

export default function UserProfile() {
  const params = useParams();
  const username = params.username as string;

  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!username) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/github/user/${encodeURIComponent(username)}`);
        
        if (response.status === 404) {
          notFound();
        }
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `API error: ${response.status}`);
        }

        const result: UserResponse = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch user details');
        }

        if (result.data) {
          setUser(result.data);
        } else {
          throw new Error('No user data received');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching user details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [username]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
      notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              ← Back to Search
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-32"></div>

            <div className="px-6 pb-6">
              <div className="flex items-end -mt-16 mb-6">
                <div className="ml-6 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {user.name || user.login}
                  </h1>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Profile Information</h2>

                  {user.bio && (
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Bio</h3>
                      <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Statistics</h2>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.public_repos}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.followers}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">{user.following}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
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
