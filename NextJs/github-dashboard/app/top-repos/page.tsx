import { getTopRepositories } from '@/app/lib/api/repos';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Top Repositories | GitHub Dashboard',
    description: 'Most starred repositories on GitHub',
};

export default async function TopReposPage() {
    const { items: repos } = await getTopRepositories();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto py-12 px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                            Top <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Repositories</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                            Exploration of the most influential projects on GitHub.
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-medium rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 hover:border-blue-500/50 transition-all hover:scale-105"
                    >
                        ← Back to Search
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {repos?.map((repo, index) => (
                        <div
                            key={repo.id}
                            className="group relative flex flex-col p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
                                        <Image
                                            src={repo.owner.avatar_url}
                                            alt={repo.owner.login}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                            {repo.owner.login}
                                        </p>
                                        <a
                                            href={repo.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            {repo.name}
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-full">
                                    <span className="text-yellow-600 dark:text-yellow-500 text-xs font-bold">★</span>
                                    <span className="text-yellow-700 dark:text-yellow-500 text-xs font-bold">
                                        {(repo.stargazers_count / 1000).toFixed(1)}k
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 flex-1 line-clamp-2">
                                {repo.description || 'No description available for this repository.'}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex gap-4">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 dark:text-white font-bold">{(repo.forks_count / 1000).toFixed(1)}k</span>
                                        <span className="text-[10px] text-gray-500 uppercase font-medium">Forks</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 dark:text-white font-bold">{repo.watchers_count}</span>
                                        <span className="text-[10px] text-gray-500 uppercase font-medium">Watchers</span>
                                    </div>
                                </div>
                                {repo.language && (
                                    <span className="text-xs font-medium px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg">
                                        {repo.language}
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <span className="text-4xl font-black text-gray-900 dark:text-white select-none">
                                    #{index + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
