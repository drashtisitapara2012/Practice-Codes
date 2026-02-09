import RevalidateButton from "../components/RevalidateButton";

async function getPosts() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    next: {
      tags: ['posts'],
      revalidate: 300
    }
  });

  console.log('FETCHING POSTS FROM REMOTE');

  return res.json();
}

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div style={{ padding: 24 }}>
      <h1>Posts (Tagged Cache)</h1>

      <RevalidateButton />

      <ul>
        {posts.slice(0, 5).map((p: any) => (
          <li key={p.id}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
