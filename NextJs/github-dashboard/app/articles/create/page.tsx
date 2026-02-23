import { cookies } from 'next/headers';
import { getTranslations } from '@/app/lib/api/strapi';
import ArticleForm from '@/app/components/ArticleForm';

export const metadata = {
    title: 'Create Article | GitHub Dashboard',
    description: 'Create a new article for the dashboard',
};

export default async function CreateArticlePage() {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    // Fetch translations on the server
    const translations = await getTranslations(locale);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <ArticleForm mode="create" translations={translations} />
            </div>
        </div>
    );
}
