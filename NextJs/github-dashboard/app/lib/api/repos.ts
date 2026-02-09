import { GitHubRepoSearchResponse } from '@/app/types/github';
import { cacheLife, cacheTag } from 'next/cache';

const GITHUB_API_BASE = 'https://api.github.com';

export async function getTopRepositories(): Promise<GitHubRepoSearchResponse> {
    'use cache';
    cacheLife({revalidate:60});
    cacheTag ('top-repos');

    const response = await fetch(
        `${GITHUB_API_BASE}/search/repositories?q=stars:>10000&sort=stars&order=desc&per_page=10`,
        {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'GitHub-Dashboard-App',
            },
        }
    );

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return response.json();
}
