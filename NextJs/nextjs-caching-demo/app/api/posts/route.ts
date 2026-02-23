import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const data = await res.json();

  const response = NextResponse.json(data);

  response.headers.set(
    'Cache-Control',
    'public, s-maxage=120, stale-while-revalidate=60'
  );

  return response;
}
