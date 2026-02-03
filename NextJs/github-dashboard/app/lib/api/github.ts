import { GitHubSearchResponse, GitHubUser } from '@/app/types/github';

const GITHUB_API_BASE = 'https://api.github.com';

export async function searchGitHubUsers(query: string): Promise<GitHubSearchResponse> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/search/users?q=${encodeURIComponent(query)}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Dashboard-App',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}

export async function getUserDetails(username: string): Promise<GitHubUser> {
  if (!username.trim()) {
    throw new Error('Username cannot be empty');
  }

  const response = await fetch(
    `${GITHUB_API_BASE}/users/${encodeURIComponent(username)}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GitHub-Dashboard-App',
      },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('User not found');
    }
    throw new Error(`GitHub API error: ${response.status}`);
  }

  return response.json();
}
