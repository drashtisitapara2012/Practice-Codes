'use client';

import { useQuery } from '@tanstack/react-query';
import SearchBox from '@/app/components/SearchBox';
import ThemeToggle from '@/app/components/ThemeToggle';
import { GitHubUser } from '@/app/types/github';
import Link from 'next/link';
import { useDebounce } from '@/app/hooks/useDebounce';
import { DataTable } from '@/app/components/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { ExternalLink, User as UserIcon, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useAppStore } from '@/app/lib/store';

const usersPerPage = 10;

// Simple in-memory cache for user details to avoid redundant API calls
const userCache = new Map<string, GitHubUser>();

async function fetchGitHubUsers(query: string, page: number) {
  let response;
  const apiPage = page + 1;
  if (query.trim()) {
    response = await fetch(`/api/github/search?q=${encodeURIComponent(query)}&page=${apiPage}&per_page=${usersPerPage}`);
  } else {
    const since = page * usersPerPage;
    response = await fetch(`/api/github/users?since=${since}&per_page=${usersPerPage}`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Request failed');
  }

  const items = Array.isArray(result.data) ? result.data : result.data?.items || [];
  const total = result.data?.total_count ?? (Array.isArray(result.data) ? 2000 : 0);

  // Enrich data with creation time (created_at) by fetching individual user details
  const enrichedItems = await Promise.all(items.map(async (user: GitHubUser) => {
    if (userCache.has(user.login)) {
      return { ...user, ...userCache.get(user.login) };
    }

    try {
      const detailRes = await fetch(`/api/github/user/${user.login}`);
      if (detailRes.ok) {
        const detailData = await detailRes.json();
        if (detailData.success && detailData.data) {
          userCache.set(user.login, detailData.data);
          return { ...user, ...detailData.data };
        }
      }
    } catch (e) {
      console.error(`Failed to fetch details for ${user.login}:`, e);
    }
    return user;
  }));

  const isSearch = query.trim() !== '';
  const searchLimit = 90;
  const cappedTotal = isSearch ? Math.min(total, searchLimit) : 2000;
  const cappedPages = isSearch ? Math.min(Math.ceil(total / usersPerPage), 9) : 200;

  return {
    items: enrichedItems,
    totalCount: cappedTotal,
    totalPages: cappedPages,
    actualTotal: total,
  };
}

export default function Home() {
  const { searchQuery, setSearchQuery, pageIndex, setPageIndex } = useAppStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 1000);
  const isDebouncing = searchQuery !== debouncedSearchQuery && searchQuery !== '';

  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ['githubUsers', debouncedSearchQuery, pageIndex],
    queryFn: () => fetchGitHubUsers(debouncedSearchQuery, pageIndex),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const users = data?.items || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 0;
  const pagination = { pageIndex, pageSize: usersPerPage };

  const columns: ColumnDef<GitHubUser>[] = [
    {
      accessorKey: "avatar_url",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-gray-100 dark:border-gray-800 shadow-sm">
              <Image
                src={user.avatar_url}
                alt={user.login}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white leading-tight">
                {user.login}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Account Type",
      enableSorting: true,
      meta: { className: "hidden md:table-cell" },
      cell: ({ row }) => (
        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs font-bold uppercase tracking-wider border border-gray-200 dark:border-gray-700">
          {row.original.type}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined",
      enableSorting: true,
      meta: { className: "hidden lg:table-cell" },
      cell: ({ row }) => {
        const date = row.original.created_at;
        if (!date) return <span className="text-gray-400 italic">...</span>;

        return (
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Calendar size={14} className="opacity-70" />
            <span className="text-sm font-medium">
              {new Date(date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "site_admin",
      header: "Status",
      enableSorting: true,
      meta: { className: "hidden sm:table-cell" },
      cell: ({ row }) => (
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${row.original.site_admin
          ? "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 border-yellow-200 dark:border-yellow-900/40"
          : "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-500 border-green-200 dark:border-green-900/40"
          }`}>
          {row.original.site_admin ? "Admin" : "Member"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-3">
            <Link
              href={`/users/${user.login}`}
              className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all shadow-sm border border-blue-100 dark:border-blue-900/40"
              title="View Profile"
            >
              <UserIcon size={18} />
            </Link>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all shadow-sm border border-gray-100 dark:border-gray-700"
              title="Open on GitHub"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            GitHub User Dashboard
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-6 px-4">
            Search and explore GitHub users
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-2xl">
            <SearchBox
              onSearch={handleSearchChange}
              isLoading={isLoading || isFetching}
              value={searchQuery}
            />
          </div>
        </div>

        <div className="flex justify-center mb-12 px-4 sm:px-0">
          <Link
            href="/top-repos"
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300"
          >
            <span>View Top Repositories</span>
          </Link>
        </div>

        <main className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
              <p className="font-medium">{(error as Error).message}</p>
            </div>
          )}

          {isDebouncing && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 rounded-xl flex items-center gap-3 animate-pulse">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span className="font-medium">Searching for "{searchQuery}"...</span>
            </div>
          )}

          {(isLoading && !data) ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase text-sm">Initializing search...</p>
            </div>
          ) : (
            <>
              {users.length === 0 && !error && !isLoading && (
                <div className="text-center py-24 bg-white dark:bg-gray-800/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                  <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">No users found. Try another search term!</p>
                </div>
              )}

              {users.length > 0 && (
                <div className="animate-in fade-in duration-500">
                  <div className="flex flex-col gap-2 mb-8">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        {searchQuery.trim() ? (
                          <>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-sm uppercase tracking-wider font-black">Search</span>
                            <span>Results for "{searchQuery}"</span>
                          </>
                        ) : (
                          <>
                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg text-sm uppercase tracking-wider font-black">Explore</span>
                            <span>All Users</span>
                          </>
                        )}
                      </h2>
                      <span className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200 dark:border-gray-700 shadow-sm">
                        {totalCount.toLocaleString()} Total
                      </span>
                    </div>
                    {searchQuery.trim() && (data as any)?.actualTotal > 90 && pageIndex >= 8 && (
                      <p className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-1">
                        Note: Further pages are disabled for this search. You have reached the maximum accessible page (Page 9).
                      </p>
                    )}
                  </div>

                  <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                    <DataTable
                      columns={columns}
                      data={users}
                      isLoading={isFetching}
                      pageCount={totalPages}
                      pagination={pagination}
                      onPaginationChange={(newPagination) => {
                        setPageIndex(newPagination.pageIndex);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
