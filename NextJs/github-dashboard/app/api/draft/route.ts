// github-dashboard/app/api/draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');

    if (secret !== (process.env.DRAFT_SECRET || 'MY_SECRET_TOKEN')) {
        return new Response('Invalid token', { status: 401 });
    }

    // Activate Draft Mode cookie
    (await draftMode()).enable();

    const locale = searchParams.get('locale');

    // Redirect to the article being previewed
    if (slug) {
        redirect(`/articles/preview/${slug}${locale ? `?locale=${locale}` : ''}`);
    }

    redirect('/articles');
}