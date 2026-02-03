/**
 * Dashboard API integration layer with Next.js 16 caching
 * Demonstrates Server Component caching with optimistic UI updates
 */

import { cacheLife, cacheTag } from 'next/cache';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export interface DataItem {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all posts with Next.js 16 caching
 * Uses medium cache duration as posts can change frequently
 */
export async function getAllPosts(limit?: number, start?: number): Promise<{ posts: DataItem[], total: number }> {
  'use cache';
  cacheLife('minutes'); // Built-in profile: 5 minute cache
  cacheTag('all-posts');

  try {
    const url = new URL(`${API_BASE_URL}/posts`);
    if (limit) url.searchParams.append('_limit', limit.toString());
    if (start !== undefined) url.searchParams.append('_start', start.toString());

    const response = await fetch(url.toString(), {
      next: { revalidate: 300 } // 5 minutes
    });

    if (!response.ok) {
      console.error(`Posts API error: ${response.status} ${response.statusText}`);
      const mock = getMockPosts();
      return { posts: mock, total: mock.length };
    }

    const posts = await response.json();
    const totalCount = response.headers.get('x-total-count');

    return {
      posts: posts.map(transformPost),
      total: totalCount ? parseInt(totalCount) : 100 // JSONPlaceholder usually has 100
    };
  } catch (error) {
    console.error('Posts fetch error:', error);
    return {
      posts: getMockPosts(),
      total: getMockPosts().length
    };
  }
}

/**
 * Get posts by user ID
 */
export async function getPostsByUser(userId: string): Promise<DataItem[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`user-posts-${userId}`);

  try {
    const response = await fetch(`${API_BASE_URL}/posts?userId=${userId || 1}`, {
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      console.error(`User posts API error: ${response.status} ${response.statusText}`);
      return getMockPosts().slice(0, 2);
    }

    const posts = await response.json();
    return posts.map(transformPost);
  } catch (error) {
    console.error('User posts fetch error:', error);
    return getMockPosts().slice(0, 2);
  }
}

/**
 * Get single post by ID
 * Uses longer cache as individual posts change less frequently
 */
export async function getPostById(id: string): Promise<DataItem> {
  'use cache';
  cacheLife('hours'); // Built-in profile: 1 hour cache
  cacheTag(`post-${id}`);

  try {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      next: { revalidate: 3600 } // 1 hour
    });

    if (!response.ok) {
      console.error(`Post API error: ${response.status} ${response.statusText}`);
      return getMockPost(id);
    }

    const post = await response.json();
    return transformPost(post);
  } catch (error) {
    console.error('Post fetch error:', error);
    return getMockPost(id);
  }
}

// Client-side API functions for mutations (no caching)
export const dataApi = {
  async createItem(itemData: { title: string; description: string; userId: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: itemData.title,
          body: itemData.description,
          userId: parseInt(itemData.userId) || 1,
        }),
      });

      if (!response.ok) throw new Error('API error');
      const newPost = await response.json();
      return transformPost(newPost);
    } catch (error) {
      console.error('Failed to create item:', error);
      return {
        id: Date.now().toString(),
        title: itemData.title,
        description: itemData.description,
        userId: itemData.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async updateItem(id: string, updateData: { title?: string; description?: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: parseInt(id),
          title: updateData.title || 'Updated Title',
          body: updateData.description || 'Updated Description',
          userId: 1,
        }),
      });

      if (!response.ok) throw new Error('API error');
      const updatedPost = await response.json();
      return transformPost(updatedPost);
    } catch (error) {
      console.error('Failed to update item:', error);
      return {
        id,
        title: updateData.title || 'Updated Title',
        description: updateData.description || 'Updated Description',
        userId: '1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  async deleteItem(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('API error');
      return { success: true };
    } catch (error) {
      console.error('Failed to delete item:', error);
      return { success: true };
    }
  }
};

// Helper function to transform API response
function transformPost(post: any): DataItem {
  return {
    id: post.id.toString(),
    title: post.title,
    description: post.body || 'No description available',
    userId: post.userId?.toString() || '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Mock data for fallback
function getMockPosts(): DataItem[] {
  return [
    {
      id: '1',
      title: 'Sample Post 1',
      description: 'This is a sample post from fallback data.',
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Sample Post 2',
      description: 'This is another sample post from fallback data.',
      userId: '1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Sample Post 3',
      description: 'This is a third sample post from fallback data.',
      userId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Sample Post 4',
      description: 'This is a fourth sample post from fallback data.',
      userId: '2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
}

function getMockPost(id: string): DataItem {
  return {
    id,
    title: 'Sample Post',
    description: 'This is a sample post from fallback data.',
    userId: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
