'use server';

import { cache } from 'react';

export type Note = {
  id: number;
  title: string;
  slug: string;
  content: string;
};

// Use cache() to deduplicate multiple calls in the same request
const fetchNotesFromAPI = cache(async (): Promise<Note[]> => {
  // You can use an in-memory array
  const notesData: Note[] = [
    { 
      id: 1, 
      title: 'Learn Next.js Basics', 
      slug: 'learn-nextjs-basics', 
      content: 'Next.js is a React framework that enables server-side rendering and generates static websites. It provides a great developer experience with features like file-based routing, API routes, and built-in optimization. Next.js makes it easy to build fast, scalable web applications with excellent performance out of the box.'
    },
    { 
      id: 2, 
      title: 'Understanding Server Components', 
      slug: 'server-components', 
      content: 'Server Components are a new type of React component that run exclusively on the server. They can directly access server-side resources like databases and file systems, and they never ship to the client. This results in smaller bundle sizes and better performance. Server Components can be async and use server-only features.'
    },
    { 
      id: 3, 
      title: 'Static vs Dynamic Rendering', 
      slug: 'static-vs-dynamic', 
      content: 'Static rendering generates HTML at build time, resulting in fast loading times and excellent CDN performance. Dynamic rendering generates HTML on each request, allowing for real-time data and personalized content. Next.js automatically chooses the best rendering strategy based on your code, and you can also explicitly control it with functions like generateStaticParams.'
    },
    { 
      id: 4, 
      title: 'Routing in Next.js', 
      slug: 'routing-in-nextjs', 
      content: 'Next.js uses a file-system based router where folders are used to create routes. Each folder becomes a route segment, and files inside those folders create the UI for that route. Dynamic routes can be created with square brackets [slug], and you can create layouts that apply to multiple routes. This approach makes routing intuitive and easy to understand.'
    },
    { 
      id: 5, 
      title: 'API Routes', 
      slug: 'api-routes', 
      content: 'API Routes in Next.js allow you to build a full API within your Next.js application. They are server-side functions that handle HTTP requests and responses. You can create API endpoints by creating files in the app/api directory. These routes can handle CRUD operations, connect to databases, and integrate with external services.'
    },
    { 
      id: 6, 
      title: 'Fetching Data with fetch', 
      slug: 'fetch-data-nextjs', 
      content: 'Next.js extends the native fetch API to provide automatic request deduplication and caching on the server. This means multiple fetch requests with the same URL in the same render pass will only be executed once. You can also revalidate data at specific intervals using the next.revalidate option, giving you fine-grained control over caching behavior.'
    },
    { 
      id: 7, 
      title: 'Server-side Rendering', 
      slug: 'server-side-rendering', 
      content: 'Server-side Rendering (SSR) generates HTML on the server for each request. This provides fresh data on every page load and is great for pages with frequently changing content. SSR is beneficial for SEO as search engines can crawl the fully rendered page. Next.js makes SSR simple with automatic server rendering for pages that use dynamic data.'
    },
    { 
      id: 8, 
      title: 'Static Site Generation', 
      slug: 'static-site-generation', 
      content: 'Static Site Generation (SSG) pre-renders pages at build time. This results in extremely fast loading times and is perfect for content that does not change frequently. SSG pages can be served from a CDN globally, providing excellent performance. Next.js allows you to generate static pages for dynamic content using generateStaticParams and incremental static regeneration.'
    },
  ];

  return notesData;
});

export async function getNotes(): Promise<Note[]> {
  return await fetchNotesFromAPI();
}

export async function getNoteBySlug(slug: string): Promise<Note | undefined> {
  const notes = await getNotes();
  console.log(`Looking for slug: "${slug}"`);
  console.log('Available slugs:', notes.map(n => n.slug));
  
  const foundNote = notes.find((note) => note.slug && note.slug.toLowerCase() === slug.toLowerCase());
  console.log('Found note:', foundNote);
  
  return foundNote;
}

export async function getFilteredNotes(
  query: string,
  page: number,
  pageSize = 4
): Promise<{ notes: Note[]; totalPages: number }> {
  const notes = await getNotes();
  let filtered = notes;

  if (query) {
    filtered = notes.filter((note) =>
      note.title.toLowerCase().includes(query.toLowerCase())
    );
  }

  const totalPages = Math.ceil(filtered.length / pageSize);
  const start = (page - 1) * pageSize;
  const paginatedNotes = filtered.slice(start, start + pageSize);

  return { notes: paginatedNotes, totalPages };
}
