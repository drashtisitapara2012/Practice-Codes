'use client';

import { useEffect, useState } from 'react';

export default function LocalCachePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cached = localStorage.getItem('posts');
    if (cached) {
      setPosts(JSON.parse(cached));
      setLoading(false);
    } else {
      fetch('/api/posts')
        .then(res => res.json())
        .then(data => {
          setPosts(data.slice(0, 10));
          localStorage.setItem('posts', JSON.stringify(data.slice(0, 10)));
          setLoading(false);
        });
    }
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Client-side Cached Posts (localStorage)</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
