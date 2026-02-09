// github-dashboard/app/api/draft/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // Activate Draft Mode cookie
    (await draftMode()).enable();

    // Redirect to the article being previewed
    if (slug) {
        redirect(`/articles/${slug}`);
    }

    redirect('/articles');
}