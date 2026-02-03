import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST() {
  revalidateTag('posts', 'default');

  return NextResponse.json({
    revalidated: true,
    time: new Date().toISOString()
  });
}
