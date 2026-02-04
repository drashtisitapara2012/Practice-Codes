'use client';

import { useState, useEffect } from 'react';
import SearchBox from '@/app/components/SearchBox';
import UserCard from '@/app/components/UserCard';
import ThemeToggle from '@/app/components/ThemeToggle';
import Pagination from '@/app/components/Pagination';
import { GitHubUser } from '@/app/types/github';
import Link from 'next/link';
import { useDebounce } from '@/app/hooks/useDebounce';

interface SearchResponse {
  success: boolean;
  data?: {
    total_count: number;
    incomplete_results: boolean;
    items: GitHubUser[];
  };
  error?: string;
}

export default function Home() {
  const [users, setUsers] = useState<GitHubUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const usersPerPage = 10; // GitHub API default per page

  // Debounce the search query to avoid API calls on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const isDebouncing = searchQuery !== debouncedSearchQuery && searchQuery !== '';

  const handleSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setUsers([]);
      setHasSearched(false);
      setError(null);
      setTotalCount(0);
      setTotalPages(0);
      setCurrentPage(1);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/github/search?q=${encodeURIComponent(query)}&page=${page}&per_page=${usersPerPage}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const result: SearchResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }

      setUsers(result.data?.items || []);
      setTotalCount(result.data?.total_count || 0);
      setCurrentPage(page);
      setTotalPages(Math.ceil((result.data?.total_count || 0) / usersPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching');
      setUsers([]);
      setTotalCount(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger search when debounced query changes
  useEffect(() => {
    handleSearch(debouncedSearchQuery, 1); // Reset to page 1 on new search
  }, [debouncedSearchQuery]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && !isLoading) {
      handleSearch(debouncedSearchQuery, page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GitHub User Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Search and explore GitHub users
          </p>
        </header>
        
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <SearchBox 
              onSearch={setSearchQuery} 
              isLoading={isLoading} 
              value={searchQuery}
            />
          </div>
        </div>

        <div className="flex justify-center mb-8">
          <Link
            href="/top-repos"
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-sm border border-blue-100 hover:bg-blue-50 transition-all hover:scale-105"
          >
            View Top Repositories
          </Link>
        </div>

        <main>
          {error && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {isDebouncing && (
            <div className="max-w-2xl mx-auto mb-8">
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Typing...</span>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Searching GitHub users...</p>
            </div>
          )}

          {!isLoading && hasSearched && users.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No users found. Try a different search term.</p>
            </div>
          )}

          {users.length > 0 && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Search Results {totalCount > 0 && `(${totalCount} total)`}
                </h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                {users.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
              
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
                isLoading={isLoading}
              />
            </div>
          )}

          {!hasSearched && !isLoading && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Enter a username above to search for GitHub users
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
