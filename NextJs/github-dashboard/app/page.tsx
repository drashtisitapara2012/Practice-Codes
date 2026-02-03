'use client';

import { useState } from 'react';
import SearchBox from '@/app/components/SearchBox';
import UserCard from '@/app/components/UserCard';
import { searchGitHubUsers } from '@/app/lib/github';
import { GitHubUser } from '@/app/types/github';

export default function Home() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await searchGitHubUsers(query);
      setUsers(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            GitHub User Dashboard
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Search and explore GitHub users
          </p>
          <SearchBox onSearch={handleSearch} isLoading={isLoading} />
        </header>

        <main>
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Searching GitHub users...</p>
            </div>
          )}

          {!isLoading && hasSearched && users.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found. Try a different search term.</p>
            </div>
          )}

          {users.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Search Results ({users.length})
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
            </div>
          )}

          {!hasSearched && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Enter a username above to search for GitHub users
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
