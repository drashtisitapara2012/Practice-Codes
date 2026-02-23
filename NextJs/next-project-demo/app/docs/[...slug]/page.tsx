import { ArrowLeft, BookOpen, Clock, FileText } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const title = slug.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' / ');
    return {
        title: `${title} | Documentation`,
    };
}

export default async function DocDetailPage({ params }: Props) {
    const { slug } = await params;
    const path = slug.join(' / ');

    // Real apps would fetch from Sanity/Contentful here
    // For the demo, we generate dynamic doc content based on the slug
    const title = slug[slug.length - 1].replace(/-/g, ' ').toUpperCase();

    return (
        <article className="max-w-4xl mx-auto space-y-8 py-10">
            <div className="space-y-4">
                <Link
                    href="/docs"
                    className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="mr-2 size-4" />
                    Back to Docs
                </Link>

                <div className="flex items-center gap-2 text-sm text-primary font-bold uppercase tracking-widest">
                    <BookOpen className="size-4" />
                    {path}
                </div>

                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">{title}</h1>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Clock className="size-4" />
                        10 min read
                    </div>
                    <div className="flex items-center gap-1.5">
                        <FileText className="size-4" />
                        V1.0.0
                    </div>
                </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none border-t pt-8">
                <p className="text-xl leading-relaxed text-muted-foreground">
                    This documentation page covers the details of <strong>{title}</strong>.
                    In a production environment, this content would be fetched from <strong>Sanity CMS</strong>
                    using the slug provided in the catch-all route.
                </p>

                <h2>Overview</h2>
                <p>
                    NextHub utilizes Next.js 16 catch-all routes to dynamically render documentation pages.
                    This allows for a flexible hierarchy without needing to create individual files for every page.
                </p>

                <div className="p-6 rounded-2xl bg-primary/5 border-l-4 border-primary my-8">
                    <h3 className="text-primary mt-0">Architecture Note</h3>
                    <p className="mb-0">
                        Current Path: <code>/docs/{slug.join('/')}</code>
                    </p>
                </div>

                <h2>Implementation Details</h2>
                <p>
                    The page uses <code>[...slug]</code> routing which captures all segments after <code>/docs/</code>.
                    This is ideal for nested documentation structures.
                </p>

                <pre className="p-4 rounded-xl bg-slate-900 text-slate-100 overflow-x-auto">
                    <code>{`// app/docs/[...slug]/page.tsx
export default async function Page({ params }) {
  const { slug } = await params;
  // slug will be ['getting-started', 'setup'] for /docs/getting-started/setup
}`}</code>
                </pre>

                <h2>Summary</h2>
                <p>
                    Next.js catch-all routes simplify content management by allowing a single page file to handle
                    infinite sub-paths, typically mapped 1:1 with a headless CMS structure.
                </p>
            </div>
        </article>
    );
}
