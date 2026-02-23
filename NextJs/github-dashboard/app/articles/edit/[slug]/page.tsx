import { cookies } from 'next/headers';
import { getArticleBySlug, getStrapiMedia, getTranslations } from '@/app/lib/api/strapi';
import ArticleForm from '@/app/components/ArticleForm';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return {
        title: `Edit ${slug} | GitHub Dashboard`,
    };
}

export default async function EditArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug: currentSlug } = await params;
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

    // Fetch article and translations on the server
    const [article, translations] = await Promise.all([
        getArticleBySlug(currentSlug, false, locale),
        getTranslations(locale),
    ]);

    if (!article) {
        notFound();
    }

    // Extract text content from Strapi's blocks format
    let contentText = '';
    if (Array.isArray(article.Content)) {
        contentText = article.Content
            .map((block: any) => {
                if (block.children) {
                    return block.children
                        .map((child: any) => child.text || '')
                        .join('');
                }
                return '';
            })
            .join('\n');
    } else if (typeof article.Content === 'string') {
        contentText = article.Content;
    }

    const imageData = (article.Image as any)?.data || article.Image;
    const imageUrl = imageData?.url ? getStrapiMedia(imageData.url) : null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            <div className="container mx-auto px-4 py-8">
                <ArticleForm
                    mode="edit"
                    article={article}
                    documentId={article.documentId}
                    translations={translations}
                    initialContent={contentText}
                    initialImage={imageUrl}
                />
            </div>
        </div>
    );
}
